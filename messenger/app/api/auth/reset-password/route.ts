import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import { validatePassword } from "@/libs/password-validation";
import { rateLimits, getClientIp } from "@/libs/rate-limit";

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    // Validate required fields
    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit by IP
    const clientIp = getClientIp(request);
    const ipRateLimit = rateLimits.perIp(clientIp, "reset-password", 5 * 60 * 1000, 10);
    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: ipRateLimit.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(ipRateLimit.retryAfter) },
        }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: passwordValidation.errors[0],
          allErrors: passwordValidation.errors,
          strength: passwordValidation.strength,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = await prisma.otpToken.findFirst({
      where: { userId: user.id, purpose: "RESET_PASSWORD" },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json(
        { error: "No reset code found. Please request a new one." },
        { status: 404 }
      );
    }

    if (token.attempts >= MAX_ATTEMPTS) {
      await prisma.otpToken.delete({ where: { id: token.id } });
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new reset code." },
        { status: 429 }
      );
    }

    if (token.expiresAt < new Date()) {
      await prisma.otpToken.delete({ where: { id: token.id } });
      return NextResponse.json(
        { error: "Reset code has expired. Please request a new one." },
        { status: 410 }
      );
    }

    const match = await bcrypt.compare(code, token.otpHash);
    if (!match) {
      await prisma.otpToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });
      const attemptsRemaining = MAX_ATTEMPTS - token.attempts - 1;
      return NextResponse.json(
        {
          error: `Invalid code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`,
        },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    // Clean up all reset password tokens for this user
    await prisma.otpToken.deleteMany({
      where: { userId: user.id, purpose: "RESET_PASSWORD" },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RESET_PASSWORD_ERROR", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
