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
      id: 'dashboard',
      label: 'Doctor Dashboard',
      subLabel: 'Today and assigned camps',
      icon: LayoutDashboard,
    },
    {
      id: 'scanner',
      label: 'Scan Worker',
      subLabel: 'Worker Health ID QR',
      badge: 'Scan',
      icon: QrCode,
    },
    {
      id: 'patients',
      label: 'Patient Medical Reports',
      subLabel: 'Authorized worker records',
      badge: selectedPatient ? 'Open' : '',
      icon: ClipboardList,
    },
    {
      id: 'translator',
      label: 'Communication',
      subLabel: 'Two-way voice translation',
      icon: Languages,
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-gradient-to-b from-[#3934b1] via-[#5a52d9] to-[#8c85fa] fixed top-[92px] bottom-0 left-0 z-40 select-none text-white shadow-xl rounded-br-3xl">
      {/* 1. Header & KMC Emblem */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#3934b1] flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-none">
              ShramikCare Doctor
            </h1>
            <span className="text-[10px] font-bold text-indigo-200 tracking-wider uppercase block mt-1">
              KMC Clinical Portal • Kerala
            </span>
          </div>
        </div>
      </div>

      {/* 2. Doctor Profile Card in Sidebar */}
      <div className="p-3.5 mx-3 my-3 rounded-xl bg-white/10 border border-white/15 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-white text-[#5a52d9] flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
          Dr
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-bold text-white truncate">
            {doctor.name}
          </h2>
          <div className="text-[10px] text-indigo-100 font-mono">
            {doctor.kmcLicense}
          </div>
          <div className="text-[10px] font-semibold text-indigo-100 truncate">
            {doctor.facility.split('&')[0]}
          </div>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold text-indigo-200 uppercase tracking-wider block py-1">
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
                  ? 'bg-white text-[#5a52d9] font-bold shadow-lg shadow-indigo-900/20'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white font-semibold'
              }`}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                        isActive ? 'text-[#5a52d9] scale-110' : 'text-indigo-200 group-hover:text-white'
                      }`}
                    />
                    <div className="truncate">
                      <span className="text-xs block leading-tight truncate">
                        {item.label}
                      </span>
                      <span className={`text-[10px] block truncate ${isActive ? 'text-indigo-500' : 'text-indigo-200'}`}>
                        {item.subLabel}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-white/15 text-indigo-100'
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
      <div className="p-3 border-t border-white/10 space-y-1.5 bg-black/10">
        {onReturnHome && (
          <button
            onClick={onReturnHome}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-100 hover:bg-white hover:text-slate-900 transition-colors"
          >
            <Home className="w-4 h-4 text-indigo-200" />
            <span>{t('backToHome')}</span>
          </button>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-200 hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </aside>
  );
};
