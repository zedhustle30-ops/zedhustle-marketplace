-- ZED HUSTLE Database Schema
-- Supabase PostgreSQL setup for ZED HUSTLE marketplace

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    has_paid_signup_fee BOOLEAN DEFAULT FALSE,
    bids INTEGER DEFAULT 0,
    wallet DECIMAL(10,2) DEFAULT 0.00,
    referral_earnings DECIMAL(10,2) DEFAULT 0.00,
    referral_code VARCHAR(10) UNIQUE,
    premium_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    bids_required INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'active',
    posted_by UUID REFERENCES users(id),
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications table
CREATE TABLE job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bid_amount INTEGER NOT NULL,
    proposal TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades table (commodity trading)
CREATE TABLE trades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    commodity VARCHAR(50) NOT NULL,
    action VARCHAR(10) NOT NULL, -- 'buy' or 'sell'
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commodities table (price tracking)
CREATE TABLE commodities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    change_percent DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (wallet transactions)
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'payment', 'referral', 'trading', 'subscription'
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (user-to-user chat)
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    bonus_amount DECIMAL(10,2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table (ZedInvest)
CREATE TABLE businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    funding_goal DECIMAL(12,2) NOT NULL,
    funding_raised DECIMAL(12,2) DEFAULT 0.00,
    risk_level VARCHAR(20) DEFAULT 'medium',
    expected_return DECIMAL(5,2) DEFAULT 15.00,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table (user investments in businesses)
CREATE TABLE investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offline jobs table
CREATE TABLE offline_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    budget DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User portfolio table (for enhanced profiles)
CREATE TABLE user_portfolio (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commodity price history table
CREATE TABLE commodity_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    commodity VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_commodity ON trades(commodity);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_business_id ON investments(business_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodity_prices ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs" ON jobs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create jobs" ON jobs
    FOR INSERT WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Job owners can update their jobs" ON jobs
    FOR UPDATE USING (auth.uid() = posted_by);

-- Job applications policies
CREATE POLICY "Users can view their own applications" ON job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can view their own trades" ON trades
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create trades" ON trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Commodities policies (public read)
CREATE POLICY "Anyone can view commodities" ON commodities
    FOR SELECT USING (true);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view their own referrals" ON referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- Businesses policies (public read)
CREATE POLICY "Anyone can view active businesses" ON businesses
    FOR SELECT USING (status = 'active');

-- Investments policies
CREATE POLICY "Users can view their own investments" ON investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create investments" ON investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Offline jobs policies
CREATE POLICY "Anyone can view active offline jobs" ON offline_jobs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create offline jobs" ON offline_jobs
    FOR INSERT WITH CHECK (auth.uid() = posted_by);

-- User portfolio policies
CREATE POLICY "Users can view their own portfolio" ON user_portfolio
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolio" ON user_portfolio
    FOR ALL USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Commodity prices policies (public read)
CREATE POLICY "Anyone can view commodity prices" ON commodity_prices
    FOR SELECT USING (true);

-- Insert sample data

-- Sample commodities
INSERT INTO commodities (name, current_price, change_percent) VALUES
('Copper', 8500.00, 2.5),
('Gold', 1950.00, -1.2),
('Maize', 250.00, 0.8),
('Oil', 75.50, 1.5),
('Diamonds', 12000.00, 0.3);

-- Sample businesses for ZedInvest
INSERT INTO businesses (name, description, category, location, funding_goal, funding_raised, risk_level, expected_return) VALUES
('Lusaka Tech Hub', 'Innovative co-working space for tech startups in Lusaka', 'technology', 'Lusaka', 50000.00, 15000.00, 'low', 12.00),
('Copperbelt Mining Equipment', 'Modern mining equipment rental and sales', 'mining', 'Kitwe', 100000.00, 45000.00, 'medium', 18.00),
('Zambia Retail Chain', 'Expanding retail chain across major Zambian cities', 'retail', 'Multiple Cities', 100000.00, 20000.00, 'medium', 15.00),
('Agricultural Processing Plant', 'Modern food processing facility for local farmers', 'agriculture', 'Ndola', 75000.00, 30000.00, 'low', 14.00),
('Tourism Development Project', 'Eco-tourism lodge development in Livingstone', 'tourism', 'Livingstone', 80000.00, 25000.00, 'high', 22.00),
('Renewable Energy Solutions', 'Solar panel manufacturing and installation', 'energy', 'Lusaka', 120000.00, 60000.00, 'medium', 16.00);

-- Sample jobs
INSERT INTO jobs (title, description, category, budget_min, budget_max, bids_required, location, status) VALUES
('Website Developer Needed', 'Looking for a skilled web developer to create a modern e-commerce website', 'web-development', 500.00, 1500.00, 5, 'Lusaka', 'active'),
('Logo Design for Restaurant', 'Need a professional logo design for a new restaurant opening in Kitwe', 'graphic-design', 200.00, 500.00, 3, 'Kitwe', 'active'),
('Mobile App Development', 'Develop a mobile app for food delivery service', 'mobile-development', 1000.00, 3000.00, 8, 'Lusaka', 'active'),
('Content Writer for Blog', 'Write engaging content for a technology blog', 'content-writing', 100.00, 300.00, 2, 'Remote', 'active'),
('Social Media Manager', 'Manage social media accounts for a retail business', 'marketing', 300.00, 800.00, 4, 'Ndola', 'active'),
('Photography for Event', 'Professional photography services for corporate event', 'photography', 400.00, 1000.00, 3, 'Lusaka', 'active'),
('Translation Services', 'Translate documents from English to local languages', 'translation', 150.00, 400.00, 2, 'Remote', 'active'),
('Data Entry Specialist', 'Help with data entry and organization tasks', 'data-entry', 100.00, 250.00, 2, 'Remote', 'active');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    code VARCHAR(10);
    exists BOOLEAN;
BEGIN
    LOOP
        code := UPPER(substring(md5(random()::text) from 1 for 8));
        SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists;
        IF NOT exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql; 