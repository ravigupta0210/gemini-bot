const path = require('path');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/generative-language.realtime'];

const getAccessToken = async () => {
  try {
    console.log('🔐 Trying to use service-account.json...');

    const auth = new GoogleAuth({
      keyFile: path.join(__dirname, '..', 'service-account.json'),
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    console.log('🔑 Client loaded');

    const accessToken = await client.getAccessToken();
    console.log('✅ Token retrieved');

    return accessToken.token;
  } catch (err) {
    console.error('❌ ERROR inside getAccessToken():', err);
    throw err;
  }
};

module.exports = { getAccessToken };
