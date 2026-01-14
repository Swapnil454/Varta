import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) return new NextResponse("Missing fields", { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    const token = await prisma.otpToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!token) return new NextResponse("No OTP found", { status: 404 });
    if (token.attempts >= MAX_ATTEMPTS) {
      await prisma.otpToken.delete({ where: { id: token.id } });
      return new NextResponse("Too many attempts", { status: 429 });
    }
    if (token.expiresAt < new Date()) {
      await prisma.otpToken.delete({ where: { id: token.id } });
      return new NextResponse("OTP expired", { status: 410 });
    }

    const match = await bcrypt.compare(code, token.otpHash);
    if (!match) {
      await prisma.otpToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });
      return new NextResponse("Invalid code", { status: 401 });
    }

    // success: mark user verified and cleanup
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });
    await prisma.otpToken.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("VERIFY_OTP_ERROR", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
