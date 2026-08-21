const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, targetLangCode } = req.body;
    
    if (!text || !targetLangCode) {
      return res.status(400).json({ error: 'Text and targetLangCode are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // Map short codes to full language names for the prompt
    const langMap = {
      'hi': 'Hindi',
      'bn': 'Bengali',
      'ml': 'Malayalam',
      'en': 'English'
    };
    
    const targetLang = langMap[targetLangCode] || targetLangCode;

    // If source is already english and target is english, no translation needed
    if (targetLang === 'English' && !text.match(/[^\x00-\x7F]/)) {
       return res.json({ success: true, translatedText: text });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `You are a professional medical translator working in Kerala. 
Translate the following text accurately into ${targetLang}. 
Return ONLY the translated text, with no extra quotes, no markdown, and no explanations. 
If the target is Malayalam, use Malayalam script. If Bengali, use Bengali script. If Hindi, use Devanagari script.

Text to translate:
"${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.1
      }
    });

    const translatedText = response.text.trim();

    res.json({ success: true, translatedText });
  } catch (error) {
    console.error('Translation API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to translate text.' });
  }
});

module.exports = router;
