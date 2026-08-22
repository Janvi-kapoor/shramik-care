import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Languages,
  Stethoscope,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const DoctorPatientLookup = () => {
  const { selectedPatient, setSelectedPatient, doctorApi, showToast } = useApp();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState([]);
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState('');
  const [consultation, setConsultation] = useState({ diagnosis: '', notes: '', publicHealthCondition: '' });

  useEffect(() => {
    if (selectedPatient?.id) {
      setLoading(true);
      doctorApi(`/patients/${selectedPatient.id}/report`)
                .then(data => {
                  setReport(data);
                  setSelectedPatient(data.worker);
                  setPrescriptions(data.prescriptions || []);
                  return data;
                })
        .then(() => doctorApi(`/patients/${selectedPatient.id}/summary`))
        .then(data => setSummary(data.summary))
        .catch(err => showToast(err.message, 'error'))
        .finally(() => setLoading(false));
    }
  }, [selectedPatient?.id]);

  if (!selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full bg-white rounded-xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">No Patient Selected</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">
          Please scan a worker's QR pass or select a patient from the QR Scanner tab.
        </p>
        <button
          onClick={() => navigate('/doctor/scanner')}
          className="mt-6 px-4 py-2 bg-teal-800 text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-teal-900"
        >
          Go to QR Scanner
        </button>
      </div>
    );
  }

  const vitals = selectedPatient?.vitals || {
    bp: "120/80 mmHg",
    bloodSugar: "94 mg/dL",
    pulse: "72 bpm",
    spO2: "99%",
    lastUpdated: "Camp Checkup"
  };

  const hasAllergy = selectedPatient.allergies && !selectedPatient.allergies.includes('No Known Drug Allergies (NKDA)');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
      {report && !loading && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
          <div className="flex items-center gap-2 mb-1"><Stethoscope className="w-4 h-4 text-teal-800" /><h4 className="text-xs font-black uppercase tracking-wider text-teal-900">AI-assisted record summary</h4></div>
          <p className="text-sm text-teal-950">{summary || 'No summary available.'}</p>
          <p className="text-[10px] text-teal-800 mt-1">Informational summary of stored records, not a diagnosis.</p>
        </div>
      )}
      {hasAllergy && (
        <div className="p-4 rounded-lg bg-rose-50 border-2 border-rose-500 flex items-center space-x-3 animate-pulse">
          <AlertCircle className="w-6 h-6 text-rose-600" />
          <div>
            <h4 className="text-rose-900 font-black text-sm uppercase tracking-wide">Critical Allergy Alert</h4>
            <p className="text-rose-700 text-xs font-bold mt-0.5">
              {Array.isArray(selectedPatient.allergies) ? selectedPatient.allergies.join(', ') : selectedPatient.allergies}
            </p>
          </div>
        </div>
      )}

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
                Blood: {selectedPatient.bloodGroup}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 font-bold text-xs">
                {selectedPatient.gender}, {selectedPatient.age} yrs
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-mono mt-1">
              <span className="font-bold text-teal-900">ID: {selectedPatient.id}</span>
              <span>•</span>
              <span>ABHA: {selectedPatient.abhaId}</span>
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
            onClick={() => navigate('/doctor/translator')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>Translate</span>
          </button>
        </div>
      </div>

      {/* Vitals Baseline Grid */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Current Screening Vitals ({selectedPatient.assignedFacility || 'Camp'}):
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

        {loading ? (
          <div className="text-center p-6 text-slate-500 text-sm animate-pulse">
            Loading prescription records...
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-700">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-800 mt-0.5 flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {rx.doctorName} {rx.doctorId !== 'DOC-UNKNOWN' ? `(${rx.doctorId})` : ''}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {new Date(rx.timestamp || rx.date).toLocaleDateString()}
                    </span>
                  </div>
                  {rx.diagnosis && (
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      <strong>Diagnosis:</strong> {rx.diagnosis}
                    </p>
                  )}
                  {rx.medicines && rx.medicines.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <strong>Prescribed Medicines:</strong>
                      <ul className="list-disc pl-5">
                        {rx.medicines.map((m) => (
                          <li key={m.id}>
                            {m.name} ({m.genericName}) - {m.dosage} - {m.frequency} for {m.duration}
                            {m.instructions ? ` (${m.instructions})` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {report?.consultations?.map((consultation) => (
              <div key={consultation.id} className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-800 mt-0.5 flex-shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                <div className="flex-1"><div className="flex items-center justify-between"><span className="font-bold text-slate-900 text-sm">Consultation: {consultation.diagnosis || 'General consultation'}</span><span className="text-slate-400 font-mono text-[10px]">{new Date(consultation.date).toLocaleDateString()}</span></div>{consultation.notes && <p className="text-slate-600 mt-1 leading-relaxed">{consultation.notes}</p>}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
