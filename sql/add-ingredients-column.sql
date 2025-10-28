-- Add ingredients column to existing recipes table
-- Run this in Supabase SQL Editor if the recipes table already exists

-- Add the ingredients column if it doesn't exist
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS ingredients TEXT[] NOT NULL DEFAULT '{}';

-- Create an index on ingredients for better search performance
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING GIN (ingredients);
