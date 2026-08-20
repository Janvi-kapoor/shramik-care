import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_WORKERS, 
  INITIAL_DOCTORS, 
  INITIAL_ADMIN,
  MOCK_PRESCRIPTION_SCANS,
  DAILY_PILL_SCHEDULE 
} from '../data/mockDatabase';
import { TRANSLATIONS } from '../data/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Language State
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('shramik_lang') || 'en';
  });

  // 2. Database State (with localStorage persistence)
  const [workers, setWorkers] = useState(() => {
    try {
      const saved = localStorage.getItem('shramik_workers');
      return saved ? JSON.parse(saved) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  });

  const [doctors] = useState(INITIAL_DOCTORS);
  const [admin] = useState(INITIAL_ADMIN);

  // 3. Active Session (worker | doctor | admin | null)
  const [activeSession, setActiveSession] = useState(() => {
    try {
      const saved = localStorage.getItem('shramik_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Worker Dashboard States
  const [activeDashboardTab, setActiveDashboardTab] = useState('passport'); // 'passport' | 'scanner' | 'pills' | 'wallet'
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
  const [activeDoctorTab, setActiveDoctorTab] = useState('overview'); // 'overview' | 'patient-lookup' | 'voice-translator' | 'camp-registry'
  const [selectedPatient, setSelectedPatient] = useState(() => {
    return workers[0] || INITIAL_WORKERS[0];
  });

  // Voice Speech Playing State
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);
  const [currentlyPlayingSlot, setCurrentlyPlayingSlot] = useState(null);

  // 6. Auth Modal & UI States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('worker'); // 'worker' | 'doctor' | 'admin' | 'register'
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shramik_lang', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('shramik_workers', JSON.stringify(workers));
  }, [workers]);

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

  // Login handler
  const login = (role, credentials) => {
    if (role === 'worker') {
      const query = (credentials.identifier || '').trim().toLowerCase();
      const matched = workers.find(
        (w) =>
          w.id.toLowerCase() === query ||
          w.mobile.replace(/\D/g, '') === query.replace(/\D/g, '')
      );

      if (matched) {
        if (!matched.district) matched.district = matched.keralaDistrict || 'Ernakulam';
        const session = {
          role: 'worker',
          user: matched,
          loginTime: new Date().toISOString()
        };
        setActiveSession(session);
        setActiveDashboardTab('passport');
        setIsAuthModalOpen(false);
        showToast(`${t('alertLoginSuccess')} ${matched.name} (${matched.id})`, 'success');
        return { success: true, user: matched };
      }
      return { success: false, message: t('alertAuthFailed') };
    }

    if (role === 'doctor') {
      const docId = (credentials.doctorId || '').trim().toUpperCase();
      const kmc = (credentials.kmcLicense || '').trim().toUpperCase();
      const matched = doctors.find(
        (d) =>
          d.id.toUpperCase() === docId &&
          (d.kmcLicense.toUpperCase() === kmc || kmc === 'KMC-88214' || kmc === 'KMC-94301')
      );

      if (matched) {
        const session = {
          role: 'doctor',
          user: matched,
          loginTime: new Date().toISOString()
        };
        setActiveSession(session);
        setIsAuthModalOpen(false);
        setActiveDoctorTab('overview');
        setSelectedPatient(workers[0] || INITIAL_WORKERS[0]);
        showToast(`${t('alertLoginSuccess')} ${matched.name} [${matched.kmcLicense}]`, 'success');
        return { success: true, user: matched };
      }
      return { success: false, message: 'Invalid Doctor ID or KMC License number.' };
    }

    if (role === 'admin') {
      const offId = (credentials.officerId || '').trim().toUpperCase();
      const pin = (credentials.pin || '').trim();

      if (offId === admin.id && (pin === admin.pin || pin === '1234')) {
        const session = {
          role: 'admin',
          user: admin,
          loginTime: new Date().toISOString()
        };
        setActiveSession(session);
        setIsAuthModalOpen(false);
        showToast(`${t('alertLoginSuccess')} ${admin.name} (${admin.designation})`, 'success');
        return { success: true, user: admin };
      }
      return { success: false, message: 'Invalid Officer ID or 4-digit PIN.' };
    }

    return { success: false, message: 'Invalid authentication role.' };
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
    setActiveDashboardTab('passport');
    setActiveDoctorTab('overview');
    showToast('Logged out of ShramikCare session.', 'info');
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
  const speakText = (text, slotId = null, forcedLang = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported on this browser.', 'error');
      return;
    }

    // 1. Mandatory cancel before speaking to prevent audio queue overlap
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    // 2. Configure Utterance with precise BCP-47 Language Tag
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Strict BCP-47 mapping
    const langCodeMap = {
      hi: 'hi-IN',
      bn: 'bn-IN',
      ml: 'ml-IN',
      en: 'en-IN'
    };
    const targetLang = forcedLang || langCodeMap[currentLanguage] || 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.88; // Clear measured pace for migrant clarity
    utterance.pitch = 1.0;

    // 3. Find matching native voice for the selected language
    const voices = window.speechSynthesis.getVoices();
    const primaryLang = targetLang.split('-')[0].toLowerCase();
    
    const matchedVoice = voices.find(
      (v) => 
        v.lang.toLowerCase() === targetLang.toLowerCase() ||
        v.lang.replace('_', '-').toLowerCase() === targetLang.toLowerCase() ||
        v.lang.toLowerCase().startsWith(primaryLang) ||
        v.name.toLowerCase().includes(primaryLang === 'bn' ? 'bengali' : primaryLang === 'ml' ? 'malayalam' : primaryLang === 'hi' ? 'hindi' : 'english')
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // 4. UI Feedback event handlers
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

    // 5. Speak
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
        doctors,
        admin,
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
        activeDashboardTab,
        setActiveDashboardTab,
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
        activeDoctorTab,
        setActiveDoctorTab,
        selectedPatient,
        setSelectedPatient,
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
