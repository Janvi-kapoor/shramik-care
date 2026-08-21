import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  QrCode, 
  Languages, 
  ClipboardList 
} from 'lucide-react';

export const DoctorBottomNav = () => {

  const tabs = [
    {
      id: 'analytics',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'scanner',
      label: 'Patient QR',
      icon: QrCode,
    },
    {
      id: 'translator',
      label: 'Translator',
      badge: 'Mic',
      icon: Languages,
    },
    {
      id: 'records',
      label: 'Registry',
      icon: ClipboardList,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-1 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.id}
              to={`/doctor/${tab.id}`}
              className={({ isActive }) => `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-teal-900 bg-teal-50 border border-teal-200 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              {({ isActive }) => (
                <>
                  {tab.badge && (
                    <span className="absolute -top-1 right-1 text-[8px] font-black uppercase px-1 py-0.2 rounded-full leading-none shadow-xs bg-amber-500 text-slate-950">
                      {tab.badge}
                    </span>
                  )}

                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                    }`}
                  />

                  <span className={`text-[10px] mt-0.5 tracking-tight ${
                    isActive ? 'font-bold' : 'font-semibold'
                  }`}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
