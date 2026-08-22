import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { QrCode, Search, Camera, X, Zap } from 'lucide-react';

export const DoctorQRScannerView = () => {
  const { selectedPatient, setSelectedPatient, showToast, doctorApi } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [matches, setMatches] = useState([]);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const playScanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
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

  const handlePatientFound = (matched) => {
    playScanBeep();
    setSelectedPatient(matched);
    showToast(`Scanned: ${matched.name} (${matched.id}) Verified!`, 'success');
    stopCamera();
    navigate('/doctor/consult');
  };

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
        const workerId = raw.match(/SHRAMIKCARE:\/\/([^/]+)/i)?.[1] || raw.match(/KL-MIG-\d+/i)?.[0];
        if (workerId) {
          doctorApi(`/patients/${workerId}/report`).then(report => handlePatientFound(report.worker)).catch(() => showToast('Worker Health ID was not found.', 'error'));
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanQrFrame);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsCameraActive(true);
          setCameraError('');
        animationFrameRef.current = requestAnimationFrame(scanQrFrame);
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setCameraError(err.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access and try again.' : 'Camera is unavailable on this device.');
      setIsCameraActive(false);
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
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>Live Health ID Scanner</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Scan Worker Health ID
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

      {isCameraActive && (
        <div className="relative w-full aspect-[16/9] max-h-[360px] bg-slate-950 rounded-xl overflow-hidden border-2 border-teal-500 shadow-2xl flex items-center justify-center">
          <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-8 sm:inset-12 pointer-events-none border-2 border-dashed border-teal-300/80 rounded-2xl flex items-center justify-center shadow-inner">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce"></div>
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-amber-300">
              Align Worker Phone QR in Box
            </div>
          </div>
        </div>
      )}

      {cameraError && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">{cameraError}</div>}

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={async (e) => {
            const value = e.target.value;
            setSearchQuery(value);
            if (value.trim()) {
              try { setMatches(await doctorApi(`/patients?search=${encodeURIComponent(value)}`)); } catch { setMatches([]); }
            } else setMatches([]);
          }}
          placeholder="Search by worker name or Health ID..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50/50"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Search results from authorized records</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {matches.map((w) => {
            const isSelected = selectedPatient?.id === w.id;
            const hasAllergy = w.allergies && !w.allergies.includes('No Known Drug Allergies (NKDA)');
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handlePatientFound(w)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/30' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold text-xs text-slate-900">{w.name}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold">{w.bloodGroup}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{w.id}</span>
                  {hasAllergy ? <span className="text-rose-600 font-bold">⚠️ Allergy</span> : <span className="text-emerald-700 font-bold">✓ NKDA</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
