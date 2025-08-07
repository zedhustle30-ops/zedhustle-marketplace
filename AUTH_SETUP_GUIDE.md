# 🔐 ZED HUSTLE - Authentication Setup Guide

## 🚨 **URGENT: Fix the "29 seconds" Signup Error**

The error you're seeing is a Supabase rate limiting protection. Here's how to fix it:

### **Step 1: Create the Users Table**

Go to your **Supabase Dashboard** → **SQL Editor** and run this SQL:

```sql
-- Create users table for ZED HUSTLE authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    has_paid_signup_fee BOOLEAN DEFAULT FALSE,
    bids INTEGER DEFAULT 0,
    wallet DECIMAL(10,2) DEFAULT 0.00,
    referral_earnings DECIMAL(10,2) DEFAULT 0.00,
    referral_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index for referral codes
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### **Step 2: Configure Authentication Settings**

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Under **Email Auth**, make sure:
   - ✅ **Enable email confirmations** is **OFF** (for now)
   - ✅ **Enable email change confirmations** is **OFF**
   - ✅ **Enable secure email change** is **OFF**

### **Step 3: Test the Fix**

1. **Wait 30 seconds** (to clear the rate limit)
2. Try creating a new account
3. The signup should now work without the "29 seconds" error

## 🔧 **What Was Fixed**

### **Before (Broken):**
- ❌ Using old local storage authentication
- ❌ No proper Supabase integration
- ❌ Rate limiting errors
- ❌ No user database table

### **After (Fixed):**
- ✅ **Supabase Authentication** integration
- ✅ **Proper user database** with profiles
- ✅ **Rate limiting protection** with better error messages
- ✅ **Real-time authentication** state management
- ✅ **Secure user data** with Row Level Security

## 🎯 **New Features**

### **Enhanced Signup Process:**
- ✅ **Loading states** during signup
- ✅ **Password strength validation** (minimum 6 characters)
- ✅ **Better error messages** for rate limiting
- ✅ **Automatic user profile creation**

### **Improved Login Process:**
- ✅ **Secure authentication** via Supabase
- ✅ **User profile loading** from database
- ✅ **Session management** with automatic logout

### **Better User Experience:**
- ✅ **Real-time authentication** status
- ✅ **Proper error handling** for all auth operations
- ✅ **Loading indicators** during operations

## 🚀 **How to Test**

### **1. Create New Account:**
1. Click "Sign Up" button
2. Fill in all required fields
3. Click "Create Account"
4. Should see "Account created successfully!" message
5. Payment modal should appear

### **2. Login with Existing Account:**
1. Click "Sign In" button
2. Enter email and password
3. Click "Sign In"
4. Should see "Login successful!" message

### **3. Logout:**
1. Click user menu (if logged in)
2. Click "Logout"
3. Should see "Logged out successfully!" message

## 🔍 **Troubleshooting**

### **If you still get rate limiting errors:**
1. **Wait 30 seconds** before trying again
2. **Clear browser cache** and cookies
3. **Try in incognito mode**
4. **Check Supabase dashboard** for any errors

### **If signup fails:**
1. Check **browser console** for errors
2. Verify **Supabase connection** is working
3. Ensure **users table** was created successfully
4. Check **authentication settings** in Supabase

### **If login fails:**
1. Verify **email and password** are correct
2. Check if **account exists** in Supabase Auth
3. Ensure **user profile** exists in database

## 📊 **Database Schema**

The new `users` table includes:
- **id**: Unique user identifier (UUID)
- **email**: User's email address (unique)
- **full_name**: User's full name
- **phone**: Phone number
- **has_paid_signup_fee**: Payment status
- **bids**: Available bids for job applications
- **wallet**: User's wallet balance
- **referral_earnings**: Earnings from referrals
- **referral_code**: Unique referral code
- **created_at**: Account creation timestamp
- **updated_at**: Last update timestamp

## 🇿🇲 **Ready for ZED HUSTLE!**

Your authentication system is now:
- ✅ **Secure** with Supabase Auth
- ✅ **Scalable** with proper database design
- ✅ **User-friendly** with better error handling
- ✅ **Rate-limited** to prevent abuse
- ✅ **Production-ready** for your marketplace

**The "29 seconds" error should now be resolved!** 🎉
