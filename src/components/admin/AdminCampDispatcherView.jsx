import React, { useState, useEffect } from 'react';
import { Bus, Users, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCampDispatcherView = () => {
  const { showToast } = useApp();
  
  const [camps, setCamps] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCamps();
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/doctors');
      const json = await res.json();
      if (res.ok) setDoctors(json);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  };

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/camps');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCamps(json);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load camps');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDispatch = async (e) => {
    e.preventDefault();
    const district = e.target.elements.district.value;
    const location = e.target.elements.location.value;
    const date = e.target.elements.date.value;
    const purpose = e.target.elements.purpose.value;
    const capacity = parseInt(e.target.elements.capacity.value, 10);
    const assigned_doctor_ids = e.target.elements.doctor.value;
    
    if (!date) {
      showToast('error', 'Please select a date for the camp');
      return;
    }
    if (capacity <= 0) {
      showToast('error', 'Capacity must be a positive number');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/camps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district, location, date, purpose, capacity, assigned_doctor_ids })
      });
      
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      
      showToast('success', `Health camp deployed successfully.`);
      e.target.reset();
      fetchCamps();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <Bus className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900">Health Camp Dispatcher</h2>
        </div>
        <button onClick={fetchCamps} className="p-2 text-slate-500 hover:text-teal-600 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-xl border border-teal-100 bg-teal-50 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-700"/> Deploy New Medical Camp</h3>
            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target District</label>
                <select name="district" className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold focus:ring-1 focus:ring-teal-500 bg-white shadow-sm">
                  <option value="Ernakulam">Ernakulam</option>
                  <option value="Palakkad">Palakkad</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Specific Location</label>
                <input name="location" type="text" required placeholder="e.g. Perumbavoor Factory" className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-teal-500 bg-white shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Purpose / Focus</label>
                <input name="purpose" type="text" required defaultValue="Fever Screening" className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-teal-500 bg-white shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  <input name="date" type="date" required className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-teal-500 bg-white shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Capacity</label>
                  <input name="capacity" type="number" required defaultValue="50" min="1" className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-teal-500 bg-white shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned Doctor</label>
                <select name="doctor" required className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold focus:ring-1 focus:ring-teal-500 bg-white shadow-sm">
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.facility})</option>
                  ))}
                  {doctors.length === 0 && <option value="">Loading doctors...</option>}
                </select>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg uppercase tracking-wider text-sm transition-colors shadow-md mt-2 flex justify-center">
                {isSubmitting ? <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Deploy Camp'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900 mb-2">Deployed Medical Camps</h3>
          {camps.length === 0 && !loading && (
             <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl">No active camps deployed.</div>
          )}
          <div className="space-y-3">
            {camps.map(camp => (
              <div key={camp.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {camp.status}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{camp.purpose}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {camp.district} • {camp.location}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {camp.date}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {camp.enrolled}/{camp.capacity} Registered</span>
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors">
                    View Enrolled Patients
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
