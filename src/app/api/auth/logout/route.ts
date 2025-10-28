import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  try {
    // Create response with success message
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the JWT auth token cookie by setting it to expire immediately
    response.cookies.set(process.env.COOKIE_NAME || "auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Makes the cookie expire immediately
    });

    // Clear the refresh token cookie if it exists
    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 0, // Makes the cookie expire immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during logout",
      },
      { status: 500 }
    );
  }
}
