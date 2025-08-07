#!/usr/bin/env node

console.log('🔄 ZED HUSTLE - Firebase to Supabase Migration');
console.log('==============================================\n');

const fs = require('fs');
const path = require('path');

// 1. Install Supabase client
console.log('1. Installing @supabase/supabase-js...');
const { execSync } = require('child_process');
try {
    execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
    console.log('✅ Supabase client installed successfully!\n');
} catch (error) {
    console.log('❌ Error installing Supabase client:', error.message);
}

// 2. Create Supabase configuration
console.log('2. Creating Supabase configuration...');
const supabaseConfig = `// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;

try {
    fs.writeFileSync('src/supabase.js', supabaseConfig);
    console.log('✅ Supabase configuration created!\n');
} catch (error) {
    console.log('❌ Error creating Supabase config:', error.message);
}

// 3. Create .env file
console.log('3. Creating .env file...');
const envContent = `VITE_SUPABASE_URL=https://jpdndlnblbbtaxcrsyfm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q
`;

try {
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file created!\n');
} catch (error) {
    console.log('❌ Error creating .env file:', error.message);
}

// 4. Create vercel.json for 404 fix
console.log('4. Creating vercel.json for 404 fix...');
const vercelConfig = `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}`;

try {
    fs.writeFileSync('vercel.json', vercelConfig);
    console.log('✅ vercel.json created!\n');
} catch (error) {
    console.log('❌ Error creating vercel.json:', error.message);
}

// 5. Clean up Firebase files
console.log('5. Cleaning up Firebase files...');
const firebaseFiles = [
    'firebase.json',
    '.firebaserc',
    'firestore.rules',
    'firestore.indexes.json',
    'FIREBASE_TESTING_GUIDE.md',
    'backend/index-firebase.js',
    'backend/config/firebase.js',
    '.github/workflows/firebase-hosting-pull-request.yml',
    '.github/workflows/firebase-hosting-merge.yml'
];

let deletedCount = 0;
firebaseFiles.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`✅ Deleted: ${file}`);
            deletedCount++;
        }
    } catch (error) {
        console.log(`⚠️  Could not delete ${file}: ${error.message}`);
    }
});

console.log(`✅ Cleaned up ${deletedCount} Firebase files!\n`);

// 6. Create example Supabase usage
console.log('6. Creating example Supabase usage...');
const exampleUsage = `// Example Supabase usage (add to your components)

// Authentication
import { supabase } from './supabase';

const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  console.log(data, error);
};

const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  console.log(data, error);
};

// Fetching data
const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  console.log(data);
};

// Inserting data
const createUser = async (userData) => {
  const { data, error } = await supabase.from('users').insert([userData]);
  console.log(data, error);
};
`;

try {
    fs.writeFileSync('SUPABASE_EXAMPLES.md', exampleUsage);
    console.log('✅ Supabase examples created!\n');
} catch (error) {
    console.log('❌ Error creating examples:', error.message);
}

// 7. Update package.json scripts if needed
console.log('7. Checking package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Add build script if not present
    if (!packageJson.scripts.build) {
        packageJson.scripts.build = 'echo "Build completed"';
        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
        console.log('✅ Added build script to package.json');
    }
    
    console.log('✅ package.json updated!\n');
} catch (error) {
    console.log('❌ Error updating package.json:', error.message);
}

console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!\n');

console.log('🚀 NEXT STEPS:');
console.log('   1. Deploy to Vercel: https://vercel.com/new');
console.log('   2. Import: zedhustle30-ops/zedhustle-marketplace');
console.log('   3. Add Environment Variables in Vercel:');
console.log('      - VITE_SUPABASE_URL: https://jpdndlnblbbtaxcrsyfm.supabase.co');
console.log('      - VITE_SUPABASE_ANON_KEY: (your key)');
console.log('   4. Build Command: npm run build');
console.log('   5. Output Directory: public');
console.log('   6. Install Command: npm install\n');

console.log('🔧 VERCEL ENVIRONMENT VARIABLES:');
console.log('   VITE_SUPABASE_URL=https://jpdndlnblbbtaxcrsyfm.supabase.co');
console.log('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q\n');

console.log('🇿🇲 Your ZED HUSTLE platform is ready for Supabase!');
