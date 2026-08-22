import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkerHealthCard } from '../WorkerHealthCard';
import { 
  Calendar, 
  ArrowRight,
  Activity,
  HeartPulse,
  Scale,
  Ruler
} from 'lucide-react';

export const TabHealthPassport = () => {
  const { activeSession, t, getMedicinesForWorker } = useApp();
  const navigate = useNavigate();

  if (!activeSession || activeSession.role !== 'worker') return null;
  const worker = activeSession.user;
  
  let activeMedsCount = 0;
  if (getMedicinesForWorker) {
    const medicines = getMedicinesForWorker(worker.id);
    activeMedsCount = medicines ? medicines.length : 0;
  } else {
    activeMedsCount = 2; // Fallback for demo
  }

  // Exact data from the backend/free camp JSON
  const vitals = worker.vitals || {
    bp: "120/80 mmHg",
    bloodSugar: "94 mg/dL",
    pulse: "72 bpm",
    weight: "68 kg",
    height: "170 cm",
    bmi: "23.5",
    lastUpdated: "14 May 2025 - Kerala Health Camp"
  };

  return (
    <div className="animate-in fade-in duration-200 space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Health ID Card */}
        <div className="lg:col-span-2">
          <WorkerHealthCard worker={worker} />
        </div>

        {/* Right: Health Vitals from Free Camp */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-slate-900">{t('wpHealthPassport', 'Camp Health Metrics')}</h3>
               <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <Activity className="w-5 h-5" />
               </div>
            </div>
            
            <p className="text-slate-500 text-xs mb-5">
              Verified records from your last health camp enrollment.
            </p>
            
            <div className="space-y-3 flex-1">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-semibold text-slate-700">Blood Pressure</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{vitals.bp}</span>
               </div>
               
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">Blood Sugar</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{vitals.bloodSugar}</span>
               </div>

               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Scale className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Weight & BMI</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{vitals.weight} ({vitals.bmi})</span>
               </div>
               
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Ruler className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-slate-700">Height</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{vitals.height}</span>
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
               <p className="text-[11px] text-slate-400 text-center">Last recorded: {vitals.lastUpdated}</p>
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Last Consultation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#5a32fa]/10 flex items-center justify-center text-[#5a32fa] shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 mb-1">Last Consultation</p>
              <h3 className="font-bold text-slate-900 text-base">Dr. Anjali Menon</h3>
              <p className="text-xs text-slate-500 mb-2">General Physician</p>
              <p className="text-xs font-semibold text-slate-600">14 May 2025</p>
            </div>
          </div>
        </div>

        {/* Medical Diary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
           <div>
             <h3 className="text-sm font-bold text-slate-900 mb-4">{t('wpMedicalDiary', 'Medical Diary')}</h3>
             <div className="flex justify-between mb-6">
                <div>
                   <p className="text-xs text-slate-500">Total Records</p>
                   <p className="text-sm font-semibold text-slate-900">3</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-500">Last Updated</p>
                   <p className="text-sm font-semibold text-slate-900">14 May 2025</p>
                </div>
             </div>
           </div>
           
           <button 
             onClick={() => navigate('/worker/diary')}
             className="w-full py-3 bg-[#5a32fa] hover:bg-[#4825cc] text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-md"
           >
             <span>View Medical Diary</span>
             <ArrowRight className="w-4 h-4" />
           </button>
        </div>

      </div>

      <div className="text-center">
         <p className="text-xs text-slate-400">Keep your Health ID safe and show it during every healthcare visit.</p>
      </div>

    </div>
  );
};
