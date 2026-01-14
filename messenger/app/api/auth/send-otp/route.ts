
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

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    // generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    // delete old otps and create new
    await prisma.otpToken.deleteMany({ where: { userId: user.id } });
    await prisma.otpToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });

    // prepare email
    const html = `
      <div style="font-family: Inter, Arial, sans-serif">
        <h2>Verify your email</h2>
        <p>Your verification code is:</p>
        <div style="font-size:32px; font-weight:700; letter-spacing:6px">${otp}</div>
        <p>This code expires in ${OTP_EXP_MINUTES} minutes.</p>
      </div>
    `;

    // send with Nodemailer
    const info = await sendMail(email, "Your verification code", html);

    console.log("=====================================");
    console.log("OTP SENT (via Nodemailer)");
    console.log("To:", email);
    console.log("OTP (for debug only):", otp);
    console.log("Message ID:", info.messageId);
    console.log("=====================================");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("SEND_OTP_ERROR", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

