-- ZED HUSTLE Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    bids_remaining INTEGER DEFAULT 50,
    referral_code VARCHAR(10) UNIQUE,
    referral_earnings DECIMAL(10,2) DEFAULT 0.00,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_tier VARCHAR(10), -- 'K50' or 'K100'
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company VARCHAR(255),
    salary_range VARCHAR(100),
    location VARCHAR(100),
    category VARCHAR(50),
    tags TEXT[], -- Array of tags
    bids_required INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'completed'
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    proposal TEXT,
    bids_used INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Commodities table
CREATE TABLE IF NOT EXISTS commodities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    price_change DECIMAL(5,2) DEFAULT 0.00, -- Percentage change
    unit VARCHAR(20) DEFAULT 'kg',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Token Holdings table
CREATE TABLE IF NOT EXISTS user_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    commodity_id UUID REFERENCES commodities(id),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, commodity_id)
);

-- Trading History table
CREATE TABLE IF NOT EXISTS trades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    commodity_id UUID REFERENCES commodities(id),
    trade_type VARCHAR(10) NOT NULL, -- 'buy' or 'sell'
    amount DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses for Investment table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    expected_return VARCHAR(20), -- e.g., '8% monthly'
    min_investment DECIMAL(10,2) NOT NULL,
    total_raised DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'withdrawn', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_admin_message BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES users(id),
    referred_id UUID REFERENCES users(id),
    bonus_amount DECIMAL(10,2) DEFAULT 5.00,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments/Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    transaction_type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'payment', 'earning'
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    payment_method VARCHAR(50), -- 'MTN', 'Airtel', 'Zamtel'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample commodities
INSERT INTO commodities (name, current_price, price_change, unit) VALUES
('Copper', 8500.00, 2.3, 'kg'),
('Gold', 12800.00, -0.8, 'gram'),
('Maize', 450.00, 1.2, 'bag'),
('Oil', 950.00, 3.1, 'liter')
ON CONFLICT (name) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    price_change = EXCLUDED.price_change,
    updated_at = NOW();

-- Insert sample businesses
INSERT INTO businesses (name, description, expected_return, min_investment) VALUES
('Lusaka Tech Solutions', 'Software development company focusing on mobile apps and web solutions', '12% monthly', 100.00),
('Kitwe Agriculture Co.', 'Organic farming and produce distribution across Copperbelt', '8% monthly', 50.00),
('Ndola Trading Hub', 'Import/export business connecting Zambia with regional markets', '10% monthly', 200.00)
ON CONFLICT DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (title, description, company, salary_range, location, category, tags, bids_required) VALUES
('Web Developer Needed', 'We need a skilled web developer to help build our e-commerce platform using modern technologies.', 'Tech Solutions Ltd', 'K2,500 - K4,000', 'Lusaka', 'web-development', ARRAY['React', 'Node.js', 'E-commerce'], 5),
('Graphic Designer for Branding', 'Looking for a creative graphic designer to help with brand identity and marketing materials.', 'Creative Agency', 'K1,800 - K3,200', 'Remote', 'graphic-design', ARRAY['Adobe Creative Suite', 'Branding'], 5),
('Mobile App Developer', 'Develop a mobile app for our delivery service. Experience with React Native preferred.', 'DeliveryZM', 'K3,000 - K5,000', 'Kitwe', 'mobile-development', ARRAY['React Native', 'JavaScript', 'Mobile'], 8),
('Content Writer', 'Create engaging content for our blog and social media channels about Zambian culture and business.', 'Cultural Media', 'K1,200 - K2,000', 'Remote', 'content-writing', ARRAY['Writing', 'SEO', 'Social Media'], 3)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user_id ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Jobs are publicly readable, but only job posters can update
CREATE POLICY "Jobs are publicly readable" ON jobs FOR SELECT USING (true);
CREATE POLICY "Users can create jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Job posters can update their jobs" ON jobs FOR UPDATE USING (auth.uid() = posted_by);

-- Job applications - users can see their own applications
CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User tokens - users can only see their own tokens
CREATE POLICY "Users can view own tokens" ON user_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tokens" ON user_tokens FOR ALL USING (auth.uid() = user_id);

-- Trades - users can only see their own trades
CREATE POLICY "Users can view own trades" ON trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create trades" ON trades FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investments - users can only see their own investments
CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create investments" ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages - users can see messages to/from them
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Transactions - users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Commodities and businesses are publicly readable
CREATE POLICY "Commodities are publicly readable" ON commodities FOR SELECT USING (true);
CREATE POLICY "Businesses are publicly readable" ON businesses FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON user_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commodities_updated_at BEFORE UPDATE ON commodities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
    RETURN upper(substring(md5(random()::text), 1, 6));
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate unique referral code
    NEW.referral_code = generate_referral_code();
    
    -- Ensure referral code is unique
    WHILE EXISTS (SELECT 1 FROM users WHERE referral_code = NEW.referral_code) LOOP
        NEW.referral_code = generate_referral_code();
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for new user registration
CREATE TRIGGER on_user_created
    BEFORE INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

COMMENT ON TABLE users IS 'ZED HUSTLE platform users with authentication and profile data';
COMMENT ON TABLE jobs IS 'Job listings posted by users and companies';
COMMENT ON TABLE commodities IS 'Tradeable commodities with current prices';
COMMENT ON TABLE businesses IS 'Investment opportunities for users';
COMMENT ON TABLE trades IS 'Trading history for commodity tokens';
COMMENT ON TABLE investments IS 'User investments in businesses';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
