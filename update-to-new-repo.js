#!/usr/bin/env node

console.log('🔄 ZED HUSTLE - Update to New Repository');
console.log('=========================================\n');

console.log('✅ UPDATING LOCAL REPOSITORY TO NEW REPO...\n');

const { execSync } = require('child_process');

try {
    console.log('1. Updating remote URL to new repository...');
    execSync('git remote set-url origin https://github.com/zedhustle30-ops/zedhustle-marketplace.git', { stdio: 'inherit' });
    
    console.log('2. Verifying remote URL...');
    execSync('git remote -v', { stdio: 'inherit' });
    
    console.log('3. Adding all files...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('4. Committing changes...');
    execSync('git commit -m "Initial commit - ZED HUSTLE Marketplace"', { stdio: 'inherit' });
    
    console.log('5. Pushing to new repository...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('\n✅ SUCCESS! Repository updated and pushed to new repo!\n');
    
    console.log('🚀 NEXT STEPS FOR VERCEL DEPLOYMENT:');
    console.log('   1. Go to: https://vercel.com/new');
    console.log('   2. Import Git repository');
    console.log('   3. Select: zedhustle30-ops/zedhustle-marketplace');
    console.log('   4. Framework Preset: Other');
    console.log('   5. Root Directory: ./');
    console.log('   6. Build Command: npm run build');
    console.log('   7. Output Directory: public');
    console.log('   8. Install Command: npm install');
    console.log('   9. Click "Deploy"\n');
    
    console.log('🔧 AFTER DEPLOYMENT:');
    console.log('   1. Go to Project Settings → Environment Variables');
    console.log('   2. Add SUPABASE_URL: https://jpdndlnblbbtaxcrsyfm.supabase.co');
    console.log('   3. Add SUPABASE_ANON_KEY: (your key)');
    console.log('   4. Set both for Production\n');
    
    console.log('🇿🇲 Your ZED HUSTLE platform will be live!');
    
} catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 MANUAL STEPS:');
    console.log('   1. git remote set-url origin https://github.com/zedhustle30-ops/zedhustle-marketplace.git');
    console.log('   2. git add .');
    console.log('   3. git commit -m "Initial commit"');
    console.log('   4. git push -u origin main');
}
