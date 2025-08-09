#!/usr/bin/env node

/**
 * ZED HUSTLE - GitHub + Vercel Setup Helper
 * Run this script to prepare for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 ZED HUSTLE - GitHub + Vercel Setup Helper');
console.log('📋 Supabase Project: ZED HUSTLE (jpdndlnblbbtaxcrsyfm)\n');

// Check if we're in the right directory
if (!fs.existsSync('public/index.html')) {
    console.error('❌ Error: Please run this script from the ZED HUSTLE project root directory.');
    process.exit(1);
}

console.log('✅ Project structure verified');

// Create .gitignore if it doesn't exist
const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Vercel
.vercel

# Local development
.env.example
`;

if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', gitignoreContent);
    console.log('✅ Created .gitignore file');
} else {
    console.log('✅ .gitignore already exists');
}

// Check package.json
if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Update scripts for Vercel deployment
    packageJson.scripts = {
        ...packageJson.scripts,
        "build": "echo 'No build step needed - static files ready'",
        "start": "http-server public -p 3000",
        "dev": "http-server public -p 3000 -o",
        "vercel-build": "echo 'Build complete - static files in public/'"
    };
    
    // Ensure we have the right dependencies
    if (!packageJson.dependencies) {
        packageJson.dependencies = {};
    }
    
    packageJson.dependencies['@supabase/supabase-js'] = '^2.39.0';
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json for Vercel deployment');
}

// Verify Vercel configuration
if (fs.existsSync('vercel.json')) {
    console.log('✅ vercel.json configuration ready');
} else {
    console.log('❌ vercel.json missing - please check deployment files');
}

// Verify Supabase files
if (fs.existsSync('lib/supabaseClient.js')) {
    console.log('✅ Supabase client configuration ready');
} else {
    console.log('❌ Supabase client missing');
}

if (fs.existsSync('supabase-schema.sql')) {
    console.log('✅ Database schema ready');
} else {
    console.log('❌ Database schema missing');
}

console.log('\n🎯 Next Steps:');
console.log('1. Create a new GitHub repository');
console.log('2. Push your code: git add . && git commit -m "Initial commit" && git push');
console.log('3. Connect to Vercel with your new account');
console.log('4. Set up environment variables in Vercel');
console.log('5. Deploy!');

console.log('\n📚 Full instructions in: SUPABASE_VERCEL_DEPLOYMENT.md');
console.log('\n🚀 Ready for deployment!');
