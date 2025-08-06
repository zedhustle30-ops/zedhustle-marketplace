#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ZED HUSTLE - Complete Setup Guide');
console.log('====================================\n');

console.log('🎯 This script will guide you through setting up ZED HUSTLE');
console.log('   on Supabase + Vercel using free plans.\n');

// Check all required files
console.log('📁 Checking project files...\n');

const requiredFiles = [
    'public/index.html',
    'public/styles.css', 
    'public/script.js',
    'public/supabase-config.js',
    'supabase-schema.sql',
    'vercel.json',
    'api/update-prices.js',
    'package.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

console.log('');

if (!allFilesExist) {
    console.log('❌ Some required files are missing. Please ensure all files are present.');
    process.exit(1);
}

console.log('✅ All required files are present!\n');

console.log('🔧 STEP 1: SUPABASE SETUP');
console.log('========================\n');

console.log('1. Go to https://supabase.com');
console.log('2. Sign in with GitHub');
console.log('3. Click "New Project"');
console.log('4. Enter project details:');
console.log('   - Name: zed-hustle');
console.log('   - Database Password: (create strong password)');
console.log('   - Region: Europe West (closest to Zambia)');
console.log('5. Click "Create new project"');
console.log('6. Wait for project to be ready (2-3 minutes)\n');

console.log('🔑 Get Project Credentials:');
console.log('1. Go to Settings → API');
console.log('2. Copy Project URL (e.g., https://xyz.supabase.co)');
console.log('3. Copy Anon Key (starts with eyJ...)');
console.log('4. Save these credentials - you\'ll need them for Vercel\n');

console.log('🗄️ Set Up Database:');
console.log('1. Go to SQL Editor in Supabase');
console.log('2. Copy the entire content from supabase-schema.sql');
console.log('3. Paste and run the SQL');
console.log('4. This creates all tables, policies, and sample data\n');

console.log('🔐 Configure Authentication:');
console.log('1. Go to Authentication → Settings');
console.log('2. Set Site URL to your Vercel domain (after deployment)');
console.log('3. Add redirect URLs for your Vercel domain\n');

console.log('🌐 STEP 2: VERCEL DEPLOYMENT');
console.log('===========================\n');

console.log('1. Go to https://vercel.com');
console.log('2. Sign in with GitHub');
console.log('3. Click "New Project"');
console.log('4. Import your GitHub repository');
console.log('5. Configure project settings:');
console.log('   - Framework Preset: Other');
console.log('   - Root Directory: ./');
console.log('   - Build Command: npm run build');
console.log('   - Output Directory: public');
console.log('6. Click "Deploy"\n');

console.log('🔧 Environment Variables Setup:');
console.log('1. Go to Project Settings → Environment Variables');
console.log('2. Add the following variables:');
console.log('   SUPABASE_URL = your_supabase_project_url');
console.log('   SUPABASE_ANON_KEY = your_supabase_anon_key');
console.log('3. Click "Save"\n');

console.log('🌐 Get Your Vercel URL:');
console.log('1. After deployment, copy your Vercel URL');
console.log('2. Update Supabase redirect URLs');
console.log('3. Update public/supabase-config.js with your Supabase credentials\n');

console.log('🧪 STEP 3: TESTING');
console.log('==================\n');

console.log('1. Visit your Vercel URL');
console.log('2. Test user registration');
console.log('3. Test login/logout');
console.log('4. Test job browsing and applications');
console.log('5. Test trading system');
console.log('6. Test admin panel (red lock button)\n');

console.log('🎯 STEP 4: FINAL CONFIGURATION');
console.log('=============================\n');

console.log('1. Update public/supabase-config.js with your actual Supabase credentials');
console.log('2. Commit and push changes to GitHub');
console.log('3. Vercel will automatically redeploy');
console.log('4. Test all features again\n');

console.log('✅ SUCCESS CHECKLIST');
console.log('===================\n');

const checklist = [
    'Supabase project created and configured',
    'Database schema deployed successfully', 
    'Vercel project deployed',
    'Environment variables set',
    'Authentication working',
    'Database operations working',
    'AI price updater functioning',
    'Mobile responsiveness tested',
    'Admin panel accessible',
    'All features tested'
];

checklist.forEach((item, index) => {
    console.log(`[ ] ${index + 1}. ${item}`);
});

console.log('\n🚀 ZED HUSTLE is ready to serve Zambia! 🇿🇲\n');

console.log('📞 Support:');
console.log('- Supabase Docs: https://supabase.com/docs');
console.log('- Vercel Docs: https://vercel.com/docs');
console.log('- GitHub Issues: Create issues in your repository\n');

console.log('💰 Revenue Streams:');
console.log('- Signup fees: K30 per user');
console.log('- Premium subscriptions: K50/K100');
console.log('- Offline job posting: K100 per post');
console.log('- Referral commissions: K25 per referral');
console.log('- Trading fees: K10 per transaction\n');

console.log('🎉 Congratulations! Your freelance marketplace is live!'); 