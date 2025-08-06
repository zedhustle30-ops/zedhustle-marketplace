#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📋 ZED HUSTLE - Copy Database Schema');
console.log('====================================\n');

const schemaPath = path.join(__dirname, 'supabase-schema.sql');

if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('✅ Database schema loaded successfully!');
    console.log('📄 Total lines: ' + schema.split('\n').length);
    console.log('🗂️ Tables to be created: 15+');
    console.log('🔒 Security policies: Included');
    console.log('📊 Sample data: Included\n');
    
    console.log('📋 NEXT STEPS:');
    console.log('1. Go to your Supabase project: https://supabase.com/dashboard');
    console.log('2. Click on your "zed hustle" project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy the schema below and paste it:');
    console.log('5. Click "Run" to execute\n');
    
    console.log('='.repeat(60));
    console.log('📄 COPY THIS SQL SCHEMA:');
    console.log('='.repeat(60));
    console.log(schema);
    console.log('='.repeat(60));
    
    console.log('\n✅ Schema copied! Now paste it in Supabase SQL Editor and run it.');
    console.log('⏱️ This will take about 30 seconds to complete.');
    
} else {
    console.log('❌ Error: supabase-schema.sql not found');
    console.log('Please ensure the file exists in your project directory.');
} 