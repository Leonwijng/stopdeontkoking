import { Recipe, RecipeSearchParams } from "@/types/recipe"
import { supabase } from "./supabase"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string>
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Recipe API met Supabase
export const recipeAPI = {
  async search(params: RecipeSearchParams): Promise<{
    recipes: Recipe[]
    total: number
    page: number
    limit: number
  }> {
    const page = params.page || 1
    const limit = params.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase!
      .from('recipes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // Filter op ingrediënten
    if (params.ingredients) {
      query = query.contains('ingredients', [params.ingredients])
    }

    // Filter op meal type
    if (params.meal_type) {
      query = query.eq('meal_type', params.meal_type)
    }

    const { data, error, count } = await query

    if (error) {
      throw new ApiError(500, error.message)
    }

    // For now, owner info is not fetched due to Supabase auth.users join restrictions
    const recipes = (data || []).map((item: any) => ({
      ...item,
      owner_name: undefined,
      owner_avatar: undefined,
    }))

    return {
      recipes,
      total: count || 0,
      page,
      limit,
    }
  },

  async getById(id: string): Promise<Recipe> {
    const response = await fetch(`/api/recipes/${id}`)
    const json = await response.json()

    if (!response.ok || !json.success) {
      throw new ApiError(response.status, json.message || 'Recept niet gevonden')
    }

    return json.data as Recipe
  },

  async create(recipe: Partial<Recipe>): Promise<Recipe> {
    const { data: { user } } = await supabase!.auth.getUser()
    
    if (!user) {
      throw new ApiError(401, 'Je moet ingelogd zijn')
    }

    const { data, error } = await supabase!
      .from('recipes')
      .insert({
        ...recipe,
        owner_id: user.id,
        owner_name: user.user_metadata?.name,
        owner_avatar: user.user_metadata?.avatar_url,
      })
      .select()
      .single()

    if (error) {
      throw new ApiError(500, error.message)
    }

    return data as Recipe
  },

  async update(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    const { data, error } = await supabase!
      .from('recipes')
      .update(recipe)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new ApiError(500, error.message)
    }

    return data as Recipe
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase!
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) {
      throw new ApiError(500, error.message)
    }
  },
}

export { ApiError }
