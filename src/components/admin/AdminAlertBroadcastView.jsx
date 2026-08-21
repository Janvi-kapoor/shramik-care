import React, { useState } from 'react';
import { Megaphone, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAlertBroadcastView = () => {
  const { t, showToast } = useApp();
  const [message, setMessage] = useState('');
  const [targetDistricts, setTargetDistricts] = useState('all');

  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    setIsBroadcasting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Emergency Advisory',
          message: message,
          target_district: targetDistricts,
          target_languages: ['hi', 'bn', 'ml']
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Alert broadcasted successfully via SMS and Dashboards.', 'success');
      setMessage('');
    } catch (e) {
      showToast('Error broadcasting alert', 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
        <Megaphone className="w-5 h-5 text-amber-600" />
        <h2 className="text-xl font-bold text-slate-900">Multilingual Alert Broadcast Engine</h2>
      </div>

      <div className="max-w-2xl">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-amber-900">
            Messages typed in English will be automatically translated into Hindi, Bengali, and Malayalam and delivered directly to the guest workers' unified dashboards and via SMS.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target District(s)</label>
            <select 
              value={targetDistricts}
              onChange={(e) => setTargetDistricts(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm font-semibold focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Kerala Districts</option>
              <option value="ernakulam">Ernakulam (High Priority)</option>
              <option value="trivandrum">Thiruvananthapuram</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Emergency Advisory Message (English)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Extreme heat warning today. Please stay hydrated and avoid direct sun between 12 PM - 3 PM."
              className="w-full p-4 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-amber-500 min-h-[120px]"
            />
          </div>

          <button
            type="button"
            onClick={handleBroadcast}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg uppercase tracking-wider text-sm transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Advisory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
