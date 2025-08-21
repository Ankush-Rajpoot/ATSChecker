const https = require('https');

// Keep the server alive by pinging it every 14 minutes
// Render free tier sleeps after 15 minutes of inactivity
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
const SERVER_URL = process.env.RENDER_EXTERNAL_URL || 'https://atschecker.onrender.com';

const pingServer = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Keep-alive disabled in development');
    return;
  }

  const url = `${SERVER_URL}/health`;
  
  https.get(url, (res) => {
    console.log(`Keep-alive ping: ${res.statusCode} at ${new Date().toISOString()}`);
  }).on('error', (err) => {
    console.error('Keep-alive ping failed:', err.message);
  });
};

const startKeepAlive = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Starting keep-alive service...');
    // Ping immediately
    setTimeout(pingServer, 30000); // Wait 30 seconds after startup
    // Then ping every 14 minutes
    setInterval(pingServer, PING_INTERVAL);
  }
};

module.exports = { startKeepAlive, pingServer };
