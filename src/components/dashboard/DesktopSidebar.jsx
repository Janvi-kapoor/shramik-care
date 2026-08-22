import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  UserCircle2,
  Bell,
  IdCard,
  Pill,
  Mic,
  ShieldCheck
} from 'lucide-react';

export const DesktopSidebar = () => {
  const { activeSession, t } = useApp();

  if (!activeSession) return null;

  const navItems = [
    {
      id: 'health-id',
      label: t('wpMyHealthId', 'My Health ID'),
      icon: IdCard,
    },
    {
      id: 'medicines',
      label: t('wpMedicines', 'My Medicines'),
      icon: Pill,
    },
    {
      id: 'voice-care',
      label: t('wpVoiceCare', 'Voice Care'),
      icon: Mic,
    },
    {
      id: 'schemes',
      label: t('wpSchemes', 'Schemes & Benefits'),
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="hidden md:flex md:w-[260px] lg:w-[280px] flex-col bg-gradient-to-b from-[#3934b1] via-[#5a52d9] to-[#8c85fa] fixed top-[92px] bottom-0 left-0 z-40 select-none text-white shadow-xl rounded-br-3xl">
      <div className="p-6">
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={`/worker/${item.id}`}
                className={({ isActive }) => `w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 font-semibold ${
                  isActive
                    ? 'bg-white text-[#5a52d9] shadow-lg shadow-indigo-900/20'
                    : 'text-indigo-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

    </aside>
  );
};
