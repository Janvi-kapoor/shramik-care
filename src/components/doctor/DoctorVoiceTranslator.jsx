import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translateClinicalText } from '../../utils/clinicalTranslator';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  ArrowRightLeft, 
  Sparkles, 
  Zap,
  CornerDownRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

const COMMON_DOCTOR_PHRASES = [
  {
    en: "Can you tell me what's your problem and where you feel the pain?",
    ml: "എന്താണ് പ്രശ്നമെന്നും എവിടെയാണ് വേദനയെന്നും പറയാമോ?",
  },
  {
    en: "Where does it hurt?",
    ml: "എവിടെയാണ് വേദന അനുഭവപ്പെടുന്നത്?",
  },
  {
    en: "How many days have you had this fever?",
    ml: "എത്ര ദിവസമായി ഈ പനിയുണ്ട്?",
  },
  {
    en: "Take this tablet after food three times a day.",
    ml: "ഈ ഗുളിക ഭക്ഷണത്തിന് ശേഷം ദിവസവും മൂന്ന് നേരം കഴിക്കുക.",
  },
  {
    en: "Do you have any allergy to penicillin or injections?",
    ml: "നിങ്ങൾക്ക് പെൻസിലിനോ കുത്തിവെയ്പ്പിനോ അലർജിയുണ്ടോ?",
  },
  {
    en: "Drink boiled warm water and take two days rest.",
    ml: "തിളപ്പിച്ചാറിയ ചെറുചൂടുവെള്ളം കുടിക്കുകയും രണ്ട് ദിവസം വിശ്രമിക്കുകയും ചെയ്യുക.",
  }
];

const COMMON_WORKER_PHRASES = [
  {
    hi: "मुझे 2 दिन से तेज़ बुखार और गले में दर्द है।",
    bn: "আমার ২ দিন ধরে প্রচণ্ড জ্বর এবং গলায় ব্যথা হচ্ছে।",
  },
  {
    hi: "प्लाईवुड फैक्ट्री में धूल की वजह से सांस लेने में दिक्कत होती है।",
    bn: "প্লাইউড কারখানার ধুলোর কারণে শ্বাস নিতে কষ্ট হয়।",
  },
  {
    hi: "मुझे पेनिसिलिन इंजेक्शन से एलर्जी है।",
    bn: "আমার পেনিসিলিন ইঞ্জেকশনে অ্যালার্জি আছে।",
  }
];

export const DoctorVoiceTranslator = () => {
  const { selectedPatient, speakText, stopSpeech, isAudioSpeaking, showToast, t } = useApp();
  
  // Translation Direction: 'doctor_to_worker' | 'worker_to_doctor'
  const [direction, setDirection] = useState('doctor_to_worker');
  const [doctorLang, setDoctorLang] = useState('en'); // 'en' | 'ml'
  const [workerLang, setWorkerLang] = useState(selectedPatient?.audioLanguage || 'hi'); // 'hi' | 'bn'
  
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Sync workerLang when selected patient changes
  useEffect(() => {
    if (selectedPatient?.audioLanguage) {
      setWorkerLang(selectedPatient.audioLanguage);
    }
  }, [selectedPatient]);

  // Translate and speak helper
  const handleTranslateAndSpeak = async (textToTranslate = inputText) => {
    if (!textToTranslate || !textToTranslate.trim()) return;
    setIsTranslating(true);
    setInputText(textToTranslate);

    const sourceLang = direction === 'doctor_to_worker' ? doctorLang : workerLang;
    const targetLang = direction === 'doctor_to_worker' ? workerLang : doctorLang;

    // Actual Translation via Clinical Translator Engine
    const translated = await translateClinicalText(textToTranslate, sourceLang, targetLang);
    setTranslatedText(translated);
    setIsTranslating(false);

    // Speak in native BCP-47 target language
    const targetBcp47 = targetLang === 'ml' ? 'ml-IN' : targetLang === 'bn' ? 'bn-IN' : targetLang === 'hi' ? 'hi-IN' : 'en-IN';
    speakText(translated, 'translator', targetBcp47, true);
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
      showToast('Speech Recognition is not supported by your browser.', 'error');
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
    const nextDir = direction === 'doctor_to_worker' ? 'worker_to_doctor' : 'doctor_to_worker';
    setDirection(nextDir);
    setInputText("");
    setTranslatedText("");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-5">
      {/* Header & Direction Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Languages className="w-3.5 h-3.5" />
            <span>2-Way Real-Time Voice Translator</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Doctor speaks English/Malayalam ↔ Patient hears Hindi/Bengali
          </h2>
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
        {/* Source Text Input */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {direction === 'doctor_to_worker' ? `Doctor Speaks (${doctorLang.toUpperCase()})` : `Patient Speaks (${workerLang.toUpperCase()})`}:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTranslateAndSpeak(inputText)}
              placeholder="Type clinical question or click voice mic below..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <button
              type="button"
              onClick={() => handleTranslateAndSpeak(inputText)}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 font-bold text-xs uppercase transition-colors"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        {/* Central Voice Mic Button */}
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
            {isListening ? "Listening live to clinical speech..." : "Hold to Speak (Voice Mic)"}
          </span>
        </div>

        {/* Live Translated Speech Card (ACTUAL HINDI / BENGALI / MALAYALAM) */}
        {translatedText && (
          <div className="p-4 rounded-lg bg-slate-800/90 border border-teal-500/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Live Translated Speech Audio ({direction === 'doctor_to_worker' ? (workerLang === 'bn' ? 'BENGALI (BN)' : 'HINDI (HI)') : (doctorLang === 'ml' ? 'MALAYALAM (ML)' : 'ENGLISH (EN)')}):
                </span>
              </span>

              <button
                type="button"
                onClick={() => {
                  const targetBcp47 = (direction === 'doctor_to_worker')
                    ? (workerLang === 'bn' ? 'bn-IN' : 'hi-IN')
                    : (doctorLang === 'ml' ? 'ml-IN' : 'en-IN');
                  speakText(translatedText, 'translator', targetBcp47, true);
                }}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-teal-900/60 hover:bg-teal-900 text-xs font-bold text-amber-300 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Audio Again</span>
              </button>
            </div>

            {/* Exact Actual Translated Speech Text */}
            <p className="text-base sm:text-lg font-black text-amber-300 leading-relaxed font-sans">
              "{translatedText}"
            </p>
          </div>
        )}
      </div>

      {/* 1-Click Fast Clinical Triage Prompts */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          ⚡ 1-Click Clinical Dialogue Prompts:
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
