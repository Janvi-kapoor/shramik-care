import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Check,
  AlertCircle
} from 'lucide-react';

export const TabVoicePillClock = () => {
  const { 
    currentLanguage, 
    t, 
    activeSession,
    pillAdherence, 
    togglePillSlotTaken, 
    speakText, 
    stopSpeech, 
    isAudioSpeaking, 
    currentlyPlayingSlot,
    showToast 
  } = useApp();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!activeSession?.user?.id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/workers/${activeSession.user.id}/prescriptions`);
        if (res.ok) {
          const data = await res.json();
          setPrescriptions(data);
        }
      } catch (err) {
        console.error("Failed to fetch real prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [activeSession]);

  const handlePlayMedicineAudio = (med, prescriptionId) => {
    const medId = `${prescriptionId}-${med.id}`;
    if (isAudioSpeaking && currentlyPlayingSlot === medId) {
      stopSpeech();
      return;
    }
    const textToSpeak = `${med.name}. ${med.instructions || med.dosage}`;
    speakText(textToSpeak, medId);
  };

  const handleToggleTaken = (medId, medName) => {
    togglePillSlotTaken(medId);
    if (!pillAdherence[medId]) {
      showToast(`Marked ${medName} as taken!`, 'success');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading Voice Guidance...</div>;
  }

  if (prescriptions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
        <p className="font-bold">No prescriptions found.</p>
        <p className="text-sm mt-1">Upload a prescription via the Medicines tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Native Voice Audio Guidance</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            {t('pillClockTitle') || "Voice Pill Clock"}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {t('pillClockSub') || "Audio guidance for your scanned prescriptions"}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">
                  Prescription Scanned at {new Date(prescription.timestamp || prescription.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Dr. {prescription.doctorName || 'Unknown'}
              </span>
            </div>

            {prescription.diagnosis && prescription.diagnosis.trim() !== '' && prescription.diagnosis.toLowerCase() !== 'none' && (
              <div className="mb-4 bg-rose-50 border border-rose-100 rounded-lg p-3">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">Diagnosis / Doctor's Note</p>
                <p className="text-sm text-slate-900 font-semibold">{prescription.diagnosis}</p>
              </div>
            )}

            <div className="space-y-3">
              {prescription.medicines?.map((med) => {
                const medId = `${prescription.id}-${med.id}`;
                const isTaken = pillAdherence[medId];
                const isPlayingThis = isAudioSpeaking && currentlyPlayingSlot === medId;
                
                // Determine background color based on instructions vaguely
                const isMorning = med.instructions?.toLowerCase().includes('morning') || med.frequency?.startsWith('1-');
                const isEvening = med.instructions?.toLowerCase().includes('night') || med.instructions?.toLowerCase().includes('evening') || med.frequency?.endsWith('-1');
                
                const bgColor = isMorning ? 'bg-blue-50' : isEvening ? 'bg-orange-50' : 'bg-slate-50';

                return (
                  <div key={med.id} className={`p-4 rounded-xl border-y border-r border-l-4 border-l-blue-600 border-y-slate-200 border-r-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${bgColor} ${isTaken ? 'opacity-70' : ''} ${isPlayingThis ? 'ring-2 ring-amber-400' : ''}`}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between md:justify-start gap-3">
                        <h4 className="text-xl font-black text-slate-900">{med.name}</h4>
                        <span className="text-[10px] font-bold text-slate-600 border border-slate-300 bg-white px-2 py-1 rounded uppercase">{med.frequency || 'Daily'}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {med.instructions || `${med.dosage} ${med.strength ? `(${med.strength})` : ''}`}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Duration: {med.duration || 'As prescribed'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayMedicineAudio(med, prescription.id)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                          isPlayingThis
                            ? 'bg-amber-400 text-slate-900 animate-pulse'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isPlayingThis ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-teal-700" />}
                        <span>{isPlayingThis ? 'Stop' : 'Listen'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleTaken(medId, med.name)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                          isTaken
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        <span>{isTaken ? 'Taken' : 'Mark Taken'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
