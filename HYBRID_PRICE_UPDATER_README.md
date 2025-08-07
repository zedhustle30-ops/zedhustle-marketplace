# ZED HUSTLE — Hybrid Price Updater (AI + Market)

## 🎯 Overview

This system combines real market commodity prices with AI-generated adjustments to create realistic, dynamic pricing for ZED HUSTLE's trading platform. It fetches baseline prices from commodity APIs, converts them to ZMW, applies AI adjustments, and stores the results in Supabase.

## 🏗️ Architecture

```
Real Market Data (USD) → Forex Conversion (ZMW) → AI Adjustments → Final Prices → Supabase
```

### Components:
1. **Market Data Fetcher** - Gets real commodity prices in USD
2. **Forex Converter** - Converts USD to ZMW using exchange rates
3. **AI Adjuster** - OpenAI generates realistic price adjustments
4. **Price Merger** - Combines baseline + AI adjustments
5. **Database Storage** - Stores final prices in Supabase
6. **Real-time Display** - Shows live prices with updates

## 🚀 Setup Instructions

### 1. Environment Variables

Create `.env.local` with these variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jpdndlnblbbtaxcrsyfm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=sk-xxxxxx

# Commodities API Configuration
COMMODITIES_API_KEY=your_commodities_api_key

# Optional: EXCHANGE_RATE_API_KEY if your forex provider needs it
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
```

### 2. Database Setup

Run this SQL in your Supabase SQL editor:

```sql
create table if not exists resources (
  name text primary key,
  price numeric,
  baseline_price numeric,
  delta_percent numeric,
  note text,
  updated_at timestamptz
);
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## 📊 How It Works

### 1. Baseline Price Fetching
- Fetches real commodity prices from APIs (e.g., commodities-api.com)
- Converts USD prices to ZMW using forex rates
- Handles different units (kg, ton, ounce conversions)

### 2. AI Price Adjustments
- Sends baseline prices to OpenAI GPT-4o-mini
- AI generates realistic ±3% adjustments
- Includes confidence scores and market notes
- Fallback to random adjustments if AI fails

### 3. Price Merging
- Combines baseline (70%) + AI adjustments (30%)
- Calculates final prices and percentage changes
- Stores results with timestamps

### 4. Real-time Updates
- Supabase realtime subscriptions
- Live price updates on trading page
- Automatic refresh when prices change

## 🔧 Configuration

### Commodities List
Edit `utils/combinedPriceFeed.js` to add/remove commodities:

```javascript
const COMMODITIES = [
  { name: "Copper", apiSymbol: "COPPER", unit: "kg" },
  { name: "Maize", apiSymbol: "CORN", unit: "kg" },
  { name: "Gold", apiSymbol: "GOLD", unit: "kg" },
  { name: "Diamonds", apiSymbol: "DIAMOND", unit: "carat" }
];
```

### AI Weight Adjustment
Change the AI influence in `pages/api/update-prices.js`:

```javascript
const finalPrices = mergePrices(baselines, aiList, 0.3); // 30% AI weight
```

## 📡 API Endpoints

### Update Prices
```bash
POST /api/update-prices
```
Triggers the full price update process.

### Trading Page
```bash
GET /trade
```
Displays live commodity prices with real-time updates.

## 🔄 Automation

### Manual Updates
```bash
curl -X POST http://localhost:3000/api/update-prices
```

### Scheduled Updates
Set up a cron job or Vercel cron to run every hour:

```bash
# Vercel cron (vercel.json)
{
  "crons": [{
    "path": "/api/update-prices",
    "schedule": "0 * * * *"
  }]
}
```

## 🛠️ Customization

### Different Commodity APIs
Replace the `fetchCommodityUSD` function in `utils/combinedPriceFeed.js`:

```javascript
async function fetchCommodityUSD(apiSymbol) {
  // Your custom API implementation
  const response = await fetch(`your-api-endpoint/${apiSymbol}`);
  const data = await response.json();
  return data.price;
}
```

### Different Forex Providers
Modify `fetchUSDtoZMWRate` function:

```javascript
async function fetchUSDtoZMWRate() {
  // Your preferred forex API
  const response = await fetch('your-forex-api');
  const data = await response.json();
  return data.rates.ZMW;
}
```

## 🔍 Monitoring

### Logs
Check console logs for:
- Commodity fetch errors
- OpenAI API failures
- Supabase upsert errors

### Database Queries
Monitor the `resources` table:
```sql
SELECT * FROM resources ORDER BY updated_at DESC;
```

## 🚨 Troubleshooting

### Common Issues

1. **Commodity API Errors**
   - Check API key validity
   - Verify API endpoint URLs
   - Check rate limits

2. **OpenAI Failures**
   - Verify API key
   - Check token limits
   - Monitor API quotas

3. **Supabase Connection Issues**
   - Verify environment variables
   - Check service role key permissions
   - Ensure table exists

### Fallback Behavior
- If commodity API fails: Skip that commodity
- If OpenAI fails: Use random adjustments
- If Supabase fails: Log error, continue with others

## 📈 Performance

### Optimization Tips
- Cache forex rates (update every 15 minutes)
- Batch Supabase operations
- Use connection pooling
- Implement retry logic for failed requests

### Cost Management
- Monitor OpenAI API usage
- Track commodity API calls
- Optimize update frequency

## 🔐 Security

### Environment Variables
- Never commit API keys to git
- Use Vercel environment variables in production
- Rotate keys regularly

### API Security
- Validate all inputs
- Implement rate limiting
- Use HTTPS in production

## 🎯 Next Steps

1. **Add More Commodities** - Expand the commodities list
2. **Historical Data** - Store price history for charts
3. **Trading Interface** - Add buy/sell functionality
4. **Notifications** - Alert users of significant price changes
5. **Analytics** - Track trading patterns and performance

---

**🇿🇲 Built for ZED HUSTLE - Empowering Zambian Freelancers and Traders**
