# 🚀 ZED HUSTLE Deployment Guide

Complete guide to deploy ZED HUSTLE on Supabase + Vercel using free plans.

## 📋 **Prerequisites**

- GitHub account
- Supabase account (free)
- Vercel account (free)
- Node.js installed locally

## 🔧 **Step 1: Set Up Supabase**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name:** `zed-hustle`
   - **Database Password:** Create a strong password
   - **Region:** Choose closest to Zambia (Europe West)
7. Click "Create new project"

### 1.2 Get Project Credentials
1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 1.3 Set Up Database
1. Go to **SQL Editor**
2. Copy the entire content from `supabase-schema.sql`
3. Paste and run the SQL
4. This creates all tables, policies, and sample data

### 1.4 Configure Authentication
1. Go to **Authentication** → **Settings**
2. Enable **Email confirmations** (optional)
3. Set **Site URL** to your Vercel domain (we'll get this later)

## 🌐 **Step 2: Set Up Vercel**

### 2.1 Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `public`

### 2.2 Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add the following:
   ```
   SUPABASE_URL = your_supabase_project_url
   SUPABASE_ANON_KEY = your_supabase_anon_key
   ```
3. Click "Save"

### 2.3 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your Vercel URL (e.g., `https://zed-hustle.vercel.app`)

## 🔄 **Step 3: Update Supabase Configuration**

### 3.1 Update Site URL
1. Go back to Supabase
2. **Authentication** → **Settings**
3. Update **Site URL** to your Vercel URL
4. Add **Redirect URLs**:
   ```
   https://your-vercel-url.vercel.app
   https://your-vercel-url.vercel.app/auth/callback
   ```

### 3.2 Update Frontend Config
1. In your local project, update `public/supabase-config.js`:
   ```javascript
   const supabaseConfig = {
       url: 'YOUR_SUPABASE_URL',
       anonKey: 'YOUR_SUPABASE_ANON_KEY'
   };
   ```
2. Commit and push to GitHub
3. Vercel will automatically redeploy

## 🧪 **Step 4: Test Deployment**

### 4.1 Test Authentication
1. Visit your Vercel URL
2. Try to sign up with a test email
3. Check if user is created in Supabase **Authentication** → **Users**

### 4.2 Test Database
1. Go to Supabase **Table Editor**
2. Check if data is being created in `users` table
3. Test job posting and applications

### 4.3 Test AI Price Updates
1. The AI price updater runs via Vercel serverless function
2. Check **Functions** in Vercel dashboard for logs

## 🔒 **Step 5: Security Setup**

### 5.1 Row Level Security
- Already configured in the SQL schema
- Users can only access their own data
- Public read access for jobs and commodities

### 5.2 Environment Variables
- Never commit sensitive keys to GitHub
- Use Vercel environment variables
- Keep Supabase keys secure

## 📊 **Step 6: Monitoring**

### 6.1 Supabase Dashboard
- Monitor database usage
- Check authentication logs
- View real-time subscriptions

### 6.2 Vercel Dashboard
- Monitor function invocations
- Check deployment status
- View performance metrics

## 🚀 **Step 7: Custom Domain (Optional)**

### 7.1 Add Custom Domain
1. Go to Vercel **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase redirect URLs

## 🔧 **Troubleshooting**

### Common Issues

**1. Authentication Errors**
- Check Supabase URL and key in Vercel environment variables
- Verify redirect URLs in Supabase settings
- Check browser console for errors

**2. Database Connection Errors**
- Verify RLS policies are working
- Check if tables exist in Supabase
- Test with Supabase client in browser console

**3. Function Errors**
- Check Vercel function logs
- Verify environment variables in function
- Test function locally with `vercel dev`

**4. CORS Errors**
- Add your Vercel domain to Supabase CORS settings
- Check if Supabase client is properly initialized

### Debug Commands

```bash
# Test Supabase connection locally
npm run dev

# Deploy to Vercel
vercel --prod

# Check Vercel logs
vercel logs

# Test function locally
vercel dev
```

## 📈 **Performance Optimization**

### 1. Database Indexing
- Indexes already created in schema
- Monitor query performance in Supabase

### 2. Caching
- Vercel provides automatic caching
- Use Supabase caching for frequently accessed data

### 3. CDN
- Vercel provides global CDN
- Static assets are automatically optimized

## 🔄 **Updates and Maintenance**

### 1. Database Changes
1. Update `supabase-schema.sql`
2. Run new SQL in Supabase SQL Editor
3. Test locally before deploying

### 2. Code Updates
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel auto-deploys

### 3. Environment Variables
1. Update in Vercel dashboard
2. Redeploy if needed
3. Test functionality

## 🎯 **Success Checklist**

- [ ] Supabase project created and configured
- [ ] Database schema deployed successfully
- [ ] Vercel project deployed
- [ ] Environment variables set
- [ ] Authentication working
- [ ] Database operations working
- [ ] AI price updater functioning
- [ ] Mobile responsiveness tested
- [ ] Admin panel accessible
- [ ] All features tested

## 🆘 **Support**

- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues:** Create issues in your repository

---

## 🚀 **Ready to Launch!**

Your ZED HUSTLE marketplace is now deployed and ready for users! The platform is scalable, secure, and optimized for the Zambian market. 