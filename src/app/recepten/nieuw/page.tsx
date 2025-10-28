"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { recipeAPI } from "@/lib/api"
import { Recipe } from "@/types/recipe"
import { RecipeForm } from "@/components/recipe-form"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { uploadImage } from "@/lib/image-upload"

export default function NewRecipePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleSubmit = async (data: Partial<Recipe>, imageFile?: File | null) => {
    setIsSubmitting(true)
    try {
      let image_url: string | undefined = undefined

      // Upload image if provided
      if (imageFile && user) {
        try {
          image_url = await uploadImage(imageFile, "recipe-images", user.id)
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Fout bij uploaden afbeelding",
            description: error.message,
          })
          // Continue without image
        }
      }

      const newRecipe = await recipeAPI.create({
        ...data,
        image_url,
      })
      toast({
        title: "Recept aangemaakt!",
        description: "Je recept is succesvol toegevoegd.",
      })
      router.push(`/recepten/${newRecipe.id}`)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij opslaan",
        description: error.message || "Het recept kon niet worden opgeslagen.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 max-w-4xl mx-auto">
        <div className="text-center">Laden...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/recepten">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar recepten
        </Link>
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Nieuw Recept</h1>
          <p className="text-lg text-muted-foreground">
            Deel je favoriete recept met de community
          </p>
        </div>

        <RecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
