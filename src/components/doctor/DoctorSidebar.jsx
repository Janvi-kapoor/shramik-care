import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  QrCode, 
  Languages, 
  ClipboardList, 
  Stethoscope, 
  ShieldCheck, 
  LogOut, 
  Home,
  MapPin,
  Users,
  AlertTriangle
} from 'lucide-react';

export const DoctorSidebar = ({ onReturnHome }) => {
  const { 
    activeSession, 
    selectedPatient,
    logout, 
    t 
  } = useApp();

  if (!activeSession || activeSession.role !== 'doctor') return null;
  const doctor = activeSession.user;

  const navItems = [
    {
      id: 'scanner',
      label: 'Live QR Scanner',
      subLabel: 'Webcam Lookup',
      badge: 'Scan',
      icon: QrCode,
    },
    {
      id: 'records',
      label: 'Clinical Record & Timeline',
      subLabel: 'Vitals & Allergies',
      badge: selectedPatient ? selectedPatient.bloodGroup : 'None',
      icon: ClipboardList,
    },
    {
      id: 'translator',
      label: '2-Way Voice Translator',
      subLabel: 'Malayalam ↔ Hindi/Bengali',
      badge: 'Live Mic',
      icon: Languages,
    },
    {
      id: 'analytics',
      label: 'Daily Screening Analytics',
      subLabel: 'Patient Counts & Logs',
      icon: LayoutDashboard,
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white border-r border-slate-200 shadow-xs h-screen sticky top-0 z-20 select-none">
      {/* 1. Header & KMC Emblem */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-none">
              Doctor Workstation
            </h1>
            <span className="text-[10px] font-bold text-teal-800 tracking-wider uppercase block mt-1">
              KMC Clinical Portal • Kerala
            </span>
          </div>
        </div>
      </div>

      {/* 2. Doctor Profile Card in Sidebar */}
      <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
          Dr
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-bold text-slate-900 truncate">
            {doctor.name}
          </h2>
          <div className="text-[10px] text-slate-500 font-mono">
            {doctor.kmcLicense}
          </div>
          <div className="text-[10px] font-semibold text-teal-800 truncate">
            {doctor.facility.split('&')[0]}
          </div>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block py-1">
          Clinical Navigation
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={`/doctor/${item.id}`}
              className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? 'bg-teal-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
              }`}
            >
              {({ isActive }) => (
                <>
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
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 4. Bottom Controls */}
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
