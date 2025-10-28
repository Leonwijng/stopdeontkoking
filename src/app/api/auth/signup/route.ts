import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import db from "@/lib/db";
import {
  UserRole,
  type UserCreateInput,
  type AuthResponse,
} from "@/types/user";
import { generateJwtToken } from "@/lib/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = (await req.json()) as UserCreateInput;

    // Validate request body
    const errors: Record<string, string> = {};
    if (!body.name) errors.name = "Name is required";
    if (!body.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!body.password) errors.password = "Password is required";
    else if (body.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // If username is provided, validate it
    if (body.username && body.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Check if user already exists by email
    const existingUserByEmail = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [body.email]
    );

    if (existingUserByEmail.rowCount && existingUserByEmail.rowCount > 0) {
      return NextResponse.json(
        {
          success: false,
          errors: { email: "User with this email already exists" },
        },
        { status: 400 }
      );
    }

    // If a username is provided, check if it already exists
    if (body.username) {
      const existingUserByUsername = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [body.username]
      );

      if (
        existingUserByUsername.rowCount &&
        existingUserByUsername.rowCount > 0
      ) {
        return NextResponse.json(
          {
            success: false,
            errors: { username: "Username is already taken" },
          },
          { status: 400 }
        );
      }
    }

    // Hash password
    const passwordHash = await argon2.hash(body.password);

    // Set default role if not provided
    const role = body.role || UserRole.USER;

    // Use provided username or email as username if not provided
    const username = body.username || body.email;

    // Insert user into database
    const result = await db.query(
      `INSERT INTO users (username, name, email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, username, name, email, role, created_at`,
      [username, body.name, body.email, passwordHash, role]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = generateJwtToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });

    // Create response with token in HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          created_at: newUser.created_at,
        },
      } as AuthResponse,
      { status: 201 }
    );

    // Set the cookie with appropriate options
    const cookieMaxAge = Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60; // 7 days in seconds
    response.cookies.set(process.env.COOKIE_NAME || "auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: cookieMaxAge,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during signup",
      },
      { status: 500 }
    );
  }
}
