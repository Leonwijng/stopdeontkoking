# ✅ Setup Checklist - Stop de Ontkoking

## 📋 Volg deze stappen in volgorde:

### 1. SQL Database Setup

**Ga naar:** Supabase Dashboard → SQL Editor

1. Klik op "New Query"
2. Open `/sql/COMPLETE-SETUP.sql` in je editor
3. Kopieer de **hele inhoud**
4. Plak in Supabase SQL Editor
5. Klik op **"Run"** (of druk Ctrl+Enter)
6. ✅ Check: Geen errors, alles groen

---

### 2. Storage Buckets Aanmaken

**Ga naar:** Supabase Dashboard → Storage

#### Bucket 1: avatars
1. Klik **"New bucket"**
2. Name: `avatars`
3. ✅ **Vink "Public bucket" AAN**
4. Klik **"Create bucket"**

#### Bucket 2: recipe-images
1. Klik **"New bucket"**
2. Name: `recipe-images`
3. ✅ **Vink "Public bucket" AAN**
4. Klik **"Create bucket"**

---

### 3. Storage Policies (BELANGRIJK!)

**Ga terug naar:** Supabase Dashboard → SQL Editor

1. Open `/sql/FIX-STORAGE-POLICIES.sql`
2. Kopieer de **hele inhoud**
3. Plak in SQL Editor
4. Klik **"Run"**
5. ✅ Check: Geen errors

Dit zorgt ervoor dat uploads werken! 🎉

---

### 4. Start de App

```bash
npm run dev
```

App draait nu op: http://localhost:3000 (of 3001)

---

### 5. Test de Features

#### ✅ Authenticatie
- [ ] Maak account aan → `/signup`
- [ ] Log in → `/login`
- [ ] Check navbar → je naam staat er

#### ✅ Profielfoto
- [ ] Ga naar `/profiel`
- [ ] Hover over avatar → camera icon verschijnt
- [ ] Upload een foto
- [ ] Check navbar → je foto staat er!

#### ✅ Recepten
- [ ] Ga naar `/recepten/nieuw`
- [ ] Upload een receptfoto
- [ ] Vul recept in en sla op
- [ ] Check detail pagina → foto zichtbaar
- [ ] Check `/recepten` lijst → foto zichtbaar
- [ ] Check homepagina → foto zichtbaar

#### ✅ Homepagina
- [ ] Log uit
- [ ] Ga naar homepagina
- [ ] Zie recepten (maar kan niet klikken)
- [ ] Klik op recept → redirect naar signup ✅

---

## 🐛 Troubleshooting

### "Could not find table recipes"
→ Voer COMPLETE-SETUP.sql opnieuw uit

### "Could not find bucket"
→ Check of beide buckets aangemaakt zijn en **Public** zijn

### "Upload failed" / "row-level security policy"
→ Voer `/sql/FIX-STORAGE-POLICIES.sql` uit in SQL Editor!

### Geen foto's zichtbaar
→ Hard refresh in browser (Ctrl+Shift+R)

---

## 🎉 Alles werkt?

Gefeliciteerd! Je app is nu volledig functioneel met:
- ✅ Gebruikers authenticatie (Supabase Auth)
- ✅ Recepten database
- ✅ Foto uploads (recepten + profielen)
- ✅ Row Level Security
- ✅ Public + private content

Veel plezier! 🚀
