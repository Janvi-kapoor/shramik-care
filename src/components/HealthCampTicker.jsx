import React from 'react';
import { useApp } from '../context/AppContext';
import { ACTIVE_CAMPS_LIST } from '../data/mockDatabase';
import { MapPin, Clock, Stethoscope, AlertCircle, Sparkles } from 'lucide-react';

export const HealthCampTicker = () => {
  const { t, openAuthModal } = useApp();

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('campsHeading')}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t('campsHeading')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('campsSub')}
            </p>
          </div>

          <button
            onClick={() => openAuthModal('register')}
            className="self-start md:self-auto inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('ctaEnroll')}</span>
          </button>
        </div>

        {/* Camp Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {ACTIVE_CAMPS_LIST.map((camp) => {
            const isHighRisk = camp.riskStatus.includes('High');

            return (
              <div
                key={camp.id}
                className="bg-slate-50 hover:bg-white rounded-xl p-4 border border-slate-200 hover:border-teal-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      <span>{t('campStatusActive')}</span>
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      {camp.id}
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                    {camp.name}
                  </h4>

                  {/* Camp Venue & Timings */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 flex-shrink-0 mt-0.5" />
                      <span className="truncate">{camp.venue}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{camp.time}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                      <span>{camp.doctorInCharge}</span>
                    </div>
                  </div>

                  {/* Services Tag list */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {camp.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] font-medium border border-slate-200"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk & Expected Turnout */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500">
                    Expected: <strong className="text-slate-800">{camp.expectedTurnout} Workers</strong>
                  </span>

                  {isHighRisk && (
                    <span className="inline-flex items-center space-x-1 text-rose-700 font-bold">
                      <AlertCircle className="w-3 h-3" />
                      <span>High Risk Area</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
