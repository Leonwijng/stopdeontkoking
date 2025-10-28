# 🚀 Quick Setup Guide - Foto's

## ⚡ Snelle Setup (3 stappen):

### 1️⃣ Database - SQL uitvoeren in Supabase SQL Editor:

```sql
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### 2️⃣ Storage - Maak 2 buckets aan in Supabase Dashboard → Storage:

**Bucket 1: `avatars`**
- Klik "New bucket"
- Naam: `avatars`
- ✅ Public bucket (aanvinken)
- Create

**Bucket 2: `recipe-images`**
- Klik "New bucket"  
- Naam: `recipe-images`
- ✅ Public bucket (aanvinken)
- Create

### 3️⃣ Test het!

```bash
npm run dev
```

**Profielfoto:**
- Ga naar `/profiel`
- Hover over je avatar
- Klik om foto te uploaden
- Check navbar → je foto staat er!

**Receptfoto:**
- Ga naar `/recepten/nieuw`
- Upload een foto bij "Recept Foto"
- Sla op
- Check of foto verschijnt op:
  - Detail pagina
  - Recepten lijst
  - Homepagina

## ✅ Klaar!

Zie `FOTO-UPLOAD-GUIDE.md` voor uitgebreide documentatie.
