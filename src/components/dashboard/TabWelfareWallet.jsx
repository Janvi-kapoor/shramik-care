import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KERALA_GOVT_SCHEMES } from '../../data/mockDatabase';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';

export const TabWelfareWallet = () => {
  const { activeSession, toggleAwazCardLink, showToast, t } = useApp();
  const [isVerifyingModal, setIsVerifyingModal] = useState(false);
  const [inputCardNo, setInputCardNo] = useState('');
  const [notifications, setNotifications] = useState([]);

  if (!activeSession || activeSession.role !== 'worker') return null;
  const worker = activeSession.user;
  const isLinked = !!worker.isAwazLinked;

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/workers/${worker.id}/notifications`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setNotifications(data);
        }
      })
      .catch(console.error);
  }, [worker.id]);

  const markAsRead = async (notifId) => {
    try {
      await fetch(`http://localhost:5000/api/workers/${worker.id}/notifications/${notifId}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const coverageLimit = worker.awazCoverageLimit || 50000;
  const utilizedAmount = worker.awazUtilizedAmount || 7500;
  const availableBalance = coverageLimit - utilizedAmount;
  const utilizedPercent = Math.round((utilizedAmount / coverageLimit) * 100);

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (!inputCardNo.trim()) {
      showToast('Please enter an AWAZ Card or Aadhaar number.', 'error');
      return;
    }
    toggleAwazCardLink();
    setIsVerifyingModal(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Govt Advisories */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map(notif => {
            const localizedMessage = notif.translations?.[activeSession.language] || notif.message;
            return (
              <div key={notif.id} className={`p-4 rounded-xl border ${notif.is_read ? 'bg-slate-50 border-slate-200' : 'bg-rose-50 border-rose-200 shadow-sm'} flex items-start gap-3 transition-colors`}>
                <div className={`p-2 rounded-lg ${notif.is_read ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-600'}`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${notif.is_read ? 'text-slate-700' : 'text-rose-900'}`}>{notif.title}</h3>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${notif.is_read ? 'text-slate-600' : 'text-rose-800'}`}>{localizedMessage}</p>
                </div>
                {!notif.is_read && (
                  <button onClick={() => markAsRead(notif.id)} className="text-[10px] font-bold text-rose-700 uppercase bg-rose-100 hover:bg-rose-200 px-2 py-1 rounded">Mark Read</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Kerala Dept. of Labour & Skills</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            {t('walletTitle')}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {t('walletSub')}
          </p>
        </div>

        <div>
          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
            isLinked
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}>
            {isLinked ? '✓ AWAZ Active' : '⚠ Link Pending'}
          </span>
        </div>
      </div>

      {/* 2. VERIFIED AWAZ LEDGER GAUGE */}
      {isLinked ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  {t('awazCardLinkedTitle')}
                </span>
                <span className="text-sm md:text-base font-bold text-slate-900 font-mono">
                  {worker.awazCardNo || 'AWZ-KL-2024-88190'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleAwazCardLink}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
            >
              Unlink Card (Demo)
            </button>
          </div>

          {/* ₹50,000 Cashless Ledger Gauge */}
          <div>
            <div className="flex items-center justify-between mb-2 text-xs font-semibold">
              <span className="text-slate-500 uppercase tracking-wider">
                {t('awazLimitTitle')}
              </span>
              <span className="text-slate-900 font-mono font-bold">
                ₹{coverageLimit.toLocaleString('en-IN')} / Year
              </span>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-teal-700 rounded-full transition-all duration-300"
                style={{ width: `${100 - utilizedPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-lg bg-teal-50/70 border border-teal-200">
                <span className="text-[10px] font-bold uppercase text-teal-800 block">
                  {t('awazAvailableBalance')}
                </span>
                <span className="text-lg md:text-xl font-bold text-teal-950 font-mono mt-0.5 block">
                  ₹{availableBalance.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-teal-700 block mt-0.5">
                  Cashless across Kerala Hospitals
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  {t('awazUtilized')}
                </span>
                <span className="text-lg md:text-xl font-bold text-slate-700 font-mono mt-0.5 block">
                  ₹{utilizedAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  OPD & Diagnostics (Settled)
                </span>
              </div>
            </div>
          </div>

          {/* Recent Claims */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {t('recentClaimsTitle')}
            </span>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {t('claimHospital')}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    12 Feb 2025 • Claim ID: AWZ-CLM-8821
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 font-mono block">
                  ₹7,500
                </span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  Settled
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* UNLINKED STATE / VERIFICATION GATE */
        <div className="bg-white rounded-xl border border-amber-300 shadow-sm p-5 md:p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-lg bg-amber-500 text-slate-950">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('awazCardUnlinkedTitle')}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Link your Kerala AWAZ insurance card or Aadhaar number to activate ₹50,000 cashless hospital benefits and ₹2 Lakh accidental insurance.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={toggleAwazCardLink}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>1-Click Auto-Link AWAZ Card</span>
            </button>

            <button
              type="button"
              onClick={() => setIsVerifyingModal(true)}
              className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              Enter Card No. Manually
            </button>
          </div>
        </div>
      )}

      {/* Manual Verify Modal */}
      {isVerifyingModal && (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter 12-Digit Aadhaar / AWAZ Number
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputCardNo}
              onChange={(e) => setInputCardNo(e.target.value)}
              placeholder="e.g. AWZ-KL-2024-88190"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs font-semibold"
            />
            <button
              onClick={handleManualVerify}
              className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase"
            >
              Verify
            </button>
            <button
              onClick={() => setIsVerifyingModal(false)}
              className="px-3 py-2 rounded-lg bg-slate-200 text-slate-600 font-semibold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. Kerala Govt Schemes Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {t('otherSchemesTitle')}
          </h3>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            4 Active Schemes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KERALA_GOVT_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-teal-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold uppercase">
                    {scheme.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{scheme.status}</span>
                  </span>
                </div>

                <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {scheme.title}
                </h4>
                <span className="text-xs font-semibold text-teal-800 block mt-0.5">
                  {scheme.titleMalayalam}
                </span>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Health Cover:</strong> {scheme.healthCover}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Accidental / Relief:</strong> {scheme.accidentalCover}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span><strong>How to claim:</strong> {scheme.howToApply}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${scheme.helpline.replace(/\D/g, '')}`}
                  className="inline-flex items-center space-x-1 font-bold text-teal-800 hover:text-teal-950"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Helpline: {scheme.helpline}</span>
                </a>

                <span className="text-[10px] text-slate-400">
                  {scheme.department.split(',')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
