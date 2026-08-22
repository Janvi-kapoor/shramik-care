import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ChevronRight,
  Pill,
  Navigation,
  QrCode,
  AlertTriangle
} from 'lucide-react';
import { EMPANELLED_HOSPITALS, KERALA_GOVT_SCHEMES } from '../../data/mockDatabase';

export const TabWelfareWallet = () => {
  const { activeSession, t, getSavedPrescriptionsForWorker } = useApp();
  const worker = activeSession?.user;
  const [showCardBack, setShowCardBack] = useState(false);

  const saved = getSavedPrescriptionsForWorker ? getSavedPrescriptionsForWorker(worker?.id) : [];
  const latestPrescription = saved.length > 0 ? saved[0] : null;

  return (
    <div className="animate-in fade-in duration-200 grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        
        {/* Ayushman / Govt Schemes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
           <h3 className="text-lg font-bold text-slate-900 mb-1">AWAZ Health Insurance (Kerala)</h3>
           <p className="text-sm text-slate-500 mb-6">Check your eligibility and access your health benefits.</p>

           <div className="perspective-1000 relative h-40 mb-4">
             <div className={`w-full h-full transition-all duration-500 transform-style-3d ${showCardBack ? 'rotate-y-180' : ''}`}>
               {/* Front */}
               <div className="absolute inset-0 backface-hidden border border-slate-200 rounded-xl p-5 overflow-hidden bg-white">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <h4 className="font-bold text-slate-900 text-base">AWAZ Health Card</h4>
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">Active</span>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Health Benefit Card</p>
                        <p className="font-mono text-slate-900 font-bold">{worker?.awazCardNo || 'AWZ-KL-2025-00000'}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Valid Till</p>
                        <p className="font-bold text-slate-900">31 Dec 2025</p>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 z-0"></div>
               </div>

               {/* Back */}
               <div className="absolute inset-0 backface-hidden rotate-y-180 border border-slate-200 rounded-xl p-5 overflow-hidden bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{worker?.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">Blood Group: {worker?.bloodGroup || 'O+'}</p>
                    <p className="text-[10px] text-slate-400 max-w-[150px]">Scan this QR at any empanelled hospital to verify benefits instantly.</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <QrCode className="w-16 h-16 text-[#5a32fa]" />
                  </div>
               </div>
             </div>
           </div>

           <button 
             onClick={() => setShowCardBack(!showCardBack)}
             className="text-sm font-bold text-[#5a32fa] hover:text-[#4825cc] transition-colors flex items-center justify-center w-full mt-2">
             {showCardBack ? 'View Card Front' : 'View Card Details'}
           </button>
        </div>

        {/* Jan Aushadhi */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
           <h3 className="text-lg font-bold text-slate-900 mb-1">Jan Aushadhi - Affordable Medicines</h3>
           <p className="text-sm text-slate-500 mb-6">Find affordable generic medicines near you.</p>

           {latestPrescription && latestPrescription.medicines?.length > 0 ? (
             <div className="space-y-3 mb-6">
               <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">Great news! Some medicines in your recent prescription are available at a high discount here.</p>
               {latestPrescription.medicines.slice(0, 2).map((med, idx) => (
                 <div key={idx} className="border border-slate-100 bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                      <p className="text-[10px] text-slate-500">Substitute available at Jan Aushadhi</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">-70% OFF</span>
                 </div>
               ))}
             </div>
           ) : (
             <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Paracetamol 500mg</h4>
                  <p className="text-xs text-slate-500">Tablet</p>
                </div>
             </div>
           )}

           <div className="flex justify-between items-center">
              <div>
                 <h4 className="font-bold text-slate-900 text-sm">Jan Aushadhi Kendra</h4>
                 <p className="text-xs text-slate-500">1.3 km</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Jan+Aushadhi+Kendra" target="_blank" rel="noreferrer" className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-[#5a32fa] text-xs font-semibold hover:bg-indigo-50 transition-colors">
                 <Navigation className="w-3.5 h-3.5" />
                 <span>Directions</span>
              </a>
           </div>

           <div className="mt-6 pt-4 border-t border-slate-100 flex items-start space-x-4">
              <p className="text-xs text-slate-400 flex-1">Please confirm any medicine substitution with your doctor/pharmacist.</p>
              <Pill className="w-8 h-8 text-rose-300 opacity-50 shrink-0" />
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        
        {/* Supported Healthcare */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
           <h3 className="text-lg font-bold text-slate-900 mb-1">Supported Healthcare Near You</h3>
           <p className="text-sm text-slate-500 mb-4">AWAZ / Govt. supported hospitals nearby</p>

           {latestPrescription && latestPrescription.diagnosis && (
             <div className="mb-4 flex items-start space-x-3 bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
               <ShieldCheck className="w-5 h-5 text-[#5a32fa] shrink-0 mt-0.5" />
               <p className="text-xs text-indigo-900 leading-relaxed">
                 Your recent diagnosis (<strong>{latestPrescription.diagnosis}</strong>) qualifies for cashless treatment under the AWAZ scheme at these hospitals.
               </p>
             </div>
           )}

           <div className="space-y-4">
             {EMPANELLED_HOSPITALS.filter(h => h.type.includes('Govt') || h.type.includes('AWAZ')).slice(0, 3).map((hospital, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-slate-100 last:border-0">
                   <div className="mb-2 sm:mb-0 sm:flex-1 sm:pr-4">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{hospital.name}</h4>
                      <p className="text-[10px] font-semibold text-emerald-600">{hospital.type}</p>
                   </div>
                   <div className="flex items-center space-x-4 justify-between">
                      <span className="text-xs font-bold text-slate-400">{hospital.distance}</span>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`} target="_blank" rel="noreferrer" className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-[#5a32fa] text-xs font-semibold hover:bg-indigo-50 transition-colors">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Map</span>
                      </a>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Other Schemes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
           <h3 className="text-lg font-bold text-slate-900 mb-1">Other Kerala Government Schemes</h3>
           <p className="text-sm text-slate-500 mb-6">Explore other health schemes and benefits.</p>

           <div className="space-y-4">
             {KERALA_GOVT_SCHEMES.slice(0, 3).map((scheme, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                   <h4 className="font-bold text-slate-900 text-sm flex-1 pr-4">{scheme.title}</h4>
                   <a href="#" className="text-[#5a32fa] text-xs font-semibold hover:text-[#4825cc] transition-colors shrink-0 flex items-center">
                     Know More <ChevronRight className="w-3.5 h-3.5 ml-1" />
                   </a>
                </div>
             ))}
           </div>
        </div>

      </div>

    </div>
  );
};
