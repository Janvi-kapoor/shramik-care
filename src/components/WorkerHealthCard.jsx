import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  QrCode, 
  Heart, 
  AlertOctagon, 
  Phone, 
  MapPin, 
  Building, 
  Printer, 
  CheckCircle2, 
  Copy,
  Sparkles,
  Volume2
} from 'lucide-react';

export const WorkerHealthCard = ({ worker, isModalView = false, onProceed }) => {
  const { t, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!worker) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(worker.id);
    setCopied(true);
    showToast(`Health ID ${worker.id} copied to clipboard!`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate SVG QR Matrix Pattern based on worker ID string
  const generateQrCells = () => {
    const seed = (worker.id + worker.abhaId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const cells = [];
    const size = 11;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Static corners
        const isCorner = (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
        const isPattern = ((r * size + c + seed) * 17) % 3 === 0;
        cells.push({ r, c, active: isCorner || isPattern });
      }
    }
    return { cells, size };
  };

  const { cells, size } = generateQrCells();

  return (
    <div className={`w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/60 transition-all ${
      isModalView ? 'bg-white' : 'bg-white/95 backdrop-blur-md'
    }`}>
      {/* Top Header Ribbon: Deep Coastal Teal with Kasavu Gold accent */}
      <div className="bg-gradient-to-r from-[#042F2E] via-[#0D5C52] to-[#064E3B] text-white p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-teal-400/10 pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-400/15 pointer-events-none"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-300 uppercase">
                  Govt. of Kerala
                </span>
                <span className="text-[9px] sm:text-[10px] bg-teal-800/80 text-teal-200 px-2 py-0.5 rounded-full border border-teal-600/40">
                  KMHE • Ayushman Bharat
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white mt-0.5">
                Digital Migrant Health Passport
              </h3>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] block font-mono text-teal-200">VALID ACROSS KERALA</span>
            <span className="text-xs font-bold text-amber-300">Arogyakeralam</span>
          </div>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-4 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-100">
          {/* Avatar & Worker Info */}
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-md border-2 border-white">
                {worker.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] shadow">
                {worker.bloodGroup}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {worker.name}
                </h4>
                {worker.audioLanguage && (
                  <span className="p-1 rounded-full bg-slate-100 text-teal-700 hover:bg-teal-50" title={`Language: ${worker.audioLanguage.toUpperCase()}`}>
                    <Volume2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {worker.nameNative && worker.nameNative !== worker.name && (
                <span className="text-xs sm:text-sm font-semibold text-slate-500 block">
                  {worker.nameNative}
                </span>
              )}

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs text-slate-600">
                <span className="font-semibold">{worker.age} Yrs • {worker.gender}</span>
                <span>•</span>
                <span className="inline-flex items-center text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                  From: {worker.originState}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-inner flex-shrink-0">
            {/* Custom SVG QR Display */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
              <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full text-slate-900">
                {cells.map((cell, idx) => (
                  <rect
                    key={idx}
                    x={cell.c}
                    y={cell.r}
                    width="1"
                    height="1"
                    fill={cell.active ? '#064E3B' : '#FFFFFF'}
                  />
                ))}
              </svg>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-500 sm:mt-1 uppercase">
              SCAN TO TRIAGE
            </span>
          </div>
        </div>

        {/* IDs & Core Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-4 sm:my-5">
          {/* Health Bridge ID */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                Kerala Health Bridge ID
              </span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-teal-950">
                {worker.id}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="p-1.5 rounded-lg hover:bg-teal-200/60 active:bg-teal-300 text-teal-700 transition-colors"
              title="Copy ID"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* 14-Digit ABHA ID */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Ayushman Bharat ABHA ID
              </span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-950">
                {worker.abhaId || '91-4820-1928-4410'}
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          </div>
        </div>

        {/* Worksite, Allergies & Emergency Contact */}
        <div className="space-y-2.5 sm:space-y-3 text-xs">
          {/* Worksite & Kerala District */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
            <Building className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-slate-500 uppercase text-[10px] block">Kerala Worksite</span>
              <span className="font-semibold text-slate-800">{worker.worksite} ({worker.keralaDistrict})</span>
            </div>
          </div>

          {/* Allergies Alert */}
          {worker.allergies && worker.allergies.length > 0 && !worker.allergies.includes('None') && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start space-x-3 text-rose-900">
              <AlertOctagon className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0 animate-pulse" />
              <div className="flex-1">
                <span className="font-bold text-rose-700 uppercase text-[10px] block">Critical Allergies Alert</span>
                <span className="font-bold text-rose-900">{worker.allergies.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {worker.emergencyContact && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
              <Phone className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 flex justify-between items-center flex-wrap gap-1">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Emergency Contact</span>
                  <span className="font-semibold text-slate-800">{worker.emergencyContact.name}</span>
                </div>
                <a
                  href={`tel:${worker.emergencyContact.phone}`}
                  className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
                >
                  {worker.emergencyContact.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons (High Contrast Bug-free states) */}
        <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs transition-colors duration-150"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('btnPrintPass')}</span>
          </button>

          {onProceed && (
            <button
              onClick={onProceed}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-colors duration-200 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{t('btnViewPassport')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
