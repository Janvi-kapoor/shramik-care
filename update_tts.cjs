const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');
const startMatch = 'const speakText = async (text, slotId = null, forcedLang = null, skipTranslation = false) => {';
const startIndex = content.indexOf(startMatch);
const endIndex = content.indexOf('const stopSpeech = () => {');

const newSpeakText = `const speakText = async (text, slotId = null, forcedLang = null, skipTranslation = false) => {
    if (!text || text.trim() === '') return;
    
    setIsAudioSpeaking(true);
    setCurrentlyPlayingSlot(slotId || 'all');

    const langCodeMap = {
      hi: 'hi',
      bn: 'bn',
      ml: 'ml',
      or: 'or',
      en: 'en'
    };
    
    let baseLang = (forcedLang || currentLanguage).split('-')[0];
    const targetLangCode = langCodeMap[baseLang] || 'en';

    let textToSpeak = text;
    
    if (!skipTranslation && targetLangCode !== 'en') {
      const cleanText = text.trim();
      if (fallbackTranslations[cleanText] && fallbackTranslations[cleanText][targetLangCode+'-IN']) {
        textToSpeak = fallbackTranslations[cleanText][targetLangCode+'-IN'];
      } else {
        try {
          const res = await fetch('http://localhost:5000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, targetLangCode })
          });
          const data = await res.json();
          if (data.success && data.translatedText) {
            textToSpeak = data.translatedText;
          }
        } catch (err) {
          console.warn('Failed to translate text:', err);
        }
      }
    }

    try {
      // Chunking for translate_tts (max 200 chars per request)
      const words = textToSpeak.split(' ');
      let chunks = [];
      let currentChunk = '';
      for (const word of words) {
        if ((currentChunk + ' ' + word).length > 150) {
          chunks.push(currentChunk);
          currentChunk = word;
        } else {
          currentChunk = currentChunk ? currentChunk + ' ' + word : word;
        }
      }
      if (currentChunk) chunks.push(currentChunk);

      const playNext = (index) => {
        if (index >= chunks.length) {
          setIsAudioSpeaking(false);
          setCurrentlyPlayingSlot(null);
          return;
        }
        
        const url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(chunks[index]) + '&tl=' + targetLangCode + '&client=tw-ob';
        const audio = new Audio(url);
        
        // Expose global so we can stop it
        window.__currentAudio = audio;
        
        audio.onended = () => playNext(index + 1);
        audio.onerror = () => {
          console.warn('Failed to play chunk.');
          setIsAudioSpeaking(false);
          setCurrentlyPlayingSlot(null);
        };
        audio.play().catch(e => {
          console.warn('Audio play blocked:', e);
          setIsAudioSpeaking(false);
          setCurrentlyPlayingSlot(null);
        });
      };
      
      if (window.__currentAudio) {
        window.__currentAudio.pause();
      }
      playNext(0);
      
    } catch (e) {
      console.error(e);
      setIsAudioSpeaking(false);
      setCurrentlyPlayingSlot(null);
    }
  };

  `;

const newContent = content.substring(0, startIndex) + newSpeakText + content.substring(endIndex);
fs.writeFileSync('src/context/AppContext.jsx', newContent);
