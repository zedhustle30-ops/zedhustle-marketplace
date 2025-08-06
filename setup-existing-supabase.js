#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ZED HUSTLE - Existing Supabase Setup');
console.log('======================================\n');

console.log('✅ You already have a Supabase project called "zed hustle"');
console.log('   Let\'s configure everything for you!\n');

console.log('🔑 STEP 1: Get Your Supabase Credentials');
console.log('=======================================\n');

console.log('1. Go to your Supabase project: https://supabase.com/dashboard');
console.log('2. Click on your "zed hustle" project');
console.log('3. Go to Settings → API');
console.log('4. Copy the following:');
console.log('   - Project URL (e.g., https://xyz.supabase.co)');
console.log('   - Anon public key (starts with eyJ...)\n');

console.log('🗄️ STEP 2: Set Up Database Schema');
console.log('================================\n');

console.log('1. In your Supabase project, go to SQL Editor');
console.log('2. Copy the entire content from supabase-schema.sql');
console.log('3. Paste and run the SQL');
console.log('4. This will create all tables, policies, and sample data\n');

console.log('🔧 STEP 3: Update Configuration');
console.log('==============================\n');

console.log('1. Update public/supabase-config.js with your credentials:');
console.log('   const supabaseConfig = {');
console.log('       url: "YOUR_SUPABASE_URL",');
console.log('       anonKey: "YOUR_SUPABASE_ANON_KEY"');
console.log('   };\n');

console.log('🌐 STEP 4: Deploy to Vercel');
console.log('==========================\n');

console.log('1. Go to https://vercel.com');
console.log('2. Sign in with GitHub');
console.log('3. Click "New Project"');
console.log('4. Import your repository');
console.log('5. Configure settings:');
console.log('   - Framework: Other');
console.log('   - Build: npm run build');
console.log('   - Output: public');
console.log('6. Add environment variables:');
console.log('   SUPABASE_URL = your_supabase_url');
console.log('   SUPABASE_ANON_KEY = your_supabase_anon_key');
console.log('7. Click "Deploy"\n');

console.log('🔐 STEP 5: Configure Authentication');
console.log('==================================\n');

console.log('1. Go back to Supabase → Authentication → Settings');
console.log('2. Set Site URL to your Vercel domain');
console.log('3. Add redirect URLs:');
console.log('   https://your-vercel-url.vercel.app');
console.log('   https://your-vercel-url.vercel.app/auth/callback\n');

console.log('🧪 STEP 6: Test Everything');
console.log('=========================\n');

console.log('1. Visit your Vercel URL');
console.log('2. Test user registration');
console.log('3. Test login/logout');
console.log('4. Test job browsing and applications');
console.log('5. Test trading system');
console.log('6. Test admin panel (red lock button)\n');

// Check if schema file exists
const schemaPath = path.join(__dirname, 'supabase-schema.sql');
if (fs.existsSync(schemaPath)) {
    console.log('📄 Database Schema Ready: supabase-schema.sql');
    console.log('   - Contains all table definitions');
    console.log('   - Includes Row Level Security policies');
    console.log('   - Has sample data for testing\n');
} else {
    console.log('❌ Error: supabase-schema.sql not found');
}

// Check if config file exists
const configPath = path.join(__dirname, 'public', 'supabase-config.js');
if (fs.existsSync(configPath)) {
    console.log('⚙️ Configuration File: public/supabase-config.js');
    console.log('   - Ready for your Supabase credentials\n');
} else {
    console.log('❌ Error: public/supabase-config.js not found');
}

console.log('✅ SUCCESS CHECKLIST');
console.log('===================\n');

const checklist = [
    'Supabase credentials obtained',
    'Database schema deployed',
    'Configuration updated',
    'Vercel project deployed',
    'Environment variables set',
    'Authentication configured',
    'All features tested'
];

checklist.forEach((item, index) => {
    console.log(`[ ] ${index + 1}. ${item}`);
});

console.log('\n🚀 ZED HUSTLE will be live and ready to serve Zambia! 🇿🇲\n');

console.log('💰 Revenue Streams Ready:');
console.log('- K30 - User signup fee');
console.log('- K50/K100 - Premium subscriptions');
console.log('- K100 - Offline job posting');
console.log('- K25 - Referral commissions');
console.log('- K10 - Trading fees\n');

console.log('🎉 Your freelance marketplace is ready to launch!'); 