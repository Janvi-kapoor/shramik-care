import React from 'react';
import { useApp } from '../../context/AppContext';
import { EMPANELLED_HOSPITALS } from '../../data/mockDatabase';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Stethoscope, 
  ExternalLink,
  Navigation,
  Globe2,
  AlertCircle
} from 'lucide-react';

export const HospitalModal = () => {
  const { isHospitalModalOpen, setIsHospitalModalOpen, activeSession, t } = useApp();

  if (!isHospitalModalOpen || !activeSession) return null;

  const worker = activeSession.user;
  const activeDistrict = worker.district || worker.keralaDistrict || 'Ernakulam';

  // STRICT DISTRICT FILTERING: Only show hospitals matching active worker's district
  const districtHospitals = EMPANELLED_HOSPITALS.filter(
    (h) => h.district.toLowerCase() === activeDistrict.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#042F2E] via-[#0D5C52] to-[#064E3B] text-white p-5 sm:p-6 pb-4 relative flex-shrink-0">
          <button
            onClick={() => setIsHospitalModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>AWAZ Network • Kerala Health Directorate</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t('hospitalsModalTitle')} <span className="text-amber-300">{activeDistrict}</span>
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            {t('hospitalsModalSub')}
          </p>

          {/* District Lock Filter Banner */}
          <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-teal-950/60 border border-teal-600/40 text-[11px] font-semibold text-teal-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('filterNotice')} <strong className="text-white">{activeDistrict} District</strong> ({districtHospitals.length} Found)</span>
          </div>
        </div>

        {/* Hospitals List Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {districtHospitals.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="font-bold text-sm">No empanelled hospitals listed for {activeDistrict}.</p>
              <p className="text-xs mt-1">Please dial 1056 for state-wide hospital routing.</p>
            </div>
          ) : (
            districtHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {t('cashlessCoveredBadge')}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {hospital.distance} away
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {hospital.name}
                    </h3>
                    <span className="text-xs font-semibold text-teal-800 block mt-0.5">
                      {hospital.nameMalayalam}
                    </span>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-teal-50 text-teal-900 text-xs font-extrabold flex-shrink-0">
                    {hospital.type}
                  </span>
                </div>

                {/* Address & Timings */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 flex-shrink-0 mt-0.5" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>{hospital.timings}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">Helpdesk: {hospital.awazDesk}</span>
                  </div>
                </div>

                {/* Spoken Languages & Departments */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                    <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Staff Speaks: <strong className="text-slate-800">{hospital.languagesSpoken.join(', ')}</strong></span>
                  </div>

                  {/* Actions: Call & Map */}
                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${hospital.phone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('callHospital')}</span>
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{t('getDirections')}</span>
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
