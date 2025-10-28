import { ChefHat, Search, Frown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  icon?: "chef" | "search" | "sad"
}

export function EmptyState({ title, description, action, icon = "chef" }: EmptyStateProps) {
  const IconComponent = {
    chef: ChefHat,
    search: Search,
    sad: Frown,
  }[icon]

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <IconComponent className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
