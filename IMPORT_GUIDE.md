# 📥 How to Import ZED HUSTLE to Vercel

## 🎯 **Step-by-Step Import Process**

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/dashboard
2. You should be logged in with your Google account

### **Step 2: Create New Project**
1. Click the **"New Project"** button
2. You'll see a page with repository options

### **Step 3: Import Your Repository**

#### **Option A: If you see your repository listed**
- Look for "ZED HUSTLE" or your repository name
- Click on it to select it
- Skip to Step 4

#### **Option B: If you don't see your repository**
1. Click **"Import Git Repository"** button
2. You'll see a search box
3. Type your repository name (e.g., "ZED HUSTLE")
4. Click on your repository when it appears
5. If prompted, authorize Vercel to access your repositories

### **Step 4: Configure Project Settings**
After selecting your repository, configure these settings:

- **Framework Preset:** Select **"Other"**
- **Root Directory:** Leave as `./` (default)
- **Build Command:** Enter `npm run build`
- **Output Directory:** Enter `public`
- **Install Command:** Leave as `npm install` (default)

### **Step 5: Add Environment Variables**
1. Click **"Environment Variables"** section
2. Add these two variables:

**Variable 1:**
- **Name:** `SUPABASE_URL`
- **Value:** `https://jpdndlnblbbtaxcrsyfm.supabase.co`
- **Environment:** Production ✅

**Variable 2:**
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q`
- **Environment:** Production ✅

### **Step 6: Deploy**
1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. You'll see a success message with your URL
4. Copy your Vercel URL (e.g., https://zed-hustle.vercel.app)

## 🔧 **Troubleshooting Import Issues**

### **If you can't find your repository:**
1. **Check GitHub connection:**
   - Make sure Vercel is connected to your GitHub account
   - Go to Vercel Settings → Git
   - Connect GitHub if not already connected

2. **Repository visibility:**
   - Make sure your ZED HUSTLE repository is public or Vercel has access
   - If private, you may need to grant Vercel access

3. **Repository name:**
   - Try searching for different variations of your repository name
   - Look for the exact name as it appears on GitHub

### **If import fails:**
1. **Check repository structure:**
   - Make sure you have these files in your repository:
     - `package.json`
     - `public/index.html`
     - `public/script.js`
     - `public/styles.css`

2. **Verify GitHub push:**
   - Make sure all your files are pushed to GitHub
   - Check that the repository exists on GitHub

## 🎉 **After Successful Import**

Once imported and deployed:
1. Copy your Vercel URL
2. Go back to Supabase to configure authentication
3. Test all features on your live website

## 📞 **Need More Help?**

If you're still having trouble:
1. Check that your repository is on GitHub
2. Make sure all files are committed and pushed
3. Try refreshing the Vercel dashboard
4. Contact Vercel support if needed

Your ZED HUSTLE marketplace will be live once imported! 🇿🇲 