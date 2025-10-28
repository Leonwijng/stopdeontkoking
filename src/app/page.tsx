"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChefHat, Search, Heart, Star, Clock, Users, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { recipeAPI } from "@/lib/api"
import { Recipe, MealType } from "@/types/recipe"
import { useToast } from "@/hooks/use-toast"

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Ontbijt",
  lunch: "Lunch",
  dinner: "Diner",
  snack: "Snack",
  dessert: "Dessert",
  drink: "Drankje",
}

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<MealType | "all">("all")

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await recipeAPI.search({
          meal_type: selectedCategory !== "all" ? selectedCategory : undefined,
          limit: 9,
          page: 1,
        })
        setRecipes(response.recipes)
      } catch (error) {
        console.error("Error fetching recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [selectedCategory])

  const handleRecipeClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      toast({
        title: "Inloggen vereist",
        description: "Maak een account aan om recepten te bekijken!",
      })
      router.push("/signup")
    }
  }

  const handleViewAllClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      toast({
        title: "Inloggen vereist",
        description: "Maak een account aan om alle recepten te bekijken!",
      })
      router.push("/signup")
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      {/* Hero Section with Featured Recipe */}
      <section className="relative overflow-hidden w-full">
        {/* Featured Recipe Banner */}
        <div className="relative h-96 md:h-[500px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }}>
          <div className="absolute inset-0 bg-black/30 z-10"></div>

          {/* Featured Content */}
          <div className="absolute inset-0 flex items-center justify-start z-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-block mb-4" style={{ backgroundColor: "#84cc16", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.25rem", paddingBottom: "0.25rem", borderRadius: "9999px", color: "white", fontSize: "0.875rem", fontWeight: "500" }}>
                Trending
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Meat <br className="hidden md:block" />Chicken
              </h1>
              <Button asChild size="lg" className="px-8 h-14 text-base font-semibold transition-all duration-300 hover:scale-105" style={{ backgroundColor: "white", color: "#1c1917" }} onClick={handleRecipeClick}>
                <Link href={user ? "/recepten" : "/login"}>
                  More <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 md:py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Recipe Grid */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#1c1917" }}>Recipes</h2>
                    <div className="flex items-center gap-4 text-sm" style={{ color: "#78716c" }}>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Based on your preferences</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="transition-all duration-300 hover:scale-105" style={{ backgroundColor: "transparent", color: "#84cc16", border: "2px solid #84cc16" }} onClick={handleViewAllClick}>
                    <Link href={user ? "/recepten" : "/login"}>View All</Link>
                  </Button>
                </div>
              </div>

              {/* Recipe Category Tabs */}
              <div className="flex flex-wrap gap-4 mb-8 pb-6" style={{ borderBottomColor: "#e7e5e4", borderBottomWidth: "1px" }}>
                <Button 
                  onClick={() => setSelectedCategory("all")}
                  className="transition-all duration-300 hover:scale-105 font-semibold rounded-full px-6" 
                  style={selectedCategory === "all" 
                    ? { backgroundColor: "#84cc16", color: "white" }
                    : { backgroundColor: "transparent", color: "#84cc16", border: "2px solid #84cc16" }
                  }
                >
                  Alle
                </Button>
                <Button 
                  onClick={() => setSelectedCategory("dinner")}
                  className="transition-all duration-300 hover:scale-105 font-semibold rounded-full px-6" 
                  style={selectedCategory === "dinner" 
                    ? { backgroundColor: "#84cc16", color: "white" }
                    : { backgroundColor: "transparent", color: "#84cc16", border: "2px solid #84cc16" }
                  }
                >
                  Diner
                </Button>
                <Button 
                  onClick={() => setSelectedCategory("lunch")}
                  className="transition-all duration-300 hover:scale-105 font-semibold rounded-full px-6" 
                  style={selectedCategory === "lunch" 
                    ? { backgroundColor: "#84cc16", color: "white" }
                    : { backgroundColor: "transparent", color: "#84cc16", border: "2px solid #84cc16" }
                  }
                >
                  Lunch
                </Button>
                <Button 
                  onClick={() => setSelectedCategory("breakfast")}
                  className="transition-all duration-300 hover:scale-105 font-semibold rounded-full px-6" 
                  style={selectedCategory === "breakfast" 
                    ? { backgroundColor: "#84cc16", color: "white" }
                    : { backgroundColor: "transparent", color: "#84cc16", border: "2px solid #84cc16" }
                  }
                >
                  Ontbijt
                </Button>
                <Button 
                  onClick={() => setSelectedCategory("dessert")}
                  className="transition-all duration-300 hover:scale-105 font-semibold rounded-full px-6" 
                  style={selectedCategory === "dessert" 
                    ? { backgroundColor: "#84cc16", color: "white" }
                    : { backgroundColor: "transparent", color: "#84cc16", border: "2px solid #84cc16" }
                  }
                >
                  Dessert
                </Button>
              </div>

              {/* Recipe Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(9)].map((_, i) => (
                    <Card key={i} className="overflow-hidden border-0 animate-pulse" style={{ backgroundColor: "white", border: `1px solid #e7e5e4` }}>
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6 md:p-8 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recipes.map((recipe) => (
                    <Link key={recipe.id} href={user ? `/recepten/${recipe.id}` : "/signup"} onClick={handleRecipeClick}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-0" style={{ backgroundColor: "white", border: `1px solid #e7e5e4` }}>
                        {/* Recipe Image */}
                        <div className="relative h-48 overflow-hidden">
                          {recipe.image_url ? (
                            <Image
                              src={recipe.image_url}
                              alt={recipe.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-lime-100 to-lime-200 flex items-center justify-center">
                              <div className="text-center">
                                <ChefHat className="h-12 w-12 text-lime-400/50 mx-auto mb-2" />
                                <p className="text-lime-600 text-sm font-medium">{recipe.name}</p>
                              </div>
                            </div>
                          )}
                          {/* Green label */}
                          <div className="absolute top-3 right-3 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-300" style={{ backgroundColor: "#84cc16" }}>
                            {mealTypeLabels[recipe.meal_type]}
                          </div>
                        </div>

                        {/* Recipe Info */}
                        <div className="p-6 md:p-8">
                          <h3 className="font-semibold text-lg mb-3 transition-colors line-clamp-2" style={{ color: "#1c1917" }}>
                            {recipe.name}
                          </h3>

                          <div className="space-y-3">
                            {/* Owner Info */}
                            {recipe.owner_name && (
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  {recipe.owner_avatar && (
                                    <AvatarImage src={recipe.owner_avatar} alt={recipe.owner_name} />
                                  )}
                                  <AvatarFallback className="text-xs" style={{ backgroundColor: "#f0fdf4", color: "#84cc16" }}>
                                    {recipe.owner_name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium" style={{ color: "#78716c" }}>
                                  Posted by: {recipe.owner_name}
                                </span>
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {recipe.description}
                            </p>

                            {/* Time and Servings */}
                            <div className="flex items-center gap-4 text-xs" style={{ color: "#78716c" }}>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{recipe.preparation_time + recipe.cooking_time} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{recipe.servings} pers.</span>
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between pt-2" style={{ borderTopColor: "#e7e5e4", borderTopWidth: "1px" }}>
                              <span className="text-xs font-medium px-3 py-1 rounded" style={{ color: "#84cc16", backgroundColor: "#f0fdf4" }}>
                                {recipe.ingredients?.length || 0} ingrediënten
                              </span>
                              <Heart className="h-4 w-4 transition-all hover:fill-red-500 hover:text-red-500" style={{ color: "#e7e5e4" }} />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Geen recepten gevonden</h3>
                  <p className="text-gray-500 mb-6">Probeer een andere categorie of voeg zelf een recept toe!</p>
                  {user && (
                    <Button asChild style={{ backgroundColor: "#84cc16", color: "white" }}>
                      <Link href="/recepten/nieuw">Voeg een recept toe</Link>
                    </Button>
                  )}
                </div>
              )}

              {/* Load More Button */}
              <div className="flex justify-center mt-12">
                <Button size="lg" className="transition-all duration-300 hover:scale-105 font-semibold rounded-full px-8 py-4" style={{ backgroundColor: "#84cc16", color: "white" }} asChild onClick={handleViewAllClick}>
                  <Link href={user ? "/recepten" : "/login"}>
                    Zie meer recepten
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}