import React from 'react';
import { useApp } from '../context/AppContext';
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
  const { openAuthModal, login } = useApp();

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-sans overflow-x-hidden pt-24 pb-12 relative">
      {/* Background Layer */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Base ultra-light background */}
        <div className="absolute inset-0 bg-[#f7f9ff]"></div>
        {/* Soft purple glow on the far left/top */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#e3d7ff] rounded-full blur-[120px] opacity-60"></div>
        {/* Pure white glowing center */}
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[80%] bg-white rounded-full blur-[100px] opacity-100 z-10"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* ================= HERO SECTION ================= */}
        <div className="flex flex-col lg:flex-row items-center pt-8 pb-32 lg:pb-40 relative">
          
          {/* Left Hero Content */}
          <div className="w-full lg:w-[50%] space-y-6 pr-0 lg:pr-12 relative z-20">
            
            <div className="inline-block px-4 py-1.5 rounded-md bg-[#eee7ff] text-[#6d4be0] text-sm font-bold shadow-sm backdrop-blur-sm border border-[#d6c9ff]/50">
              Kerala Migrant Health Ecosystem (KMHE)
            </div>

            <h1 className="text-4xl lg:text-[54px] font-extrabold text-[#1f2937] leading-[1.1] tracking-tight">
              Bridging Healthcare & <br /> Welfare for Kerala's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a32fa] to-[#8c6dfd]">Guest Workforce</span>
            </h1>

            <p className="text-gray-600 text-[17px] max-w-lg leading-relaxed">
              Portable digital health passports, 14-digit ABHA integration, and zero-friction AWAZ insurance linkage.
            </p>

            {/* Login Cards */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => openAuthModal('worker')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#ece5ff] to-[#f4efff] border border-[#d6c9ff] p-4 rounded-xl hover:shadow-md hover:scale-105 transition-all group text-left"
              >
                <div className="flex flex-col">
                  <User className="w-6 h-6 text-[#6d4be0] mb-2" />
                  <span className="text-[#3b2b73] font-bold text-[15px]">Worker Login</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#6d4be0] flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button 
                onClick={() => openAuthModal('doctor')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#296aff] to-[#5a93ff] p-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all group text-left"
              >
                <div className="flex flex-col">
                  <Stethoscope className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-bold text-[15px]">Doctor Login</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#296aff] group-hover:translate-x-1 transition-transform shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button 
                onClick={() => openAuthModal('admin')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#2cc299] to-[#5bd7b6] p-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all group text-left"
              >
                <div className="flex flex-col">
                  <Building2 className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-bold text-[15px] leading-tight">Government <br/>Portal</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#2cc299] group-hover:translate-x-1 transition-transform shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* 1-Click Demo Logins */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-sm font-semibold flex items-center text-slate-500">
                <Zap className="w-4 h-4 mr-1 text-slate-400" />
                1-Click Demo Logins:
              </span>
              
              <button 
                onClick={() => login('worker', { identifier: 'KL-MIG-78219' })}
                className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
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
                className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
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

          {/* Right Hero Image Layout (Blended & Large) */}
          <div className="absolute top-0 right-0 w-full lg:w-[65%] h-[115%] hidden lg:flex justify-end items-start z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-white/20 z-10 mask-fade"></div>
            <img 
              src="/hero-collage.jpg" 
              alt="ShramikCare Healthcare Ecosystem"
              className="w-full h-full object-cover object-left-top opacity-100"
              style={{
                // Extremely smooth left fade to blend perfectly into the center white area
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 5%, black 40%, black 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, transparent 5%, black 40%, black 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ================= MIDDLE BANNER ================= */}
      {/* Negative top margin to overlap the bottom curve of the hero area */}
      <div className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-8 mt-[-40px]">
        <div className="bg-[#242159] rounded-2xl shadow-xl flex flex-wrap justify-between items-center py-6 px-10 text-white gap-y-6">
          <div className="flex items-center space-x-4">
            <ShieldCheck className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">AWAZ Insurance</div>
              <div className="text-xs text-[#a9a6da]">1-click enrollment & <br/> cashless benefits</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>
          
          <div className="flex items-center space-x-4">
            <CreditCard className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">Digital Health Passport</div>
              <div className="text-xs text-[#a9a6da]">Portable records for <br/> lifetime</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          <div className="flex items-center space-x-4">
            <HeartPulse className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">14-Digit ABHA</div>
              <div className="text-xs text-[#a9a6da]">Seamless national <br/> health integration</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          <div className="flex items-center space-x-4">
            <Hospital className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">Interstate Portability</div>
              <div className="text-xs text-[#a9a6da]">Care anywhere, <br/> anytime</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block"></div>

          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 text-[#d4d1fb] opacity-80" />
            <div>
              <div className="font-bold text-[15px]">Welfare Support</div>
              <div className="text-xs text-[#a9a6da]">Karunya & other benefits <br/> at your fingertips</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 mt-16 text-center">
        <h2 className="text-2xl font-bold text-[#1f2937] mb-8">
          A Health Bridge for <span className="border-b-2 border-[#6d4be0]">Kerala's Guest Workforce</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <FileMinus className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">No Portable Records</h3>
            <p className="text-gray-500 text-[13px] leading-tight">Health data gets lost when workers move.</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">High Out-of-Pocket</h3>
            <p className="text-gray-500 text-[13px] leading-tight">Unexpected medical expenses cause hardship.</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <MessagesSquare className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">Language & Access</h3>
            <p className="text-gray-500 text-[13px] leading-tight">Communication gaps & complex processes.</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug">Low Insurance Coverage</h3>
            <p className="text-gray-500 text-[13px] leading-tight">Awareness & enrollment remain very low.</p>
          </div>

          <div className="bg-[#ede7fc] border border-[#d6c9ff] p-6 rounded-2xl shadow-sm hover:shadow-md text-left flex flex-col items-start transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-[#6d4be0]" />
            </div>
            <h3 className="font-bold text-[#3b2b73] text-[15px] mb-2 leading-snug">ShramikCare Solution</h3>
            <p className="text-[#594d8a] text-[13px] leading-tight">One platform. Many benefits. Better health. Dignified life.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};
