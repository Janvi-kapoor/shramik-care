import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Languages, 
  ArrowRightLeft, 
  Sparkles, 
  Check, 
  MessageSquare,
  Zap,
  CornerDownRight
} from 'lucide-react';

const COMMON_DOCTOR_PHRASES = [
  {
    en: "Where does it hurt?",
    ml: "എവിടെയാണ് വേദന അനുഭവപ്പെടുന്നത്?",
    hi: "आपको दर्द कहाँ हो रहा है?",
    bn: "আপনার কোথায় ব্যথা হচ্ছে?"
  },
  {
    en: "How many days have you had this fever?",
    ml: "എത്ര ദിവസമായി ഈ പനിയുണ്ട്?",
    hi: "यह बुखार आपको कितने दिनों से है?",
    bn: "এই জ্বর আপনার কতদিন ধরে রয়েছে?"
  },
  {
    en: "Take this tablet after food three times a day.",
    ml: "ഈ ഗുളിക ഭക്ഷണത്തിന് ശേഷം ദിവസവും മൂന്ന് നേരം കഴിക്കുക.",
    hi: "यह गोली दिन में तीन बार खाना खाने के बाद लें।",
    bn: "এই ট্যাবলেটটি দিনে তিনবার খাবার খাওয়ার পর খাবেন।"
  },
  {
    en: "Do you have any allergy to penicillin or injections?",
    ml: "നിങ്ങൾക്ക് പെൻസിലിനോ കുത്തിവെയ്പ്പിനോ അലർജിയുണ്ടോ?",
    hi: "क्या आपको पेनिसिलिन या इंजेक्शन से कोई एलर्जी है?",
    bn: "আপনার কি পেনিসিলিন বা ইঞ্জেকশনে কোনো অ্যালার্জি আছে?"
  },
  {
    en: "Drink boiled warm water and take two days rest.",
    ml: "തിളപ്പിച്ചാറിയ ചെറുചൂടുവെള്ളം കുടിക്കുകയും രണ്ട് ദിവസം വിശ്രമിക്കുകയും ചെയ്യുക.",
    hi: "उबला हुआ गुनगुना पानी पिएं और दो दिन पूरा आराम करें।",
    bn: "ফোটানো হালকা গরম জল খান এবং দুই দিন বিশ্রাম নিন।"
  }
];

const COMMON_WORKER_PHRASES = [
  {
    hi: "मुझे 2 दिन से तेज़ बुखार और गले में दर्द है।",
    bn: "আমার ২ দিন ধরে প্রচণ্ড জ্বর এবং গলায় ব্যথা হচ্ছে।",
    en: "I have had high fever and throat pain for 2 days.",
    ml: "എനിക്ക് 2 ദിവസമായി കടുത്ത പനിയും തൊണ്ടവേദനയുമുണ്ട്."
  },
  {
    hi: "प्लाईवुड फैक्ट्री में धूल की वजह से सांस लेने में दिक्कत होती है।",
    bn: "প্লাইউড কারখানার ধুলোর কারণে শ্বাস নিতে কষ্ট হয়।",
    en: "I have difficulty breathing due to dust in the plywood factory.",
    ml: "പ്ലൈവുഡ് ഫാക്ടറിയിലെ പൊടി കാരണം എനിക്ക് ശ്വാസമെടുക്കാൻ ബുദ്ധിമുട്ടാണ്."
  },
  {
    hi: "मुझे पेनिसिलिन इंजेक्शन से एलर्जी है।",
    bn: "আমার পেনিসিলিন ইঞ্জেকশনে অ্যালার্জি আছে।",
    en: "I am allergic to penicillin injections.",
    ml: "എനിക്ക് പെൻസിലിൻ കുത്തിവെയ്പ്പ് അലർജിയാണ്."
  }
];

