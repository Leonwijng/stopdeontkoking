"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MealType } from "@/types/recipe"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (ingredients: string, mealType: MealType | "") => void
}

const mealTypeOptions = [
  { value: "all", label: "Alle types" },
  { value: "breakfast", label: "Ontbijt" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Diner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
  { value: "drink", label: "Drankje" },
]

export function SearchBar({ onSearch }: SearchBarProps) {
  const [ingredients, setIngredients] = useState("")
  const [mealType, setMealType] = useState<MealType | "all">("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(ingredients, mealType === "all" ? "" : mealType)
  }

  return (
    <form onSubmit={handleSearch} className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek op ingrediënten..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={mealType} onValueChange={(value) => setMealType(value as MealType | "all")}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Type gerecht" />
          </SelectTrigger>
          <SelectContent>
            {mealTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Zoeken
        </Button>
      </div>
    </form>
  )
}
