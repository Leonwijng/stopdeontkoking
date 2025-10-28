export interface Recipe {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  ingredients: string[];
  meal_type: MealType;
  preparation_time: number; // in minutes
  cooking_time: number; // in minutes
  servings: number;
  instructions: string[];
  image_url?: string; // Optional recipe image
  created_at: string;
  updated_at: string;
  // Owner info (joined from auth.users)
  owner_name?: string;
  owner_avatar?: string;
}

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "dessert"
  | "drink";

export interface RecipeSearchParams {
  ingredients?: string;
  meal_type?: MealType;
  page?: number;
  limit?: number;
}

export interface RecipeSearchResponse {
  success: boolean;
  data?: {
    recipes: Recipe[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
  errors?: Record<string, string>;
}
