# 🚀 ZED HUSTLE - Supabase + Vercel Deployment Guide

## 📋 **Prerequisites**
- Supabase account (existing): `https://jpdndlnblbbtaxcrsyfm.supabase.co`
- New Vercel account for deployment
- GitHub account for code hosting

---

## 🗄️ **Step 1: Set Up Supabase Database**

### **1.1 Go to your Supabase project dashboard**
- URL: `https://supabase.com/dashboard/project/jpdndlnblbbtaxcrsyfm`

### **1.2 Run the database setup**
1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the entire content from `supabase-schema.sql`
3. **Click "Run"** to create all tables and policies

### **1.3 Verify database setup**
Check that these tables were created:
- ✅ `users` (user profiles and authentication)
- ✅ `jobs` (job listings)
- ✅ `commodities` (trading commodities)
- ✅ `businesses` (investment opportunities)
- ✅ `trades` (trading history)
- ✅ `investments` (user investments)
- ✅ `messages` (user messaging)
- ✅ `transactions` (payment history)

---

## 🔐 **Step 2: Configure Authentication**

### **2.1 Enable Email Authentication**
1. Go to **Authentication** → **Settings** in Supabase
2. Enable **Email** provider
3. **Disable email confirmations** for testing (optional)
4. Set **Site URL** to your future Vercel domain

### **2.2 Set up Row Level Security (RLS)**
The SQL schema already includes RLS policies, but verify:
- Users can only access their own data
- Jobs are publicly readable
- Admin users have elevated permissions

---

## 🌐 **Step 3: Set Up Vercel (New Account)**

### **3.1 Create new Vercel account**
1. Go to [vercel.com](https://vercel.com)
2. **Sign up** with a different email/GitHub account
3. **Connect to GitHub**

### **3.2 Push code to GitHub**
```bash
# Create new GitHub repository
git remote set-url origin https://github.com/YOUR_USERNAME/zedhustle-platform.git
git push -u origin main
```

### **3.3 Import to Vercel**
1. In Vercel dashboard: **"New Project"**
2. **Import** your GitHub repository
3. **Configure project settings**:
   - Framework: **Other**
   - Build Command: (leave empty)
   - Output Directory: `public`
   - Install Command: `npm install`

---

## ⚙️ **Step 4: Environment Variables**

### **4.1 In Vercel Dashboard**
Go to **Project Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL = https://jpdndlnblbbtaxcrsyfm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q
```

**Set for all environments**: Development, Preview, Production

---

## 🔧 **Step 5: Update Code for Supabase**

### **5.1 The code structure is ready**:
- ✅ `lib/supabaseClient.js` - Supabase configuration
- ✅ `supabase-schema.sql` - Database schema
- ✅ `vercel.json` - Vercel configuration
- ✅ ES modules support in HTML

### **5.2 Key features working with Supabase**:
- **Authentication**: Email/password login and registration
- **User Profiles**: Stored in Supabase `users` table
- **Job System**: Jobs stored in `jobs` table with applications
- **Trading**: Commodities and user tokens in database
- **Investments**: Business investments tracked
- **Admin Panel**: Admin users marked in database

---

## 🚀 **Step 6: Deploy to Vercel**

### **6.1 Automatic Deployment**
1. **Push changes** to GitHub
2. Vercel **automatically deploys**
3. **Check deployment logs** for any errors

### **6.2 Manual Deployment (Alternative)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to your new Vercel account
vercel login

# Deploy
vercel --prod
```

---

## 🧪 **Step 7: Test Your Deployment**

### **7.1 Test Core Features**
Visit your Vercel URL and test:
- ✅ **Homepage loads** with modern design
- ✅ **User registration** creates account in Supabase
- ✅ **User login** authenticates via Supabase
- ✅ **Job listings** load from database
- ✅ **Trading system** works with database
- ✅ **Admin access** (type "ZEDHUSTLE" or Ctrl+Shift+A)

### **7.2 Admin Test**
1. **Access admin panel** using hidden methods
2. **Login** with: `admin@zedhustle.zm` / `ZedHustle2024!`
3. **Verify** user management works
4. **Check** all admin tabs function

### **7.3 Database Verification**
In Supabase dashboard:
- **Check Table Editor** for new user records
- **Monitor** real-time activity
- **Verify** RLS policies are working

---

## 🎯 **Step 8: Post-Deployment Setup**

### **8.1 Custom Domain (Optional)**
1. In Vercel: **Settings** → **Domains**
2. **Add custom domain**
3. **Update Supabase Site URL** to match

### **8.2 Performance Optimization**
- **Enable** Vercel Analytics
- **Set up** custom error pages
- **Configure** caching headers

### **8.3 Monitoring**
- **Monitor** Supabase usage in dashboard
- **Check** Vercel function logs
- **Set up** error tracking

---

## 💰 **Revenue Configuration**

### **8.1 Payment Processing**
The platform includes:
- **Flutterwave integration** (simulation mode)
- **Mobile money** support (MTN, Airtel, Zamtel)
- **Wallet system** in Supabase

### **8.2 Admin Revenue Tracking**
- **User signups**: K30 fee (K25 profit + K5 referral)
- **Premium subscriptions**: K50/K100 monthly
- **Trading fees**: Built into system
- **Job posting fees**: K100 for offline jobs

---

## 🔒 **Security Notes**

### **8.1 Environment Security**
- ✅ **Never expose** service role keys in frontend
- ✅ **Use anon key** for public operations
- ✅ **RLS policies** protect user data
- ✅ **Admin functions** require authentication

### **8.2 Production Checklist**
- ✅ **Enable email confirmation** for production
- ✅ **Set up proper CORS** policies
- ✅ **Configure rate limiting**
- ✅ **Monitor suspicious activity**

---

## 🆘 **Troubleshooting**

### **Common Issues:**

**1. Module import errors:**
- Ensure `script.js` has `type="module"` in HTML
- Check Supabase client import path

**2. Authentication errors:**
- Verify environment variables in Vercel
- Check Supabase project URL and keys

**3. Database connection issues:**
- Confirm RLS policies are set up
- Check user permissions in Supabase

**4. Deployment failures:**
- Review Vercel build logs
- Ensure all dependencies are installed

---

## ✅ **Deployment Checklist**

Before going live:
- [ ] Supabase database schema created
- [ ] Authentication configured
- [ ] Vercel project set up with new account
- [ ] Environment variables configured
- [ ] Code pushed to GitHub
- [ ] Automatic deployment working
- [ ] All features tested on live site
- [ ] Admin panel accessible
- [ ] Database operations working
- [ ] Error handling functional

---

## 🎉 **You're Ready to Launch!**

Your ZED HUSTLE platform will be:
- ✅ **Fully hosted** on Vercel
- ✅ **Database powered** by Supabase
- ✅ **Scalable** and production-ready
- ✅ **Revenue generating** from day one

**Live URL**: `https://your-project-name.vercel.app`

**Admin Access**: Type "ZEDHUSTLE" or use Ctrl+Shift+A
**Admin Login**: `admin@zedhustle.zm` / `ZedHustle2024!`

---

*Ready to start earning with ZED HUSTLE! 🇿🇲💼*
