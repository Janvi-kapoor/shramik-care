import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRESCRIPTION_SCANS } from '../data/mockDatabase';
import { TRANSLATIONS } from '../data/translations';
import { fallbackTranslations } from '../utils/clinicalAudioBackup';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. Language State
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('shramik_lang') || 'en';
  });

  // 2. Database State (now fetched from backend)
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/workers');
        if (res.ok) {
          const data = await res.json();
          setWorkers(data);
          
          if (data.length > 0) {
            setSelectedPatient(prev => prev || data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial workers from server:', err);
      }
    };
    fetchWorkers();
  }, []);

  // 3. Active Session (worker | doctor | admin | null)
  const [activeSession, setActiveSession] = useState(() => {
    try {
      const saved = localStorage.getItem('shramik_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Modal / Local States
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [isJanAushadhiModalOpen, setIsJanAushadhiModalOpen] = useState(false);
  const [activePrescription, setActivePrescription] = useState(MOCK_PRESCRIPTION_SCANS[0]);
  
  // Daily Pill Adherence Checklist State
  const [pillAdherence, setPillAdherence] = useState(() => {
    try {
      const saved = localStorage.getItem('shramik_pills_adherence');
      return saved ? JSON.parse(saved) : { 'SLOT-MORNING': true };
    } catch {
      return { 'SLOT-MORNING': true };
    }
  });

  // 5. Doctor Workstation States
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Voice Speech Playing State
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);
  const [currentlyPlayingSlot, setCurrentlyPlayingSlot] = useState(null);

  // 6. Auth Modal & UI States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('worker'); // 'worker' | 'doctor' | 'admin' | 'register'
  const [toast, setToast] = useState(null);

  // localStorage syncs
  useEffect(() => {
    localStorage.setItem('shramik_lang', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('shramik_pills_adherence', JSON.stringify(pillAdherence));
  }, [pillAdherence]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('shramik_session', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('shramik_session');
    }
  }, [activeSession]);

  // Clean up any speech on language switch or unmount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAudioSpeaking(false);
      setCurrentlyPlayingSlot(null);
    }
  }, [currentLanguage]);

  // Translation Helper
  const t = useCallback((key, fallback = '') => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return fallback || key;
  }, [currentLanguage]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openAuthModal = (tab = 'worker') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setLanguage = (lang) => {
    if (['en', 'hi', 'bn', 'ml'].includes(lang)) {
      setCurrentLanguage(lang);
    }
  };

  // Real API Login handler
  const login = async (role, credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, ...credentials })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, message: data.error || t('alertAuthFailed') };
      }

      const session = {
        role: role,
        user: data.user,
        token: data.token,
        loginTime: new Date().toISOString()
      };
      
      setActiveSession(session);
      setIsAuthModalOpen(false);
      showToast(`${t('alertLoginSuccess')} ${data.user.name}`, 'success');

      if (role === 'worker') {
        navigate('/worker/home');
      } else if (role === 'doctor') {
        navigate('/doctor/scanner');
      } else if (role === 'admin') {
        navigate('/admin/overview');
      }
      
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  };

  // Register new worker
  const registerWorker = (formData) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newId = `KL-MIG-${randomDigits}`;

    let finalAbha = formData.abhaId;
    if (!finalAbha || finalAbha.trim().length < 14) {
      const seg1 = Math.floor(1000 + Math.random() * 9000);
      const seg2 = Math.floor(1000 + Math.random() * 9000);
      const seg3 = Math.floor(1000 + Math.random() * 9000);
      finalAbha = `91-${seg1}-${seg2}-${seg3}`;
    }

    const awazNo = `AWZ-KL-2025-${Math.floor(10000 + Math.random() * 90000)}`;

    const newWorker = {
      id: newId,
      name: formData.name || 'Guest Worker',
      nameNative: formData.name || 'Guest Worker',
      age: parseInt(formData.age, 10) || 28,
      gender: formData.gender || 'Male',
      mobile: formData.mobile || '9876500000',
      originState: formData.originState || 'Bihar',
      originDistrict: formData.originDistrict || 'Home District',
      district: formData.keralaDistrict || 'Ernakulam',
      keralaDistrict: formData.keralaDistrict || 'Ernakulam',
      worksite: formData.worksite || 'Perumbavoor Industrial Hub',
      occupation: formData.occupation || 'General Workforce / Construction',
      audioLanguage: formData.audioLanguage || 'hi',
      bloodGroup: formData.bloodGroup || 'B+',
      abhaId: finalAbha,
      awazCardNo: awazNo,
      isAwazLinked: true,
      awazCoverageLimit: 50000,
      awazUtilizedAmount: 0,
      emergencyContact: {
        name: formData.emergencyName || 'Camp Coordinator',
        phone: formData.emergencyPhone || formData.mobile || '+91 94470 00000',
        relation: formData.emergencyRelation || 'Contact'
      },
      allergies: Array.isArray(formData.allergies) && formData.allergies.length > 0
        ? formData.allergies
        : ['No Known Drug Allergies (NKDA)'],
      conditions: Array.isArray(formData.conditions) && formData.conditions.length > 0
        ? formData.conditions
        : ['Healthy Baseline'],
      vaccinations: ['Covishield (Verified)', 'Tetanus Toxoid (Current)'],
      vitals: {
        bp: "120/80 mmHg",
        bloodSugar: "94 mg/dL",
        pulse: "72 bpm",
        spO2: "99%",
        bmi: "22.0",
        lastUpdated: "Today (Camp Onboarding)"
      },
      lastCampCheckup: `Registered Today at ${formData.keralaDistrict || 'Ernakulam'} Health Desk`,
      assignedFacility: `${formData.keralaDistrict || 'Ernakulam'} Taluk Health Center`,
      registeredAt: new Date().toISOString(),
      qrCodeData: `SHRAMIKCARE://${newId}/${finalAbha}/${formData.bloodGroup || 'B-POS'}`
    };

    setWorkers((prev) => [newWorker, ...prev]);

    const session = {
      role: 'worker',
      user: newWorker,
      loginTime: new Date().toISOString()
    };
    setActiveSession(session);
    setActiveDashboardTab('passport');
    setIsAuthModalOpen(false);

    showToast(`${t('alertRegisterSuccess')} ${newWorker.id}`, 'success');
    return newWorker;
  };

  const logout = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSession(null);
    showToast('Logged out of ShramikCare session.', 'info');
    navigate('/');
  };

  // Toggle dose taken in Pill-Clock
  const togglePillSlotTaken = (slotId) => {
    setPillAdherence((prev) => {
      const updated = { ...prev, [slotId]: !prev[slotId] };
      return updated;
    });
  };

  // Toggle AWAZ Card Linking state for active worker
  const toggleAwazCardLink = () => {
    if (!activeSession || activeSession.role !== 'worker') return;
    const currentStatus = activeSession.user.isAwazLinked;
    const updatedWorker = {
      ...activeSession.user,
      isAwazLinked: !currentStatus,
      awazCardNo: currentStatus ? null : `AWZ-KL-2025-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setActiveSession({
      ...activeSession,
      user: updatedWorker
    });

    setWorkers((prev) =>
      prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w))
    );

    if (!currentStatus) {
      showToast(t('alertAwazLinked'), 'success');
    } else {
      showToast('AWAZ Card unlinked from active profile.', 'info');
    }
  };

  // Flawless Multilingual Speech Engine (Bengali, Malayalam, Hindi, English)
  const speakText = async (text, slotId = null, forcedLang = null, skipTranslation = false) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported on this browser.', 'error');
      return;
    }

    // 1. Mandatory cancel before speaking to prevent audio queue overlap
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    // 2. Strict BCP-47 mapping
    const langCodeMap = {
      hi: 'hi-IN',
      bn: 'bn-IN',
      ml: 'ml-IN',
      or: 'or-IN',
      en: 'en-IN'
    };
    
    // If forcedLang is already a full tag (e.g. 'ml-IN'), extract the base ('ml')
    let baseLang = (forcedLang || currentLanguage).split('-')[0];
    const targetLangTag = langCodeMap[baseLang] || 'en-IN';
    const targetLangCode = baseLang; // 'hi', 'bn', 'ml', 'en'

    // 3. API Translation or Offline Fallback
    let textToSpeak = text;
    
    if (!skipTranslation && targetLangCode !== 'en') {
      const cleanText = text.trim();
      if (fallbackTranslations[cleanText] && fallbackTranslations[cleanText][targetLangTag]) {
        textToSpeak = fallbackTranslations[cleanText][targetLangTag];
        setIsAudioSpeaking(true);
        setCurrentlyPlayingSlot(slotId || 'all');
      } else {
        try {
          // HACK: Unlock speech synthesis in this call stack before awaiting fetch
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);

        setIsAudioSpeaking(true);
        setCurrentlyPlayingSlot(slotId || 'all');
        
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
        console.warn('Failed to translate text via API before speaking:', err);
      }
    }
  }

    // Workaround for browser async speech synthesis blocking
    // After an await, sometimes speech synthesis is blocked if no prior interaction
    // We will still attempt to speak.
    
    // 4. Configure Utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = targetLangTag;
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    // 5. Loop through available browser voices to find exact matching language voice
    const voices = window.speechSynthesis.getVoices();
    let exactVoice = null;
    for (let i = 0; i < voices.length; i++) {
      const v = voices[i];
      const vLang = v.lang.toLowerCase();
        if (targetLangTag === 'bn-IN' && (vLang.includes('bn') || vLang.includes('bengali'))) {
          exactVoice = v;
          break;
        }
        if (targetLangTag === 'ml-IN' && (vLang.includes('ml') || vLang.includes('malayalam'))) {
          exactVoice = v;
          break;
        }
        if (targetLangTag === 'or-IN' && (vLang.includes('or') || vLang.includes('odia') || vLang.includes('oriya'))) {
          exactVoice = v;
          break;
        }
        if (targetLangTag === 'hi-IN' && (vLang.includes('hi') || vLang.includes('hindi'))) {
          exactVoice = v;
          break;
        }
      if (targetLangTag === 'en-IN' && (vLang.includes('en-in') || vLang.includes('english'))) {
        exactVoice = v;
        break;
      }
    }

    // 6. Synthetic Fallback Tone
    if (!exactVoice) {
       const primaryLang = targetLangTag.split('-')[0].toLowerCase();
       exactVoice = voices.find(v => v.lang.toLowerCase().startsWith(primaryLang));
       
       if (!exactVoice) {
         utterance.pitch = 0.8;
         utterance.rate = 0.8;
         exactVoice = voices.find(v => v.default) || voices[0];
         console.warn(`[Speech Engine] Missing native voice pack for ${targetLangTag}.`);
       }
    }

    if (exactVoice) {
      utterance.voice = exactVoice;
    }

    // 7. UI Feedback event handlers
    utterance.onstart = () => {
      setIsAudioSpeaking(true);
      setCurrentlyPlayingSlot(slotId || 'all');
    };

    utterance.onend = () => {
      setIsAudioSpeaking(false);
      setCurrentlyPlayingSlot(null);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsAudioSpeaking(false);
      setCurrentlyPlayingSlot(null);
    };

    // 8. Speak
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAudioSpeaking(false);
      setCurrentlyPlayingSlot(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        workers,
        activeSession,
        setActiveSession,
        login,
        logout,
        registerWorker,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        toast,
        showToast,
        // Worker Dashboard Features
        isHospitalModalOpen,
        setIsHospitalModalOpen,
        isJanAushadhiModalOpen,
        setIsJanAushadhiModalOpen,
        activePrescription,
        setActivePrescription,
        pillAdherence,
        togglePillSlotTaken,
        toggleAwazCardLink,
        // Doctor Workstation Features
        selectedPatient,
        setSelectedPatient,
        // Admin Command Center Features
        // Audio Engine
        speakText,
        stopSpeech,
        isAudioSpeaking,
        currentlyPlayingSlot
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
