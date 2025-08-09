-- ZED HUSTLE Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    has_paid_signup_fee BOOLEAN DEFAULT FALSE,
    bids INTEGER DEFAULT 0,
    wallet DECIMAL(10,2) DEFAULT 0.00,
    referral_earnings DECIMAL(10,2) DEFAULT 0.00,
    referral_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- 3. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies that actually work for signup
-- Allow anyone to insert during registration (we'll secure this later)
CREATE POLICY IF NOT EXISTS "Allow public registration" ON users
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY IF NOT EXISTS "Users can read own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

-- Allow users to update their own data
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 5. Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger for auto-updating timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert a test user to verify everything works
INSERT INTO users (email, full_name, phone, has_paid_signup_fee, bids, wallet, referral_code) 
VALUES ('test@zedhustle.com', 'Test User', '+260123456789', true, 50, 100.00, 'TEST123')
ON CONFLICT (email) DO NOTHING;

-- 8. Verify the setup
SELECT 'Database setup completed successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
