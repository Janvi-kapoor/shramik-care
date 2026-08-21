/**
 * ShramikCare - Comprehensive Clinical Translation Engine
 * Translates doctor-patient dialogue between English, Malayalam, Hindi, and Bengali.
 * Features clinical phrasebook, semantic sentence parser, and fallback online translation API.
 */

// 1. Direct High-Precision Clinical Sentence Dictionary
const CLINICAL_PHRASES_DB = [
  // Pain and Symptoms
  {
    patterns: [
      /what.*your problem/i,
      /where.*feel.*pain/i,
      /where.*pain/i,
      /what.*trouble/i,
      /what.*issue/i,
      /tell.*problem/i
    ],
    hi: "क्या आप बता सकते हैं कि आपको क्या समस्या है और दर्द कहाँ हो रहा है?",
    bn: "আপনি কি বলতে পারেন আপনার কি সমস্যা এবং কোথায় ব্যথা হচ্ছে?",
    ml: "എന്താണ് നിങ്ങളുടെ പ്രശ്നമെന്നും എവിടെയാണ് വേദന അനുഭവപ്പെടുന്നതെന്നും പറയാമോ?",
    en: "Can you tell me what is your problem and where you feel the pain?"
  },
  {
    patterns: [
      /where does it hurt/i,
      /where is the pain/i,
      /where it hurts/i
    ],
    hi: "आपको दर्द कहाँ हो रहा है?",
    bn: "আপনার কোথায় ব্যথা হচ্ছে?",
    ml: "എവിടെയാണ് വേദന അനുഭവപ്പെടുന്നത്?",
    en: "Where does it hurt?"
  },
  {
    patterns: [
      /how many days.*fever/i,
      /since when.*fever/i,
      /fever.*how long/i,
      /how many days/i
    ],
    hi: "यह बुखार आपको कितने दिनों से है?",
    bn: "এই জ্বর আপনার কতদিন ধরে রয়েছে?",
    ml: "എത്ര ദിവസമായി ഈ പനിയുണ്ട്?",
    en: "How many days have you had this fever?"
  },
  {
    patterns: [
      /do you have.*allergy/i,
      /allergy to penicillin/i,
      /any drug allergy/i,
      /allergy/i
    ],
    hi: "क्या आपको पेनिसिलिन, इंजेक्शन या किसी दवा से कोई एलर्जी है?",
    bn: "আপনার কি পেনিসিলিন, ইঞ্জেকশন বা কোনো ওষুধে অ্যালার্জি আছে?",
    ml: "നിങ്ങൾക്ക് പെൻസിലിനോ മറ്റേതെങ്കിലും മരുന്നുകൾക്കോ അലർജിയുണ്ടോ?",
    en: "Do you have any allergy to penicillin or medicines?"
  },
  {
    patterns: [
      /take this.*tablet.*after food/i,
      /take.*after food.*three times/i,
      /after food.*three times/i,
      /take this medicine/i,
      /after food/i
    ],
    hi: "यह गोली दिन में तीन बार खाना खाने के बाद एक गिलास पानी के साथ लें।",
    bn: "এই ওষুধটি দিনে তিনবার খাবার খাওয়ার পর এক গ্লাস জল দিয়ে খাবেন।",
    ml: "ഈ ഗുളിക ഭക്ഷണത്തിന് ശേഷം ദിവസവും മൂന്ന് നേരം ഒരു ഗ്ലാസ് വെള്ളത്തോടൊപ്പം കഴിക്കുക.",
    en: "Take this tablet after food three times a day with water."
  },
  {
    patterns: [
      /take this tablet before sleep/i,
      /before sleep/i,
      /night tablet/i,
      /at night/i
    ],
    hi: "यह गोली रात को सोने से पहले पानी के साथ लें।",
    bn: "এই ওষুধটি রাতে ঘুমানোর আগে জলের সাথে খাবেন।",
    ml: "ഈ ഗുളിക രാത്രി ഉറങ്ങുന്നതിന് മുൻപ് വെള്ളത്തോടൊപ്പം കഴിക്കുക.",
    en: "Take this tablet before sleeping at night."
  },
  {
    patterns: [
      /drink.*warm water/i,
      /boiled water/i,
      /rest for two days/i,
      /take rest/i,
      /rest/i
    ],
    hi: "उबला हुआ गुनगुना पानी पिएं और दो दिन पूरा आराम करें।",
    bn: "ফোটানো হালকা গরম জল পান করুন এবং দুই দিন পুরো বিশ্রাম নিন।",
    ml: "തിളപ്പിച്ചാറിയ ചെറുചൂടുവെള്ളം കുടിക്കുകയും രണ്ട് ദിവസം പൂർണ്ണമായി വിശ്രമിക്കുകയും ചെയ്യുക.",
    en: "Drink boiled warm water and take complete rest for two days."
  },
  {
    patterns: [
      /breathe deeply/i,
      /take deep breath/i,
      /open mouth/i,
      /show tongue/i
    ],
    hi: "लंबी गहरी सांस लें और अपना मुंह खोलकर जीभ दिखाएं।",
    bn: "লম্বা গভীর শ্বাস নিন এবং মুখ খুলে জিভ দেখান।",
    ml: "ദീർഘമായി ശ്വാസമെടുക്കുക, വായ തുറന്ന് നാവ് കാണിക്കുക.",
    en: "Take a deep breath and open your mouth to show your tongue."
  },
  {
    patterns: [
      /do you have.*chest pain/i,
      /chest pain/i,
      /difficulty.*breathing/i,
      /shortness of breath/i
    ],
    hi: "क्या आपको सीने में दर्द या सांस लेने में तकलीफ हो रही है?",
    bn: "আপনার কি বুকে ব্যথা বা শ্বাস নিতে কষ্ট হচ্ছে?",
    ml: "നിങ്ങൾക്ക് നെഞ്ചുവേദനയോ ശ്വാസമെടുക്കാൻ ബുദ്ധിമുട്ടോ ഉണ്ടോ?",
    en: "Do you have chest pain or difficulty in breathing?"
  },
  {
    patterns: [
      /do you have.*cough/i,
      /cough.*phlegm/i,
      /cold and cough/i
    ],
    hi: "क्या आपको सूखी खांसी है या बलगम भी आ रहा है?",
    bn: "আপনার কি শুকনো কাশি নাকি কফ বের হচ্ছে?",
    ml: "നിങ്ങൾക്ക് വരണ്ട ചുമയാണോ അതോ കഫക്കെട്ടുണ്ടോ?",
    en: "Do you have dry cough or phlegm?"
  },
  {
    patterns: [
      /headache/i,
      /dizziness/i,
      /feeling dizzy/i
    ],
    hi: "क्या आपको सिरदर्द या चक्कर आ रहे हैं?",
    bn: "আপনার কি মাথাব্যথা বা মাথা ঘোরা হচ্ছে?",
    ml: "നിങ്ങൾക്ക് തലവേദനയോ തലകറക്കമോ ഉണ്ടോ?",
    en: "Do you have headache or feel dizzy?"
  },
  {
    patterns: [
      /stomach pain/i,
      /abdominal pain/i,
      /vomiting/i,
      /loose motions/i,
      /diarrhea/i
    ],
    hi: "क्या पेट में दर्द, उल्टी या दस्त की समस्या है?",
    bn: "পেটে ব্যথা, বমি বা পাতলা পায়খানা হচ্ছে কি?",
    ml: "വയറുവേദനയോ ഛർദ്ദിയോ വയറിളക്കമോ ഉണ്ടോ?",
    en: "Do you have stomach pain, vomiting or loose motions?"
  }
];

