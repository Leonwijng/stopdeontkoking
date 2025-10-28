import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateJwtToken, verifyJwtToken } from "@/lib/auth";
import { rateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Apply rate limiting - 10 attempts per minute
    const rateLimit = rateLimiter(req, {
      limit: 10,
      windowMs: 60 * 1000, // 1 minute
      message: "Too many token refresh attempts. Please try again later.",
    });

    if (rateLimit) {
      return rateLimit;
    }

    // Get the refresh token from cookies
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No refresh token provided",
        },
        { status: 401 }
      );
    }

    // Verify the refresh token
    const payload = verifyJwtToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired refresh token",
        },
        { status: 401 }
      );
    }

    // Check if the user still exists and is valid
    const userResult = await db.query(
      "SELECT * FROM users WHERE id = $1 AND email = $2",
      [payload.userId, payload.email]
    );

    if (!userResult.rowCount || userResult.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Generate a new access token
    const newToken = generateJwtToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Create response with new token in HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
      },
      { status: 200 }
    );

    // Set the new access token cookie
    const cookieMaxAge = Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60; // 7 days in seconds
    response.cookies.set(process.env.COOKIE_NAME || "auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: cookieMaxAge,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while refreshing token",
      },
      { status: 500 }
    );
  }
}
