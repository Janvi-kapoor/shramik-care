import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, Activity, Pill } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_PRESCRIPTION_SCANS } from '../data/mockDatabase';

export const MedicalDiaryPage = () => {
  const { activeSession, t, getSavedPrescriptionsForWorker } = useApp();
  const navigate = useNavigate();
  
  if (!activeSession) return null;
  const worker = activeSession.user;

  const contextRecords = getSavedPrescriptionsForWorker ? getSavedPrescriptionsForWorker(worker.id) : [];
  const records = [...contextRecords, ...MOCK_PRESCRIPTION_SCANS.filter(p => !p.workerId || p.workerId === worker.id)];

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Medical Diary</h2>
          <p className="text-sm text-slate-500">Your past consultations & records</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Records Found</h3>
          <p className="text-sm text-slate-500 mt-1">Your medical diary is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Prescription Record</h4>
                    <div className="flex items-center text-xs text-slate-500 space-x-2 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-100">
                  Verified
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-4">
                <div className="flex items-center space-x-1.5 mb-1 text-slate-700">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Diagnosis</span>
                </div>
                <p className="text-sm font-medium text-slate-900 pl-5.5">{record.diagnosis || "General Checkup"}</p>
              </div>

              {/* Medicines */}
              {record.medicines && record.medicines.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                   <div className="flex items-center space-x-1.5 mb-2 text-slate-700">
                    <Pill className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Prescribed Medicines ({record.medicines.length})</span>
                  </div>
                  <div className="space-y-2 pl-5.5">
                    {record.medicines.map((med, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-800">{med.name}</span>
                        <span className="text-slate-500 text-xs">{med.dosage} • {med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
