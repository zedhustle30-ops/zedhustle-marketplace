#!/usr/bin/env node

console.log('📥 ZED HUSTLE - Third-Party Git Repository Import');
console.log('================================================\n');

console.log('✅ You selected "Import Third-Party Git Repository"');
console.log('   This is perfect for importing your ZED HUSTLE project!\n');

console.log('🎯 Step-by-Step Process:\n');

console.log('1. Repository URL:');
console.log('   - You\'ll need your GitHub repository URL');
console.log('   - It should look like: https://github.com/yourusername/zed-hustle');
console.log('   - Or: https://github.com/yourusername/ZED-HUSTLE');
console.log('   - Copy your exact repository URL from GitHub\n');

console.log('2. In Vercel Import Page:');
console.log('   - Paste your GitHub repository URL in the field');
console.log('   - Make sure the URL is correct and accessible');
console.log('   - Click "Continue" or "Import"\n');

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
console.log('   - Copy your Vercel URL\n');

console.log('🔧 If You Get Errors:\n');

console.log('Repository not found:');
console.log('- Check that your repository URL is correct');
console.log('- Make sure the repository is public or accessible');
console.log('- Verify the repository exists on GitHub\n');

console.log('Build fails:');
console.log('- Make sure you have package.json in your repository');
console.log('- Check that all files are committed and pushed');
console.log('- Verify the build command is "npm run build"\n');

console.log('✅ After Successful Import:');
console.log('1. Copy your Vercel URL');
console.log('2. Go back to Supabase to configure authentication');
console.log('3. Test all features on your live website\n');

console.log('🚀 Your ZED HUSTLE marketplace will be live! 🇿🇲'); 