const express = require('express');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const router = express.Router();

// Setup Multer to store uploaded image in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan-prescription', upload.single('image'), async (req, res) => {
  console.log("OCR Request received! file:", req.file, "body:", req.body);
  try {
    if (!req.file) {
      console.log("No file found in request!");
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // Initialize the official Gemini SDK
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Format the image for the Gemini API
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const prompt = `
      You are an expert medical OCR system. Examine this clinical prescription or medical document.
      Extract the medications prescribed, including their names, generic names, strengths, dosages, frequencies, and duration.
      IMPORTANT SAFETY RULE: DO NOT independently diagnose the patient. Only extract the diagnosis if explicitly written by the doctor on the prescription. 
      If the doctor just wrote symptoms (like cold, fever), put them in reportedSymptoms, NOT diagnosis.
      Do not invent medicine names. If handwriting is very unclear, provide your best guess but mark confidence as low.
      
      Return the output strictly in the following JSON structure without markdown formatting (\`\`\`json):
      {
        "patientName": "Exact Patient Name written on prescription, else null",
        "doctorName": "Doctor Name if present, else null",
        "prescriptionDate": "Date if present, else null",
        "diagnosis": "Diagnosis ONLY if explicitly written as a diagnosis, else null",
        "reportedSymptoms": "Any symptoms explicitly written (e.g. cold, fever, cough), else null",
        "medicines": [
          {
            "name": "Exact Medicine Name",
            "genericName": "Normalized Generic Name if confident, else null",
            "strength": "Strength (e.g. 500mg)",
            "dosage": "Dosage (e.g. 1 tablet)",
            "frequency": "Frequency (e.g. 1-0-1 or twice daily)",
            "duration": "Duration (e.g. 5 days)",
            "route": "Route (e.g. oral)",
            "instructions": "Specific instructions (e.g. after food)",
            "confidence": "high, medium, or low"
          }
        ],
        "doctorInstructions": "Any other clinical notes or instructions",
        "overallConfidence": "high, medium, or low"
      }
      Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON object.
    `;

    // Call the Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [prompt, imagePart],
      config: {
        temperature: 0.1, // Keep it deterministic for OCR
      }
    });

    let rawOutput = response.text;
    
    // Clean up potential markdown formatting if the model disobeys
    rawOutput = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsedData;
    try {
      parsedData = JSON.parse(rawOutput);
    } catch (e) {
      console.error('Failed to parse AI output:', rawOutput);
      return res.status(500).json({ error: 'Failed to extract usable clinical data.' });
    }

    if (!parsedData || !parsedData.medicines) {
      return res.status(500).json({ error: 'No prescription data could be read.' });
    }

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('OCR API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process image.' });
  }
});

module.exports = router;
