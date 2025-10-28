import { supabase } from "./supabase"

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageUploadError"
  }
}

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param bucket - The storage bucket name ('avatars' or 'recipe-images')
 * @param path - Optional path within the bucket
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: "avatars" | "recipe-images",
  path?: string
): Promise<string> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new ImageUploadError("Alleen afbeeldingen zijn toegestaan")
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new ImageUploadError("Afbeelding mag maximaal 5MB zijn")
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = path ? `${path}/${fileName}` : fileName

  // Upload to Supabase Storage
  const { data, error } = await supabase!.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    throw new ImageUploadError(error.message)
  }

  // Get public URL
  const { data: publicData } = supabase!.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicData.publicUrl
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image
 * @param bucket - The storage bucket name
 */
export async function deleteImage(
  url: string,
  bucket: "avatars" | "recipe-images"
): Promise<void> {
  // Extract path from URL
  const urlParts = url.split(`/storage/v1/object/public/${bucket}/`)
  if (urlParts.length < 2) {
    throw new ImageUploadError("Ongeldige afbeelding URL")
  }

  const path = urlParts[1]

  const { error } = await supabase!.storage.from(bucket).remove([path])

  if (error) {
    throw new ImageUploadError(error.message)
  }
}

/**
 * Update user avatar URL in user metadata
 * @param avatarUrl - The new avatar URL
 */
export async function updateUserAvatar(avatarUrl: string): Promise<void> {
  const { error } = await supabase!.auth.updateUser({
    data: { avatar_url: avatarUrl },
  })

  if (error) {
    throw new ImageUploadError(error.message)
  }
}