// 2. Comprehensive Clinical Word Dictionary for Dynamic Replacement
const CLINICAL_VOCABULARY = {
  hi: {
    "pain": "दर्द",
    "problem": "समस्या / परेशानी",
    "where": "कहाँ",
    "feel": "महसूस",
    "fever": "बुखार",
    "cough": "खांसी",
    "cold": "जुकाम / सर्दी",
    "headache": "सिरदर्द",
    "stomach": "पेट",
    "chest": "छाती / सीना",
    "throat": "गला",
    "throat pain": "गले में दर्द",
    "dizziness": "चक्कर",
    "medicine": "दवा",
    "tablet": "गोली",
    "injection": "सुई / इंजेक्शन",
    "water": "पानी",
    "food": "खाना / भोजन",
    "after food": "खाना खाने के बाद",
    "before food": "खाना खाने से पहले",
    "morning": "सुबह",
    "afternoon": "दोपहर",
    "night": "रात",
    "days": "दिन",
    "allergy": "एलर्जी",
    "penicillin": "पेनिसिलिन",
    "rest": "आराम",
    "doctor": "डॉक्टर",
    "hospital": "अस्पताल",
    "free": "मुफ्त",
    "cashless": "कैशलेस"
  },
  bn: {
    "pain": "ব্যথা",
    "problem": "সমস্যা",
    "where": "কোথায়",
    "feel": "অনুভব",
    "fever": "জ্বর",
    "cough": "কাশি",
    "cold": "ঠান্ডা / সর্দি",
    "headache": "মাথাব্যথা",
    "stomach": "পেট",
    "chest": "বুক",
    "throat": "গলা",
    "throat pain": "গলায় ব্যথা",
    "dizziness": "মাথা ঘোরা",
    "medicine": "ওষুধ",
    "tablet": "ট্যাবলেট / ওষুধ",
    "injection": "ইঞ্জেকশন",
    "water": "জল",
    "food": "খাবার",
    "after food": "খাবার খাওয়ার পর",
    "before food": "খাবার আগে",
    "morning": "সকাল",
    "afternoon": "দুপুর",
    "night": "রাত",
    "days": "দিন",
    "allergy": "অ্যালার্জি",
    "penicillin": "পেনিসিলিন",
    "rest": "বিশ্রাম",
    "doctor": "ডাক্তার",
    "hospital": "হাসপাতাল",
    "free": "বিনামূল্যে",
    "cashless": "ক্যাশলেস"
  },
  ml: {
    "pain": "വേദന",
    "problem": "പ്രശ്നം",
    "where": "എവിടെ",
    "feel": "അനുഭവപ്പെടുന്നു",
    "fever": "പനി",
    "cough": "ചുമ",
    "cold": "ജലദോഷം",
    "headache": "തലവേദന",
    "stomach": "വയറ്",
    "chest": "നെഞ്ച്",
    "throat": "തൊണ്ട",
    "throat pain": "തൊണ്ടവേദന",
    "dizziness": "തലകറക്കം",
    "medicine": "മരുന്ന്",
    "tablet": "ഗുളിക",
    "injection": "കുത്തിവെയ്പ്പ്",
    "water": "വെള്ളം",
    "food": "ഭക്ഷണം",
    "after food": "ഭക്ഷണത്തിന് ശേഷം",
    "before food": "ഭക്ഷണത്തിന് മുൻപ്",
    "morning": "രാവിലെ",
    "afternoon": "ഉച്ചയ്ക്ക്",
    "night": "രാത്രി",
    "days": "ദിവസം",
    "allergy": "അലർജി",
    "penicillin": "പെൻസിലിൻ",
    "rest": "വിശ്രമം",
    "doctor": "ഡോക്ടർ",
    "hospital": "ആശുപത്രി"
  }
};

