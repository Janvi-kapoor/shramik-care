import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Volume2,
  ChevronDown,
  Navigation,
  PhoneCall,
  Sun,
  Moon,
  Sunset
} from 'lucide-react';
import { EMPANELLED_HOSPITALS } from '../../data/mockDatabase';

export const TabVoicePillClock = () => {
  const { activeSession, speakText, isAudioSpeaking, t, getSavedPrescriptionsForWorker } = useApp();
  const [selectedLang, setSelectedLang] = useState(() => activeSession?.user?.audioLanguage || 'hi');
  const [hospitalFilter, setHospitalFilter] = useState('All');

  const worker = activeSession?.user;
  const saved = getSavedPrescriptionsForWorker ? getSavedPrescriptionsForWorker(worker?.id) : [];
  const latestPrescription = saved.length > 0 ? saved[0] : null;

  useEffect(() => {
    if (worker?.audioLanguage) setSelectedLang(worker.audioLanguage);
  }, [worker?.audioLanguage]);

  const handleListen = () => {
    let text = "";
    if (!latestPrescription || !latestPrescription.medicines || latestPrescription.medicines.length === 0) {
      text = "You do not have any active medicines right now.";
    } else {
      const medsList = latestPrescription.medicines.map(m => `${m.name}, ${m.dosage}, ${m.frequency}`).join(". ");
      text = `Your diagnosis is ${latestPrescription.diagnosis || 'unknown'}. You have ${latestPrescription.medicines.length} medicines to take. They are: ${medsList}. Please take your medicine on time.`;
    }
    if (speakText) speakText(text, 'voice-care', selectedLang, false);
  };

  // Hospital Filtering
  const filteredHospitals = EMPANELLED_HOSPITALS.filter(h => {
    if (hospitalFilter === 'All') return true;
    if (hospitalFilter === 'Hospitals' && h.type.includes('Hospital')) return true;
    if (hospitalFilter === 'Clinics' && h.type.includes('Clinic')) return true;
    if (hospitalFilter === 'Govt.' && (h.type.includes('Govt') || h.type.includes('Primary Health'))) return true;
    return false;
  }).slice(0, 3);

  // Frequency icons parsing
  const getFreqIcons = (freq = "") => {
    const parts = freq.split('-');
    return (
      <div className="flex space-x-2 text-slate-400">
        {parts[0] && parts[0] !== '0' && <Sun className="w-4 h-4 text-amber-500" />}
        {parts[1] && parts[1] !== '0' && <Sunset className="w-4 h-4 text-orange-500" />}
        {parts[2] && parts[2] !== '0' && <Moon className="w-4 h-4 text-indigo-500" />}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-200 grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Left: Voice Care */}
      <div className="space-y-6 flex flex-col">
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('wpVoiceCare', 'Medicine Voice')}</h3>
                <p className="text-sm text-slate-500">Listen to your medicine instructions.</p>
              </div>

              <div className="relative">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-bold text-[#5a32fa] focus:outline-none focus:border-[#5a32fa]"
                >
                  <option value="hi">Hindi</option>
                  <option value="ml">Malayalam</option>
                  <option value="bn">Bengali</option>
                  <option value="en">English</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-[#5a32fa] pointer-events-none" />
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-5 mb-6 bg-slate-50/50">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="text-xs font-bold text-slate-500 uppercase">Current Prescription</h4>
                 <span className="text-xs font-semibold text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                   {latestPrescription ? (
                     new Date(latestPrescription.date || latestPrescription.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) !== 'Invalid Date'
                       ? new Date(latestPrescription.date || latestPrescription.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                       : "Recent"
                   ) : "None"}
                 </span>
               </div>

               <div className="mb-4 bg-white p-3 rounded-lg border border-slate-100">
                 <p className="text-[10px] text-slate-400 uppercase mb-1">Diagnosis</p>
                 <p className="text-sm font-bold text-slate-900">{latestPrescription?.diagnosis || "No diagnosis saved"}</p>
               </div>

               <div>
                 <p className="text-[10px] text-slate-400 uppercase mb-2">Medicines</p>
                 <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                   {latestPrescription && latestPrescription.medicines && latestPrescription.medicines.length > 0 ? (
                     latestPrescription.medicines.map((m, i) => (
                       <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100">
                         <div>
                           <p className="text-xs font-bold text-slate-900">{m.name}</p>
                           <p className="text-[10px] text-slate-500">{m.dosage} • {m.frequency}</p>
                         </div>
                         {getFreqIcons(m.frequency)}
                       </div>
                     ))
                   ) : (
                     <div className="text-xs font-semibold text-slate-400 p-3 text-center border border-dashed border-slate-200 rounded-lg">
                       No medicines active.
                     </div>
                   )}
                 </div>
               </div>
            </div>

            <button
              onClick={handleListen}
              disabled={isAudioSpeaking || (!latestPrescription || !latestPrescription.medicines?.length)}
              className="w-full py-3.5 px-4 bg-[#5a32fa] hover:bg-[#4825cc] text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {isAudioSpeaking ? (
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>
                      Listen in {selectedLang === 'hi' ? 'Hindi' : selectedLang === 'ml' ? 'Malayalam' : selectedLang === 'bn' ? 'Bengali' : 'English'}
                    </span>
                  </>
                )}
            </button>
         </div>
      </div>

      {/* Right: Care Near You */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
         <h3 className="text-lg font-bold text-slate-900 mb-1">{t('wpCareNearYou', 'Care Near You')}</h3>
         <p className="text-sm text-slate-500 mb-6">Nearby verified healthcare facilities</p>

         <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {['All', 'Hospitals', 'Clinics', 'Govt.'].map(filter => (
              <button
                key={filter}
                onClick={() => setHospitalFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  hospitalFilter === filter
                    ? 'bg-indigo-50 text-[#5a32fa] border border-indigo-100'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
         </div>

         <div className="space-y-4 flex-1">
            {filteredHospitals.map((hospital, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-slate-100 last:border-0">
                 <div className="mb-3 sm:mb-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{hospital.name}</h4>
                      {(hospital.type.includes('AWAZ') || hospital.type.includes('Govt')) && (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-sm uppercase tracking-wider">AWAZ</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{hospital.type}</p>
                 </div>
                 <div className="flex items-center space-x-4">
                    <span className="text-xs font-bold text-slate-400 w-12 text-right">{hospital.distance}</span>
                    <div className="flex space-x-2">
                       <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`} target="_blank" rel="noreferrer" className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-[#5a32fa] text-xs font-semibold hover:bg-indigo-50 transition-colors">
                         <Navigation className="w-3.5 h-3.5" />
                         <span className="hidden sm:inline">Map</span>
                       </a>
                       <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-[#5a32fa] text-xs font-semibold hover:bg-indigo-50 transition-colors">
                         <PhoneCall className="w-3.5 h-3.5" />
                         <span className="hidden sm:inline">Call</span>
                       </button>
                    </div>
                 </div>
              </div>
            ))}
            {filteredHospitals.length === 0 && (
              <div className="text-center text-sm text-slate-400 py-6">
                No facilities found for this filter.
              </div>
            )}
         </div>

         <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <button className="text-sm font-bold text-[#5a32fa] hover:text-[#4825cc] transition-colors flex items-center justify-center w-full">
              View More Places <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
            </button>
         </div>
      </div>
    </div>
  );
};
