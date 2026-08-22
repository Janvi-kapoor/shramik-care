import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Upload, 
  CheckCircle2, 
  FileText, 
  Info,
  Scan
} from 'lucide-react';

export const TabAiScanner = () => {
  const { activeSession, t, speakText, saveWorkerPrescription, showToast } = useApp();
  const worker = activeSession?.user;
  const navigate = useNavigate();
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        processImageWithGemini(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageWithGemini = async (imageSource) => {
    setIsProcessing(true);
    setExtractedData(null);
    try {
      const fetchRes = await fetch(imageSource);
      const blob = await fetchRes.blob();
      
      const formData = new FormData();
      formData.append('image', blob, 'prescription.png');

      const response = await fetch('http://localhost:5000/api/ocr/scan-prescription', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        setExtractedData({
          diagnosis: json.data.diagnosis || "No diagnosis written",
          medicines: json.data.medicines || []
        });

        // Add Voice Readout
        if (speakText) {
          const medCount = json.data.medicines ? json.data.medicines.length : 0;
          const diag = json.data.diagnosis && json.data.diagnosis.toLowerCase() !== 'unknown' 
            ? `Your diagnosis is ${json.data.diagnosis}.` 
            : `No diagnosis was specified.`;
          const text = `Prescription scanned successfully. ${diag} You have been prescribed ${medCount} medicines.`;
          speakText(text, 'scanner', worker?.preferredLanguage || 'hi', true);
        }
      } else {
        throw new Error(json.error || 'Failed');
      }
    } catch (error) {
      console.error(error);
      alert('OCR Failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const newData = { ...extractedData };
    newData.medicines[index][field] = value;
    setExtractedData(newData);
  };

  const handleSaveToDiary = () => {
    if (!extractedData) return;
    
    if (saveWorkerPrescription) {
      saveWorkerPrescription(worker.id, extractedData);
      if (showToast) showToast("Prescription saved successfully!");
      handleClear();
      navigate('/worker/diary');
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setExtractedData(null);
  };

  return (
    <div className="animate-in fade-in duration-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left: Upload and Extracted Info (7 cols) */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        {/* Upload Block */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('wpUploadPrescription', 'Upload Prescription')}</h3>
              <p className="text-sm text-slate-500">Upload clear prescription image for auto reading.</p>
            </div>
            <button onClick={() => navigate('/worker/diary')} className="text-sm font-bold text-[#5a32fa] hover:underline">View Medical Diary</button>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/50 transition-colors bg-white group">
            <div className="w-12 h-12 bg-indigo-50 text-[#5a32fa] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="text-[#5a32fa] font-bold text-sm mb-1">Click to upload or take a photo</h4>
            <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {/* Extracted Info Block */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{t('wpExtractedInfo', 'Extracted Information')}</h3>
          
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
               <div className="w-8 h-8 border-4 border-[#5a32fa] border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-sm font-semibold">Reading prescription using AI...</p>
            </div>
          ) : !extractedData ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-slate-50 rounded-xl">
               <Scan className="w-12 h-12 mb-3 opacity-20" />
               <p className="text-sm">Upload a prescription to view details</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>OCR Completed</span>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase">Diagnosis (Explicit)</h4>
                <input 
                  type="text" 
                  value={extractedData.diagnosis}
                  onChange={(e) => setExtractedData({...extractedData, diagnosis: e.target.value})}
                  className="w-full text-emerald-700 font-bold text-base bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Medicine</th>
                      <th className="py-2 px-3 font-semibold">Dosage</th>
                      <th className="py-2 px-3 font-semibold">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {extractedData.medicines.map((med, i) => {
                      const isLowConfidence = med.confidence === 'low';
                      return (
                        <tr key={i} className={isLowConfidence ? "bg-amber-50" : ""}>
                          <td className="py-2 px-2">
                            <input 
                              type="text" 
                              value={med.name} 
                              onChange={(e) => handleMedicineChange(i, 'name', e.target.value)}
                              className={`w-full bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none px-1 py-1 font-medium ${isLowConfidence ? 'text-amber-900 border-amber-200' : 'text-slate-900'}`} 
                            />
                            {isLowConfidence && <span className="text-[10px] text-amber-600 block px-1">Check spelling</span>}
                          </td>
                          <td className="py-2 px-2">
                            <input 
                              type="text" 
                              value={med.dosage} 
                              onChange={(e) => handleMedicineChange(i, 'dosage', e.target.value)}
                              className="w-full bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none px-1 py-1 text-slate-600" 
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input 
                              type="text" 
                              value={med.frequency} 
                              onChange={(e) => handleMedicineChange(i, 'frequency', e.target.value)}
                              className="w-full bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none px-1 py-1 text-slate-600" 
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-start space-x-2 text-xs text-slate-500 mt-4">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Diagnosis is shown only if explicitly written in prescription. You can edit any details before saving.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-2">
                <button onClick={handleClear} className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors">
                  Clear
                </button>
                <button onClick={handleSaveToDiary} className="px-5 py-2 rounded-xl bg-[#5a32fa] hover:bg-[#4825cc] text-white font-semibold text-sm shadow-md transition-colors">
                  Save to Diary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Massive Image Preview (5 cols) */}
      <div className="lg:col-span-5 h-[calc(100vh-140px)] sticky top-24">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-bold text-slate-900">Original Document</h3>
           </div>
           <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-2">
             {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded" className="max-w-full rounded shadow-sm object-contain" style={{ maxHeight: '100%' }} />
             ) : (
                <div className="text-slate-400 text-sm flex flex-col items-center">
                  <FileText className="w-10 h-10 mb-2 opacity-20" />
                  No document uploaded
                </div>
             )}
           </div>
        </div>
      </div>

    </div>
  );
};
