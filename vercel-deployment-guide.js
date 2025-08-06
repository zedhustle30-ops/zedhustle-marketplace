#!/usr/bin/env node

console.log('🚀 ZED HUSTLE - Vercel Deployment Guide');
console.log('======================================\n');

console.log('✅ Step 1 (Supabase) - COMPLETED!');
console.log('   Database schema deployed successfully\n');

console.log('🌐 STEP 2: Deploy to Vercel');
console.log('==========================\n');

console.log('📋 Detailed Steps:\n');

console.log('1. Go to Vercel:');
console.log('   https://vercel.com');
console.log('');

console.log('2. Sign in with GitHub:');
console.log('   - Click "Continue with GitHub"');
console.log('   - Authorize Vercel to access your repositories');
console.log('');

console.log('3. Create New Project:');
console.log('   - Click "New Project" button');
console.log('   - You\'ll see your GitHub repositories');
console.log('   - Find and click on your ZED HUSTLE repository');
console.log('');

console.log('4. Configure Project Settings:');
console.log('   - Framework Preset: Select "Other"');
console.log('   - Root Directory: Leave as "./" (default)');
console.log('   - Build Command: Enter "npm run build"');
console.log('   - Output Directory: Enter "public"');
console.log('   - Install Command: Leave as "npm install" (default)');
console.log('');

console.log('5. Add Environment Variables:');
console.log('   - Click "Environment Variables" section');
console.log('   - Add the following variables:');
console.log('');
console.log('   Variable Name: SUPABASE_URL');
console.log('   Value: https://jpdndlnblbbtaxcrsyfm.supabase.co');
console.log('   Environment: Production (checked)');
console.log('');
console.log('   Variable Name: SUPABASE_ANON_KEY');
console.log('   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q');
console.log('   Environment: Production (checked)');
console.log('');

console.log('6. Deploy:');
console.log('   - Click "Deploy" button');
console.log('   - Wait for deployment to complete (2-3 minutes)');
console.log('   - You\'ll see a success message with your URL');
console.log('');

console.log('7. Get Your Vercel URL:');
console.log('   - Copy the URL (e.g., https://zed-hustle.vercel.app)');
console.log('   - Save this URL - you\'ll need it for the next step');
console.log('');

console.log('🔐 STEP 3: Configure Authentication (After Vercel Deployment)');
console.log('===========================================================\n');

console.log('1. Go back to Supabase:');
console.log('   https://supabase.com/dashboard/project/jpdndlnblbbtaxcrsyfm');
console.log('');

console.log('2. Go to Authentication → Settings:');
console.log('   - Click "Authentication" in the left sidebar');
console.log('   - Click "Settings" tab');
console.log('');

console.log('3. Update Site URL:');
console.log('   - Set "Site URL" to your Vercel URL');
console.log('   - Example: https://zed-hustle.vercel.app');
console.log('');

console.log('4. Add Redirect URLs:');
console.log('   - Add your Vercel URL: https://your-project.vercel.app');
console.log('   - Add callback URL: https://your-project.vercel.app/auth/callback');
console.log('   - Click "Save"');
console.log('');

console.log('🧪 STEP 4: Test Your Deployment');
console.log('==============================\n');

console.log('1. Visit your Vercel URL');
console.log('2. Test these features:');
console.log('   - User registration');
console.log('   - User login/logout');
console.log('   - Job browsing');
console.log('   - Job applications');
console.log('   - Trading system');
console.log('   - Admin panel (red lock button)');
console.log('');

console.log('✅ SUCCESS CHECKLIST');
console.log('===================\n');

const checklist = [
    'Vercel project created',
    'Repository imported',
    'Build settings configured',
    'Environment variables added',
    'Deployment successful',
    'Vercel URL obtained',
    'Supabase authentication configured',
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
console.log('   Share your Vercel URL with users and start earning!'); 