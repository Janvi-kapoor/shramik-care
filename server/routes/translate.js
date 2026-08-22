const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const router = express.Router();

function pcmToWav(
  pcmBase64,
  sampleRate = 24000,
  channels = 1,
  bitsPerSample = 16,
) {
  const pcm = Buffer.from(pcmBase64, "base64");
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

router.post("/speech", async (req, res) => {
  try {
    const { text, language = "en" } = req.body;
    if (!text || !["en", "hi", "bn", "ml"].includes(language))
      return res
        .status(400)
        .json({ error: "Text and supported language are required." });
    if (!process.env.GEMINI_API_KEY)
      return res
        .status(503)
        .json({ error: "AI speech is not configured on the server." });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Speak this medical communication in ${language}: ${text}`,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
        },
      },
    });
    const audioPart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.data,
    );
    if (!audioPart)
      return res
        .status(502)
        .json({ error: "AI speech provider returned no audio." });
    const wav = pcmToWav(audioPart.inlineData.data);
    res.type("audio/wav").send(wav);
  } catch (error) {
    console.error("Speech API Error:", error);
    res
      .status(502)
      .json({ error: error.message || "AI speech generation failed." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { text, targetLangCode } = req.body;

    if (!text || !targetLangCode) {
      return res
        .status(400)
        .json({ error: "Text and targetLangCode are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    // Map short codes to full language names for the prompt
    const langMap = {
      hi: "Hindi",
      bn: "Bengali",
      ml: "Malayalam",
      en: "English",
    };

    const targetLang = langMap[targetLangCode] || targetLangCode;

    // If source is already english and target is english, no translation needed
    if (targetLang === "English" && !text.match(/[^\x00-\x7F]/)) {
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
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
      },
    });

    const translatedText = response.text.trim();

    res.json({ success: true, translatedText });
  } catch (error) {
    console.error("Translation API Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to translate text." });
  }
});

module.exports = router;
