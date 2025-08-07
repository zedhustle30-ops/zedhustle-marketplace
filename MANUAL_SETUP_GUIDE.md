# 🔧 ZED HUSTLE - Manual Setup Guide

## 🎯 Quick Setup Steps

### 1. Create Database Table

Go to your **Supabase Dashboard** → **SQL Editor** and run this SQL:

```sql
-- Create the resources table for commodity prices
CREATE TABLE IF NOT EXISTS resources (
    name text PRIMARY KEY,
    price numeric,
    baseline_price numeric,
    delta_percent numeric,
    note text,
    updated_at timestamptz DEFAULT NOW()
);

-- Insert sample commodity data
INSERT INTO resources (name, price, baseline_price, delta_percent, note) VALUES
    ('Copper', 125.50, 120.00, 4.58, 'Strong demand from construction sector'),
    ('Maize', 8.75, 8.50, 2.94, 'Good harvest season expected'),
    ('Gold', 1850.25, 1820.00, 1.66, 'Safe haven demand remains strong'),
    ('Diamonds', 95.80, 92.00, 4.13, 'Luxury market recovery')
ON CONFLICT (name) DO UPDATE SET
    price = EXCLUDED.price,
    baseline_price = EXCLUDED.baseline_price,
    delta_percent = EXCLUDED.delta_percent,
    note = EXCLUDED.note,
    updated_at = NOW();

-- Enable realtime for the resources table
ALTER PUBLICATION supabase_realtime ADD TABLE resources;
```

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jpdndlnblbbtaxcrsyfm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration (for AI price adjustments)
OPENAI_API_KEY=sk-xxxxxx

# Commodities API Configuration (for real market data)
COMMODITIES_API_KEY=your_commodities_api_key

# Optional: EXCHANGE_RATE_API_KEY if your forex provider needs it
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the System

1. **Visit Trading Page**: http://localhost:3000/trade
2. **Test Price Updates**: 
   ```bash
   curl -X POST http://localhost:3000/api/update-prices
   ```

## 🚀 What You'll Get

### Real-time Trading Interface
- Live commodity prices with AI adjustments
- Real-time updates via Supabase subscriptions
- Professional trading dashboard

### Hybrid Price System
- **70% Real Market Data** + **30% AI Adjustments**
- Realistic price movements
- Market commentary from AI

### Commodities Tracked
- **Copper** - Construction demand
- **Maize** - Agricultural markets  
- **Gold** - Safe haven asset
- **Diamonds** - Luxury market

## 🔧 Troubleshooting

### If Database Connection Fails
1. Check Supabase credentials in `.env.local`
2. Verify the `resources` table exists
3. Ensure realtime is enabled

### If API Keys Missing
- **OpenAI**: Get from https://platform.openai.com/api-keys
- **Commodities API**: Get from https://commodities-api.com
- **Service Role Key**: Get from Supabase Dashboard → Settings → API

### If Realtime Not Working
1. Go to Supabase Dashboard → Database → Replication
2. Ensure `resources` table is enabled for realtime
3. Check browser console for connection errors

## 📊 System Architecture

```
Real Market Data (USD) → Forex Conversion (ZMW) → AI Adjustments → Final Prices → Supabase → Real-time Display
```

## 🎯 Next Steps

1. **Add More Commodities** - Edit `utils/combinedPriceFeed.js`
2. **Customize AI Weight** - Change the 30% AI influence
3. **Add Trading Interface** - Buy/sell functionality
4. **Historical Data** - Price charts and trends
5. **Notifications** - Price alerts

## 🇿🇲 ZED HUSTLE Ready!

Your hybrid trading system combines the best of real market data with AI intelligence for realistic, dynamic commodity pricing in Zambia!

---

**Need Help?** Check the `HYBRID_PRICE_UPDATER_README.md` for detailed documentation.
