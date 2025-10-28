-- Add image columns to existing tables
-- Run this in Supabase SQL Editor

-- Add image_url column to recipes table
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Note: Supabase Auth users already have a avatar_url field in user_metadata
-- We'll use that for profile pictures instead of adding a column
