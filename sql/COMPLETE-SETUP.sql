-- ============================================
-- COMPLETE SQL SETUP - Stop de Ontkoking
-- ============================================
-- Kopieer en plak dit HELE bestand in Supabase SQL Editor
-- en klik op "Run" (of Ctrl+Enter)

-- ============================================
-- STAP 1: Extensions & Tabellen
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT[] NOT NULL DEFAULT '{}',
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink')),
    preparation_time INTEGER DEFAULT 0,
    cooking_time INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 1,
    instructions TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Ingredients Table (optioneel, voor later gebruik)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient TEXT NOT NULL,
    quantity FLOAT,
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, ingredient)
);

-- ============================================
-- STAP 2: Indexes voor betere performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_owner_id ON recipes(owner_id);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING GIN (ingredients);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient);

-- ============================================
-- STAP 3: Row Level Security (RLS)
-- ============================================

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STAP 4: Policies voor recipes
-- ============================================

-- Verwijder oude policies (als ze bestaan)
DROP POLICY IF EXISTS "Allow authenticated users to read recipes" ON recipes;
DROP POLICY IF EXISTS "Allow anyone to read all recipes" ON recipes;
DROP POLICY IF EXISTS "Allow users to insert their own recipes" ON recipes;
DROP POLICY IF EXISTS "Allow users to update their own recipes" ON recipes;
DROP POLICY IF EXISTS "Allow users to delete their own recipes" ON recipes;

-- Iedereen (ook niet-ingelogd) kan recepten LEZEN
CREATE POLICY "Allow anyone to read all recipes"
ON recipes FOR SELECT
TO public
USING (true);

-- Alleen ingelogde gebruikers kunnen recepten TOEVOEGEN
CREATE POLICY "Allow users to insert their own recipes"
ON recipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Alleen eigenaar kan zijn eigen recepten BEWERKEN
CREATE POLICY "Allow users to update their own recipes"
ON recipes FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

-- Alleen eigenaar kan zijn eigen recepten VERWIJDEREN
CREATE POLICY "Allow users to delete their own recipes"
ON recipes FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- ============================================
-- STAP 5: Policies voor recipe_ingredients
-- ============================================

-- Verwijder oude policies
DROP POLICY IF EXISTS "Allow authenticated users to read recipe ingredients" ON recipe_ingredients;
DROP POLICY IF EXISTS "Allow anyone to read recipe ingredients" ON recipe_ingredients;
DROP POLICY IF EXISTS "Allow users to manage ingredients of their recipes" ON recipe_ingredients;

-- Iedereen kan ingrediënten LEZEN
CREATE POLICY "Allow anyone to read recipe ingredients"
ON recipe_ingredients FOR SELECT
TO public
USING (true);

-- Alleen eigenaar kan ingrediënten van zijn recepten BEHEREN
CREATE POLICY "Allow users to manage ingredients of their recipes"
ON recipe_ingredients FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND recipes.owner_id = auth.uid()
  )
);

-- ============================================
-- KLAAR! 🎉
-- ============================================
-- Je database is nu klaar voor gebruik.
-- 
-- VOLGENDE STAPPEN:
-- 1. Ga naar Supabase Dashboard → Storage
-- 2. Maak bucket 'avatars' (Public ✅)
-- 3. Maak bucket 'recipe-images' (Public ✅)
-- 4. Run FIX-STORAGE-POLICIES.sql (BELANGRIJK!)
-- 5. Run: npm run dev
-- 6. Test de app!
