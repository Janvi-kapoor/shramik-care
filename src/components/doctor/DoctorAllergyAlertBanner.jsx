import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, AlertOctagon, HeartHandshake } from 'lucide-react';

export const DoctorAllergyAlertBanner = ({ patient }) => {
  if (!patient) return null;

  const allergies = patient.allergies || [];
  const hasPenicillin = allergies.some((a) => a.toLowerCase().includes('penicillin') || a.toLowerCase().includes('amoxicillin'));
  const hasSulfa = allergies.some((a) => a.toLowerCase().includes('sulfa'));
  const hasAllergies = allergies.length > 0 && !allergies.includes('No Known Drug Allergies (NKDA)');
  const conditions = patient.conditions || [];

  if (!hasAllergies && conditions.length === 0) {
    return (
      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">Clinical Baseline Safe:</span>
          <span>No Known Drug Allergies (NKDA) • Baseline Vitals Cleared</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-100 font-extrabold text-[10px] uppercase">
          Safe to Prescribe
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* Critical Allergy Flashing Red Banner */}
      {hasAllergies && (
        <div className="p-4 rounded-xl bg-rose-600 text-white shadow-lg border-2 border-rose-400 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-black/30 text-amber-300 flex-shrink-0 mt-0.5">
              <AlertOctagon className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.2 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Contraindication Alert
                </span>
                <span className="text-xs font-bold text-rose-100">
                  Critical Patient Safety Warning
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                🚨 ALLERGY DETECTED: {allergies.join(', ')}
              </h3>

              {hasPenicillin && (
                <p className="text-xs text-rose-100 mt-1 font-semibold leading-relaxed">
                  ⚠️ <strong>DO NOT PRESCRIBE BETA-LACTAM ANTIBIOTICS</strong> (Amoxicillin, Augmentin, Ampicillin). Safe Alternatives: <strong>Azithromycin 500mg</strong> or <strong>Cefixime / Doxycycline</strong>.
                </p>
              )}

              {hasSulfa && (
                <p className="text-xs text-rose-100 mt-1 font-semibold leading-relaxed">
                  ⚠️ <strong>DO NOT PRESCRIBE SULFONAMIDES / BACTRIM / COTRIMOXAZOLE</strong>.
                </p>
              )}
            </div>
          </div>

          <div className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-black/40 text-amber-300 text-xs font-black uppercase tracking-wider border border-white/20 whitespace-nowrap">
            High Severity
          </div>
        </div>
      )}

      {/* Chronic Conditions Notice */}
      {conditions.length > 0 && !conditions.includes('Healthy Baseline') && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-bold">Chronic Condition Alert:</span>
            <span>{conditions.join(' • ')}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-200/80 font-bold text-[10px]">
            Check Renal/Hepatic Dosing
          </span>
        </div>
      )}
    </div>
  );
};
