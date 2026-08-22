import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, User, Globe } from 'lucide-react';
import { landingTranslations } from '../pages/translations';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', script: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'à¤¹à¤¿à¤‚à¤¦à¥€', script: 'HI' },
  { code: 'bn', label: 'Bengali', native: 'à¦¬à¦¾à¦‚à¦²à¦¾', script: 'BN' },
  { code: 'ml', label: 'Malayalam', native: 'à´®à´²à´¯à´¾à´³à´‚', script: 'ML' }
];

export const LandingNavbar = () => {
  const { openAuthModal, currentLanguage, setLanguage } = useApp();
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Find active language safely
  const activeLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
  const t = landingTranslations[currentLanguage] || landingTranslations['en'];

  return (
    <div className="absolute top-0 w-full z-50">
      {/* Official Government Top Bar */}
      <div className="w-full bg-[#1e1b4b] text-white/90 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 flex justify-between items-center">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold tracking-wider uppercase text-white/80">Govt. of Kerala</span>
            <span className="text-white/30">|</span>
            <span>Department of Labour & Skills</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <a href="#" className="hover:text-white transition-colors">Screen Reader Access</a>
            <a href="#" className="hover:text-white transition-colors">Skip to Main Content</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="w-full bg-transparent px-4 sm:px-8 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative w-11 h-11 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="35" r="22" stroke="url(#grad1)" strokeWidth="12" />
                <circle cx="35" cy="65" r="22" stroke="url(#grad2)" strokeWidth="12" />
                <circle cx="65" cy="65" r="22" stroke="url(#grad3)" strokeWidth="12" />
                <defs>
                  <linearGradient id="grad1" x1="28" y1="13" x2="72" y2="57" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3934b1" />
                    <stop offset="1" stopColor="#5a52d9" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="13" y1="43" x2="57" y2="87" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5a52d9" />
                    <stop offset="1" stopColor="#8c85fa" />
                  </linearGradient>
                  <linearGradient id="grad3" x1="43" y1="43" x2="87" y2="87" gradientUnits="userSpaceOnUse">
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
                <span className="font-malayalam text-[#635dc9]">à´¶àµà´°à´®à´¿à´•àµ à´•àµ†à´¯àµ¼</span>
                <span className="text-slate-300">â€¢</span>
                <span>Migrant Health Bridge</span>
              </div>
            </div>
          </div>

          {/* Center Links (Hidden on small) */}
          <div className="hidden lg:flex items-center space-x-3 text-sm font-bold text-[#374151]">
            <button className="px-4 py-2 rounded-full hover:bg-white/80 hover:shadow-sm hover:text-[#5a52d9] transition-all border border-transparent hover:border-slate-200">
              {t.navAwaz}
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 rounded-full hover:bg-white/80 hover:shadow-sm hover:text-[#5a52d9] transition-all border border-transparent hover:border-slate-200 group">
              <span>{t.navKasp}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#5a52d9]" />
            </button>
          </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* Language Selector */}
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1 bg-white/60 hover:bg-white backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 transition-colors shadow-sm"
            >
              <Globe className="w-4 h-4 text-[#6d4be0]" />
              <span className="text-sm font-bold text-slate-700">{activeLang.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
            
            {isLangOpen && (
              <div className="absolute top-full mt-2 right-0 w-40 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden py-1 z-[100]">
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
            onClick={() => openAuthModal('worker')}
            className="flex items-center space-x-2 bg-[#7b5cf5] hover:bg-[#684be3] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-colors"
          >
            <User className="w-4 h-4" />
            <span>{t.navLogin}</span>
          </button>
        </div>
      </div>
    </nav>
    </div>
  );
};

