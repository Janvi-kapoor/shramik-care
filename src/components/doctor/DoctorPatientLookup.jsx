import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Search, 
  User, 
  Camera, 
  Clock, 
  Activity, 
  FileText, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  ShieldCheck,
  Calendar,
  X,
  Phone,
  Zap
} from 'lucide-react';

export const DoctorPatientLookup = () => {
  const { workers, selectedPatient, setSelectedPatient, showToast, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Filter workers based on search
  const filteredWorkers = workers.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      w.name.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.mobile.includes(q) ||
      w.originState.toLowerCase().includes(q)
    );
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera lookup unavailable:', err);
      showToast('Camera feed unavailable. Select patient from camp queue.', 'info');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSimulateQrScan = (worker) => {
    stopCamera();
    setSelectedPatient(worker);
    showToast(`1-Sec QR Scan Verified: ${worker.name} (${worker.id})`, 'success');
  };

  const vitals = selectedPatient?.vitals || {
    bp: "120/80 mmHg",
    bloodSugar: "94 mg/dL",
    pulse: "72 bpm",
    spO2: "99%",
    lastUpdated: "Camp Checkup"
  };

  return (
    <div className="space-y-5">
      {/* 1. Quick Patient Lookup Bar & Camera Trigger */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('docLookupTitle')}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-900 hover:bg-teal-100 font-bold text-xs border border-teal-200 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Patient QR</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Camera Scanner Viewport */}
        {isCameraActive && (
          <div className="relative w-full aspect-[16/9] max-h-[220px] bg-slate-950 rounded-lg overflow-hidden border-2 border-teal-500 shadow-inner flex items-center justify-center">
            <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center">
              <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-amber-300">
                Hold Patient QR in Viewfinder
              </span>
            </div>
          </div>
        )}

        {/* Search Input Box */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient by Name, KL-MIG ID, or Mobile (e.g. Ramesh, 78219)..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Camp Queue Fast Select Chips */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            ⚡ Camp Queue Triage Chips:
          </span>
          <div className="flex flex-wrap gap-2">
            {workers.map((w) => {
              const isSelected = selectedPatient?.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleSimulateQrScan(w)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-teal-800 text-white shadow-sm ring-2 ring-teal-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{w.name} ({w.id})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Patient Verified Clinical Details & Medical Timeline */}
      {selectedPatient && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-5">
          {/* Patient Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center text-lg font-black shadow-xs">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {selectedPatient.name}
                  </h2>
                  <span className="px-2 py-0.2 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                    {selectedPatient.bloodGroup}
                  </span>
                  <span className="px-2 py-0.2 rounded bg-teal-50 text-teal-800 font-bold text-[10px]">
                    {selectedPatient.gender}, {selectedPatient.age} yrs
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-mono mt-0.5">
                  <span className="font-bold text-teal-900">{selectedPatient.id}</span>
                  <span>•</span>
                  <span>ABHA: {selectedPatient.abhaId}</span>
                  <span>•</span>
                  <span>Origin: {selectedPatient.originState}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <a
                href={`tel:${selectedPatient.mobile}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedPatient.mobile}</span>
              </a>
            </div>
          </div>

          {/* Screening Vitals Bar */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Current Screening Vitals (Aluva Camp #2):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">BP</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{vitals.bp}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">Blood Sugar</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{vitals.bloodSugar}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">Pulse</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{vitals.pulse}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">SpO2</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{vitals.spO2}</span>
              </div>
            </div>
          </div>

          {/* Unified Medical History Timeline */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Unified Medical Timeline (KMC Electronic Health Record):
            </span>

            <div className="space-y-2.5 text-xs text-slate-700">
              {/* Event 1 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/90 flex items-start space-x-3">
                <div className="p-1.5 rounded-md bg-teal-100 text-teal-800 mt-0.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Aluva Taluk Mobile Camp #2 - Dr. P.K. Thomas</span>
                    <span className="text-[10px] text-slate-400 font-mono">12 Feb 2025</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Acute upper respiratory irritation due to veneer sanding dust. Prescribed Paracetamol 650mg & Cetirizine 10mg. Fit for work with N95 mask advisory.
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/90 flex items-start space-x-3">
                <div className="p-1.5 rounded-md bg-amber-100 text-amber-800 mt-0.5">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Kaloor Metro Workers Outreach</span>
                    <span className="text-[10px] text-slate-400 font-mono">04 Jan 2025</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Routine camp screening. Tetanus Toxoid booster administered. Blood glucose fasting normal (98 mg/dL).
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/90 flex items-start space-x-3">
                <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Perumbavoor Hub Digital Enrollment</span>
                    <span className="text-[10px] text-slate-400 font-mono">15 Nov 2024</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Primary on-site biometric onboarding, 14-digit ABHA generation, AWAZ health card seeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
