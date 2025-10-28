"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { recipeAPI } from "@/lib/api"
import { Recipe, MealType } from "@/types/recipe"
import { SearchBar } from "@/components/search-bar"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeGridSkeleton } from "@/components/loading-skeletons"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RecipesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchIngredients, setSearchIngredients] = useState("")
  const [searchMealType, setSearchMealType] = useState<MealType | "">("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 9

  // Redirect to signup if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Inloggen vereist",
        description: "Je moet ingelogd zijn om recepten te bekijken.",
      })
      router.push("/signup")
    }
  }, [user, authLoading, router, toast])

  const fetchRecipes = async () => {
    if (!user) return // Don't fetch if not logged in
    
    setLoading(true)
    try {
      const response = await recipeAPI.search({
        ingredients: searchIngredients || undefined,
        meal_type: searchMealType || undefined,
        page,
        limit,
      })
      setRecipes(response.recipes)
      setTotalPages(Math.ceil(response.total / limit))
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && !authLoading) {
      fetchRecipes()
    }
  }, [page, user, authLoading])

  const handleSearch = (ingredients: string, mealType: MealType | "") => {
    setSearchIngredients(ingredients)
    setSearchMealType(mealType)
    setPage(1)
  }

  useEffect(() => {
    if (page === 1 && user && !authLoading) {
      fetchRecipes()
    }
  }, [searchIngredients, searchMealType, user, authLoading])

  return (
    <div className="container py-12 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Ontdek Recepten</h1>
          <p className="text-lg text-muted-foreground">
            Zoek en filter door onze collectie van heerlijke recepten
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <RecipeGridSkeleton />
        ) : recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Pagina {page} van {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Geen recepten gevonden"
            description={
              searchIngredients || searchMealType
                ? "Probeer je zoekopdracht aan te passen of verwijder de filters."
                : "Er zijn nog geen recepten beschikbaar. Wees de eerste om er een toe te voegen!"
            }
            action={{
              label: "Recept Toevoegen",
              href: "/recepten/nieuw",
            }}
            icon="search"
          />
        )}
      </div>
    </div>
  )
}
