import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import jsQR from 'jsqr';
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
  Zap,
  Sparkles,
  RefreshCw,
  Languages,
  Pill,
  HeartPulse,
  Flame
} from 'lucide-react';

export const DoctorPatientLookup = () => {
  const { workers, selectedPatient, setSelectedPatient, setActiveDoctorTab, showToast, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scanSuccessFeedback, setScanSuccessFeedback] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Play synthetic scan beep sound via Web Audio API
  const playScanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 pitch
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn('Web Audio beep error:', e);
    }
  };

  // Optical QR Code Scanner Loop
  const scanQrFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        const raw = code.data.trim();
        // Match worker by ID or ABHA or string
        const matched = workers.find(
          (w) =>
            raw.includes(w.id) ||
            raw.includes(w.mobile) ||
            raw.toLowerCase().includes(w.name.toLowerCase()) ||
            raw.includes(w.abhaId)
        );

        if (matched) {
          playScanBeep();
          setSelectedPatient(matched);
          setScanSuccessFeedback(true);
          showToast(`Optical QR Scanned: ${matched.name} (${matched.id}) Verified!`, 'success');
          stopCamera();
          setTimeout(() => setScanSuccessFeedback(false), 2000);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanQrFrame);
  };

  const startCamera = async () => {
    try {
      setIsScanningActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsCameraActive(true);
        animationFrameRef.current = requestAnimationFrame(scanQrFrame);
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      showToast('Camera feed unavailable. Use quick phone screen scan buttons below.', 'info');
      setIsCameraActive(false);
      setIsScanningActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsScanningActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Direct Phone Screen QR Simulation Trigger
  const handleSimulateDirectScreenScan = (worker) => {
    playScanBeep();
    setScanSuccessFeedback(true);
    setSelectedPatient(worker);
    showToast(`Phone Screen QR Decoded: ${worker.name} (${worker.id})`, 'success');
    setTimeout(() => setScanSuccessFeedback(false), 2000);
  };

  const vitals = selectedPatient?.vitals || {
    bp: "120/80 mmHg",
    bloodSugar: "94 mg/dL",
    pulse: "72 bpm",
    spO2: "99%",
    lastUpdated: "Camp Checkup"
  };

  return (
    <div className="space-y-6">
      {/* 1. Real Webcam Optical QR Scanner & Direct Phone Scan Console */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <QrCode className="w-3.5 h-3.5" />
              <span>Real-Time Optical Camera QR Scanner</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Scan Worker Digital Health Pass / QR Code
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Start Live Camera Scanner</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Stop Camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Camera Scanner Viewport with Optical Laser Animation */}
        {isCameraActive && (
          <div className="relative w-full aspect-[16/9] max-h-[360px] bg-slate-950 rounded-xl overflow-hidden border-2 border-teal-500 shadow-2xl flex items-center justify-center">
            <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Targeting Reticle */}
            <div className="absolute inset-8 sm:inset-12 pointer-events-none border-2 border-dashed border-teal-300/80 rounded-2xl flex items-center justify-center shadow-inner">
              {/* Laser Scanning Line Moving Up & Down */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce"></div>

              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-amber-300">
                Align Worker Phone QR in Box
              </div>
            </div>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient by Name, KL-MIG ID, or Mobile number..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* 1-Click Direct Worker Phone Screen Scan Triggers */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            ⚡ Direct Phone Screen QR Scanner (1-Click Instant Triage):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {workers.map((w) => {
              const isSelected = selectedPatient?.id === w.id;
              const hasAllergy = w.allergies && !w.allergies.includes('No Known Drug Allergies (NKDA)');

              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleSimulateDirectScreenScan(w)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/30 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-bold text-xs text-slate-900">{w.name}</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold">
                      {w.bloodGroup}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{w.id}</span>
                    {hasAllergy ? (
                      <span className="text-rose-600 font-bold">⚠️ Allergy</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">✓ NKDA</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Unified Comprehensive Electronic Medical Record (EMR) for Doctor */}
      {selectedPatient && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
          {/* Patient Master Demographics Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white flex items-center justify-center text-xl font-black shadow-sm">
                {selectedPatient.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedPatient.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-xs">
                    Blood Group: {selectedPatient.bloodGroup}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 font-bold text-xs">
                    {selectedPatient.gender}, {selectedPatient.age} yrs
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-mono mt-1">
                  <span className="font-bold text-teal-900">Health ID: {selectedPatient.id}</span>
                  <span>•</span>
                  <span>14-Digit ABHA: {selectedPatient.abhaId}</span>
                  <span>•</span>
                  <span>Origin: {selectedPatient.originState} ({selectedPatient.originDistrict})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start md:self-auto">
              <a
                href={`tel:${selectedPatient.mobile}`}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedPatient.mobile}</span>
              </a>

              <button
                onClick={() => setActiveDoctorTab('voice-translator')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>Translate with Patient</span>
              </button>
            </div>
          </div>

          {/* Vitals Baseline Grid */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Current Screening Vitals (Aluva Health Camp #2):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Blood Pressure</span>
                <span className="text-base font-black text-slate-900 font-mono">{vitals.bp}</span>
                <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Normal Range</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Blood Sugar</span>
                <span className="text-base font-black text-slate-900 font-mono">{vitals.bloodSugar}</span>
                <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Fasting Normal</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Pulse Rate</span>
                <span className="text-base font-black text-slate-900 font-mono">{vitals.pulse}</span>
                <span className="text-[9px] text-teal-700 font-bold block mt-0.5">Resting Heart Rate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Oxygen (SpO2)</span>
                <span className="text-base font-black text-slate-900 font-mono">{vitals.spO2}</span>
                <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Optimal Saturation</span>
              </div>
            </div>
          </div>

          {/* Unified Medical History Timeline & Doctor Notes */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Unified Medical Timeline (Past Camp Visits & Prescriptions):
            </span>

            <div className="space-y-3 text-xs text-slate-700">
              {/* Event 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-800 mt-0.5 flex-shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Aluva Taluk Mobile Triage - Dr. P.K. Thomas
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">12 Feb 2025</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Patient presented with acute upper respiratory irritation due to fine veneer dust exposure at the plywood worksite. Prescribed Paracetamol 650mg & Cetirizine 10mg. Fit for duty with mandatory N95 mask advisory.
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5 flex-shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Kaloor Metro Workers Outreach Clinic
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">04 Jan 2025</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Routine camp health screening. Administered Tetanus Toxoid booster injection. Blood glucose tested at 98 mg/dL.
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Perumbavoor Hub Digital Enrollment
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">15 Nov 2024</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Primary biometric camp onboarding, 14-digit ABHA ID generated, AWAZ health card seeded with ₹50,000 cashless annual allocation.
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
