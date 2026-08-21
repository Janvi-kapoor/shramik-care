import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, LogOut, ShieldAlert, HardHat, Stethoscope, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppHeader = () => {
  const { activeSession, currentLanguage, setLanguage, logout, openAuthModal } = useApp();

  const renderBadge = () => {
    switch (activeSession?.role) {
      case 'worker':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded tracking-wider border border-blue-200">Guest Worker</span>;
      case 'doctor':
        return <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold uppercase rounded tracking-wider border border-teal-200">Medical Officer</span>;
      case 'admin':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold uppercase rounded tracking-wider border border-rose-200">Govt Command</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center shadow-inner group-hover:bg-teal-700 transition-colors">
            <ShieldAlert className="w-6 h-6 text-teal-50" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-teal-800 transition-colors">
              ShramikCare
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Kerala Migrant Health Ecosystem
            </span>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Unauthenticated Nav Links */}
          {!activeSession && (
            <div className="hidden md:flex items-center space-x-2 border-r border-slate-200 pr-6">
              <button 
                onClick={() => openAuthModal('worker')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <HardHat className="w-4 h-4" />
                <span>Worker Portal</span>
              </button>
              <button 
                onClick={() => openAuthModal('doctor')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Desk</span>
              </button>
              <button 
                onClick={() => openAuthModal('admin')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Building2 className="w-4 h-4" />
                <span>Govt Admin</span>
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
            <Globe className="w-4 h-4 text-slate-500" />
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="ml">മലയാളം (ML)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="bn">বাংলা (BN)</option>
            </select>
          </div>

          {/* Logged-in User Profile */}
          {activeSession && (
            <>
              <div className="hidden md:flex items-center space-x-3 border-l border-slate-200 pl-6">
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {activeSession.user.name}
                  </span>
                  {renderBadge()}
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold">
                  {activeSession.user.name.charAt(0)}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Secure Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
