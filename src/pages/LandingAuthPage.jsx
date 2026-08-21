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
      {/* Background Gradient & Shape Layer */}
      <div 
        className="absolute top-0 right-0 w-[55%] h-[700px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #a78bfa 0%, #7b5cf5 100%)',
          clipPath: 'path("M0,0 L1000,0 L1000,700 Q500,800 0,600 Z")', // Approximate wave shape
          zIndex: 0,
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Kerala Health" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#7b5cf5]/80"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* ================= HERO SECTION ================= */}
        <div className="flex flex-col lg:flex-row items-center pt-8 pb-16 lg:pb-24">
          
          {/* Left Hero Content */}
          <div className="w-full lg:w-[50%] space-y-6 pr-0 lg:pr-12">
            
            <div className="inline-block px-4 py-1.5 rounded-md bg-[#eee7ff] text-[#6d4be0] text-sm font-bold shadow-sm">
              Kerala Migrant Health Ecosystem (KMHE)
            </div>

            <h1 className="text-4xl lg:text-[54px] font-extrabold text-[#1f2937] leading-[1.1] tracking-tight">
              Bridging Healthcare & <br /> Welfare for Kerala's <br />
              <span className="text-[#6d4be0]">Guest Workforce</span>
            </h1>

            <p className="text-gray-600 text-[17px] max-w-lg leading-relaxed">
              Portable digital health passports, 14-digit ABHA integration, and zero-friction AWAZ insurance linkage.
            </p>

            {/* Login Cards */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => openAuthModal('worker')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#ece5ff] to-[#f4efff] border border-[#d6c9ff] p-4 rounded-xl hover:shadow-md transition-shadow group text-left"
              >
                <div className="flex flex-col">
                  <User className="w-6 h-6 text-[#6d4be0] mb-2" />
                  <span className="text-[#3b2b73] font-bold text-[15px]">Worker Login</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#6d4be0] flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button 
                onClick={() => openAuthModal('doctor')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#296aff] to-[#5a93ff] p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow group text-left"
              >
                <div className="flex flex-col">
                  <Stethoscope className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-bold text-[15px]">Doctor Login</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#296aff] group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button 
                onClick={() => openAuthModal('admin')}
                className="flex items-center justify-between w-48 bg-gradient-to-br from-[#2cc299] to-[#5bd7b6] p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow group text-left"
              >
                <div className="flex flex-col">
                  <Building2 className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-bold text-[15px] leading-tight">Government <br/>Portal</span>
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
                1-Click Demo Logins:
              </span>
              
              <button 
                onClick={() => login('worker', { identifier: 'KL-MIG-78219' })}
                className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
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
                className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
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
          
          {/* Right Hero Image Layout */}
          <div className="w-full lg:w-[50%] mt-12 lg:mt-0 relative hidden lg:block">
            {/* Using the uploaded image precisely if needed, or approximating collage via standard img tag with exact border radius */}
            <img 
              src="/placeholder_right_collage.jpg" 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
              alt="Collage"
              className="w-full rounded-tl-full rounded-bl-full shadow-2xl object-cover"
              style={{ clipPath: 'path("M 50,0 C 150,0 200,100 250,200 C 300,300 150,400 50,500 L 500,500 L 500,0 Z")' }} // Fallback if custom SVG masking is needed
            />
          </div>
        </div>
      </div>

      {/* ================= MIDDLE BANNER ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-8 -mt-6">
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
