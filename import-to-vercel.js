#!/usr/bin/env node

console.log('📥 ZED HUSTLE - Import to Vercel Guide');
console.log('======================================\n');

console.log('🎯 Step-by-Step Import Process:\n');

console.log('1. Go to Vercel Dashboard:');
console.log('   https://vercel.com/dashboard');
console.log('   (You should be logged in with Google)\n');

console.log('2. Click "New Project" button\n');

console.log('3. Import Your Repository:');
console.log('   - Look for your ZED HUSTLE repository in the list');
console.log('   - If you see it, click on it');
console.log('   - If you don\'t see it, click "Import Git Repository"');
console.log('   - Search for your repository name');
console.log('   - Click on it when it appears\n');

console.log('4. Configure Project Settings:');
console.log('   - Framework Preset: Select "Other"');
console.log('   - Root Directory: Leave as "./" (default)');
console.log('   - Build Command: Enter "npm run build"');
console.log('   - Output Directory: Enter "public"');
console.log('   - Install Command: Leave as "npm install" (default)\n');

console.log('5. Add Environment Variables:');
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

console.log('6. Deploy:');
console.log('   - Click "Deploy" button');
console.log('   - Wait 2-3 minutes');
console.log('   - Copy your Vercel URL\n');

console.log('🔧 Troubleshooting:\n');

console.log('If you can\'t find your repository:');
console.log('- Make sure Vercel is connected to GitHub');
console.log('- Check that your repository is public or accessible');
console.log('- Try searching for different name variations');
console.log('- Make sure all files are pushed to GitHub\n');

console.log('If import fails:');
console.log('- Check that you have package.json in your repository');
console.log('- Verify all files are committed and pushed');
console.log('- Try refreshing the Vercel dashboard\n');

console.log('✅ After Successful Import:');
console.log('1. Copy your Vercel URL');
console.log('2. Go back to Supabase to configure authentication');
console.log('3. Test all features on your live website\n');

console.log('🚀 Your ZED HUSTLE marketplace will be live! 🇿🇲'); 