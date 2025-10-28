-- Migration script for updating the users table to match our Next.js API requirements

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add name column if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_attribute 
                  WHERE attrelid = 'users'::regclass
                  AND attname = 'name'
                  AND NOT attisdropped) THEN
        ALTER TABLE users ADD COLUMN name VARCHAR(255);
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_attribute 
                  WHERE attrelid = 'users'::regclass
                  AND attname = 'created_at'
                  AND NOT attisdropped) THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_attribute 
                  WHERE attrelid = 'users'::regclass
                  AND attname = 'updated_at'
                  AND NOT attisdropped) THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END
$$;

-- Update existing records to ensure name has a value
UPDATE users SET name = username WHERE name IS NULL;

-- Make name column NOT NULL
ALTER TABLE users ALTER COLUMN name SET NOT NULL;
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;

-- Create index on email for faster lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);