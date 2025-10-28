# 📸 Foto Upload Feature - Implementatie Instructies

## 🎯 Wat is geïmplementeerd:

### 1. **Recepten Foto's**
- ✅ Upload foto bij nieuw recept
- ✅ Wijzig foto bij bestaand recept
- ✅ Toon foto op receptdetail pagina
- ✅ Toon foto in receptlijst (grid)
- ✅ Toon foto op homepagina

### 2. **Profielfoto's**
- ✅ Upload/wijzig profielfoto op profiel pagina
- ✅ Toon profielfoto in navbar dropdown
- ✅ Toon profielfoto op profiel pagina
- ✅ Hover-to-upload functionaliteit
- ✅ Auto-refresh na upload

## 🗄️ Database Setup Vereist:

### Stap 1: Voeg image_url kolom toe aan recipes tabel

Voer uit in Supabase SQL Editor:

```sql
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### Stap 2: Maak Storage Buckets aan

Ga naar Supabase Dashboard → Storage en maak deze buckets aan:

1. **Bucket: `avatars`**
   - Public: ✅ (voor lezen)
   - Allowed MIME types: `image/*`
   - Max file size: 5MB

2. **Bucket: `recipe-images`**
   - Public: ✅ (voor lezen)
   - Allowed MIME types: `image/*`
   - Max file size: 5MB

### Stap 3: Storage Policies (optioneel, automatisch via RLS)

De policies zijn al goed gezet als je de buckets public maakt voor lezen.

## 📦 Wat is toegevoegd aan de code:

### Nieuwe bestanden:
- `/src/lib/image-upload.ts` - Helper functies voor uploads
- `/src/components/image-upload.tsx` - Upload component voor recepten
- `/src/components/profile-avatar-editor.tsx` - Upload component voor profielfoto
- `/sql/add-image-columns.sql` - Database migratie
- `/sql/setup-storage.sql` - Storage policies (reference)

### Aangepaste bestanden:
- `recipe.ts` - Added `image_url?: string`
- `recipe-form.tsx` - Image upload toegevoegd
- `recipe-card.tsx` - Toont afbeelding
- `recepten/nieuw/page.tsx` - Handle image upload
- `recepten/[id]/bewerken/page.tsx` - Handle image upload
- `recepten/[id]/page.tsx` - Toont afbeelding
- `page.tsx` (home) - Toont afbeeldingen
- `profiel/page.tsx` - Avatar editor toegevoegd
- `navbar.tsx` - Toont avatar in dropdown
- `avatar.tsx` - Export AvatarImage component

## 🚀 Testing Checklist:

1. [ ] Voer SQL uit om `image_url` kolom toe te voegen
2. [ ] Maak `avatars` bucket aan in Supabase Dashboard (Public)
3. [ ] Maak `recipe-images` bucket aan in Supabase Dashboard (Public)
4. [ ] Start dev server: `npm run dev`
5. [ ] Test: Profielfoto uploaden op /profiel
6. [ ] Controleer: Avatar zichtbaar in navbar
7. [ ] Test: Nieuw recept aanmaken met foto
8. [ ] Test: Recept bewerken en foto wijzigen
9. [ ] Controleer: Foto zichtbaar op detail pagina
10. [ ] Controleer: Foto zichtbaar in receptlijst
11. [ ] Controleer: Foto zichtbaar op homepagina

## 💡 Features:

### Recepten Foto's:
- ✅ Drag & drop support (via file input)
- ✅ Image preview voor upload
- ✅ File size validation (max 5MB)
- ✅ File type validation (alleen images)
- ✅ Verwijder/wijzig afbeelding
- ✅ Fallback UI als geen afbeelding
- ✅ Hover effects en transitions
- ✅ Responsive design

### Profielfoto's:
- ✅ Hover-to-upload interface
- ✅ Camera icon overlay
- ✅ Loading spinner tijdens upload
- ✅ Instant preview in avatar
- ✅ Auto-refresh na upload
- ✅ Toont in navbar dropdown
- ✅ File validation (type & size)

## 🔜 Toekomstige uitbreidingen:

- Image cropping/resizing voor avatars
- Multiple images per recept (gallery)
- Image optimization/compression
- CDN voor snellere loading
- Drag & drop voor recepten foto's
