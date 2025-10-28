-- ============================================
-- STORAGE POLICIES FIX
-- ============================================
-- Run dit in Supabase SQL Editor om storage policies te fixen
-- Dit moet NADAT je de buckets hebt aangemaakt!

-- ============================================
-- FIX: Verwijder oude policies en maak nieuwe
-- ============================================

-- AVATARS BUCKET
-- Verwijder oude policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Verwijder oude recipe policies
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view recipe images" ON storage.objects;

-- NIEUWE SIMPELE POLICIES (werken altijd!)

-- Avatars: Iedereen (authenticated) kan uploaden/updaten/deleten
CREATE POLICY "Authenticated users can manage avatars"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Avatars: Iedereen kan lezen (public)
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Recipe Images: Iedereen (authenticated) kan uploaden/updaten/deleten
CREATE POLICY "Authenticated users can manage recipe images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'recipe-images')
WITH CHECK (bucket_id = 'recipe-images');

-- Recipe Images: Iedereen kan lezen (public)
CREATE POLICY "Public can view recipe images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'recipe-images');

-- ============================================
-- KLAAR! Upload zou nu moeten werken 🎉
-- ============================================
