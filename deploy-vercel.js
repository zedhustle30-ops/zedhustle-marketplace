#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ZED HUSTLE - Vercel Deployment Helper');
console.log('========================================\n');

console.log('📋 Vercel Deployment Steps:');
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

console.log('✅ Vercel Deployment Complete!\n');

// Check if vercel.json exists
const vercelPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelPath)) {
    console.log('📄 Vercel Configuration: vercel.json');
    console.log('   - Static site configuration');
    console.log('   - Environment variables setup');
    console.log('   - API routes configuration\n');
} else {
    console.log('❌ Error: vercel.json not found');
}

// Check if API function exists
const apiPath = path.join(__dirname, 'api', 'update-prices.js');
if (fs.existsSync(apiPath)) {
    console.log('🤖 AI Price Updater: api/update-prices.js');
    console.log('   - Serverless function for commodity price updates');
    console.log('   - Runs automatically via Vercel Functions\n');
} else {
    console.log('❌ Error: api/update-prices.js not found');
}

console.log('🎯 Final Steps:');
console.log('1. Test your deployed application');
console.log('2. Verify authentication works');
console.log('3. Check database operations');
console.log('4. Test all features\n');

console.log('🚀 ZED HUSTLE is ready to serve Zambia! 🇿🇲'); 