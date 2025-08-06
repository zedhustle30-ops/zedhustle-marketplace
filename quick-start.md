# 🚀 ZED HUSTLE - Quick Start Guide

## ⚡ **Get Everything Running in 10 Minutes**

### **Step 1: Supabase Setup (5 minutes)**

1. **Create Project:**
   - Go to [supabase.com](https://supabase.com)
   - Sign in with GitHub
   - Click "New Project"
   - Name: `zed-hustle`
   - Password: (create strong password)
   - Region: Europe West
   - Click "Create"

2. **Get Credentials:**
   - Go to Settings → API
   - Copy Project URL
   - Copy Anon Key

3. **Set Up Database:**
   - Go to SQL Editor
   - Copy ALL content from `supabase-schema.sql`
   - Paste and run
   - Wait for completion

### **Step 2: Vercel Deployment (3 minutes)**

1. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Framework: Other
   - Build: `npm run build`
   - Output: `public`
   - Click "Deploy"

2. **Add Environment Variables:**
   - Go to Settings → Environment Variables
   - Add: `SUPABASE_URL` = your_supabase_url
   - Add: `SUPABASE_ANON_KEY` = your_supabase_key
   - Save

### **Step 3: Connect Everything (2 minutes)**

1. **Update Config:**
   - Edit `public/supabase-config.js`
   - Replace with your actual Supabase credentials
   - Commit and push to GitHub

2. **Test:**
   - Visit your Vercel URL
   - Test registration/login
   - Test all features

## 🎯 **What You Get:**

✅ **Complete Freelance Marketplace**
✅ **User Authentication**
✅ **Job Posting & Bidding**
✅ **Virtual Trading System**
✅ **AI-Powered Features**
✅ **Mobile Responsive**
✅ **Admin Panel**
✅ **ZedInvest Platform**
✅ **Referral System**
✅ **Payment Integration**

## 💰 **Revenue Streams:**

- **K30** - User signup fee
- **K50/K100** - Premium subscriptions
- **K100** - Offline job posting
- **K25** - Referral commissions
- **K10** - Trading fees

## 🚀 **Ready to Scale!**

Your ZED HUSTLE marketplace is now live and ready to serve Zambia! 🇿🇲

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions. 