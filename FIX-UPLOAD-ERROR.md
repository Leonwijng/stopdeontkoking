# 🔧 SNELLE FIX - Upload Error

## ❌ Probleem: "new row violates row-level security policy"

Dit betekent dat de storage policies niet goed staan.

## ✅ Oplossing (30 seconden):

### 1. Ga naar Supabase SQL Editor

### 2. Kopieer & Run dit:

Open `/sql/FIX-STORAGE-POLICIES.sql` en run het!

**OF kopieer dit:**

```sql
-- Verwijder oude policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view recipe images" ON storage.objects;

-- Nieuwe simpele policies
CREATE POLICY "Authenticated users can manage avatars"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can manage recipe images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'recipe-images')
WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Public can view recipe images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'recipe-images');
```

### 3. Klik "Run"

### 4. Probeer upload opnieuw!

Het zou nu moeten werken! 🎉

---

## 💡 Wat doet dit?

- Verwijdert oude restrictieve policies
- Maakt nieuwe simpele policies:
  - Ingelogde gebruikers kunnen uploaden/bewerken/verwijderen
  - Iedereen kan foto's bekijken (public read)

---

## Werkt het nog niet?

Check:
1. Zijn de buckets `avatars` en `recipe-images` aangemaakt?
2. Zijn ze allebei **Public** (niet Private)?
3. Ben je ingelogd in de app?
4. Hard refresh browser (Ctrl+Shift+R)
