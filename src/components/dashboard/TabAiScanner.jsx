import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Sparkles, CheckCircle2, Building2, Pill, RotateCcw, 
  Upload, FileText, Clock, Eye, Save, Volume2, Plus, Trash2, Maximize2
} from 'lucide-react';

export const TabAiScanner = () => {
  const { 
    activeSession, 
    setIsHospitalModalOpen, 
    setIsJanAushadhiModalOpen,
    showToast,
    t 
  } = useApp();
  
  const navigate = useNavigate();

  const worker = activeSession?.user;
  const activeDistrict = worker?.district || worker?.keralaDistrict || 'Ernakulam';

  // Scanner States: 'viewfinder' | 'processing' | 'result'
  const [scannerView, setScannerView] = useState('viewfinder');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  const [rawJsonData, setRawJsonData] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  
  // Editable form state for the parsed prescription
  const [formRx, setFormRx] = useState(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize WebRTC live camera
  const startCamera = async () => {
    setCameraError(false);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(true);
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera error/fallback:', err);
      setCameraError(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (scannerView === 'viewfinder') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scannerView]);

  const handleCaptureVideoFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    processImageWithGemini(dataUrl);
  };

  const processImageWithGemini = async (imageSource) => {
    stopCamera();
    setUploadedImage(imageSource);
    setScannerView('processing');
    setOcrProgress(20);

    try {
      const fetchRes = await fetch(imageSource);
      const blob = await fetchRes.blob();
      
      const formData = new FormData();
      formData.append('image', blob, 'prescription.jpg');

      setOcrProgress(60);

      const response = await fetch('http://localhost:5000/api/ocr/scan-prescription', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      setOcrProgress(80);
      const json = await response.json();
      
      setOcrProgress(100);
      setRawJsonData(json.data);
      
      const parsedMeds = Array.isArray(json.data.medicines) 
        ? json.data.medicines.map(m => ({
            name: m.name || m.genericName || '',
            dosage: m.dosage || m.strength || '',
            frequency: m.frequency || '',
            duration: m.duration || '',
            instructions: m.instructions || '',
            confidence: m.confidence || 'medium'
          })) 
        : [];

      setFormRx({
        patientName: json.data.patientName || '',
        doctorName: json.data.doctorName || '',
        date: json.data.prescriptionDate || new Date().toISOString().split('T')[0],
        diagnosis: json.data.diagnosis || '',
        reportedSymptoms: json.data.reportedSymptoms || '',
        overallConfidence: json.data.overallConfidence || 'medium',
        medicines: parsedMeds
      });
      
      setSavedSuccess(false);
      setScannerView('result');
      showToast('Prescription recognized!', 'success');
    } catch (err) {
      console.error('OCR Error:', err);
      showToast('We couldn\'t read this prescription. Please try a clearer image.', 'error');
      setScannerView('viewfinder');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImageWithGemini(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!worker?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/workers/${worker.id}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formRx)
      });
      
      if (!response.ok) throw new Error('Failed to save to database');
      
      setSavedSuccess(true);
      showToast('Prescription saved securely.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error saving prescription', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMedicineChange = (idx, field, value) => {
    const newMeds = [...formRx.medicines];
    newMeds[idx] = { ...newMeds[idx], [field]: value };
    setFormRx({ ...formRx, medicines: newMeds });
  };

  const addMedicine = () => {
    setFormRx({
      ...formRx, 
      medicines: [...formRx.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const removeMedicine = (idx) => {
    const newMeds = formRx.medicines.filter((_, i) => i !== idx);
    setFormRx({ ...formRx, medicines: newMeds });
  };

  const playAudio = (med, idx) => {
    if (!('speechSynthesis' in window)) {
      showToast('Voice playback is unavailable on this device.', 'error');
      return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setSpeakingId(idx);

    let text = `Medicine: ${med.name}. `;
    if (med.dosage) text += `Take ${med.dosage}. `;
    if (med.frequency) text += `${med.frequency}. `;
    if (med.duration) text += `For ${med.duration}. `;
    if (med.instructions) text += `${med.instructions}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to match language
    let lang = 'en-IN';
    if (worker?.audioLanguage === 'hi') lang = 'hi-IN';
    if (worker?.audioLanguage === 'ml') lang = 'ml-IN';
    if (worker?.audioLanguage === 'bn') lang = 'bn-IN';
    
    utterance.lang = lang;
    
    utterance.onend = () => {
      setSpeakingId(null);
    };
    
    utterance.onerror = () => {
      setSpeakingId(null);
      showToast('Audio playback failed.', 'error');
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* VIEW 1: LIVE WEBRTC CAMERA & UPLOAD DROPZONE                              */}
      {/* ========================================================================= */}
      {scannerView === 'viewfinder' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Prescription Scanner</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Scan Your Prescription
              </h2>
            </div>

            <label className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[400px] bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
            {!cameraError ? (
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-slate-400 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-amber-400" />
                <p className="text-xs max-w-xs mx-auto">
                  Camera feed unavailable. Please upload a photo of your prescription.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleCaptureVideoFrame}
              disabled={cameraError}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2 ${
                cameraError 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-teal-800 hover:bg-teal-900 text-white'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Capture Prescription</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: PROFESSIONAL PROGRESS UI                                          */}
      {/* ========================================================================= */}
      {scannerView === 'processing' && (
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-slate-200 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
            Analyzing Prescription
          </h3>
          <div className="space-y-4 max-w-sm mx-auto text-sm font-medium text-slate-600">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Image uploaded securely</span>
            </div>
            <div className="flex items-center gap-3">
              {ocrProgress >= 60 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
              <span className={ocrProgress >= 60 ? "text-slate-900" : "text-slate-400"}>Prescription detected</span>
            </div>
            <div className="flex items-center gap-3">
              {ocrProgress >= 80 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : ocrProgress >= 60 ? <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
              <span className={ocrProgress >= 80 ? "text-slate-900" : ocrProgress >= 60 ? "text-teal-700 font-bold" : "text-slate-400"}>Reading medicines</span>
            </div>
            <div className="flex items-center gap-3">
              {ocrProgress >= 100 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : ocrProgress >= 80 ? <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
              <span className={ocrProgress >= 100 ? "text-slate-900" : ocrProgress >= 80 ? "text-teal-700 font-bold" : "text-slate-400"}>Structuring data</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: DYNAMIC RECOGNITION RESULTS (TWO COLUMN)                          */}
      {/* ========================================================================= */}
      {scannerView === 'result' && formRx && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LEFT: IMAGE PREVIEW */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm lg:sticky lg:top-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Prescription Preview</h3>
              <button 
                onClick={() => setScannerView('viewfinder')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Replace Image
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
              <img src={uploadedImage} alt="Uploaded Prescription" className="w-full h-auto object-contain max-h-[600px]" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a href={uploadedImage} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition">
                  <Maximize2 className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: EXTRACTED DATA & EDIT */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Extracted Prescription
                  </h2>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${
                    formRx.overallConfidence === 'low' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    formRx.overallConfidence === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    OCR Confidence: {formRx.overallConfidence}
                  </span>
                </div>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <p className="font-medium">Please verify all handwritten medicine names and doses against the original prescription.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Patient on Prescription</label>
                  <input
                    type="text"
                    value={formRx.patientName || ''}
                    onChange={(e) => setFormRx({...formRx, patientName: e.target.value})}
                    placeholder="Not clearly read"
                    className="w-full px-2 py-1.5 rounded-md border border-slate-300 text-sm font-semibold text-slate-800 bg-white"
                  />
                  <div className="mt-2 text-[10px] text-slate-500">
                    Linked Worker: <strong className="text-teal-700">{worker?.name || 'Ramesh Kumar'}</strong>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={formRx.doctorName || ''}
                    onChange={(e) => setFormRx({...formRx, doctorName: e.target.value})}
                    className="w-full px-2 py-1.5 rounded-md border border-slate-300 text-sm font-semibold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Diagnosis</label>
                  <input
                    type="text"
                    value={formRx.diagnosis || ''}
                    onChange={(e) => setFormRx({...formRx, diagnosis: e.target.value})}
                    placeholder="Not explicitly mentioned"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reported Symptoms</label>
                  <input
                    type="text"
                    value={formRx.reportedSymptoms || ''}
                    onChange={(e) => setFormRx({...formRx, reportedSymptoms: e.target.value})}
                    placeholder="None read from prescription"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800">Medicines Found</h3>
                  <button onClick={addMedicine} className="text-xs font-bold text-teal-600 flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Medicine
                  </button>
                </div>
                
                {formRx.medicines.map((med, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${med.confidence === 'low' ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'} relative`}>
                    
                    <div className="absolute top-3 right-3 flex gap-2 items-center">
                      {med.confidence === 'low' && (
                        <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                          ⚠️ Please Verify
                        </span>
                      )}
                      <button 
                        onClick={() => playAudio(med, idx)}
                        className={`p-1.5 rounded-md transition-colors ${speakingId === idx ? 'bg-amber-100 text-amber-700' : 'bg-white border border-slate-200 text-slate-500 hover:text-teal-700'}`}
                        title="Listen to Instructions"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeMedicine(idx)} className="p-1.5 bg-white border border-slate-200 text-rose-500 rounded-md hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medicine Name</label>
                        <input
                          type="text"
                          value={med.name || ''}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          className={`w-full px-3 py-2 rounded-md border text-sm font-semibold ${med.confidence === 'low' ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500' : 'border-slate-200'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dosage / Strength</label>
                        <input
                          type="text"
                          value={med.dosage || ''}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Frequency</label>
                        <input
                          type="text"
                          value={med.frequency || ''}
                          onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                          className={`w-full px-3 py-2 rounded-md border text-sm ${med.confidence === 'low' ? 'border-amber-300' : 'border-slate-200'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration</label>
                        <input
                          type="text"
                          value={med.duration || ''}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                          className={`w-full px-3 py-2 rounded-md border text-sm ${med.confidence === 'low' ? 'border-amber-300' : 'border-slate-200'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Instructions</label>
                        <input
                          type="text"
                          value={med.instructions || ''}
                          onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {formRx.medicines.length === 0 && (
                  <p className="text-sm text-slate-500 italic text-center p-4">No medicines clearly identified.</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {!savedSuccess ? (
                  <button
                    type="button"
                    onClick={handleSaveToDatabase}
                    disabled={isSaving}
                    className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center transition-colors shadow-md"
                  >
                    {isSaving ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Confirm & Save Prescription
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center text-emerald-800">
                      <CheckCircle2 className="w-6 h-6 mr-3" />
                      <div>
                        <p className="font-bold text-sm">Successfully Saved</p>
                        <p className="text-xs">Your prescription has been digitized and saved securely.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CARE NEAR YOU / AFFORDABLE MEDS */}
            {savedSuccess && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900">Care Near You</h3>
                  <p className="text-xs text-slate-500 mt-1">Based on the prescription and reported symptoms, here are nearby healthcare facilities in your district.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-emerald-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Government Hospital</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Verified public healthcare facility in {activeDistrict}.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsHospitalModalOpen(true)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Find Nearest Facility
                    </button>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white border border-amber-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Affordable Medicines</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Jan Aushadhi stores offering generic equivalents.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsJanAushadhiModalOpen(true)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Locate Jan Aushadhi
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic text-center mt-2">
                  A generic equivalent may be available. Please confirm with your doctor or pharmacist before substitution.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
