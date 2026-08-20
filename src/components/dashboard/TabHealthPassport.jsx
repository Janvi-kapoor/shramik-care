import React from 'react';
import { useApp } from '../../context/AppContext';
import { WorkerHealthCard } from '../WorkerHealthCard';
import { 
  Activity, 
  Camera, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Phone, 
  ShieldCheck,
  Building2,
  HeartPulse
} from 'lucide-react';

export const TabHealthPassport = () => {
  const { activeSession, setActiveDashboardTab, t } = useApp();

  if (!activeSession || activeSession.role !== 'worker') return null;
  const worker = activeSession.user;
  const vitals = worker.vitals || {
    bp: "120/80 mmHg",
    bloodSugar: "94 mg/dL",
    pulse: "72 bpm",
    spO2: "99%",
    lastUpdated: "Camp Checkup"
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Digital Health Passport Card */}
      <div className="relative">
        <WorkerHealthCard worker={worker} />
      </div>

      {/* 2. Emergency SOS Rapid Action Strip */}
      <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-4 md:p-5">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-700 mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
          <span>{t('emergencySosTitle')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* DISHA 1056 */}
          <a
            href="tel:1056"
            className="p-3 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-center transition-colors block"
          >
            <span className="text-xl block mb-0.5">📞</span>
            <span className="text-xs font-bold text-rose-950 block">DISHA 1056</span>
            <span className="text-[10px] text-rose-700 block truncate">
              {t('sosDishaLabel')}
            </span>
          </a>

          {/* Ambulance 108 */}
          <a
            href="tel:108"
            className="p-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-center transition-colors block"
          >
            <span className="text-xl block mb-0.5">🚑</span>
            <span className="text-xs font-bold text-amber-950 block">Ambulance 108</span>
            <span className="text-[10px] text-amber-800 block truncate">
              {t('sosAmbulanceLabel')}
            </span>
          </a>

          {/* Labour Helpline 155214 */}
          <a
            href="tel:155214"
            className="p-3 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-center transition-colors block"
          >
            <span className="text-xl block mb-0.5">👮</span>
            <span className="text-xs font-bold text-teal-950 block">Labour 155214</span>
            <span className="text-[10px] text-teal-700 block truncate">
              {t('sosLabourLabel')}
            </span>
          </a>

          {/* Emergency Contact */}
          <a
            href={`tel:${worker.emergencyContact?.phone || '1056'}`}
            className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-center transition-colors block"
          >
            <span className="text-xl block mb-0.5">👨‍👩‍👦</span>
            <span className="text-xs font-bold text-slate-900 block truncate">
              {worker.emergencyContact?.name?.split(' ')[0] || 'Emergency'}
            </span>
            <span className="text-[10px] text-slate-600 font-mono block truncate">
              {worker.emergencyContact?.phone || 'Call Family'}
            </span>
          </a>
        </div>
      </div>

      {/* 3. Screening Vitals Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm md:text-base font-bold text-slate-900">
              {t('vitalsTitle')}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {vitals.lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              {t('vitalsBp')}
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {vitals.bp}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              {t('vitalsSugar')}
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {vitals.bloodSugar}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              {t('vitalsPulse')}
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {vitals.pulse}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              {t('vitalsSpo2')}
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {vitals.spO2}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            <span>{t('campCheckupTitle')}: <strong className="text-slate-800">{worker.lastCampCheckup}</strong></span>
          </span>
          <span className="text-emerald-700 font-bold hidden sm:inline">
            ✓ Fit for Work
          </span>
        </div>
      </div>

      {/* 4. Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveDashboardTab('scanner')}
          className="p-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white flex items-center justify-between shadow-sm transition-colors text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-teal-700 text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-teal-200 uppercase tracking-wider block">
                OCR Prescription Digitizer
              </span>
              <span className="text-sm font-bold text-white">
                Live AI Rx Scanner 📸
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setActiveDashboardTab('pills')}
          className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-between shadow-sm transition-colors text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Native Speech Audio Reminders
              </span>
              <span className="text-sm font-bold text-white">
                Voice Pill-Clock 💊
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
