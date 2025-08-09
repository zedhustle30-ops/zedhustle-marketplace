-- Create users table for ZED HUSTLE authentication
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

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index for referral codes
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy to allow anonymous users to insert during signup
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample user for testing (optional)
-- INSERT INTO users (email, full_name, phone, has_paid_signup_fee, bids, wallet, referral_code) VALUES
--     ('test@example.com', 'Test User', '+260123456789', true, 50, 100.00, 'TEST123');
