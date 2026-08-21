import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  AlertTriangle, 
  Pill, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Stethoscope, 
  ArrowRight,
  QrCode,
  Languages,
  ClipboardList,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const DoctorOverviewView = () => {
  const { workers: appWorkers, activeSession, selectedPatient, setSelectedPatient, setActiveDoctorTab, t } = useApp();
  const doctor = activeSession?.user;
  
  const [activeCamp, setActiveCamp] = React.useState(null);
  const [campWorkers, setCampWorkers] = React.useState([]);

  React.useEffect(() => {
    if (doctor?.id) {
      fetch(`http://localhost:5000/api/camps/doctor/${doctor.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setActiveCamp(data[0]); // Active camp
            return fetch(`http://localhost:5000/api/camps/${data[0].id}/workers`);
          }
        })
        .then(res => res ? res.json() : [])
        .then(data => {
          if (data && !data.error) setCampWorkers(data);
        })
        .catch(console.error);
    }
  }, [doctor?.id]);

  const workers = activeCamp ? campWorkers : appWorkers;

  const stats = [
    {
      label: "Patients Triaged Today",
      value: workers.length.toString(),
      subtext: "On-site camp screening",
      icon: Users,
      color: "text-teal-900 bg-teal-50 border-teal-200"
    },
    {
      label: "Critical Allergies Flagged",
      value: workers.filter(w => w.allergies && !w.allergies.includes('No Known Drug Allergies (NKDA)')).length.toString(),
      subtext: "Penicillin & Sulfa alerts",
      icon: AlertTriangle,
      color: "text-rose-900 bg-rose-50 border-rose-200"
    },
    {
      label: "Prescriptions Dispatched",
      value: "0",
      subtext: "Jan Aushadhi generic linked",
      icon: Pill,
      color: "text-amber-900 bg-amber-50 border-amber-200"
    },
    {
      label: "AWAZ Cashless Coverage",
      value: "100%",
      subtext: "Zero out-of-pocket claims",
      icon: ShieldCheck,
      color: "text-emerald-900 bg-emerald-50 border-emerald-200"
    }
  ];

  const handleSelectAndGo = (worker) => {
    setSelectedPatient(worker);
    setActiveDoctorTab('patient-lookup');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Active Camp Header Card */}
      <div className="bg-gradient-to-r from-[#042F2E] via-[#0D5C52] to-[#064E3B] text-white rounded-xl p-5 md:p-6 shadow-sm border border-teal-600/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1.5 border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Health Camp Active</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {activeCamp ? activeCamp.name : 'No Active Camps Assigned'}
          </h2>
          <span className="text-xs text-teal-100 block mt-1">
            Nodal Hospital: {doctor?.facility} • Location: {activeCamp ? activeCamp.district : 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveDoctorTab('patient-lookup')}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Next Patient</span>
          </button>
        </div>
      </div>

      {/* 4 Clinical Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${stat.color} shadow-2xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{stat.label}</span>
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-2xl lg:text-3xl font-black">{stat.value}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{stat.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Overview Section: Live Queue & Fast Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camp Patient Queue (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Today's Camp Patient Triage Queue
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              {workers.length} Registered at Desk
            </span>
          </div>

          <div className="space-y-2.5">
            {workers.map((w) => {
              const isSelected = selectedPatient?.id === w.id;
              const hasAllergy = w.allergies && !w.allergies.includes('No Known Drug Allergies (NKDA)');

              return (
                <div
                  key={w.id}
                  onClick={() => handleSelectAndGo(w)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50/60 border-teal-400 ring-1 ring-teal-400/30'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                      {w.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {w.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold">
                          {w.bloodGroup}
                        </span>
                        {hasAllergy && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                            ⚠️ Allergy
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {w.id} • {w.originState} • {w.worksite?.split(',')[0]}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-teal-900 flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Navigation Tools (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Voice Translator Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <Languages className="w-5 h-5 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">
                2-Way Voice Translator Room
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly speak in English/Malayalam and let the system speak Hindi or Bengali to the guest worker.
            </p>
            <button
              onClick={() => setActiveDoctorTab('voice-translator')}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              <Languages className="w-4 h-4" />
              <span>Open Voice Translator</span>
            </button>
          </div>

          {/* Quick Camp Audit Report Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Camp Audit Registry & Records
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export government-compliant camp clinical records, vitals, and AWAZ claim settlement documentation.
            </p>
            <button
              onClick={() => setActiveDoctorTab('camp-registry')}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              <ClipboardList className="w-4 h-4" />
              <span>View Camp Registry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
