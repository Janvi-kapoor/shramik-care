import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminInsuranceClaimsView = () => {
  const { showToast } = useApp();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/claims');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClaims(data);
    } catch (err) {
      showToast('Error loading claims', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/claims/${id}`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(`Claim ${id} Approved. Funds released to worker ledger.`, 'success');
      fetchClaims();
    } catch (err) {
      showToast('Error approving claim', 'error');
    }
  };

  const pendingClaims = claims.filter(c => c.status !== 'Settled');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-900">AWAZ Insurance Claim Settlement Hub</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
              <th className="p-3 border-b border-slate-200 font-bold rounded-tl-lg">Claim ID</th>
              <th className="p-3 border-b border-slate-200 font-bold">Worker ID</th>
              <th className="p-3 border-b border-slate-200 font-bold">Reason</th>
              <th className="p-3 border-b border-slate-200 font-bold">Amount</th>
              <th className="p-3 border-b border-slate-200 font-bold text-right rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                <td className="p-3 text-xs font-bold text-slate-900">{claim.id}</td>
                <td className="p-3">
                  <div className="text-[10px] font-mono text-slate-500">{claim.workerId}</div>
                </td>
                <td className="p-3 text-xs text-slate-600 font-medium">{claim.reason}</td>
                <td className="p-3 text-sm font-bold text-emerald-700">₹{claim.amount}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleApprove(claim.id)} className="p-1.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors" title="Approve & Release Funds">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors" title="Reject Claim">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pendingClaims.length === 0 && !loading && (
          <div className="p-6 text-center text-sm text-slate-500 font-medium">
            No pending claims for settlement.
          </div>
        )}
      </div>
    </div>
  );
};
