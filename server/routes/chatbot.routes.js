const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// POST /api/chatbot/ask
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ message: 'Question is required.' });

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const prompt = `
You are a helpful DSA (Data Structures and Algorithms) tutor chatbot.
- Always explain concepts in simple, easy-to-understand language.
- Use step-by-step explanations and examples when possible.
- If the user asks a coding question, provide a clear and concise answer.
- If the user asks for code, use well-formatted code blocks.
- Keep your answers friendly and supportive.

User question: ${question}
    `;

    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: { key: geminiApiKey }
      }
    );
    console.log('Gemini API response:', JSON.stringify(response.data, null, 2));
    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate an answer.';
    res.json({ answer });
  } catch (error) {
    if (error.response) {
      console.error('Gemini API error:', error.response.data);
      res.status(500).json({ message: 'Error from Gemini API', error: error.response.data });
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Error getting answer from Gemini API', error: error.message });
    }
  }
});

module.exports = router; 