"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { recipeAPI } from "@/lib/api"
import { Recipe } from "@/types/recipe"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeGridSkeleton } from "@/components/loading-skeletons"
import { EmptyState } from "@/components/empty-state"
import { ProfileAvatarEditor } from "@/components/profile-avatar-editor"
import { User, Mail, Calendar, Shield } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user) return

      try {
        // Fetch all recipes and filter by owner_id
        const response = await recipeAPI.search({ limit: 100 })
        const userRecipes = response.recipes.filter(
          (recipe) => recipe.owner_id === user.id.toString()
        )
        setRecipes(userRecipes)
      } catch (error) {
        console.error("Error fetching user recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && !authLoading) {
      fetchUserRecipes()
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">Laden...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get user data from Supabase user object
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Gebruiker'
  const userEmail = user.email || ''
  const userCreatedAt = user.created_at || new Date().toISOString()
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="space-y-8">
        {/* Profile Avatar Editor */}
        <ProfileAvatarEditor />

        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="text-2xl">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-3xl">{userName}</CardTitle>
                <CardDescription className="text-base">@{userEmail.split('@')[0]}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">E-mail</div>
                  <div className="font-medium">{userEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Lid sinds</div>
                  <div className="font-medium">{formatDate(userCreatedAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Rol</div>
                  <div className="font-medium capitalize">{user.user_metadata?.role || 'user'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Recipes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Mijn Recepten</h2>
              <p className="text-muted-foreground">
                {recipes.length} {recipes.length === 1 ? "recept" : "recepten"}
              </p>
            </div>
            <Button asChild>
              <a href="/recepten/nieuw">Nieuw Recept</a>
            </Button>
          </div>

          {loading ? (
            <RecipeGridSkeleton />
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nog geen recepten"
              description="Je hebt nog geen recepten toegevoegd. Begin nu met het delen van je favoriete recepten!"
              action={{
                label: "Eerste Recept Toevoegen",
                href: "/recepten/nieuw",
              }}
              icon="chef"
            />
          )}
        </div>
      </div>
    </div>
  )
}
