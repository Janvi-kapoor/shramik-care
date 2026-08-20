import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  LogOut, 
  ChevronDown, 
  Stethoscope, 
  ShieldCheck, 
  Building2, 
  Home,
  MapPin
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', script: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', script: 'HI' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', script: 'BN' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', script: 'ML' }
];

export const DoctorNavbar = ({ onReturnHome }) => {
  const { currentLanguage, setLanguage, activeSession, logout, t } = useApp();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeSession || activeSession.role !== 'doctor') return null;
  const doctor = activeSession.user;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top KMC Verified Strip */}
      <div className="bg-gradient-to-r from-[#042F2E] via-[#0D5C52] to-[#064E3B] text-white text-[11px] py-1 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-teal-100">
            Kerala Medical Council (KMC) Licensed Clinical Workstation
          </span>
        </div>

        <div className="flex items-center space-x-2 font-mono text-amber-300 font-bold">
          <span>License: {doctor.kmcLicense}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Doctor Info */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                {doctor.name}
              </h2>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                KMC Verified
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block truncate">
              {doctor.facility} • {doctor.campsToday}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
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

          {/* Return Home */}
          {onReturnHome && (
            <button
              onClick={onReturnHome}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title={t('backToHome')}
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
            title={t('signOut')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
