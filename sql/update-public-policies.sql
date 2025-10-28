-- Update RLS Policies for Public Recipe Sharing
-- Run this in Supabase SQL Editor to allow everyone to see all recipes
-- But require login to view full details (handled in frontend)

-- First, drop the old restrictive policy
DROP POLICY IF EXISTS "Allow authenticated users to read recipes" ON recipes;

-- Create new policy: Allow EVERYONE (including anonymous users) to read all recipes
-- This allows the homepage to show recipe previews
CREATE POLICY "Allow anyone to read all recipes"
ON recipes FOR SELECT
TO public
USING (true);

-- Keep the rest of the policies the same (only owners can modify their recipes)
-- These should already exist from simple-setup.sql:

-- DROP and RECREATE to ensure they're correct
DROP POLICY IF EXISTS "Allow users to insert their own recipes" ON recipes;
CREATE POLICY "Allow users to insert their own recipes"
ON recipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Allow users to update their own recipes" ON recipes;
CREATE POLICY "Allow users to update their own recipes"
ON recipes FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Allow users to delete their own recipes" ON recipes;
CREATE POLICY "Allow users to delete their own recipes"
ON recipes FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Same for recipe_ingredients - allow everyone to read
DROP POLICY IF EXISTS "Allow authenticated users to read recipe ingredients" ON recipe_ingredients;
CREATE POLICY "Allow anyone to read recipe ingredients"
ON recipe_ingredients FOR SELECT
TO public
USING (true);

-- Keep the owner-only modification policy for ingredients
DROP POLICY IF EXISTS "Allow users to manage ingredients of their recipes" ON recipe_ingredients;
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
