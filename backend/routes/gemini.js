const express = require('express');
const router = express.Router();
const { askGeminiWithApiKey } = require('../services/geminiAPIKeyService');

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

router.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body;
    const reply = await askGeminiWithApiKey(prompt);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
