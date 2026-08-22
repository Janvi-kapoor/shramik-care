import React from 'react';
import { useApp } from '../context/AppContext';
import { landingTranslations } from './translations';
import { 
  ArrowRight, 
  User, 
  Stethoscope, 
  Building2, 
  Zap,
  ShieldCheck,
  CreditCard,
  HeartPulse,
  Hospital,
  Users,
  FileMinus,
  Wallet,
  MessagesSquare,
  AlertTriangle,
  Heart
} from 'lucide-react';

export const LandingAuthPage = () => {
  const { openAuthModal, login, currentLanguage } = useApp();
  
  // Safe fallback to English if translation is missing
  const t = landingTranslations[currentLanguage] || landingTranslations['en'];

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-sans overflow-x-hidden pt-[92px] pb-12 relative">
      {/* Background Layer (Clean & Constrained Glow) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#f7f9ff]"></div>
        {/* Soft purple glow on the far left */}
        <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] bg-[#e3d7ff] rounded-full blur-[100px] opacity-60"></div>
        {/* Pure white glowing center transition */}
        <div className="absolute top-[10%] left-[35%] w-[30%] h-[80%] bg-white rounded-full blur-[80px] opacity-100 z-10"></div>
      </div>

      {/* Absolute Image Layout - Flushed Right and touching Header exactly at 92px */}
      <div className="absolute top-[92px] right-0 w-[55vw] max-w-[950px] h-[520px] z-10 hidden lg:block pointer-events-none overflow-hidden">
        <img 
          src="/hero-collage.jpg" 
          alt="ShramikCare Hero Collage"
          className="w-full h-full object-cover object-left-top"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%)',
          }}
        />
      </div>

      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* ================= HERO SECTION ================= */}
        <div className="flex flex-col lg:flex-row items-center pt-8 pb-16 lg:pb-24">
          
          {/* Left Hero Content */}
          <div className="w-full lg:w-[50%] space-y-6 pr-0 lg:pr-12 relative pointer-events-auto">
            
            <div className="inline-block px-4 py-1.5 rounded-md bg-[#eee7ff] text-[#6d4be0] text-sm font-bold shadow-sm backdrop-blur-sm border border-[#d6c9ff]/50">
              {t.badge}
            </div>

            <h1 className="text-4xl lg:text-[54px] font-extrabold text-[#1f2937] leading-[1.1] tracking-tight">
              {t.title1} <br /> {t.title2} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a32fa] to-[#8c6dfd]">{t.titleHighlight}</span>
            </h1>

            <p className="text-gray-600 text-[17px] max-w-lg leading-relaxed">
              {t.subtitle}
            </p>

            {/* Login Cards */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => openAuthModal('worker')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#ece5ff] to-[#f4efff] border border-[#d6c9ff] p-4 rounded-xl hover:shadow-md transition-shadow group text-left hover:scale-105"
              >
                <div className="flex flex-col">
                  <User className="w-6 h-6 text-[#6d4be0] mb-2" />
                  <span className="text-[#3b2b73] font-bold text-[15px]">{t.workerLogin}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#6d4be0] flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button 
                onClick={() => openAuthModal('doctor')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#296aff] to-[#5a93ff] p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow group text-left hover:scale-105"
              >
                <div className="flex flex-col">
                  <Stethoscope className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-bold text-[15px]">{t.doctorLogin}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#296aff] group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button 
                onClick={() => openAuthModal('admin')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#2cc299] to-[#5bd7b6] p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow group text-left hover:scale-105"
              >
                <div className="flex flex-col">
                  <Building2 className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-bold text-[15px] leading-tight whitespace-pre-line">{t.adminLogin}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#2cc299] group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* 1-Click Demo Logins */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-sm font-semibold flex items-center text-slate-500">
                <Zap className="w-4 h-4 mr-1 text-slate-400" />
                {t.demoLogins}
              </span>
              
              <button 
                onClick={() => login('worker', { identifier: 'KL-MIG-78219' })}
                className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors pointer-events-auto"
              >
                <div className="w-6 h-6 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold">
                  R
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-bold text-slate-800">Ramesh Kumar</div>
                  <div className="text-[10px] text-slate-500">(Ernakulam Hub)</div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>

              <button 
                onClick={() => login('worker', { identifier: 'KL-MIG-88412' })}
                className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors pointer-events-auto"
              >
                <div className="w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-xs font-bold">
                  B
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-bold text-slate-800">Bikash Mondal</div>
                  <div className="text-[10px] text-slate-500">(Bengali)</div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
          
          {/* Right Space placeholder (Since image is absolute) */}
          <div className="w-full lg:w-[50%] hidden lg:block"></div>
        </div>
      </div>

      {/* Hero Bottom Elegant Wave SVG */}
      <div className="absolute w-full left-0 bottom-[100px] z-10 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#f8f9ff" />
        </svg>
      </div>

      {/* ================= MIDDLE BANNER ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-8 -mt-16">
        <div className="bg-[#242159] rounded-2xl shadow-xl flex flex-wrap justify-between items-center py-6 px-10 text-white gap-y-6">
          <div className="flex items-center space-x-4">
            <ShieldCheck className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">{t.awaz}</div>
              <div className="text-xs text-[#a9a6da] whitespace-pre-line">{t.awazSub}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>
          
          <div className="flex items-center space-x-4">
            <CreditCard className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">{t.passport}</div>
              <div className="text-xs text-[#a9a6da] whitespace-pre-line">{t.passportSub}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          <div className="flex items-center space-x-4">
            <HeartPulse className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">{t.abha}</div>
              <div className="text-xs text-[#a9a6da] whitespace-pre-line">{t.abhaSub}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          <div className="flex items-center space-x-4">
            <Hospital className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">{t.portability}</div>
              <div className="text-xs text-[#a9a6da] whitespace-pre-line">{t.portabilitySub}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">{t.welfare}</div>
              <div className="text-xs text-[#a9a6da] whitespace-pre-line">{t.welfareSub}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM CARDS SECTION ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-8 mt-16 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 inline-block relative">
          {t.bridgeTitle}
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#6d4be0] to-[#b39ff7] rounded-full opacity-70"></div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <FileMinus className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">{t.card1Title}</h3>
            <p className="text-gray-500 text-[13px] leading-tight">{t.card1Sub}</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">{t.card2Title}</h3>
            <p className="text-gray-500 text-[13px] leading-tight">{t.card2Sub}</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <MessagesSquare className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">{t.card3Title}</h3>
            <p className="text-gray-500 text-[13px] leading-tight">{t.card3Sub}</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">{t.card4Title}</h3>
            <p className="text-gray-500 text-[13px] leading-tight">{t.card4Sub}</p>
          </div>

          <div className="bg-[#ede7fc] border border-[#d6c9ff] p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-[#6d4be0]" />
            </div>
            <h3 className="font-bold text-[#3b2b73] text-[15px] mb-2 leading-snug">{t.card5Title}</h3>
            <p className="text-[#594d8a] text-[13px] leading-tight">{t.card5Sub}</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};
