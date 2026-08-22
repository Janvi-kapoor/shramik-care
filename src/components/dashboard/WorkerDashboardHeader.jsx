import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, ChevronDown, LogOut } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', script: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', script: 'HI' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', script: 'BN' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', script: 'ML' }
];

export const WorkerDashboardHeader = ({ onReturnHome }) => {
  const { currentLanguage, setLanguage, activeSession, logout } = useApp();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const activeLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  if (!activeSession) return null;

  return (
    <div className="w-full z-50 sticky top-0 bg-white border-b border-slate-200 shadow-sm">
      {/* Official Government Top Bar */}
      <div className="w-full bg-[#1e1b4b] text-white/90 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 flex justify-between items-center">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold tracking-wider uppercase text-white/80">Govt. of Kerala</span>
            <span className="text-white/30">|</span>
            <span>Department of Labour & Skills</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="hover:text-white transition-colors cursor-pointer">Screen Reader Access</span>
            <span className="hover:text-white transition-colors cursor-pointer">Skip to Main Content</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="w-full px-4 sm:px-8 py-3 bg-white">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
           
          {/* Logo - Exact Same as Landing Page */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={onReturnHome}>
             <div className="relative w-11 h-11 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="35" r="22" stroke="url(#header_grad1)" strokeWidth="12" />
                <circle cx="35" cy="65" r="22" stroke="url(#header_grad2)" strokeWidth="12" />
                <circle cx="65" cy="65" r="22" stroke="url(#header_grad3)" strokeWidth="12" />
                <defs>
                  <linearGradient id="header_grad1" x1="28" y1="13" x2="72" y2="57" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3934b1" />
                    <stop offset="1" stopColor="#5a52d9" />
                  </linearGradient>
                  <linearGradient id="header_grad2" x1="13" y1="43" x2="57" y2="87" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5a52d9" />
                    <stop offset="1" stopColor="#8c85fa" />
                  </linearGradient>
                  <linearGradient id="header_grad3" x1="43" y1="43" x2="87" y2="87" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4a3ed6" />
                    <stop offset="1" stopColor="#6c5ce7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-[24px] tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#2e2993] to-[#5a52d9] drop-shadow-sm">
                ShramikCare
              </h1>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-1">
                <span className="font-malayalam text-[#635dc9]">മലയാളം</span>
                <span className="text-slate-300">•</span>
                <span>Worker Portal</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
               {/* Worker Profile Mini */}
               <div className="hidden md:flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm mr-2">
                 <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                   {activeSession.user.name.charAt(0)}
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-800 leading-none">{activeSession.user.name}</span>
                   <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{activeSession.user.id}</span>
                 </div>
               </div>

               {/* Language Dropdown */}
             <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors shadow-sm"
              >
                <Globe className="w-4 h-4 text-[#6d4be0]" />
                <span className="text-sm font-bold text-slate-700">{activeLang.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 w-40 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden py-1 z-[100]">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${currentLanguage === lang.code ? 'text-[#6a54d5] font-bold bg-[#f8f9ff]' : 'text-slate-700'}`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-xs text-slate-400">{lang.script}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={logout}
              className="flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </nav>
    </div>
  );
};
