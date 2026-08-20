import React from 'react';
import { useApp } from '../../context/AppContext';
import { JAN_AUSHADHI_KENDRAS } from '../../data/mockDatabase';
import { 
  X, 
  Pill, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Navigation,
  Percent,
  AlertCircle
} from 'lucide-react';

export const JanAushadhiModal = () => {
  const { isJanAushadhiModalOpen, setIsJanAushadhiModalOpen, activeSession, t } = useApp();

  if (!isJanAushadhiModalOpen || !activeSession) return null;

  const worker = activeSession.user;
  const activeDistrict = worker.district || worker.keralaDistrict || 'Ernakulam';

  // STRICT DISTRICT FILTERING: Only show Jan Aushadhi stores in the active worker's district
  const districtPharmacies = JAN_AUSHADHI_KENDRAS.filter(
    (k) => k.district.toLowerCase() === activeDistrict.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: Kasavu Gold / Emerald */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-[#064E3B] text-white p-5 sm:p-6 pb-4 relative flex-shrink-0">
          <button
            onClick={() => setIsJanAushadhiModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <Pill className="w-4 h-4" />
            <span>PM Jan Aushadhi Pariyojana • Certified Generics</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t('janAushadhiModalTitle')} <span className="text-amber-300">{activeDistrict}</span>
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            {t('janAushadhiModalSub')}
          </p>

          {/* District Lock Filter Banner */}
          <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-teal-950/60 border border-teal-600/40 text-[11px] font-semibold text-teal-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('filterNotice')} <strong className="text-white">{activeDistrict} District</strong> ({districtPharmacies.length} Stores Available)</span>
          </div>
        </div>

        {/* Pharmacy Stores List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {districtPharmacies.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="font-bold text-sm">No Jan Aushadhi pharmacies listed for {activeDistrict}.</p>
              <p className="text-xs mt-1">Please ask your camp coordinator for the nearest district store.</p>
            </div>
          ) : (
            districtPharmacies.map((store) => (
              <div
                key={store.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{store.stockStatus}</span>
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {store.distance} from worksite
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {store.name}
                    </h3>
                    <span className="text-xs font-semibold text-teal-800 block mt-0.5">
                      {store.nameMalayalam}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black flex items-center space-x-1 flex-shrink-0">
                    <Percent className="w-3.5 h-3.5" />
                    <span>{store.savingsAverage}</span>
                  </span>
                </div>

                {/* Address & Timings */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 flex-shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>{store.timings}</span>
                  </div>
                </div>

                {/* Popular Generic Medicines in Stock */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Top Available Generics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {store.popularGenerics.map((med, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-emerald-800 shadow-2xs"
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions: Call & Map */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 font-mono">
                    Store ID: {store.id}
                  </span>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${store.phone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Store</span>
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
