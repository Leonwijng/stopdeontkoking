import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET handler for /api/recipes/[id] endpoint
 * Get a single recipe by ID with owner information
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          message: "Recipe not found",
        },
        { status: 404 }
      );
    }

    // Fetch owner info separately
    let owner_name: string | undefined;
    let owner_avatar: string | undefined;
    // Temporarily disabled due to auth restrictions
    // if (data.owner_id) {
    //   const { data: userData } = await supabase.auth.admin.getUserById(data.owner_id);
    //   if (userData.user?.user_metadata) {
    //     owner_name = userData.user.user_metadata.name;
    //     owner_avatar = userData.user.user_metadata.avatar_url;
    //   }
    // }

    const recipe = {
      id: data.id,
      owner_id: data.owner_id,
      name: data.name,
      description: data.description,
      ingredients: data.ingredients || [],
      meal_type: data.meal_type,
      preparation_time: data.preparation_time,
      cooking_time: data.cooking_time,
      servings: data.servings,
      instructions: data.instructions,
      image_url: data.image_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      owner_name,
      owner_avatar,
    };

    return NextResponse.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Recipe fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching the recipe",
      },
      { status: 500 }
    );
  }
}
