-- Simple Supabase Table Setup
-- Copy and paste this into Supabase SQL Editor

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

-- Recipe Ingredients Table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient TEXT NOT NULL,
    quantity FLOAT,
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, ingredient)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_owner_id ON recipes(owner_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Policies: Allow authenticated users to read all recipes
CREATE POLICY "Allow authenticated users to read recipes"
ON recipes FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow users to insert their own recipes
CREATE POLICY "Allow users to insert their own recipes"
ON recipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Policy: Allow users to update their own recipes
CREATE POLICY "Allow users to update their own recipes"
ON recipes FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

-- Policy: Allow users to delete their own recipes
CREATE POLICY "Allow users to delete their own recipes"
ON recipes FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Policies for recipe_ingredients (they follow the recipe ownership)
CREATE POLICY "Allow authenticated users to read recipe ingredients"
ON recipe_ingredients FOR SELECT
TO authenticated
USING (true);

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
