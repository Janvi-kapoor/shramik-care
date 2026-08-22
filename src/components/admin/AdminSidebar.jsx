import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Megaphone,
  Bus,
  ClipboardList,
  ChevronRight
} from 'lucide-react';

export const AdminSidebar = () => {

  const navItems = [
    {
      id: 'overview',
      label: 'Public Health Dashboard',
      icon: <Activity className="w-5 h-5" />
    },
    {
      id: 'advisories',
      label: 'Health Alerts & Advisories',
      icon: <Megaphone className="w-5 h-5" />
    },
    {
      id: 'camps',
      label: 'Health Camps & Resources',
      icon: <Bus className="w-5 h-5" />
    },
    {
      id: 'operations',
      label: 'Camp & Public Health Operations',
      icon: <ClipboardList className="w-5 h-5" />
    }
  ];

  return (
    <>
    <div className="hidden md:flex md:w-[260px] lg:w-[280px] bg-gradient-to-b from-[#3934b1] via-[#5a52d9] to-[#8c85fa] fixed top-[92px] bottom-0 left-0 z-40 flex-col shadow-xl rounded-br-3xl text-white">
      <div className="p-5 border-b border-white/10">
        <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">
          District Operations
        </h3>
        <p className="text-sm font-semibold text-white">
          Public Health Portal
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-5 space-y-2">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.id}
              to={`/admin/${item.id}`}
              className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-white text-[#5a52d9] shadow-lg border border-white'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 py-2 flex justify-around">
      {navItems.map(item => <NavLink key={item.id} to={`/admin/${item.id}`} className={({ isActive }) => `flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${isActive ? 'text-[#5a32fa] bg-indigo-50' : 'text-slate-500'}`}>{React.cloneElement(item.icon, { className: 'w-4 h-4' })}<span>{item.label.split(' ')[0]}</span></NavLink>)}
    </nav>
    </>
  );
};
