import jwt from "jsonwebtoken";
import { User, JwtPayload } from "@/types/user";

// Function to generate JWT token
export function generateJwtToken(
  user: Pick<User, "id" | "username" | "email" | "role">,
  expiresIn: string = "7d" // Default expiration
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  // Using a type assertion for the JWT secret
  const secret = process.env.JWT_SECRET as string;

  // @ts-expect-error The type definitions for jsonwebtoken seem to be causing issues
  return jwt.sign(payload, secret, {
    expiresIn,
  });
}

// Function to generate refresh token (longer lived)
export function generateRefreshToken(
  user: Pick<User, "id" | "username" | "email" | "role">
): string {
  return generateJwtToken(user, "30d"); // 30 days expiration
}

// Function to verify JWT token
export function verifyJwtToken(token: string): JwtPayload | null {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  try {
    // Using a type assertion for the JWT secret
    const secret = process.env.JWT_SECRET as string;

    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

// Function to create auth cookie for response
export function createAuthCookie(token: string) {
  const cookieMaxAge = Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60; // 7 days in seconds

  return {
    name: process.env.COOKIE_NAME || "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: cookieMaxAge,
    path: "/",
  };
}
