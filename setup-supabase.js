#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ZED HUSTLE - Supabase Setup Helper');
console.log('=====================================\n');

console.log('📋 Manual Steps Required:');
console.log('1. Go to https://supabase.com');
console.log('2. Sign in with GitHub');
console.log('3. Click "New Project"');
console.log('4. Enter project details:');
console.log('   - Name: zed-hustle');
console.log('   - Database Password: (create strong password)');
console.log('   - Region: Europe West (closest to Zambia)');
console.log('5. Click "Create new project"');
console.log('6. Wait for project to be ready\n');

console.log('🔑 Get Project Credentials:');
console.log('1. Go to Settings → API');
console.log('2. Copy Project URL and Anon Key');
console.log('3. Update public/supabase-config.js with your credentials\n');

console.log('🗄️ Set Up Database:');
console.log('1. Go to SQL Editor');
console.log('2. Copy content from supabase-schema.sql');
console.log('3. Paste and run the SQL');
console.log('4. This creates all tables and sample data\n');

console.log('🔐 Configure Authentication:');
console.log('1. Go to Authentication → Settings');
console.log('2. Set Site URL to your Vercel domain (after deployment)');
console.log('3. Add redirect URLs for your Vercel domain\n');

console.log('✅ Supabase Setup Complete!\n');

// Read the schema file
const schemaPath = path.join(__dirname, 'supabase-schema.sql');
if (fs.existsSync(schemaPath)) {
    console.log('📄 Database Schema File: supabase-schema.sql');
    console.log('   - Contains all table definitions');
    console.log('   - Includes Row Level Security policies');
    console.log('   - Has sample data for testing\n');
} else {
    console.log('❌ Error: supabase-schema.sql not found');
}

console.log('🌐 Next: Deploy to Vercel');
console.log('   Run: npm run deploy'); 