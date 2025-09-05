#!/usr/bin/env node

// Quick script to test Supabase connection
// Run with: node scripts/test-supabase-connection.js

require('dotenv').config({ path: '.env.development' });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('\n❌ Missing Supabase configuration!');
  console.log('\nPlease set in .env.development:');
  console.log('EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...');
  process.exit(1);
}

// Test the connection
fetch(`${SUPABASE_URL}/rest/v1/`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  }
})
.then(response => {
  if (response.ok) {
    console.log('\n✅ Supabase connection successful!');
    console.log('Status:', response.status);
    console.log('\nNext steps:');
    console.log('1. Run database migrations');
    console.log('2. Start development with: pnpm start');
  } else {
    console.error('\n❌ Connection failed!');
    console.log('Status:', response.status);
    console.log('\nCheck your credentials in the Supabase dashboard:');
    console.log('Settings → API → Copy the correct URL and anon key');
  }
})
.catch(error => {
  console.error('\n❌ Connection error:', error.message);
  console.log('\nMake sure:');
  console.log('1. Your Supabase project exists');
  console.log('2. The URL is correct (no typos)');
  console.log('3. You have internet connection');
});