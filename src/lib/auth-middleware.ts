import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth";
import db from "@/lib/db";
import { JwtPayload } from "@/types/user";

export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload;
}

/**
 * Authentication middleware for API routes
 * Verifies the JWT token in cookies and attaches user data to the request
 *
 * @param req - The NextRequest object
 * @returns A NextResponse error or null if authentication succeeds
 */
export async function authenticateUser(
  req: AuthenticatedRequest
): Promise<NextResponse | null> {
  try {
    // Get the auth token from cookies
    const token = req.cookies.get(
      process.env.COOKIE_NAME || "auth_token"
    )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = verifyJwtToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    // Check if user still exists in the database
    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
      payload.userId,
    ]);

    if (!userResult.rowCount || userResult.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    // Attach the user payload to the request for later use
    req.user = payload;

    // Return null to indicate authentication succeeded
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Route handler wrapper that enforces authentication
 *
 * @param handler - The route handler function
 * @returns A new handler that authenticates before calling the original handler
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async function (req: AuthenticatedRequest): Promise<NextResponse> {
    // Run the authentication middleware
    const authResponse = await authenticateUser(req);

    // If authentication failed, return the error response
    if (authResponse) {
      return authResponse;
    }

    // If authentication succeeded, call the original handler
    return handler(req);
  };
}
