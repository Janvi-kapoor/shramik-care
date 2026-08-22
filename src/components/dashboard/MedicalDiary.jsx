import React from 'react';
import { X, FileText, Calendar, Activity, Pill } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_PRESCRIPTION_SCANS } from '../../data/mockDatabase';

export const MedicalDiary = ({ isOpen, onClose, worker }) => {
  const { t } = useApp();
  
  if (!isOpen) return null;

  // For demo purposes, we will just use all MOCK_PRESCRIPTION_SCANS or filter by worker id if applicable.
  // Assuming the mock has workerId
  const records = MOCK_PRESCRIPTION_SCANS.filter(p => !p.workerId || p.workerId === worker.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-2xl bg-slate-50 sm:rounded-3xl rounded-t-3xl sm:h-auto h-[85vh] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
      >
        <div className="flex items-center justify-between p-4 md:p-6 bg-white border-b border-slate-100 sm:rounded-t-3xl rounded-t-3xl sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-teal-600" />
              Medical Records
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Past prescriptions and diagnoses</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 border-dashed">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No records found.</p>
            </div>
          ) : (
            records.map((record, index) => (
              <div key={record.id || index} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center">
                      <Activity className="w-4 h-4 mr-1.5 text-rose-500" />
                      {record.diagnosis || "General Checkup"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {record.date || "Recent"}
                    </p>
                  </div>
                  <div className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {record.facility || "Camp"}
                  </div>
                </div>

                {record.medicines && record.medicines.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center">
                      <Pill className="w-3.5 h-3.5 mr-1.5" />
                      Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {record.medicines.map((med, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="font-semibold text-slate-900 text-sm block">{med.name || med}</span>
                            {med.dosage && <span className="text-[10px] text-slate-500">{med.dosage}</span>}
                          </div>
                          {med.duration && (
                            <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                              {med.duration}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {record.doctorNotes && (
                  <div className="mt-4 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Doctor's Note</span>
                    <p className="text-xs text-slate-700">{record.doctorNotes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