export const DoctorVoiceTranslator = () => {
  const { selectedPatient, speakText, stopSpeech, isAudioSpeaking, t } = useApp();
  
  // Translation Direction: 'doctor_to_worker' | 'worker_to_doctor'
  const [direction, setDirection] = useState('doctor_to_worker');
  const [doctorLang, setDoctorLang] = useState('en'); // 'en' | 'ml'
  const [workerLang, setWorkerLang] = useState(selectedPatient?.audioLanguage || 'hi'); // 'hi' | 'bn'
  
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Sync workerLang when selected patient changes
  useEffect(() => {
    if (selectedPatient?.audioLanguage) {
      setWorkerLang(selectedPatient.audioLanguage);
    }
  }, [selectedPatient]);

  // Translate text helper
  const handleTranslateAndSpeak = (text, sourceDirection = direction) => {
    if (!text || !text.trim()) return;
    setInputText(text);

    let output = '';
    let targetLangCode = 'hi-IN';

    if (sourceDirection === 'doctor_to_worker') {
      // Doctor -> Worker
      const matched = COMMON_DOCTOR_PHRASES.find(
        (p) => p.en.toLowerCase() === text.toLowerCase() || p.ml === text
      );
      if (matched) {
        output = matched[workerLang] || matched.hi;
      } else {
        // Simple contextual clinical dictionary
        output = workerLang === 'bn' 
          ? `ডাক্তারের নির্দেশ: ${text}` 
          : `डॉक्टर का निर्देश: ${text}`;
      }
      targetLangCode = workerLang === 'bn' ? 'bn-IN' : 'hi-IN';
    } else {
      // Worker -> Doctor
      const matched = COMMON_WORKER_PHRASES.find(
        (p) => p.hi === text || p.bn === text
      );
      if (matched) {
        output = doctorLang === 'ml' ? matched.ml : matched.en;
      } else {
        output = doctorLang === 'ml' ? `രോഗി പറയുന്നു: ${text}` : `Patient reports: ${text}`;
      }
      targetLangCode = doctorLang === 'ml' ? 'ml-IN' : 'en-IN';
    }

    setTranslatedText(output);
    speakText(output, 'translator', targetLangCode);
  };

  // Web Speech Recognition for Live Mic
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: pick the first sample
      const sample = direction === 'doctor_to_worker' 
        ? (doctorLang === 'ml' ? COMMON_DOCTOR_PHRASES[0].ml : COMMON_DOCTOR_PHRASES[0].en)
        : (workerLang === 'bn' ? COMMON_WORKER_PHRASES[0].bn : COMMON_WORKER_PHRASES[0].hi);
      handleTranslateAndSpeak(sample);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      const micLang = direction === 'doctor_to_worker' 
        ? (doctorLang === 'ml' ? 'ml-IN' : 'en-IN')
        : (workerLang === 'bn' ? 'bn-IN' : 'hi-IN');
      recognition.lang = micLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleTranslateAndSpeak(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition err:', err);
      setIsListening(false);
    }
  };

  const handleSwapDirection = () => {
    setDirection(direction === 'doctor_to_worker' ? 'worker_to_doctor' : 'doctor_to_worker');
    setInputText('');
    setTranslatedText('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-5">
      {/* Header & Direction Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Languages className="w-3.5 h-3.5" />
            <span>Real-Time Clinical Audio Bridge</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {t('docTranslatorTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('docTranslatorSub')}
          </p>
        </div>

        {/* Direction Switch Toggle */}
        <button
          type="button"
          onClick={handleSwapDirection}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all shadow-xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>
            {direction === 'doctor_to_worker' ? 'Mode: Doctor ➔ Patient' : 'Mode: Patient ➔ Doctor'}
          </span>
        </button>
      </div>

      {/* Language Selection Radios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Doctor Language Choice */}
        <div className={`p-3 rounded-lg border text-xs ${direction === 'doctor_to_worker' ? 'bg-teal-50/70 border-teal-300' : 'bg-slate-50 border-slate-200'}`}>
          <span className="font-bold text-slate-700 block mb-1.5">Doctor Speaks In:</span>
          <div className="flex items-center space-x-3 font-semibold">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="radio"
                name="docLang"
                checked={doctorLang === 'en'}
                onChange={() => setDoctorLang('en')}
                className="text-teal-700 focus:ring-teal-500"
              />
              <span>English</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="radio"
                name="docLang"
                checked={doctorLang === 'ml'}
                onChange={() => setDoctorLang('ml')}
                className="text-teal-700 focus:ring-teal-500"
              />
              <span>മലയാളം (Malayalam)</span>
            </label>
          </div>
        </div>

        {/* Worker Language Choice */}
        <div className={`p-3 rounded-lg border text-xs ${direction === 'worker_to_doctor' ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
          <span className="font-bold text-slate-700 block mb-1.5">Patient Speaks / Hears In:</span>
          <div className="flex items-center space-x-3 font-semibold">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="radio"
                name="workerLang"
                checked={workerLang === 'hi'}
                onChange={() => setWorkerLang('hi')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>हिन्दी (Hindi)</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="radio"
                name="workerLang"
                checked={workerLang === 'bn'}
                onChange={() => setWorkerLang('bn')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>বাংলা (Bengali)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Translation Mic & Visual Display */}
      <div className="p-4 md:p-5 rounded-xl bg-slate-900 text-white space-y-4 shadow-sm border border-slate-800">
        {/* Source Text Input / Speech Bar */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {direction === 'doctor_to_worker' ? t('docDoctorSpeaks') : t('docWorkerSpeaks')}:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={direction === 'doctor_to_worker' ? "Type doctor instructions or click voice mic below..." : "Patient speech transcript..."}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <button
              type="button"
              onClick={() => handleTranslateAndSpeak(inputText)}
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 font-bold text-xs uppercase"
            >
              Translate
            </button>
          </div>
        </div>

        {/* Central Live Mic Trigger */}
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md ${
              isListening
                ? 'bg-rose-600 ring-4 ring-rose-400/50 animate-pulse text-white scale-110'
                : 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <span className="text-xs text-slate-300 font-semibold">
            {isListening ? "Listening live to speech..." : t('docSpeakMic')}
          </span>
        </div>

        {/* Translated Output Card */}
        {translatedText && (
          <div className="p-3.5 rounded-lg bg-slate-800/90 border border-teal-500/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Live Translated Speech Audio ({direction === 'doctor_to_worker' ? workerLang.toUpperCase() : doctorLang.toUpperCase()}):</span>
              </span>

              <button
                type="button"
                onClick={() => speakText(translatedText, 'translator', direction === 'doctor_to_worker' ? (workerLang === 'bn' ? 'bn-IN' : 'hi-IN') : (doctorLang === 'ml' ? 'ml-IN' : 'en-IN'))}
                className="inline-flex items-center space-x-1 text-xs font-bold text-amber-300 hover:text-amber-200"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Audio Again</span>
              </button>
            </div>

            <p className="text-sm md:text-base font-bold text-white leading-relaxed">
              "{translatedText}"
            </p>
          </div>
        )}
      </div>

      {/* Fast 1-Click Clinical Phrases */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          ⚡ 1-Click Common Clinical Triage Phrases:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {direction === 'doctor_to_worker' ? (
            COMMON_DOCTOR_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTranslateAndSpeak(doctorLang === 'ml' ? phrase.ml : phrase.en)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition-colors text-xs font-medium text-slate-800 flex items-center justify-between group"
              >
                <span className="truncate">{doctorLang === 'ml' ? phrase.ml : phrase.en}</span>
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 flex-shrink-0 ml-1" />
              </button>
            ))
          ) : (
            COMMON_WORKER_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTranslateAndSpeak(workerLang === 'bn' ? phrase.bn : phrase.hi)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-colors text-xs font-medium text-slate-800 flex items-center justify-between group"
              >
                <span className="truncate">{workerLang === 'bn' ? phrase.bn : phrase.hi}</span>
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 flex-shrink-0 ml-1" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
