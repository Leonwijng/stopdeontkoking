import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import db from "@/lib/db";
import argon2 from "argon2";
import { UserProfileUpdateInput } from "@/types/user";

/**
 * GET handler for /api/auth/me endpoint
 * Returns information about the currently authenticated user
 */
async function getUserProfile(
  req: AuthenticatedRequest
): Promise<NextResponse> {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID not found",
        },
        { status: 400 }
      );
    }

    // Fetch the user data from the database
    const userResult = await db.query(
      `SELECT id, username, name, email, role, created_at, updated_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (!userResult.rowCount || userResult.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Return user profile data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching user profile",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for /api/auth/me endpoint
 * Updates user profile information (name, email, password)
 */
async function updateUserProfile(
  req: AuthenticatedRequest
): Promise<NextResponse> {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID not found",
        },
        { status: 400 }
      );
    }

    // Parse the request body with error handling
    let body: UserProfileUpdateInput;
    try {
      const rawData = await req.text();
      console.log("Raw request body:", rawData); // Log the raw request for debugging
      body = JSON.parse(rawData) as UserProfileUpdateInput;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid JSON in request body. Please ensure your request contains valid JSON.",
          error:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parse error",
        },
        { status: 400 }
      );
    }

    // Validate the request body
    const errors: Record<string, string> = {};

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (body.username && body.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (body.password) {
      if (!body.current_password) {
        errors.current_password =
          "Current password is required when updating password";
      } else if (typeof body.current_password !== "string") {
        errors.current_password = "Current password must be a string";
      }

      if (body.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Get the current user from the database
    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (!userResult.rowCount || userResult.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Handle password update
    if (body.password && body.current_password) {
      // Verify the current password
      const isPasswordValid = await argon2.verify(
        user.password_hash,
        body.current_password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            errors: { current_password: "Current password is incorrect" },
          },
          { status: 400 }
        );
      }

      // Hash the new password
      body.password = await argon2.hash(body.password);
    }

    // Check email uniqueness if updating email
    if (body.email && body.email !== user.email) {
      const emailExists = await db.query(
        "SELECT COUNT(*) as count FROM users WHERE email = $1 AND id != $2",
        [body.email, userId]
      );

      if (emailExists.rows[0].count > 0) {
        return NextResponse.json(
          {
            success: false,
            errors: { email: "Email is already in use" },
          },
          { status: 400 }
        );
      }
    }

    // Check username uniqueness if updating username
    if (body.username && body.username !== user.username) {
      const usernameExists = await db.query(
        "SELECT COUNT(*) as count FROM users WHERE username = $1 AND id != $2",
        [body.username, userId]
      );

      if (usernameExists.rows[0].count > 0) {
        return NextResponse.json(
          {
            success: false,
            errors: { username: "Username is already taken" },
          },
          { status: 400 }
        );
      }
    }

    // Build the update query dynamically
    const updates: string[] = [];
    const values: Array<string | number> = [];
    let paramIndex = 1;

    if (body.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(body.name);
    }

    if (body.username) {
      updates.push(`username = $${paramIndex++}`);
      values.push(body.username);
    }

    if (body.email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(body.email);
    }

    if (body.password) {
      updates.push(`password_hash = $${paramIndex++}`);
      values.push(body.password);
    }

    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);

    // Add the user ID to the values array
    values.push(userId);

    // If there are no updates, return early
    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No changes to update",
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        },
        { status: 200 }
      );
    }

    // Execute the update query
    const updateResult = await db.query(
      `UPDATE users 
       SET ${updates.join(", ")} 
       WHERE id = $${paramIndex}
       RETURNING id, username, name, email, role, created_at, updated_at`,
      values
    );

    const updatedUser = updateResult.rows[0];

    // Return the updated user data
    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          created_at: updatedUser.created_at,
          updated_at: updatedUser.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating user profile",
      },
      { status: 500 }
    );
  }
}

// Export the handlers with authentication middleware
export const GET = withAuth(getUserProfile);
export const PUT = withAuth(updateUserProfile);
