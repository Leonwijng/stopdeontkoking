-- =========================================
-- Stop de Ontkoking Database Initialization
-- =========================================
-- This script creates all tables, indexes, and sample data
-- in chronological order for the Stop de Ontkoking application.

-- ==================
-- Extension Setup
-- ==================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==================
-- Users Table
-- ==================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, 
    role TEXT CHECK (role IN ('user', 'admin')),
    session_id TEXT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==================
-- Recipes Table
-- ==================
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL, 
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink')),
    preparation_time INTEGER DEFAULT 0,
    cooking_time INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 1,
    instructions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on meal_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes(meal_type);

-- ==================
-- Recipe Ingredients Table
-- ==================
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient TEXT NOT NULL,
    quantity FLOAT,
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, ingredient)
);

-- Create indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);

-- ==================
-- Sample Data
-- ==================

-- Insert a sample user if none exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
        INSERT INTO users (id, username, email, password_hash, role, name)
        VALUES (
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'sampleuser',
            'user@example.com',
            -- This is a pre-hashed password 'password123' using argon2
            '$argon2id$v=19$m=16,t=2,p=1$MTIzNDU2Nzg5MDEyMzQ$o5/3xAMQbHnJZX70SupnPw',
            'user',
            'Sample User'
        );
    END IF;
END
$$;

-- Insert sample recipes
INSERT INTO recipes (
    id, owner_id, name, description, meal_type, 
    preparation_time, cooking_time, servings, instructions
) VALUES (
    'b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Reference to sample user
    'Spaghetti Carbonara',
    'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper',
    'dinner',
    15,
    20,
    4,
    ARRAY[
        'Boil water and cook pasta according to package instructions', 
        'In a bowl, mix eggs, grated cheese, and black pepper', 
        'Fry pancetta until crispy', 
        'Drain pasta, mix with egg mixture and pancetta while still hot', 
        'Serve immediately with extra cheese and black pepper'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Add ingredients for the sample recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient, quantity, unit) 
VALUES
    ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'spaghetti', 400, 'g'),
    ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'eggs', 4, ''),
    ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'pancetta', 150, 'g'),
    ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'parmesan cheese', 100, 'g'),
    ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'black pepper', 1, 'tsp'),
    ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'salt', 1, 'tsp')
ON CONFLICT (recipe_id, ingredient) DO NOTHING;

-- Insert another sample recipe
INSERT INTO recipes (
    id, owner_id, name, description, meal_type, 
    preparation_time, cooking_time, servings, instructions
) VALUES (
    'c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Reference to sample user
    'Chicken Stir Fry',
    'A quick and healthy dinner with chicken and vegetables',
    'dinner',
    15,
    15,
    2,
    ARRAY[
        'Cut chicken into small strips', 
        'Chop vegetables into bite-sized pieces', 
        'Heat oil in a wok and stir-fry chicken until cooked', 
        'Add vegetables and stir-fry for 3-5 minutes', 
        'Add sauce and continue cooking for 1-2 minutes',
        'Serve hot with rice'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Add ingredients for the second sample recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient, quantity, unit) 
VALUES
    ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'chicken breast', 300, 'g'),
    ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'bell pepper', 1, ''),
    ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'broccoli', 200, 'g'),
    ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'carrots', 2, ''),
    ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'soy sauce', 2, 'tbsp'),
    ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'vegetable oil', 1, 'tbsp')
ON CONFLICT (recipe_id, ingredient) DO NOTHING;