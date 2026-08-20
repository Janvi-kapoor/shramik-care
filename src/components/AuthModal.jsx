import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WorkerHealthCard } from './WorkerHealthCard';
import { 
  X, 
  HardHat, 
  Stethoscope, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  Phone, 
  User, 
  Activity, 
  Heart, 
  Lock,
  Zap,
  Volume2,
  Key,
  ShieldAlert
} from 'lucide-react';
import { 
  KERALA_DISTRICTS, 
  ORIGIN_STATES, 
  BLOOD_GROUPS, 
  COMMON_ALLERGIES, 
  COMMON_CONDITIONS 
} from '../data/mockDatabase';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    t, 
    login, 
    registerWorker,
    currentLanguage 
  } = useApp();

  // Mode: 'login' or 'register'
  const [mode, setMode] = useState('login');
  const [activeLoginRole, setActiveLoginRole] = useState('worker'); // 'worker' | 'doctor' | 'admin'
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Kiosk Security Gate PIN State (Step 0)
  const [kioskPin, setKioskPin] = useState('');
  const [isKioskUnlocked, setIsKioskUnlocked] = useState(false);

  // Worker Login Form State
  const [workerIdentifier, setWorkerIdentifier] = useState('');

  // Doctor Login Form State
  const [doctorId, setDoctorId] = useState('');
  const [kmcLicense, setKmcLicense] = useState('');

  // Admin Login Form State
  const [officerId, setOfficerId] = useState('');
  const [adminPin, setAdminPin] = useState('');

  // Wizard Step State (0=Kiosk Gate, 1=Personal, 2=Worksite, 3=Medical/ABHA, 4=Instant Success)
  const [wizardStep, setWizardStep] = useState(0);
  const [newlyCreatedWorker, setNewlyCreatedWorker] = useState(null);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '28',
    gender: 'Male',
    originState: 'Bihar',
    originDistrict: '',
    audioLanguage: 'hi',
    keralaDistrict: 'Ernakulam',
    worksite: 'Perumbavoor Plywood Hub',
    mobile: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: 'Brother',
    bloodGroup: 'B+',
    allergies: ['Penicillin / Amoxicillin'],
    conditions: ['None / Healthy Baseline'],
    abhaId: '',
    occupation: 'Wood Finishing'
  });

  // Sync initial tab when opened
  useEffect(() => {
    if (authModalTab === 'register') {
      setMode('register');
      setWizardStep(isKioskUnlocked ? 1 : 0);
      setNewlyCreatedWorker(null);
    } else {
      setMode('login');
      setActiveLoginRole(authModalTab || 'worker');
    }
    setErrorMsg('');
  }, [authModalTab, isAuthModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // --- Handlers for Kiosk Gate ---
  const handleUnlockKiosk = (pinToTest) => {
    const pin = (pinToTest || kioskPin).trim();
    setErrorMsg('');
    if (pin === '1234' || pin === '9999') {
      setIsKioskUnlocked(true);
      setWizardStep(1);
    } else {
      setErrorMsg(t('alertKioskPinInvalid'));
    }
  };

  // --- Handlers for Login ---
  const handleWorkerLogin = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    if (!workerIdentifier.trim()) {
      setErrorMsg('Please enter your Mobile number or KL-MIG ID.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const res = login('worker', { identifier: workerIdentifier });
      setIsLoading(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  const handleDoctorLogin = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    if (!doctorId.trim() || !kmcLicense.trim()) {
      setErrorMsg('Both Doctor ID and Kerala Medical Council (KMC) License are mandatory.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const res = login('doctor', { doctorId, kmcLicense });
      setIsLoading(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  const handleAdminLogin = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    if (!officerId.trim() || !adminPin.trim()) {
      setErrorMsg('Both Officer ID and 4-digit PIN are required.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const res = login('admin', { officerId, pin: adminPin });
      setIsLoading(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  // Demo Login Auto-fill & Submit
  const handleDemoWorker = (id) => {
    setWorkerIdentifier(id);
    setIsLoading(true);
    setTimeout(() => {
      const res = login('worker', { identifier: id });
      setIsLoading(false);
      if (res.success) closeAuthModal();
    }, 250);
  };

  const handleDemoDoctor = () => {
    setDoctorId('DOC-ALUVA-01');
    setKmcLicense('KMC-88214');
    setIsLoading(true);
    setTimeout(() => {
      const res = login('doctor', { doctorId: 'DOC-ALUVA-01', kmcLicense: 'KMC-88214' });
      setIsLoading(false);
      if (res.success) closeAuthModal();
    }, 250);
  };

  const handleDemoAdmin = () => {
    setOfficerId('OFF-ERN-01');
    setAdminPin('1234');
    setIsLoading(true);
    setTimeout(() => {
      const res = login('admin', { officerId: 'OFF-ERN-01', pin: '1234' });
      setIsLoading(false);
      if (res.success) closeAuthModal();
    }, 250);
  };

  // --- Handlers for Wizard Form ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxToggle = (field, item) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (item === 'None / Healthy Baseline' || item === 'No Known Drug Allergies (NKDA)') {
        return { ...prev, [field]: [item] };
      }
      const filtered = current.filter((x) => x !== 'None / Healthy Baseline' && x !== 'No Known Drug Allergies (NKDA)');
      if (filtered.includes(item)) {
        const next = filtered.filter((x) => x !== item);
        return { ...prev, [field]: next.length === 0 ? ['None'] : next };
      } else {
        return { ...prev, [field]: [...filtered, item] };
      }
    });
  };

  const handleGenerateAbha = () => {
    const seg1 = Math.floor(1000 + Math.random() * 9000);
    const seg2 = Math.floor(1000 + Math.random() * 9000);
    const seg3 = Math.floor(1000 + Math.random() * 9000);
    const generated = `91-${seg1}-${seg2}-${seg3}`;
    setFormData((prev) => ({ ...prev, abhaId: generated }));
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (wizardStep === 1) {
      if (!formData.name.trim()) {
        setErrorMsg('Please enter the worker’s full name.');
        return;
      }
      if (!formData.age || parseInt(formData.age, 10) < 18) {
        setErrorMsg('Please enter a valid age (minimum 18 years).');
        return;
      }
    } else if (wizardStep === 2) {
      if (!formData.worksite.trim()) {
        setErrorMsg('Please specify the Kerala worksite / camp location.');
        return;
      }
      if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
    }
    setWizardStep((prev) => prev + 1);
  };

  // Assisted Enrollment Submission -> Instantly displays Health Passport
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Instant submission & state bypass
    setTimeout(() => {
      const created = registerWorker(formData);
      setNewlyCreatedWorker(created);
      setIsLoading(false);
      setWizardStep(4); // Instant QR Health Passport Screen
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 overflow-hidden my-4 sm:my-6 transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/90 hover:bg-slate-200 active:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-[#042F2E] via-[#0D5C52] to-[#064E3B] text-white p-5 sm:p-6 pb-4 sm:pb-5 relative flex-shrink-0">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('authModalTitle')}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white">
            {mode === 'register' ? t('wizardTitle') : t('portalLogin')}
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            {mode === 'register' ? t('wizardSubtitle') : t('authModalSubtitle')}
          </p>

          {/* Mode Switcher Tabs (Login vs 1-Minute Registration) */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-5 p-1 rounded-2xl bg-teal-950/50 border border-teal-700/40">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                mode === 'login'
                  ? 'bg-white text-teal-950 shadow-md'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              🔐 {t('portalLogin')}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setWizardStep(isKioskUnlocked ? 1 : 0);
                setNewlyCreatedWorker(null);
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-1.5 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('tabRegister')}</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body with scrolling */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 text-slate-800">
          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-800 text-xs font-semibold animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 1: UNIVERSAL LOGIN (3 TABS)                                         */}
          {/* ========================================================================= */}
          {mode === 'login' && (
            <div>
              {/* Role Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-5 sm:mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLoginRole('worker');
                    setErrorMsg('');
                  }}
                  className={`flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeLoginRole === 'worker'
                      ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HardHat className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{t('tabWorker')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLoginRole('doctor');
                    setErrorMsg('');
                  }}
                  className={`flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeLoginRole === 'doctor'
                      ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="truncate">{t('tabDoctor')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLoginRole('admin');
                    setErrorMsg('');
                  }}
                  className={`flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeLoginRole === 'admin'
                      ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{t('tabAdmin')}</span>
                </button>
              </div>

              {/* Tab 1: Worker Login (Strictly Mobile or KL-MIG ID) */}
              {activeLoginRole === 'worker' && (
                <form onSubmit={handleWorkerLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('inputWorkerMobileOrId')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4 text-teal-700" />
                      </div>
                      <input
                        type="text"
                        value={workerIdentifier}
                        onChange={(e) => setWorkerIdentifier(e.target.value)}
                        placeholder={t('inputWorkerMobilePlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold transition-all bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* High Contrast Primary Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-colors duration-200 active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-200" />
                        <span>{t('btnWorkerLogin')}</span>
                      </>
                    )}
                  </button>

                  {/* One-Click Demo Logins */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      {t('demoQuickLogin')}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDemoWorker('KL-MIG-78219')}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 active:bg-teal-100 border border-slate-200 hover:border-teal-300 text-left transition-colors duration-150 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                            {t('btnDemoRamesh')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          KL-MIG-78219 • Bihar
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoWorker('KL-MIG-88412')}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 active:bg-teal-100 border border-slate-200 hover:border-teal-300 text-left transition-colors duration-150 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                            {t('btnDemoBikash')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          KL-MIG-88412 • West Bengal
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tab 2: Doctor Login */}
              {activeLoginRole === 'doctor' && (
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('inputDoctorId')}
                    </label>
                    <input
                      type="text"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      placeholder={t('inputDoctorIdPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-mono text-sm font-semibold transition-all bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {t('inputKmcLicense')}
                      </label>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        KMC Enforced
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Stethoscope className="w-4 h-4 text-teal-700" />
                      </div>
                      <input
                        type="text"
                        value={kmcLicense}
                        onChange={(e) => setKmcLicense(e.target.value)}
                        placeholder={t('inputKmcPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-mono text-sm font-semibold transition-all uppercase bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-colors duration-200 active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-200" />
                        <span>{t('btnDoctorLogin')}</span>
                      </>
                    )}
                  </button>

                  {/* One-Click Demo Doctor */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      {t('demoQuickLogin')}
                    </span>
                    <button
                      type="button"
                      onClick={handleDemoDoctor}
                      className="w-full p-3 rounded-xl bg-slate-50 hover:bg-teal-50 active:bg-teal-100 border border-slate-200 hover:border-teal-300 text-left transition-colors duration-150 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                          {t('btnDemoDoctor')}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        DOC-ALUVA-01 • KMC-88214 (Aluva Taluk Hospital)
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 3: Admin Login */}
              {activeLoginRole === 'admin' && (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('inputOfficerId')}
                    </label>
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder={t('inputOfficerIdPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-mono text-sm font-semibold transition-all uppercase bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('inputAdminPin')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 text-amber-600" />
                      </div>
                      <input
                        type="password"
                        maxLength={6}
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        placeholder={t('inputAdminPinPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-mono text-sm font-semibold tracking-widest transition-all bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm shadow-md hover:shadow-lg transition-colors duration-200 active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-amber-400" />
                        <span>{t('btnAdminLogin')}</span>
                      </>
                    )}
                  </button>

                  {/* One-Click Demo Admin */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      {t('demoQuickLogin')}
                    </span>
                    <button
                      type="button"
                      onClick={handleDemoAdmin}
                      className="w-full p-3 rounded-xl bg-slate-50 hover:bg-teal-50 active:bg-teal-100 border border-slate-200 hover:border-teal-300 text-left transition-colors duration-150 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                          {t('btnDemoAdmin')}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        OFF-ERN-01 • PIN: 1234 (District Labour Nodal)
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: 1-MINUTE CAMP REGISTRATION (GATE + 3 STEPS + INSTANT SUCCESS)     */}
          {/* ========================================================================= */}
          {mode === 'register' && (
            <div>
              {/* STEP 0: CAMP KIOSK SECURITY PIN GATE */}
              {wizardStep === 0 && (
                <div className="p-4 sm:p-6 rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-sm space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {t('kioskGateTitle')}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {t('kioskGateSubtitle')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('inputKioskPin')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Key className="w-4 h-4 text-amber-600" />
                      </div>
                      <input
                        type="password"
                        maxLength={4}
                        value={kioskPin}
                        onChange={(e) => setKioskPin(e.target.value)}
                        placeholder={t('inputKioskPinPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-mono font-bold text-sm tracking-widest bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => handleUnlockKiosk()}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t('btnUnlockKiosk')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKioskPin('1234');
                        handleUnlockKiosk('1234');
                      }}
                      className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 active:bg-amber-400 text-slate-900 font-extrabold text-xs transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>{t('btnQuickKioskDemo')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Wizard Progress Bar for Step 1, 2, 3 */}
              {wizardStep >= 1 && wizardStep <= 3 && (
                <div className="mb-5 sm:mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                    <span className="text-teal-900">
                      {t('stepOf')} {wizardStep} / 3: {
                        wizardStep === 1 ? t('step1Title') : wizardStep === 2 ? t('step2Title') : t('step3Title')
                      }
                    </span>
                    <span className="font-mono text-teal-700">{Math.round((wizardStep / 3) * 100)}% Completed</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-300 rounded-full"
                      style={{ width: `${(wizardStep / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* STEP 1: Personal Details */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('fieldName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('fieldNamePlaceholder')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldAge')} *
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="80"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldGender')}
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                      >
                        <option value="Male">{t('genderMale')}</option>
                        <option value="Female">{t('genderFemale')}</option>
                        <option value="Other">{t('genderOther')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldOriginState')}
                      </label>
                      <select
                        value={formData.originState}
                        onChange={(e) => handleInputChange('originState', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                      >
                        {ORIGIN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldAudioLang')}
                      </label>
                      <select
                        value={formData.audioLanguage}
                        onChange={(e) => handleInputChange('audioLanguage', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                      >
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="or">ଓଡ଼ിଆ (Odia)</option>
                        <option value="as">অসমীয়া (Assamese)</option>
                        <option value="ml">മലയാളം (Malayalam)</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  {/* Bug-Free High-Contrast Continue Button */}
                  <div className="pt-3 sm:pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-colors duration-200 cursor-pointer"
                    >
                      <span>{t('stepNext')} 2</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Worksite & Contact */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldKeralaDistrict')}
                      </label>
                      <select
                        value={formData.keralaDistrict}
                        onChange={(e) => handleInputChange('keralaDistrict', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                      >
                        {KERALA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldBloodGroup')}
                      </label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-bold text-rose-700 bg-white"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('fieldWorksite')} *
                    </label>
                    <input
                      type="text"
                      value={formData.worksite}
                      onChange={(e) => handleInputChange('worksite', e.target.value)}
                      placeholder={t('fieldWorksitePlaceholder')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('fieldMobile')} *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder={t('fieldMobilePlaceholder')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold font-mono bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldEmergencyName')}
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyName}
                        onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                        placeholder={t('fieldEmergencyNamePlaceholder')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t('fieldEmergencyPhone')}
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        placeholder={t('fieldEmergencyPhonePlaceholder')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-900 text-sm font-semibold font-mono bg-white"
                      />
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-3 sm:pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold text-xs transition-colors duration-150"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('stepPrev')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-colors duration-200 cursor-pointer"
                    >
                      <span>{t('stepNext')} 3</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Medical Baseline & ABHA ID Auto-Gen */}
              {wizardStep === 3 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in duration-150">
                  {/* Allergies Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('fieldAllergies')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COMMON_ALLERGIES.map((allergy) => {
                        const isChecked = (formData.allergies || []).includes(allergy);
                        return (
                          <button
                            key={allergy}
                            type="button"
                            onClick={() => handleCheckboxToggle('allergies', allergy)}
                            className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all flex items-center space-x-2 ${
                              isChecked
                                ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isChecked ? 'bg-rose-600 border-rose-600 text-white font-bold' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && '✓'}
                            </span>
                            <span className="truncate">{allergy}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('fieldConditions')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COMMON_CONDITIONS.map((cond) => {
                        const isChecked = (formData.conditions || []).includes(cond);
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => handleCheckboxToggle('conditions', cond)}
                            className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all flex items-center space-x-2 ${
                              isChecked
                                ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isChecked ? 'bg-teal-700 border-teal-700 text-white font-bold' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && '✓'}
                            </span>
                            <span className="truncate">{cond}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 14-Digit ABHA ID Auto-Generator Section */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        {t('fieldAbhaId')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ABDM Sandbox
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.abhaId}
                        onChange={(e) => handleInputChange('abhaId', e.target.value)}
                        placeholder={t('fieldAbhaPlaceholder')}
                        className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-slate-900 font-mono font-bold text-xs sm:text-sm tracking-wider"
                      />

                      <button
                        type="button"
                        onClick={handleGenerateAbha}
                        className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:from-amber-700 active:to-amber-800 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm flex items-center space-x-1.5 transition-colors active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Auto-Gen</span>
                      </button>
                    </div>

                    {formData.abhaId && (
                      <span className="text-[11px] text-emerald-700 font-bold mt-2 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('abhaGeneratedNotice')}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-3 sm:pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold text-xs transition-colors duration-150"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('stepPrev')}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-colors duration-200 active:scale-95 cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          <span>{t('stepSubmit')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: Instant Assisted Enrollment Result (QR Health Passport Screen) */}
              {wizardStep === 4 && newlyCreatedWorker && (
                <div className="space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                      <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {t('successTitle')}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t('successSubtitle')}
                    </p>
                  </div>

                  {/* Render Health Card Preview */}
                  <WorkerHealthCard
                    worker={newlyCreatedWorker}
                    isModalView={true}
                    onProceed={() => {
                      closeAuthModal();
                    }}
                  />

                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => {
                        setWizardStep(1);
                        setFormData({
                          name: '',
                          age: '28',
                          gender: 'Male',
                          originState: 'Bihar',
                          originDistrict: '',
                          audioLanguage: 'hi',
                          keralaDistrict: 'Ernakulam',
                          worksite: 'Perumbavoor Plywood Hub',
                          mobile: '',
                          emergencyName: '',
                          emergencyPhone: '',
                          emergencyRelation: 'Brother',
                          bloodGroup: 'B+',
                          allergies: ['Penicillin / Amoxicillin'],
                          conditions: ['None / Healthy Baseline'],
                          abhaId: '',
                          occupation: 'Wood Finishing'
                        });
                        setNewlyCreatedWorker(null);
                      }}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                    >
                      + {t('btnEnrollAnother')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
