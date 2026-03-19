import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { validatePassword } from "@/libs/password-validation";
import { rateLimits, getClientIp } from "@/libs/rate-limit";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Rate limit by IP
    const clientIp = getClientIp(request);
    const ipRateLimit = rateLimits.register(clientIp);
    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please try again later.",
          retryAfter: ipRateLimit.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(ipRateLimit.retryAfter) },
        }
      );
    }

    // Validate email format
    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate name
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (trimmedName.length > 50) {
      return NextResponse.json(
        { error: "Name must be at most 50 characters" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
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

    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        hashedPassword,
        emailVerified: null,
      },
    });

    return NextResponse.json({ ok: true, userId: user.id, email: user.email });
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
