# 🚀 ZED HUSTLE - Quick Setup for Existing Supabase Project

## ⚡ **Get Everything Running in 5 Minutes**

Since you already have a Supabase project called "zed hustle", here's how to set everything up:

### **Step 1: Set Up Database (2 minutes)**

1. **Go to your Supabase project:**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click on your "zed hustle" project

2. **Run the Database Schema:**
   - Go to **SQL Editor**
   - Copy ALL content from `supabase-schema.sql`
   - Paste and run the SQL
   - Wait for completion (creates 15+ tables)

### **Step 2: Get Your Credentials (1 minute)**

1. **Get API Keys:**
   - Go to **Settings** → **API**
   - Copy **Project URL** (e.g., `https://xyz.supabase.co`)
   - Copy **Anon public key** (starts with `eyJ...`)

### **Step 3: Update Configuration (1 minute)**

1. **Edit `public/supabase-config.js`:**
   ```javascript
   const supabaseConfig = {
       url: 'YOUR_SUPABASE_URL_HERE',
       anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'
   };
   ```

### **Step 4: Deploy to Vercel (1 minute)**

1. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Framework: **Other**
   - Build: `npm run build`
   - Output: `public`
   - Click "Deploy"

2. **Add Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Add: `SUPABASE_URL` = your_supabase_url
   - Add: `SUPABASE_ANON_KEY` = your_supabase_anon_key

### **Step 5: Configure Authentication**

1. **Update Supabase Settings:**
   - Go back to Supabase → **Authentication** → **Settings**
   - Set **Site URL** to your Vercel domain
   - Add **Redirect URLs**:
     ```
     https://your-vercel-url.vercel.app
     https://your-vercel-url.vercel.app/auth/callback
     ```

## 🎯 **What Gets Created:**

### **Database Tables:**
- ✅ `users` - User accounts and profiles
- ✅ `jobs` - Job postings
- ✅ `job_applications` - Bidding system
- ✅ `trades` - Commodity trading
- ✅ `commodities` - Price tracking
- ✅ `transactions` - Wallet system
- ✅ `messages` - Chat system
- ✅ `notifications` - User notifications
- ✅ `referrals` - Referral system
- ✅ `businesses` - ZedInvest businesses
- ✅ `investments` - Micro-investments
- ✅ `offline_jobs` - Offline job posting
- ✅ `user_portfolio` - User portfolios
- ✅ `user_achievements` - Achievements system
- ✅ `commodity_prices` - Price history

### **Security Features:**
- ✅ Row Level Security (RLS) policies
- ✅ User authentication
- ✅ Data protection
- ✅ Secure API access

### **Sample Data:**
- ✅ Sample jobs
- ✅ Sample commodities
- ✅ Sample businesses
- ✅ Test users

## 🚀 **Ready Features:**

- ✅ **User Registration & Login**
- ✅ **Job Posting & Bidding**
- ✅ **Virtual Trading System**
- ✅ **AI-Powered Price Updates**
- ✅ **Referral System**
- ✅ **Digital Wallet**
- ✅ **Chat System**
- ✅ **ZedInvest Platform**
- ✅ **Admin Panel**
- ✅ **Mobile Responsive**

## 💰 **Revenue Streams:**

- **K30** - User signup fee
- **K50/K100** - Premium subscriptions
- **K100** - Offline job posting
- **K25** - Referral commissions
- **K10** - Trading fees

## 🎉 **You're Ready!**

Your ZED HUSTLE marketplace will be live and ready to serve Zambia! 🇿🇲

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions. 