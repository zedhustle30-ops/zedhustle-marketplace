#!/usr/bin/env node

console.log('🚀 ZED HUSTLE - Hybrid Trading System Setup');
console.log('===========================================\n');

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://jpdndlnblbbtaxcrsyfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupHybridTrading() {
    try {
        console.log('1. Creating resources table...');
        
        // Create the resources table
        const { error: createError } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS resources (
                    name text PRIMARY KEY,
                    price numeric,
                    baseline_price numeric,
                    delta_percent numeric,
                    note text,
                    updated_at timestamptz DEFAULT NOW()
                );
            `
        });

        if (createError) {
            console.log('⚠️  Table creation error (might already exist):', createError.message);
        } else {
            console.log('✅ Resources table created successfully!');
        }

        console.log('\n2. Inserting sample commodity data...');
        
        // Insert sample data
        const sampleCommodities = [
            {
                name: 'Copper',
                price: 125.50,
                baseline_price: 120.00,
                delta_percent: 4.58,
                note: 'Strong demand from construction sector'
            },
            {
                name: 'Maize',
                price: 8.75,
                baseline_price: 8.50,
                delta_percent: 2.94,
                note: 'Good harvest season expected'
            },
            {
                name: 'Gold',
                price: 1850.25,
                baseline_price: 1820.00,
                delta_percent: 1.66,
                note: 'Safe haven demand remains strong'
            },
            {
                name: 'Diamonds',
                price: 95.80,
                baseline_price: 92.00,
                delta_percent: 4.13,
                note: 'Luxury market recovery'
            }
        ];

        for (const commodity of sampleCommodities) {
            const { error: insertError } = await supabase
                .from('resources')
                .upsert(commodity, { onConflict: 'name' });

            if (insertError) {
                console.log(`⚠️  Error inserting ${commodity.name}:`, insertError.message);
            } else {
                console.log(`✅ ${commodity.name} data inserted`);
            }
        }

        console.log('\n3. Setting up realtime subscriptions...');
        
        // Enable realtime for the resources table
        const { error: realtimeError } = await supabase.rpc('exec_sql', {
            sql: `
                ALTER PUBLICATION supabase_realtime ADD TABLE resources;
            `
        });

        if (realtimeError) {
            console.log('⚠️  Realtime setup error (might already be enabled):', realtimeError.message);
        } else {
            console.log('✅ Realtime subscriptions enabled!');
        }

        console.log('\n🎉 HYBRID TRADING SYSTEM SETUP COMPLETE!\n');

        console.log('📊 Next Steps:');
        console.log('   1. Add environment variables to .env.local:');
        console.log('      - OPENAI_API_KEY=your_openai_key');
        console.log('      - COMMODITIES_API_KEY=your_commodities_api_key');
        console.log('      - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
        console.log('   2. Run: npm run dev');
        console.log('   3. Visit: http://localhost:3000/trade');
        console.log('   4. Test price updates: POST /api/update-prices\n');

        console.log('🔧 Manual Price Update Test:');
        console.log('   curl -X POST http://localhost:3000/api/update-prices\n');

        console.log('🇿🇲 Your ZED HUSTLE hybrid trading system is ready!');

    } catch (error) {
        console.error('❌ Setup error:', error.message);
        console.log('\n🔧 Manual Setup Required:');
        console.log('   1. Go to Supabase Dashboard → SQL Editor');
        console.log('   2. Run this SQL:');
        console.log(`
            CREATE TABLE IF NOT EXISTS resources (
                name text PRIMARY KEY,
                price numeric,
                baseline_price numeric,
                delta_percent numeric,
                note text,
                updated_at timestamptz DEFAULT NOW()
            );
        `);
        console.log('   3. Enable realtime for the resources table');
    }
}

setupHybridTrading();
