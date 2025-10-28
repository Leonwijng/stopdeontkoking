"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Recipe, MealType } from "@/types/recipe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"

const recipeSchema = z.object({
  name: z.string().min(3, "Naam moet minimaal 3 karakters bevatten"),
  description: z.string().min(10, "Beschrijving moet minimaal 10 karakters bevatten"),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snack", "dessert", "drink"]),
  preparation_time: z.number().min(1, "Bereidingstijd moet minimaal 1 minuut zijn"),
  cooking_time: z.number().min(0, "Kooktijd moet 0 of meer minuten zijn"),
  servings: z.number().min(1, "Aantal personen moet minimaal 1 zijn"),
  ingredients: z.array(z.string().min(1, "Ingrediënt mag niet leeg zijn")).min(1, "Voeg minimaal 1 ingrediënt toe"),
  instructions: z.array(z.string().min(1, "Stap mag niet leeg zijn")).min(1, "Voeg minimaal 1 bereidingsstap toe"),
})

type RecipeFormData = z.infer<typeof recipeSchema>

interface RecipeFormProps {
  recipe?: Recipe
  onSubmit: (data: Partial<Recipe>, imageFile?: File | null) => Promise<void>
  isSubmitting?: boolean
}

const mealTypeOptions = [
  { value: "breakfast", label: "Ontbijt" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Diner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
  { value: "drink", label: "Drankje" },
]

export function RecipeForm({ recipe, onSubmit, isSubmitting }: RecipeFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe || {
      name: "",
      description: "",
      meal_type: "dinner",
      preparation_time: 15,
      cooking_time: 30,
      servings: 4,
      ingredients: [""],
      instructions: [""],
    },
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: control as any,
    name: "ingredients",
  })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: control as any,
    name: "instructions",
  })

  const mealType = watch("meal_type")

  const handleFormSubmit = async (data: RecipeFormData) => {
    await onSubmit(data, imageFile)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Recept Foto</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            currentImage={recipe?.image_url}
            onImageChange={setImageFile}
            label="Recept afbeelding"
            description="Upload een foto van je gerecht (optioneel, max 5MB)"
          />
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basisinformatie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Naam van het recept *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Bijv. Spaghetti Carbonara"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Beschrijving *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Beschrijf je recept in een paar zinnen..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meal_type">Type gerecht *</Label>
              <Select
                value={mealType}
                onValueChange={(value) => setValue("meal_type", value as MealType)}
              >
                <SelectTrigger id="meal_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.meal_type && (
                <p className="text-sm text-destructive mt-1">{errors.meal_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="servings">Aantal personen *</Label>
              <Input
                id="servings"
                type="number"
                {...register("servings", { valueAsNumber: true })}
                min="1"
              />
              {errors.servings && (
                <p className="text-sm text-destructive mt-1">{errors.servings.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preparation_time">Bereidingstijd (minuten) *</Label>
              <Input
                id="preparation_time"
                type="number"
                {...register("preparation_time", { valueAsNumber: true })}
                min="1"
              />
              {errors.preparation_time && (
                <p className="text-sm text-destructive mt-1">
                  {errors.preparation_time.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cooking_time">Kooktijd (minuten) *</Label>
              <Input
                id="cooking_time"
                type="number"
                {...register("cooking_time", { valueAsNumber: true })}
                min="0"
              />
              {errors.cooking_time && (
                <p className="text-sm text-destructive mt-1">
                  {errors.cooking_time.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Ingrediënten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`ingredients.${index}`)}
                placeholder={`Ingrediënt ${index + 1}`}
              />
              {ingredientFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {errors.ingredients && (
            <p className="text-sm text-destructive">{errors.ingredients.message}</p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendIngredient("" as any)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ingrediënt toevoegen
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Bereidingswijze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-sm mt-2 min-w-[30px]">
                  Stap {index + 1}
                </span>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    {...register(`instructions.${index}`)}
                    placeholder={`Beschrijf stap ${index + 1}...`}
                    rows={2}
                  />
                  {instructionFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {errors.instructions && (
            <p className="text-sm text-destructive">{errors.instructions.message}</p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendInstruction("" as any)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Stap toevoegen
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Bezig met opslaan..." : recipe ? "Recept bijwerken" : "Recept opslaan"}
        </Button>
      </div>
    </form>
  )
}
