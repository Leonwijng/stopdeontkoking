-- Updates to the recipes table to add meal_type and other required fields
ALTER TABLE recipes 
  ADD COLUMN IF NOT EXISTS meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink')),
  ADD COLUMN IF NOT EXISTS preparation_time INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cooking_time INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS servings INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS instructions TEXT[];

-- Create a table for recipe ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient TEXT NOT NULL,
  quantity FLOAT,
  unit TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(recipe_id, ingredient)
);

-- Create indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);

-- Sample recipe data for testing
INSERT INTO recipes (
  id, owner_id, name, description, meal_type, preparation_time, cooking_time, servings, instructions
) VALUES (
  'b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1',
  (SELECT id FROM users LIMIT 1), -- Get the first user as owner
  'Spaghetti Carbonara',
  'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper',
  'dinner',
  15,
  20,
  4,
  ARRAY['Boil water and cook pasta according to package instructions', 
        'In a bowl, mix eggs, grated cheese, and black pepper', 
        'Fry pancetta until crispy', 
        'Drain pasta, mix with egg mixture and pancetta while still hot', 
        'Serve immediately with extra cheese and black pepper']
);

-- Add ingredients for the sample recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient, quantity, unit) VALUES
  ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'spaghetti', 400, 'g'),
  ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'eggs', 4, ''),
  ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'pancetta', 150, 'g'),
  ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'parmesan cheese', 100, 'g'),
  ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'black pepper', 1, 'tsp'),
  ('b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1', 'salt', 1, 'tsp');

-- Insert another sample recipe
INSERT INTO recipes (
  id, owner_id, name, description, meal_type, preparation_time, cooking_time, servings, instructions
) VALUES (
  'c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2',
  (SELECT id FROM users LIMIT 1), -- Get the first user as owner
  'Chicken Stir Fry',
  'A quick and healthy dinner with chicken and vegetables',
  'dinner',
  15,
  15,
  2,
  ARRAY['Cut chicken into small strips', 
        'Chop vegetables into bite-sized pieces', 
        'Heat oil in a wok and stir-fry chicken until cooked', 
        'Add vegetables and stir-fry for 3-5 minutes', 
        'Add sauce and continue cooking for 1-2 minutes',
        'Serve hot with rice']
);

-- Add ingredients for the second sample recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient, quantity, unit) VALUES
  ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'chicken breast', 300, 'g'),
  ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'bell pepper', 1, ''),
  ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'broccoli', 200, 'g'),
  ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'carrots', 2, ''),
  ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'soy sauce', 2, 'tbsp'),
  ('c6e9dcc8-5b3f-4288-0fee-3c92a9c9f2b2', 'vegetable oil', 1, 'tbsp');