"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { recipeAPI } from "@/lib/api"
import { Recipe } from "@/types/recipe"
import { RecipeForm } from "@/components/recipe-form"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { uploadImage } from "@/lib/image-upload"

export default function EditRecipePage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useAuth()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
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
        router.push("/recepten")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchRecipe()
    }
  }, [params.id, authLoading])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (recipe && user && !authLoading) {
      const canEdit = user.id === recipe.owner_id || isAdmin
      if (!canEdit) {
        toast({
          variant: "destructive",
          title: "Geen toegang",
          description: "Je hebt geen rechten om dit recept te bewerken.",
        })
        router.push(`/recepten/${recipe.id}`)
      }
    }
  }, [recipe, user, authLoading, isAdmin, router, toast])

  const handleSubmit = async (data: Partial<Recipe>, imageFile?: File | null) => {
    if (!recipe) return

    setIsSubmitting(true)
    try {
      let image_url = recipe.image_url

      // Upload new image if provided
      if (imageFile && user) {
        try {
          image_url = await uploadImage(imageFile, "recipe-images", user.id)
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Fout bij uploaden afbeelding",
            description: error.message,
          })
          // Continue with old image
        }
      }

      await recipeAPI.update(recipe.id, {
        ...data,
        image_url,
      })
      toast({
        title: "Recept bijgewerkt!",
        description: "Je wijzigingen zijn succesvol opgeslagen.",
      })
      router.push(`/recepten/${recipe.id}`)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij opslaan",
        description: error.message || "Het recept kon niet worden bijgewerkt.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="container py-12 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!user || !recipe) {
    return null
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/recepten/${recipe.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar recept
        </Link>
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Recept Bewerken</h1>
          <p className="text-lg text-muted-foreground">
            Pas je recept aan en sla de wijzigingen op
          </p>
        </div>

        <RecipeForm recipe={recipe} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
