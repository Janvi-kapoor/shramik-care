import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, User, Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', script: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', script: 'HI' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', script: 'BN' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', script: 'ML' }
];

export const LandingNavbar = () => {
  const { openAuthModal, currentLanguage, setLanguage } = useApp();
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Find active language safely
  const activeLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent px-4 sm:px-8 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-[#3934b1]">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M48.5 22C43.8 22 40 25.8 40 30.5C40 35.2 43.8 39 48.5 39C53.2 39 57 35.2 57 30.5C57 25.8 53.2 22 48.5 22ZM29.5 41C24.8 41 21 44.8 21 49.5C21 54.2 24.8 58 29.5 58C34.2 58 38 54.2 38 49.5C38 44.8 34.2 41 29.5 41ZM67.5 41C62.8 41 59 44.8 59 49.5C59 54.2 62.8 58 67.5 58C72.2 58 76 54.2 76 49.5C76 44.8 72.2 41 67.5 41ZM48.5 60C43.8 60 40 63.8 40 68.5C40 73.2 43.8 77 48.5 77C53.2 77 57 73.2 57 68.5C57 63.8 53.2 60 48.5 60ZM48.5 43C44.9 43 42 45.9 42 49.5C42 53.1 44.9 56 48.5 56C52.1 56 55 53.1 55 49.5C55 45.9 52.1 43 48.5 43ZM28.5 30.5C28.5 28 30.5 26 33 26C35.5 26 37.5 28 37.5 30.5C37.5 33 35.5 35 33 35C30.5 35 28.5 33 28.5 30.5ZM64 30.5C64 28 66 26 68.5 26C71 26 73 28 73 30.5C73 33 71 35 68.5 35C66 35 64 33 64 30.5ZM28.5 68.5C28.5 66 30.5 64 33 64C35.5 64 37.5 66 37.5 68.5C37.5 71 35.5 73 33 73C30.5 73 28.5 71 28.5 68.5ZM64 68.5C64 66 66 64 68.5 64C71 64 73 66 73 68.5C73 71 71 73 68.5 73C66 73 64 71 64 68.5Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[#3934b1] font-extrabold text-xl leading-tight">ShramikCare</h1>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-medium">
              <span className="font-malayalam font-bold text-[#635dc9]">ശ്രമിക് കെയർ</span>
              <span>•</span>
              <span>Interstate Migrant Health Bridge</span>
            </div>
          </div>
        </div>

        {/* Center Links (Hidden on small) */}
        <div className="hidden lg:flex items-center space-x-10 text-sm font-bold text-[#1f2937]">
          <a href="#" className="hover:text-[#6a54d5]">AWAZ Scheme</a>
          <button className="flex items-center space-x-1 hover:text-[#6a54d5]">
            <span>KASP (Karunya)</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="hidden sm:flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>{activeLang.label}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
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
            <span>Portal Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
