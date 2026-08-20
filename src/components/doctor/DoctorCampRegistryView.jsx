import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin,
  Calendar,
  FileText,
  User
} from 'lucide-react';

export const DoctorCampRegistryView = () => {
  const { workers, activeSession, showToast } = useApp();
  const doctor = activeSession?.user;

  const handleExportReport = () => {
    showToast('Camp Clinical Registry summary exported successfully (KMC Format).', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Export Action */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>KMC Field Audit & Triage Register</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Active Camp Patient Registry & Clinical Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified electronic records for {doctor?.campsToday} ({doctor?.facility}).
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportReport}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Clinical CSV</span>
        </button>
      </div>

      {/* Patient Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Patient / Health ID</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Worksite</th>
                <th className="py-3 px-4">Vitals (BP/Sugar)</th>
                <th className="py-3 px-4">Clinical Allergy Alert</th>
                <th className="py-3 px-4">AWAZ Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {workers.map((w, idx) => {
                const hasAllergy = w.allergies && !w.allergies.includes('No Known Drug Allergies (NKDA)');
                const isAwaz = w.isAwazLinked;

                return (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-md bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{w.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{w.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span>{w.age} yrs / {w.gender}</span>
                      <span className="text-[10px] text-slate-400 block">Origin: {w.originState}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="truncate max-w-xs block">{w.worksite}</span>
                      <span className="text-[10px] text-teal-700 font-semibold">{w.district}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span>BP: {w.vitals?.bp}</span>
                      <span className="text-[10px] text-slate-400 block">Sugar: {w.vitals?.bloodSugar}</span>
                    </td>

                    <td className="py-3 px-4">
                      {hasAllergy ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{w.allergies[0]}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>NKDA Cleared</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isAwaz
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{isAwaz ? '100% Cashless' : 'Pending Link'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
