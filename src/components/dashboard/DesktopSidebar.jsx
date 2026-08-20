import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Camera, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Pill, 
  PhoneCall, 
  LogOut,
  Sparkles,
  HeartPulse,
  Home
} from 'lucide-react';

export const DesktopSidebar = ({ onReturnHome }) => {
  const { 
    activeDashboardTab, 
    setActiveDashboardTab, 
    activeSession, 
    setIsHospitalModalOpen, 
    setIsJanAushadhiModalOpen,
    logout, 
    t 
  } = useApp();

  if (!activeSession) return null;
  const worker = activeSession.user;
  const activeDistrict = worker.district || worker.keralaDistrict || 'Ernakulam';

  const navItems = [
    {
      id: 'passport',
      label: t('dashTabPassport'),
      subLabel: 'ABHA & Digital ID',
      icon: QrCode,
    },
    {
      id: 'scanner',
      label: t('dashTabScanner'),
      subLabel: 'Real AI OCR Engine',
      badge: 'Tesseract',
      icon: Camera,
    },
    {
      id: 'pills',
      label: t('dashTabPills'),
      subLabel: 'Voice Guidance Audio',
      icon: Clock,
    },
    {
      id: 'wallet',
      label: t('dashTabWallet'),
      subLabel: 'AWAZ Insurance Ledger',
      badge: '₹50,000',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white border-r border-slate-200 shadow-xs h-screen sticky top-0 z-20 select-none">
      {/* 1. Header & Govt Emblem */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D5C52] to-[#042F2E] flex items-center justify-center text-amber-400 shadow-md">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
              ShramikCare
            </h1>
            <span className="text-[10px] font-bold text-teal-800 tracking-wider uppercase block mt-1">
              ശ്രമിക് കെയർ • Kerala DHS
            </span>
          </div>
        </div>
      </div>

      {/* 2. Worker Profile Card in Sidebar */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-800 to-emerald-700 flex items-center justify-center text-white font-black text-sm shadow-xs">
            {worker.name.charAt(0)}
          </div>
          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[8px]">
            {worker.bloodGroup}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-bold text-slate-900 truncate">
            {worker.name}
          </h2>
          <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono">
            <span>{worker.id}</span>
          </div>
          <div className="inline-flex items-center space-x-0.5 text-[9px] font-bold text-teal-800">
            <MapPin className="w-2.5 h-2.5 text-teal-600" />
            <span>{activeDistrict}</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block py-1">
          Health Management
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeDashboardTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveDashboardTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? 'bg-teal-800 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isActive ? 'text-amber-300 scale-110' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <div className="truncate">
                  <span className="text-xs block leading-tight truncate">
                    {item.label}
                  </span>
                  <span className={`text-[10px] block truncate ${isActive ? 'text-teal-200' : 'text-slate-400'}`}>
                    {item.subLabel}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block py-1">
            Quick District Services
          </span>

          <button
            onClick={() => setIsHospitalModalOpen(true)}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-900 transition-colors"
          >
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>AWAZ Hospitals ({activeDistrict})</span>
          </button>

          <button
            onClick={() => setIsJanAushadhiModalOpen(true)}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
          >
            <Pill className="w-4 h-4 text-emerald-700" />
            <span>Jan Aushadhi Stores</span>
          </button>
        </div>
      </nav>

      {/* 4. Bottom Controls: Return to Landing & Sign Out */}
      <div className="p-3 border-t border-slate-100 space-y-1.5 bg-slate-50/50">
        {onReturnHome && (
          <button
            onClick={onReturnHome}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>{t('backToHome')}</span>
          </button>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </aside>
  );
};
