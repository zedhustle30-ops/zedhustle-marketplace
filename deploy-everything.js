#!/usr/bin/env node

console.log('🚀 ZED HUSTLE - Complete Deployment Guide');
console.log('========================================\n');

console.log('✅ Step 1: Supabase Database - COMPLETED!');
console.log('   Your database is ready with all tables and data\n');

console.log('🌐 STEP 2: Deploy to Vercel (Google Account)');
console.log('===========================================\n');

console.log('📋 Since you signed up with Google, follow these steps:\n');

console.log('1. Go to Vercel Dashboard:');
console.log('   https://vercel.com/dashboard');
console.log('   (You should be logged in with your Google account)\n');

console.log('2. Create New Project:');
console.log('   - Click "New Project" button');
console.log('   - You\'ll see a list of repositories');
console.log('   - If you don\'t see your ZED HUSTLE repository:');
console.log('     * Click "Import Git Repository"');
console.log('     * Search for your ZED HUSTLE repository');
console.log('     * Select it\n');

console.log('3. Configure Project Settings:');
console.log('   - Framework Preset: Select "Other"');
console.log('   - Root Directory: Leave as "./" (default)');
console.log('   - Build Command: Enter "npm run build"');
console.log('   - Output Directory: Enter "public"');
console.log('   - Install Command: Leave as "npm install" (default)\n');

console.log('4. Add Environment Variables:');
console.log('   - Click "Environment Variables" section');
console.log('   - Add these two variables:\n');

console.log('   Variable 1:');
console.log('   - Name: SUPABASE_URL');
console.log('   - Value: https://jpdndlnblbbtaxcrsyfm.supabase.co');
console.log('   - Environment: Production ✅\n');

console.log('   Variable 2:');
console.log('   - Name: SUPABASE_ANON_KEY');
console.log('   - Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q');
console.log('   - Environment: Production ✅\n');

console.log('5. Deploy:');
console.log('   - Click "Deploy" button');
console.log('   - Wait 2-3 minutes for deployment');
console.log('   - You\'ll see a success message with your URL');
console.log('   - Copy your Vercel URL (e.g., https://zed-hustle.vercel.app)\n');

console.log('🔐 STEP 3: Configure Authentication');
console.log('==================================\n');

console.log('1. Go back to Supabase:');
console.log('   https://supabase.com/dashboard/project/jpdndlnblbbtaxcrsyfm\n');

console.log('2. Configure Authentication:');
console.log('   - Click "Authentication" in left sidebar');
console.log('   - Click "Settings" tab');
console.log('   - Set "Site URL" to your Vercel URL');
console.log('   - Add "Redirect URLs":');
console.log('     https://your-project.vercel.app');
console.log('     https://your-project.vercel.app/auth/callback');
console.log('   - Click "Save"\n');

console.log('🧪 STEP 4: Test Everything');
console.log('=========================\n');

console.log('1. Visit your Vercel URL');
console.log('2. Test these features:');
console.log('   - User registration');
console.log('   - User login/logout');
console.log('   - Job browsing');
console.log('   - Job applications');
console.log('   - Trading system');
console.log('   - Admin panel (red lock button)\n');

console.log('✅ SUCCESS CHECKLIST');
console.log('===================\n');

const checklist = [
    'Vercel project created with Google account',
    'Repository imported successfully',
    'Build settings configured correctly',
    'Environment variables added',
    'Deployment completed successfully',
    'Vercel URL obtained',
    'Supabase authentication configured',
    'All features tested and working'
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
console.log('   Share your Vercel URL with users and start earning!\n');

console.log('🔧 Troubleshooting Tips:');
console.log('- If you don\'t see your repository, make sure it\'s pushed to GitHub');
console.log('- If deployment fails, check environment variables are set correctly');
console.log('- If authentication doesn\'t work, verify redirect URLs in Supabase'); 