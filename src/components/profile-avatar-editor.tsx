"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Camera, Loader2 } from "lucide-react"
import { uploadImage, updateUserAvatar } from "@/lib/image-upload"

export function ProfileAvatarEditor() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user?.user_metadata?.avatar_url
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Ongeldige bestandstype",
        description: "Alleen afbeeldingen zijn toegestaan",
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Bestand te groot",
        description: "Afbeelding mag maximaal 5MB zijn",
      })
      return
    }

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const imageUrl = await uploadImage(file, "avatars", user.id)

      // Update user metadata
      await updateUserAvatar(imageUrl)

      setAvatarUrl(imageUrl)

      toast({
        title: "Profielfoto bijgewerkt!",
        description: "Je nieuwe profielfoto is succesvol opgeslagen.",
      })

      // Refresh page to update navbar
      window.location.reload()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload mislukt",
        description: error.message || "Er ging iets mis bij het uploaden.",
      })
    } finally {
      setUploading(false)
    }
  }

  if (!user) return null

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Gebruiker'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profielfoto</CardTitle>
        <CardDescription>
          Upload een profielfoto om je profiel te personaliseren
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="text-2xl">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Upload button overlay */}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </label>
            
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">
              Klik op je avatar om een nieuwe foto te uploaden
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG of GIF (max 5MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
