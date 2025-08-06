#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ZED HUSTLE - Database Setup');
console.log('==============================\n');

console.log('✅ Supabase credentials configured!');
console.log('   URL: https://jpdndlnblbbtaxcrsyfm.supabase.co');
console.log('   Project: zed hustle\n');

console.log('🗄️ STEP 1: Set Up Database Schema');
console.log('================================\n');

console.log('1. Go to your Supabase project:');
console.log('   https://supabase.com/dashboard/project/jpdndlnblbbtaxcrsyfm');
console.log('');

console.log('2. Go to SQL Editor (left sidebar)');
console.log('');

console.log('3. Copy and paste the following SQL schema:');
console.log('');

// Read and display the schema
const schemaPath = path.join(__dirname, 'supabase-schema.sql');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 SQL SCHEMA TO COPY:');
    console.log('='.repeat(60));
    console.log(schema);
    console.log('='.repeat(60));
    
    console.log('\n✅ Copy the above SQL and paste it in Supabase SQL Editor');
    console.log('⏱️ Click "Run" and wait for completion (30 seconds)');
    console.log('📊 This will create 15+ tables with sample data\n');
    
} else {
    console.log('❌ Error: supabase-schema.sql not found');
}

console.log('🔧 STEP 2: Verify Database Setup');
console.log('===============================\n');

console.log('After running the SQL, check these tables exist:');
console.log('- users');
console.log('- jobs');
console.log('- job_applications');
console.log('- trades');
console.log('- commodities');
console.log('- transactions');
console.log('- messages');
console.log('- notifications');
console.log('- referrals');
console.log('- businesses');
console.log('- investments');
console.log('- offline_jobs');
console.log('- user_portfolio');
console.log('- user_achievements');
console.log('- commodity_prices\n');

console.log('🌐 STEP 3: Deploy to Vercel');
console.log('==========================\n');

console.log('1. Go to https://vercel.com');
console.log('2. Sign in with GitHub');
console.log('3. Click "New Project"');
console.log('4. Import your repository');
console.log('5. Configure:');
console.log('   - Framework: Other');
console.log('   - Build: npm run build');
console.log('   - Output: public');
console.log('6. Add environment variables:');
console.log('   SUPABASE_URL = https://jpdndlnblbbtaxcrsyfm.supabase.co');
console.log('   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q');
console.log('7. Click "Deploy"\n');

console.log('🔐 STEP 4: Configure Authentication');
console.log('==================================\n');

console.log('1. Go back to Supabase → Authentication → Settings');
console.log('2. Set Site URL to your Vercel domain');
console.log('3. Add redirect URLs:');
console.log('   https://your-vercel-url.vercel.app');
console.log('   https://your-vercel-url.vercel.app/auth/callback\n');

console.log('🎉 STEP 5: Test Everything');
console.log('=========================\n');

console.log('1. Visit your Vercel URL');
console.log('2. Test user registration');
console.log('3. Test login/logout');
console.log('4. Test job browsing and applications');
console.log('5. Test trading system');
console.log('6. Test admin panel (red lock button)\n');

console.log('✅ SUCCESS CHECKLIST');
console.log('===================\n');

const checklist = [
    'Database schema deployed',
    'All tables created successfully',
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