import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { MealType } from "@/types/recipe";

/**
 * GET handler for /api/recipes/search endpoint
 * Search for recipes by ingredients and meal type
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);

    const ingredients = searchParams.get("ingredients") || undefined;
    const meal_type = searchParams.get("meal_type") as MealType | undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const offset = (page - 1) * limit;

    // Build the query conditionally with owner info
    let query = `
      SELECT r.*, 
        array_agg(DISTINCT ri.ingredient) as ingredients,
        COUNT(*) OVER() as total_count,
        u.raw_user_meta_data->>'name' as owner_name,
        u.raw_user_meta_data->>'avatar_url' as owner_avatar
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN auth.users u ON r.owner_id = u.id
    `;

    const queryParams: (string | number)[] = [];
    const conditions: string[] = [];

    // Filter by ingredients (partial match)
    if (ingredients) {
      queryParams.push(`%${ingredients.toLowerCase()}%`);
      conditions.push(`EXISTS (
        SELECT 1 FROM recipe_ingredients 
        WHERE recipe_id = r.id 
          AND LOWER(ingredient) LIKE $${queryParams.length}
      )`);
    }

    // Filter by meal type
    if (meal_type) {
      queryParams.push(meal_type);
      conditions.push(`r.meal_type = $${queryParams.length}`);
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Group by recipe fields to handle the array_agg
    query += `
      GROUP BY r.id, u.raw_user_meta_data
      ORDER BY r.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    // Add pagination parameters
    queryParams.push(limit, offset);

    // Execute the query
    const result = await db.query(query, queryParams);

    // If no recipes found, return empty array but still success
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          recipes: [],
          total: 0,
          page,
          limit,
        },
      });
    }

    // Get the total count from the first row
    const total = parseInt(result.rows[0].total_count);

    // Format the response
    const recipes = result.rows.map((row) => ({
      id: row.id,
      owner_id: row.owner_id,
      name: row.name,
      description: row.description,
      ingredients: row.ingredients,
      meal_type: row.meal_type,
      preparation_time: row.preparation_time,
      cooking_time: row.cooking_time,
      servings: row.servings,
      instructions: row.instructions,
      image_url: row.image_url,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner_name: row.owner_name,
      owner_avatar: row.owner_avatar,
    }));

    return NextResponse.json({
      success: true,
      data: {
        recipes,
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Recipe search error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while searching for recipes",
      },
      { status: 500 }
    );
  }
}