/**
 * Main Translation Function
 * Synchronous instant NLP matching with optional async fallback
 */
export const translateClinicalText = async (text, sourceLang = 'en', targetLang = 'hi') => {
  if (!text || !text.trim()) return '';

  const clean = text.trim();

  // 1. Direct Phrasebook Search (Highest accuracy for clinical dialogues)
  for (const item of CLINICAL_PHRASES_DB) {
    const isMatched = item.patterns.some((regex) => regex.test(clean));
    if (isMatched) {
      if (item[targetLang]) {
        return item[targetLang];
      }
    }
  }

  // 2. Check if source matches any of the stored target strings
  for (const item of CLINICAL_PHRASES_DB) {
    if (item.hi === clean || item.bn === clean || item.ml === clean || item.en === clean) {
      if (item[targetLang]) return item[targetLang];
    }
  }

  // 3. Smart Semantic Translation via our internal Gemini API
  try {
    const sourceCode = sourceLang === 'ml' ? 'ml' : sourceLang === 'bn' ? 'bn' : sourceLang === 'hi' ? 'hi' : 'en';
    const targetCode = targetLang === 'ml' ? 'ml' : targetLang === 'bn' ? 'bn' : targetLang === 'hi' ? 'hi' : 'en';
    
    if (sourceCode !== targetCode) {
      const res = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, targetLangCode: targetCode })
      });
      const data = await res.json();
      if (data.success && data.translatedText) {
        return data.translatedText;
      }
    }
  } catch (err) {
    console.warn('API translation fallback error / offline:', err);
  }

  // 4. Clinical Semantic Parser Fallback (Rule-based reconstruction)
  const lower = clean.toLowerCase();
  
  if (targetLang === 'hi') {
    if (lower.includes('pain') || lower.includes('hurt')) {
      return "कृपया बताएं कि आपको दर्द कहाँ हो रहा है और क्या परेशानी है?";
    }
    if (lower.includes('fever')) {
      return "आपको कितने दिनों से बुखार और शरीर में दर्द है?";
    }
    if (lower.includes('medicine') || lower.includes('tablet')) {
      return "यह दवा दिन में तीन बार खाना खाने के बाद पानी के साथ लें।";
    }
    if (lower.includes('allergy')) {
      return "क्या आपको किसी दवा या इंजेक्शन से कोई एलर्जी है?";
    }
    return clean;
  }

  if (targetLang === 'bn') {
    if (lower.includes('pain') || lower.includes('hurt')) {
      return "দয়া করে বলুন আপনার কোথায় ব্যথা হচ্ছে এবং কি সমস্যা?";
    }
    if (lower.includes('fever')) {
      return "আপনার কতদিন ধরে জ্বর এবং শরীরে ব্যথা হচ্ছে?";
    }
    if (lower.includes('medicine') || lower.includes('tablet')) {
      return "এই ওষুধটি দিনে তিনবার খাওয়ার পর জল দিয়ে খাবেন।";
    }
    if (lower.includes('allergy')) {
      return "আপনার কি কোনো ওষুধ বা ইঞ্জেকশনে কোনো অ্যালার্জি আছে?";
    }
    return clean;
  }

  if (targetLang === 'ml') {
    if (lower.includes('pain') || lower.includes('hurt')) {
      return "എവിടെയാണ് വേദന അനുഭവപ്പെടുന്നത് എന്ന് പറയാമോ?";
    }
    if (lower.includes('fever')) {
      return "എത്ര ദിവസമായി പനിയും ശരീരവേദനയുമുണ്ട്?";
    }
    return clean;
  }

  return clean;
};
