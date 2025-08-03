const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Final working URL for AI Studio API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

const askGeminiWithApiKey = async (promptText) => {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: promptText }],
          role: 'user',
        },
      ],
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response from Gemini.';
  } catch (error) {
    console.error('❌ Error from Gemini API:', error.response?.data || error.message);
    throw new Error('Gemini API error');
  }
};

module.exports = { askGeminiWithApiKey };
