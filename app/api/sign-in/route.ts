import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For generating JWTs

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variables for secrets

export async function SignIn(req: NextRequest) {
  try {
    // Parse request body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // Set expiration time for the token
    );

    // Respond with token
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
