import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, Stethoscope, AlertCircle, Sparkles, UserPlus } from 'lucide-react';

export const HealthCampTicker = () => {
  const { t, activeSession, showToast } = useApp();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/camps/active');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCamps(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCamp = async (campId) => {
    if (!activeSession?.user?.id) {
      showToast('error', 'Please login to enroll in a camp.');
      return;
    }
    setEnrolling(campId);
    try {
      const res = await fetch('http://localhost:5000/api/workers/enroll-camp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId: activeSession.user.id, campId })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('success', `Successfully enrolled! Your token is ${json.token}`);
      fetchCamps();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) return null;

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available Health Camps</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Government Health Camps
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Free screening and medical checkups near your worksite
            </p>
          </div>
        </div>

        {/* Camp Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {camps.map((camp) => (
            <div
              key={camp.id}
              className="bg-slate-50 hover:bg-white rounded-xl p-4 border border-slate-200 hover:border-teal-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    <span>{camp.status}</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    {camp.id.split('-')[1]}
                  </span>
                </div>

                <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {camp.purpose}
                </h4>

                {/* Camp Venue & Timings */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{camp.location} ({camp.district})</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>{camp.date}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-4 border-t border-slate-200/80">
                <button
                  onClick={() => enrollInCamp(camp.id)}
                  disabled={enrolling === camp.id}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {enrolling === camp.id ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" /> Enroll Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
          {camps.length === 0 && (
            <div className="col-span-3 p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl">
              No health camps are currently scheduled in your area.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
