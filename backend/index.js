// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // ✅ 1. Import cors

const app = express();
const PORT = process.env.PORT || 5050;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors()); // ✅ 2. Enable CORS for all origins
app.use(express.json());

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ success: true, reply });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Gemini API failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Fast Gemini bot running at http://localhost:${PORT}`);
});
