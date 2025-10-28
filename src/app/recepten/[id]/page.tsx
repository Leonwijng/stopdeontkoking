"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { recipeAPI } from "@/lib/api"
import { Recipe } from "@/types/recipe"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, Users, ChefHat, ArrowLeft, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { formatTime, formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

const mealTypeLabels: Record<Recipe["meal_type"], string> = {
  breakfast: "Ontbijt",
  lunch: "Lunch",
  dinner: "Diner",
  snack: "Snack",
  dessert: "Dessert",
  drink: "Drankje",
}

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  useEffect(() => {
    if (!user && !authLoading) return // Don't fetch if not logged in

    const fetchRecipe = async () => {
      try {
        const data = await recipeAPI.getById(params.id as string)
        setRecipe(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Fout bij laden",
          description: "Recept kon niet worden geladen.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id, user, authLoading, toast])

  const handleDelete = async () => {
    if (!recipe) return

    setIsDeleting(true)
    try {
      await recipeAPI.delete(recipe.id)
      toast({
        title: "Recept verwijderd",
        description: "Het recept is succesvol verwijderd.",
      })
      router.push("/recepten")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fout bij verwijderen",
        description: "Het recept kon niet worden verwijderd.",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container py-12 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Recept niet gevonden</h1>
        <Button asChild>
          <Link href="/recepten">Terug naar recepten</Link>
        </Button>
      </div>
    )
  }

  const canEdit = user && (user.id === recipe.owner_id || isAdmin)
  const totalTime = recipe.preparation_time + recipe.cooking_time

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/recepten">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar recepten
        </Link>
      </Button>

      <div className="space-y-8">
        {/* Recipe Image */}
        {recipe.image_url && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-4xl font-bold">{recipe.name}</h1>
                <Badge>{mealTypeLabels[recipe.meal_type]}</Badge>
              </div>
              <p className="text-lg text-muted-foreground">{recipe.description}</p>
              
              {/* Owner Info */}
              {recipe.owner_name && (
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="h-8 w-8">
                    {recipe.owner_avatar && (
                      <AvatarImage src={recipe.owner_avatar} alt={recipe.owner_name} />
                    )}
                    <AvatarFallback className="text-sm">
                      {recipe.owner_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {recipe.owner_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(recipe.created_at)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/recepten/${recipe.id}/bewerken`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <div>
                <div className="text-sm">Totale tijd</div>
                <div className="font-semibold text-foreground">{formatTime(totalTime)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <div>
                <div className="text-sm">Porties</div>
                <div className="font-semibold text-foreground">
                  {recipe.servings} {recipe.servings === 1 ? "persoon" : "personen"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              <div>
                <div className="text-sm">Bereidingstijd</div>
                <div className="font-semibold text-foreground">
                  {formatTime(recipe.preparation_time)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              <div>
                <div className="text-sm">Kooktijd</div>
                <div className="font-semibold text-foreground">
                  {formatTime(recipe.cooking_time)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingrediënten</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Bereidingswijze</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recept verwijderen?</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je dit recept wilt verwijderen? Deze actie kan niet ongedaan
              worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuleren
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Bezig met verwijderen..." : "Verwijderen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
