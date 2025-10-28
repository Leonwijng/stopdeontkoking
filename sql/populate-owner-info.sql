-- Populate owner_name and owner_avatar for existing recipes
-- This assumes you have access to auth.users metadata

-- Note: This requires admin access to auth.users
-- Run this in Supabase SQL Editor with proper permissions

UPDATE recipes
SET
  owner_name = u.raw_user_meta_data->>'name',
  owner_avatar = u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
WHERE recipes.owner_id = u.id
  AND (recipes.owner_name IS NULL OR recipes.owner_name = '');

-- Alternative if you can't access auth.users:
-- You can manually update specific recipes, e.g.:
-- UPDATE recipes SET owner_name = 'User Name', owner_avatar = 'avatar_url' WHERE id = 'recipe_id';