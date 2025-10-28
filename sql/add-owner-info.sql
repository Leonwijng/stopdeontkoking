-- Add owner_name and owner_avatar columns to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS owner_avatar TEXT;

-- Create index for owner_name if needed
CREATE INDEX IF NOT EXISTS idx_recipes_owner_name ON recipes(owner_name);