#!/usr/bin/env node

console.log('🔄 ZED HUSTLE - Setup New Repository');
console.log('=====================================\n');

console.log('✅ UPDATING LOCAL REPOSITORY...\n');

// This will be run after you create the new repository
const { execSync } = require('child_process');

try {
    console.log('1. Updating remote URL...');
    execSync('git remote set-url origin https://github.com/zedhustle30-ops/zedhustle-marketplace.git', { stdio: 'inherit' });
    
    console.log('2. Adding all files...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('3. Committing changes...');
    execSync('git commit -m "Initial commit - ZED HUSTLE Marketplace"', { stdio: 'inherit' });
    
    console.log('4. Pushing to new repository...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('\n✅ SUCCESS! Repository updated and pushed!\n');
    
    console.log('🚀 NEXT STEPS:');
    console.log('   1. Go to: https://vercel.com/new');
    console.log('   2. Import: zedhustle30-ops/zedhustle-marketplace');
    console.log('   3. Framework: Other');
    console.log('   4. Build Command: npm run build');
    console.log('   5. Output Directory: public');
    console.log('   6. Deploy!\n');
    
    console.log('🇿🇲 Your ZED HUSTLE platform will be live!');
    
} catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 MANUAL STEPS:');
    console.log('   1. git remote set-url origin https://github.com/zedhustle30-ops/zedhustle-marketplace.git');
    console.log('   2. git add .');
    console.log('   3. git commit -m "Initial commit"');
    console.log('   4. git push -u origin main');
}
