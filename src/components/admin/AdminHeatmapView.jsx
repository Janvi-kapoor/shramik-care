import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Users, MapPin, CheckCircle2, ChevronRight, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminHeatmapView = () => {
  const { showToast, adminApi } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('All Districts');

  useEffect(() => {
    fetchData();
  }, [district]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const json = await adminApi(`/health-overview?district=${encodeURIComponent(district)}`);
      const outJson = await adminApi(`/outbreak?district=${encodeURIComponent(district)}`);

      if (json.error) throw new Error(json.error);

      // Merge outbreak data into clusters/alerts so UI doesn't break
      if (outJson.success) {
         json.clusters = outJson.allData.map(d => ({ district: d.district, condition: d.symptom, count: d.count }));
         json.alerts = outJson.outbreaks.map(o => ({
             id: `ALT-${o.district}-${o.symptom}`,
             district: o.district,
             condition: o.symptom,
             count: o.count,
             status: 'High Activity',
             message: `${o.symptom} activity is above threshold.`
         }));
         json.metrics.activeAlerts = json.alerts.length;
      }

      setData(json);
    } catch (err) {
      console.error(err);
      showToast('Failed to load health overview', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5a52d9]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">District Public Health Overview</h2>
          <p className="text-sm text-slate-500">Real-time aggregation of doctor consultations and health events</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer py-2 pl-2 pr-8"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option>All Districts</option>
            <option>Ernakulam</option>
            <option>Palakkad</option>
          </select>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500">Active Alerts</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">{data?.metrics?.activeAlerts || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500">Active Camps</span>
            <MapPin className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">{data?.metrics?.activeCamps || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500">Registered Workers</span>
            <Users className="w-5 h-5 text-teal-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">{data?.metrics?.totalWorkers || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500">Health Reports</span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">{data?.metrics?.totalReports || 0}</span>
        </div>
      </div>

      {/* Health Alerts */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-rose-600" />
          Automated Health Alerts
        </h3>

        {data?.alerts?.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3" />
            <span className="text-emerald-800 font-medium">No activity thresholds exceeded in the selected region.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.alerts?.map(alert => (
              <div key={alert.id} className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-1 rounded border border-rose-200">
                    {alert.status}
                  </span>
                  <span className="text-sm font-bold text-slate-500">{alert.district}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{alert.condition} Activity Rising</h4>
                <p className="text-sm text-slate-600 mb-4">{alert.count} reported cases from recent doctor consultations.</p>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-xs text-rose-600 font-bold flex items-center">
                    <Activity className="w-3 h-3 mr-1" /> Monitoring Required
                  </span>
                  <button className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center">
                    Deploy Camp <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disease Clusters Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Anonymized Activity Clusters</h3>
          <span className="text-xs text-slate-500">Sourced from Doctor Consultations</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">District</th>
                <th className="px-4 py-3 font-semibold">Symptom</th>
                <th className="px-4 py-3 font-semibold">Reports</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.clusters?.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.district}</td>
                  <td className="px-4 py-3 text-slate-600">{c.condition}</td>
                  <td className="px-4 py-3 font-mono font-medium text-slate-700">{c.count}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      c.count >= 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {c.count >= 10 ? 'Increased' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.clusters || data.clusters.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500">No health events recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
