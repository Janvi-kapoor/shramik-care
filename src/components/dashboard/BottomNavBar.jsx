import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Camera, 
  Clock, 
  ShieldCheck
} from 'lucide-react';

export const BottomNavBar = () => {
  const { activeDashboardTab, setActiveDashboardTab, t } = useApp();

  const tabs = [
    {
      id: 'passport',
      label: t('dashTabPassport'),
      icon: QrCode,
      activeColor: 'text-teal-800 bg-teal-50 border-teal-200/80',
      activeDot: 'bg-teal-600',
    },
    {
      id: 'scanner',
      label: t('dashTabScanner'),
      icon: Camera,
      badge: 'AI Rx',
      activeColor: 'text-amber-900 bg-amber-50 border-amber-300',
      activeDot: 'bg-amber-500',
    },
    {
      id: 'pills',
      label: t('dashTabPills'),
      icon: Clock,
      activeColor: 'text-emerald-900 bg-emerald-50 border-emerald-300',
      activeDot: 'bg-emerald-600',
    },
    {
      id: 'wallet',
      label: t('dashTabWallet'),
      icon: ShieldCheck,
      badge: '₹50K',
      activeColor: 'text-indigo-900 bg-indigo-50 border-indigo-200/80',
      activeDot: 'bg-indigo-600',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-1 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDashboardTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveDashboardTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? `${tab.activeColor} shadow-xs border font-bold`
                  : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              {tab.badge && (
                <span className={`absolute -top-1 right-1 text-[8px] font-black uppercase px-1 py-0.2 rounded-full leading-none shadow-xs ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-teal-700 text-white'
                }`}>
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
            </button>
          );
        })}
      </div>
    </nav>
  );
};
