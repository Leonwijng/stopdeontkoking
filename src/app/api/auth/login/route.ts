import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import db from "@/lib/db";
import { type LoginInput } from "@/types/user";
import { generateJwtToken, generateRefreshToken } from "@/lib/auth";
import { rateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting
    const rateLimit = rateLimiter(req, {
      limit: 5,
      windowMs: 60 * 1000,
      message: "Too many login attempts. Please try again in a minute.",
    });
    if (rateLimit) return rateLimit;

    // Parse body and validate
    const { email, password, rememberMe } = (await req.json()) as LoginInput;
    const errors: Record<string, string> = {};
    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length)
      return NextResponse.json({ success: false, errors }, { status: 400 });

    
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    const user = userResult.rows[0];
    if (!user || !(await argon2.verify(user.password_hash, password))) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
  
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = generateJwtToken(tokenPayload);
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });

    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };
    response.cookies.set(process.env.COOKIE_NAME || "auth_token", token, {
      ...cookieOptions,
      maxAge: rememberMe
        ? Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60
        : undefined,
    });

    if (rememberMe) {
      const refreshToken = generateRefreshToken(tokenPayload);
      response.cookies.set("refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60,
        path: "/api/auth/refresh",
      });
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
