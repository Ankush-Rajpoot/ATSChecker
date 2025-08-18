// Simple test to check environment variables
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET ✅' : 'NOT SET ❌');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET ✅' : 'NOT SET ❌');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET ✅' : 'NOT SET ❌');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET ✅' : 'NOT SET ❌');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('\n✅ Google OAuth should work properly');
} else {
  console.log('\n❌ Google OAuth configuration incomplete');
}
