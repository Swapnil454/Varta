import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();
    if (!email || !code || !newPassword) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const token = await prisma.otpToken.findFirst({
      where: { userId: user.id, purpose: "RESET_PASSWORD" },
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

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    await prisma.otpToken.deleteMany({ where: { userId: user.id, purpose: "RESET_PASSWORD" } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RESET_PASSWORD_ERROR", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
