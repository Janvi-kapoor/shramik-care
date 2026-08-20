import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, PhoneCall, Heart, ExternalLink, Activity, FileText } from 'lucide-react';

export const Footer = () => {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-24 border-t border-slate-800">
      {/* Upper Helpline Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('footerHelplineTitle')}
                </span>
                <span className="text-sm font-semibold text-white">
                  24x7 Multi-lingual Emergency Support for Kerala Guest Workers
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-semibold">
              <a
                href="tel:1056"
                className="px-3 py-1.5 rounded-lg bg-teal-900/60 border border-teal-700/50 text-teal-300 hover:bg-teal-800 transition-colors"
              >
                {t('footerDisha')}
              </a>
              <a
                href="tel:18004251147"
                className="px-3 py-1.5 rounded-lg bg-amber-900/40 border border-amber-700/50 text-amber-300 hover:bg-amber-800 transition-colors"
              >
                {t('footerAwaz')}
              </a>
              <a
                href="tel:155214"
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {t('footerLabour')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Govt Endorsement */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-md">
                KL
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Shramik<span className="text-teal-400">Care</span>
                </span>
                <span className="text-xs block text-slate-400">
                  {t('brandTagline')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A public digital health initiative by the Government of Kerala, uniting the Department of Labour & Skills and the Directorate of Health Services to provide continuous, dignified healthcare and health identity for interstate migrant workers.
            </p>

            <div className="flex items-center space-x-2 text-xs text-teal-400">
              <Shield className="w-4 h-4" />
              <span>{t('footerPrivacy')}</span>
            </div>
          </div>

          {/* Col 2: Key Programs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Kerala Health Initiatives
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-teal-300 transition-colors cursor-pointer">
                AWAZ Health Insurance Scheme
              </li>
              <li className="hover:text-teal-300 transition-colors cursor-pointer">
                Arogyakeralam Mobile Clinics
              </li>
              <li className="hover:text-teal-300 transition-colors cursor-pointer">
                Karunya Arogya Suraksha Padhathi (KASP)
              </li>
              <li className="hover:text-teal-300 transition-colors cursor-pointer">
                Perumbavoor Migrant Wellness Hub
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Standards */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Digital Health Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>ABHA / ABDM Architecture</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>KMC Doctor Verification</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>FHIR & ISO 27001 Ready</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>DPDP Act 2023 Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between text-xs text-slate-500">
          <span>{t('footerCopy')}</span>
          <span className="mt-2 sm:mt-0 block">
            Phase 1 Foundation • Kerala Digital Health Stack
          </span>
        </div>
      </div>
    </footer>
  );
};
