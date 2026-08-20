import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  ChevronDown, 
  LogIn, 
  UserPlus, 
  PhoneCall, 
  ShieldCheck, 
  HeartPulse, 
  Sparkles,
  ExternalLink,
  Info,
  Building2,
  FileText
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', script: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', script: 'HI' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', script: 'BN' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', script: 'ML' }
];

export const LandingNavbar = () => {
  const { currentLanguage, setLanguage, t, openAuthModal } = useApp();
  
  // Dropdown states
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'awaz' | 'kasp' | null

  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsLangOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200" ref={navRef}>
      {/* Top Kerala Govt Strip */}
      <div className="bg-gradient-to-r from-[#042F2E] via-[#0D5C52] to-[#064E3B] text-white text-[11px] py-1 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-teal-100">{t('govtBadge')}</span>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="tel:1056"
            className="flex items-center space-x-1 text-amber-300 font-bold hover:text-amber-200"
          >
            <PhoneCall className="w-3 h-3" />
            <span>DISHA: 1056</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D5C52] to-[#042F2E] flex items-center justify-center text-amber-400 shadow-sm">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">
              ShramikCare
            </h1>
            <span className="text-[10px] font-bold text-teal-800 tracking-wider uppercase block mt-1">
              ശ്രമിക് കെയർ • Interstate Migrant Health Bridge
            </span>
          </div>
        </div>

        {/* Center: Scheme Dropdown Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-2">
          {/* 1. AWAZ Scheme Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'awaz' ? null : 'awaz')}
              onMouseEnter={() => setActiveDropdown('awaz')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeDropdown === 'awaz'
                  ? 'bg-teal-50 text-teal-900'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>AWAZ Scheme</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'awaz' ? 'rotate-180' : ''}`} />
            </button>

            {/* AWAZ Dropdown Menu */}
            {activeDropdown === 'awaz' && (
              <div 
                className="absolute left-0 mt-1 w-80 rounded-xl bg-white shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Kerala Govt Welfare Flagship</span>
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  AWAZ Health & Accidental Insurance Scheme
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Provides <strong>₹50,000 annual cashless medical care</strong> and <strong>₹2,00,000 accidental relief</strong> for all registered interstate guest workers in Kerala across empanelled hospitals.
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-900 font-bold">
                    ✓ ₹50K Cashless Care
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-900 font-bold">
                    ✓ ₹2 Lakh Accidental
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                  <span>Helpline: 1800-425-1147</span>
                  <span className="text-emerald-700 font-bold">100% Free Enrolment</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. KASP (Karunya) Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'kasp' ? null : 'kasp')}
              onMouseEnter={() => setActiveDropdown('kasp')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeDropdown === 'kasp'
                  ? 'bg-teal-50 text-teal-900'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>KASP (Karunya)</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'kasp' ? 'rotate-180' : ''}`} />
            </button>

            {/* KASP Dropdown Menu */}
            {activeDropdown === 'kasp' && (
              <div 
                className="absolute left-0 mt-1 w-80 rounded-xl bg-white shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  <span>Tertiary Healthcare Security</span>
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  Karunya Arogya Suraksha Padhathi (KASP)
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Comprehensive health protection scheme implemented by Kerala Health Directorate offering secondary and tertiary hospitalization cover up to <strong>₹5,00,000 per family annually</strong>.
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-900 font-bold">
                    ✓ ₹5 Lakh / Family
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-900 font-bold">
                    ✓ Tertiary Surgeries
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                  <span>DISHA Helpline: 1056</span>
                  <span className="text-rose-700 font-bold">State Network</span>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Language Selector & Login Buttons */}
        <div className="flex items-center space-x-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-teal-700" />
              <span>{currentLangObj.native}</span>
              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors hover:bg-teal-50 ${
                      currentLanguage === lang.code ? 'bg-teal-50 font-bold text-teal-900' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.native} ({lang.label})</span>
                    <span className="font-mono text-[10px] text-slate-400">{lang.script}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Portal Login CTA */}
          <button
            type="button"
            onClick={() => openAuthModal('worker')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t('portalLogin')}</span>
          </button>

          {/* 1-Min Camp Enrollment Button (Desktop) */}
          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>1-Min Enroll</span>
          </button>
        </div>
      </div>
    </header>
  );
};
