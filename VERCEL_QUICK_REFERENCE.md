# 🚀 Vercel Deployment - Quick Reference

## ✅ **Step 1: Go to Vercel**
- Visit: https://vercel.com
- Click "Continue with GitHub"

## ✅ **Step 2: Create New Project**
- Click "New Project"
- Find your ZED HUSTLE repository
- Click on it

## ✅ **Step 3: Configure Settings**
- **Framework Preset:** Other
- **Root Directory:** ./ (default)
- **Build Command:** `npm run build`
- **Output Directory:** `public`
- **Install Command:** `npm install` (default)

## ✅ **Step 4: Add Environment Variables**
Click "Environment Variables" and add:

### Variable 1:
- **Name:** `SUPABASE_URL`
- **Value:** `https://jpdndlnblbbtaxcrsyfm.supabase.co`
- **Environment:** Production ✅

### Variable 2:
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q`
- **Environment:** Production ✅

## ✅ **Step 5: Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Copy your Vercel URL

## ✅ **Step 6: Configure Supabase Auth**
- Go back to Supabase: https://supabase.com/dashboard/project/jpdndlnblbbtaxcrsyfm
- Authentication → Settings
- Set Site URL to your Vercel URL
- Add redirect URLs:
  - `https://your-project.vercel.app`
  - `https://your-project.vercel.app/auth/callback`

## 🎉 **Done!**
Your ZED HUSTLE marketplace is live! 🇿🇲 