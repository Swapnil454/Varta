import { NextResponse } from "next/server";
import prisma from "../../../libs/prismadb";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail, EmailError } from "../../../../app/libs/resend";
import { rateLimits, getClientIp } from "../../../libs/rate-limit";

const OTP_EXP_MINUTES = 10;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Rate limiting by email
    const rateLimit = rateLimits.sendOtp(normalizedEmail);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many OTP requests. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    // Also rate limit by IP
    const clientIp = getClientIp(request);
    const ipRateLimit = rateLimits.perIp(clientIp, "send-otp", 5 * 60 * 1000, 10);
    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: ipRateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(ipRateLimit.retryAfter),
          },
        }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    // Delete old otps and create new
    await prisma.otpToken.deleteMany({ where: { userId: user.id } });
    await prisma.otpToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });

    // Prepare email with improved template
    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; margin-bottom: 16px;">Verify Your Email</h2>
        <p style="color: #4a4a4a; margin-bottom: 20px;">Welcome! Please use the code below to verify your email address:</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: white;">${otp}</div>
        </div>
        <p style="color: #666; font-size: 14px;">This code expires in <strong>${OTP_EXP_MINUTES} minutes</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `;

    // Send email
    const result = await sendMail(normalizedEmail, "Your verification code", html);

    if (!result.success) {
      const error = result.error!;
      console.error("Failed to send verification email:", error.message, error.code);

      // Return appropriate error based on error type
      if (error.code === "QUOTA_EXCEEDED" || error.code === "RATE_LIMITED") {
        return NextResponse.json(
          {
            error: "Email service is temporarily unavailable. Please try again in a few minutes.",
            code: "EMAIL_SERVICE_BUSY",
          },
          { status: 503 }
        );
      }

      if (error.code === "SERVICE_UNAVAILABLE") {
        return NextResponse.json(
          {
            error: "Unable to send email at this time. Please try again later.",
            code: "EMAIL_SERVICE_DOWN",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "Unable to send verification email. Please contact support.",
          code: "EMAIL_ERROR",
        },
        { status: 500 }
      );
    }

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("=====================================");
      console.log("OTP SENT (via Resend)");
      console.log("To:", normalizedEmail);
      console.log("OTP (for debug only):", otp);
      console.log("Message ID:", result.messageId);
      console.log("=====================================");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("SEND_OTP_ERROR", e);

    if (e instanceof EmailError) {
      return NextResponse.json(
        {
          error: "Email service error. Please try again later.",
          code: "EMAIL_ERROR",
        },
        { status: e.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

