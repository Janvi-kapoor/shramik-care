import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Bus, 
  Megaphone, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminSidebar = () => {

  const navItems = [
    {
      id: 'heatmap',
      label: 'Disease Outbreak Heatmap',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'dispatch',
      label: 'Camp Dispatcher',
      icon: <Bus className="w-5 h-5" />
    },
    {
      id: 'broadcast',
      label: 'Alert Broadcast Engine',
      icon: <Megaphone className="w-5 h-5" />
    },
    {
      id: 'claims',
      label: 'AWAZ Claim Settlement',
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          Command Center
        </h3>
        <p className="text-sm font-semibold text-slate-900">
          Govt of Kerala Health Cell
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.id}
              to={`/admin/${item.id}`}
              className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-rose-50 text-rose-800 shadow-sm border border-rose-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
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
  );
};
