# 🚀 ZED HUSTLE - Zambian Freelance Marketplace

A comprehensive freelance marketplace platform built for Zambia, featuring bidding systems, virtual trading, and AI-powered features.

## 🎯 **Features**

- **👥 User Registration & Authentication** (Supabase Auth)
- **💼 Job Posting & Bidding System**
- **📈 Virtual Commodity Trading**
- **⭐ Premium Subscription Tiers**
- **🎁 Referral System**
- **💰 Digital Wallet**
- **🧠 AI-Powered Job Recommendations**
- **🔒 Admin Panel**
- **📱 Mobile Responsive Design**
- **🏢 ZedInvest Micro-investments**
- **🏆 Leaderboard & Achievements**
- **💳 Flutterwave Payment Integration**
- **📍 Offline Job Posting**

## 🛠️ **Tech Stack**

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel
- **Storage:** Supabase Storage
- **Functions:** Vercel Serverless Functions
- **Database:** Supabase PostgreSQL

## ⚡ **Quick Start**

### **1. Set Up Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Update `public/supabase-config.js` with your credentials

### **2. Set Up Database**
1. Go to SQL Editor in Supabase
2. Run the SQL from `supabase-schema.sql`
3. This creates all tables and security policies

### **3. Set Up Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### **4. Deploy**
```bash
npm install
npm run deploy
```

## 📁 **Project Structure**

```
zed-hustle/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styles
│   ├── script.js          # Main JavaScript
│   └── supabase-config.js # Supabase configuration
├── api/                   # Vercel serverless functions
│   └── update-prices.js   # AI price updater
├── supabase-schema.sql    # Database schema
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 🚀 **Key Features**

### **👥 User Management**
- Email/password authentication with Supabase
- Profile management with portfolio uploads
- Referral system with automatic rewards
- Digital wallet with transaction history

### **💼 Job System**
- Post jobs with detailed descriptions
- Apply with bids and proposals
- Track application status
- Category-based filtering and search

### **📈 Trading System**
- Virtual commodity trading (Copper, Gold, Maize, Oil, Diamonds)
- AI-powered real-time price updates
- Trading history and analytics
- Profit/loss tracking with charts

### **🧠 AI Features**
- ZedAI assistant for job recommendations
- AI-powered proposal generation
- Visibility optimization suggestions
- Smart job matching algorithm

### **🏢 ZedInvest**
- Micro-investments in Zambian businesses
- Risk assessment and expected returns
- Investment portfolio tracking
- Business funding progress

### **🏆 Achievements**
- Leaderboard system
- Achievement badges
- Performance tracking
- Social recognition

### **🔒 Admin Panel**
- User management and moderation
- Job approval and management
- Payment processing
- Analytics dashboard
- Trading oversight

## 🔧 **Development**

### **Local Development**
```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Build for production
npm run build
```

### **Environment Variables**
Create a `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 **Database Schema**

The platform uses PostgreSQL with the following main tables:
- `users` - User profiles and authentication
- `jobs` - Job postings and details
- `job_applications` - Job applications and bids
- `trades` - Trading transactions
- `commodities` - Commodity prices and data
- `businesses` - ZedInvest business listings
- `investments` - User investments
- `messages` - User messaging system
- `notifications` - System notifications

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Environment Setup**
1. Add environment variables in Vercel dashboard
2. Configure custom domain (optional)
3. Set up automatic deployments from GitHub

## 🔐 **Security**

- **Row Level Security (RLS)** on all tables
- **Supabase Auth** for authentication
- **Environment variables** for sensitive data
- **CORS protection** and rate limiting
- **Input validation** and sanitization

## 📈 **Performance**

- **Global CDN** with Vercel
- **Database indexing** for fast queries
- **Caching** at multiple levels
- **Optimized images** and assets
- **Mobile-first** responsive design

## 🆘 **Support**

- **Documentation:** Check `MIGRATION_GUIDE.md`
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)

## 🎯 **Benefits Over Firebase**

- **✅ No usage limits** - Unlimited users and operations
- **✅ Better performance** - PostgreSQL vs Firestore
- **✅ More control** - Full database access
- **✅ Cost effective** - Free tier is more generous
- **✅ Real-time subscriptions** - Built-in PostgreSQL subscriptions
- **✅ Better debugging** - SQL queries and logs

## 📄 **License**

MIT License - see LICENSE file for details

---

## 🚀 **Ready to Scale!**

ZED HUSTLE is now built on a scalable, modern stack that can handle unlimited growth without Firebase limitations! 