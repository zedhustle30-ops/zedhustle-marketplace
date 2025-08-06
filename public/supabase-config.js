// Supabase configuration for ZED HUSTLE
const supabaseConfig = {
    url: 'https://jpdndlnblbbtaxcrsyfm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZG5kbG5ibGJidGF4Y3JzeWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMzNDEsImV4cCI6MjA3MDAwOTM0MX0.jJKRrinjTqoI5azn1YYRXyVYSKfLYJ1M-G-Vl-CAL-Q'
};

// Initialize Supabase client
const supabase = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Export for use in other scripts
window.supabaseClient = supabase; 