
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "@/app/libs/resend"; 

const OTP_EXP_MINUTES = 10;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return new NextResponse("Email required", { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    // Delete old tokens for this user/purpose
    await prisma.otpToken.deleteMany({
      where: { userId: user.id, purpose: "RESET_PASSWORD" },
    });

    // Store new OTP token
    await prisma.otpToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
        purpose: "RESET_PASSWORD",
      },
    });

    // Email template
    const html = `
      <div style="font-family: Inter, Arial, sans-serif">
        <h2>Password Reset Request</h2>
        <p>Your reset code is:</p>
        <div style="font-size:32px; font-weight:700; letter-spacing:6px">${otp}</div>
        <p>This code expires in ${OTP_EXP_MINUTES} minutes.</p>
      </div>
    `;

    // Send with Nodemailer
    await sendMail(email, "Your password reset code", html);

    console.log("🔐 Password reset OTP sent:", { to: email, otp });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("FORGOT_PASSWORD_ERROR", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
