import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCards } from '../components/MetricCards';
import { HealthCampTicker } from '../components/HealthCampTicker';
import { MedicalCampCarousel } from '../components/MedicalCampCarousel';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  HeartPulse, 
  QrCode, 
  Pill, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Phone,
  Sparkles,
  Stethoscope,
  Building2
} from 'lucide-react';

const SCHEMES_LIST = [
  {
    id: 'SCHEME-AWAZ',
    title: 'AWAZ Health & Accidental Insurance Scheme',
    titleMalayalam: 'ആവാസ് ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതി',
    badge: '100% Free For Guest Workers',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: ShieldCheck,
    iconColor: 'text-emerald-600 bg-emerald-50',
    summary: 'Kerala Government\'s premier insurance scheme providing ₹50,000 annual cashless medical treatment and ₹2,00,000 accidental death/disability relief across empanelled hospitals for all registered interstate workers.',
    highlights: [
      '₹50,000 / Year Cashless Treatment',
      '₹2,00,000 Accidental Relief',
      '100% Free Enrolment at Camp'
    ],
    helpline: '1800-425-1147',
    department: 'Department of Labour and Skills, Govt. of Kerala'
  },
  {
    id: 'SCHEME-KASP',
    title: 'Karunya Arogya Suraksha Padhathi (KASP)',
    titleMalayalam: 'കാരുണ്യ ആരോഗ്യ സുരക്ഷാ പദ്ധതി',
    badge: 'Secondary & Tertiary Care',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: HeartPulse,
    iconColor: 'text-rose-600 bg-rose-50',
    summary: 'Comprehensive health security program offering secondary and tertiary hospitalization cover up to ₹5,00,000 per family annually for critical illnesses and surgical treatments.',
    highlights: [
      'Up to ₹5,00,000 / Family Annually',
      'Covers Major Surgeries & ICU Care',
      'Empanelled Govt & Super Specialty Hospitals'
    ],
    helpline: '1056 (DISHA)',
    department: 'Health & Family Welfare Dept., Govt. of Kerala'
  },
  {
    id: 'SCHEME-ABHA',
    title: '14-Digit ABHA Smart Digital Health Passport',
    titleMalayalam: 'ആയുഷ്മാൻ ഭാരത് ആഭ ഡിജിറ്റൽ പാസ്‌പോർട്ട്',
    badge: 'ABDM National Portability',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    icon: QrCode,
    iconColor: 'text-teal-700 bg-teal-50',
    summary: 'National Ayushman Bharat Digital Mission (ABDM) integration linking medical histories, vaccinations, and allergies into a single portable QR code for instant doctor triage.',
    highlights: [
      '1-Second Doctor QR Triage',
      'Lifetime Portable Across All Indian States',
      'Encrypted Health Records under DPDP Act'
    ],
    helpline: '14477',
    department: 'National Health Authority & Kerala DHS'
  },
  {
    id: 'SCHEME-JANAUSHADHI',
    title: 'PM Jan Aushadhi Generic Savings Program',
    titleMalayalam: 'പ്രധാനമന്ത്രി ജൻ ഔഷധി കേന്ദ്രങ്ങൾ',
    badge: 'Up to 85% Price Savings',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: Pill,
    iconColor: 'text-amber-600 bg-amber-50',
    summary: 'Central and state government network delivering certified, high-quality generic equivalents of doctor prescriptions at 80% to 90% cheaper prices with district store locators.',
    highlights: [
      'Save ₹200+ per Doctor Prescription',
      'WHO-GMP Certified Generic Formulations',
      'Over 80+ Stores Across Kerala Industrial Hubs'
    ],
    helpline: '1800-180-8080',
    department: 'Pharmaceuticals & Medical Devices Bureau of India'
  }
];

export const LandingAuthPage = () => {
  const { openAuthModal, login, t } = useApp();
  
  // Clickable Dropdown / Accordion state for schemes
  const [openScheme, setOpenScheme] = useState(null);

  const toggleScheme = (id) => {
    setOpenScheme(openScheme === id ? null : id);
  };

  return (
    <div className="space-y-12 md:space-y-16 pb-16">
      {/* ========================================================================= */}
      {/* 1. LANDING PAGE HERO (STRICT 50-50 SPLIT ON DESKTOP)                      */}
      {/* ========================================================================= */}
      <section 
        className="relative overflow-hidden text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 shadow-xl"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(4, 47, 46, 0.96), rgba(13, 92, 82, 0.85), rgba(6, 78, 59, 0.6)), url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          
          {/* ----------------- LEFT COLUMN (50%): RESTRAINED TEXT ----------------- */}
          <div className="space-y-5 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-950/40 backdrop-blur-md border border-teal-500/30 text-xs font-semibold text-teal-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Kerala Migrant Health Ecosystem (KMHE)</span>
            </div>

            {/* Proportional H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Bridging Healthcare & Welfare for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 drop-shadow-none">Kerala's Guest Workforce</span>
            </h1>

            {/* Subtext (Max 2 lines) */}
            <p className="text-sm sm:text-base text-teal-50 leading-relaxed max-w-lg drop-shadow-sm font-medium">
              Portable digital health passports, 14-digit ABHA integration, and zero-friction AWAZ insurance linkage.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => openAuthModal('worker')}
                className="py-2.5 px-5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Worker Login</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('doctor')}
                className="py-2.5 px-5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-teal-200" />
                <span>Doctor Login</span>
              </button>
              
              <button
                type="button"
                onClick={() => openAuthModal('admin')}
                className="py-2.5 px-5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-slate-600/60 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-300" />
                <span>Government Portal</span>
              </button>
            </div>

            {/* 1-Click Demo Logins */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-teal-200 uppercase tracking-wider block mb-1.5">
                ⚡ 1-Click Demo Logins:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => login('worker', { identifier: 'KL-MIG-78219' })}
                  className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ramesh Kumar (Ernakulam Hub)</span>
                </button>

                <button
                  type="button"
                  onClick={() => login('worker', { identifier: 'KL-MIG-88412' })}
                  className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bikash Mondal (Bengali)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ----------------- RIGHT COLUMN (50%): KERALA CAMP IMAGES ----------------- */}
          <div className="w-full hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-8">
              <img 
                src="https://images.unsplash.com/photo-1541888081699-28157e1b5700?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Migrant Construction Worker" 
                className="w-full h-48 object-cover rounded-2xl shadow-xl border-4 border-white/10 transform hover:-translate-y-1 transition-transform duration-300"
              />
              <img 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Worker Safety & Health" 
                className="w-full h-64 object-cover rounded-2xl shadow-xl border-4 border-white/10 transform hover:-translate-y-1 transition-transform duration-300"
              />
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Industrial Worksite" 
                className="w-full h-64 object-cover rounded-2xl shadow-xl border-4 border-white/10 transform hover:-translate-y-1 transition-transform duration-300"
              />
              <img 
                src="https://images.unsplash.com/photo-1590424744257-f827449bcbc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Kerala Migrant Workforce" 
                className="w-full h-48 object-cover rounded-2xl shadow-xl border-4 border-white/10 transform hover:-translate-y-1 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME IMPACT METRICS                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MetricCards />
      </section>

      {/* ========================================================================= */}
      {/* 3. SCHEMES & CAPABILITIES (INTERACTIVE DROPDOWNS / ACCORDIONS)           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Scheme Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Kerala Migrant Health & Welfare Schemes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click any scheme card to toggle detailed coverage limits, benefits, and helpline numbers.
          </p>
        </div>

        {/* Compact 2x2 Grid with Interactive Dropdowns / Accordion toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCHEMES_LIST.map((scheme) => {
            const Icon = scheme.icon;
            const isOpen = openScheme === scheme.id;

            return (
              <div
                key={scheme.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  isOpen ? 'border-teal-400 ring-1 ring-teal-400/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header (Always compact & clickable) */}
                <button
                  type="button"
                  onClick={() => toggleScheme(scheme.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 focus:outline-none"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`p-2.5 rounded-lg ${scheme.iconColor} flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-0.5">
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider border ${scheme.badgeColor}`}>
                          {scheme.badge}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
                        {scheme.title}
                      </h3>
                      <span className="text-[11px] text-teal-800 font-medium block truncate">
                        {scheme.titleMalayalam}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Chevron Toggle */}
                  <div className={`p-1.5 rounded-md bg-slate-100 text-slate-600 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 bg-teal-100 text-teal-800' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Dropdown Accordion Body (Rendered smoothly on toggle) */}
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in duration-150">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {scheme.summary}
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-1.5 pt-1">
                      {scheme.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Helpline & Department */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <a
                        href={`tel:${scheme.helpline.replace(/\D/g, '')}`}
                        className="inline-flex items-center space-x-1 font-bold text-teal-800 hover:text-teal-950"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Helpline: {scheme.helpline}</span>
                      </a>

                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">
                        {scheme.department.split(',')[0]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE KERALA HEALTH CAMPS TICKER                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HealthCampTicker />
      </section>

      {/* ========================================================================= */}
      {/* 5. DISTRICT TRIAGE CALL-OUT                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 shadow-sm">
          <div className="space-y-1 max-w-xl">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-bold uppercase">
              District Level Triage
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Empanelled Government & AWAZ Hospital Network
            </h3>
            <p className="text-xs text-slate-300">
              Equipped with migrant health helpdesks, dedicated multi-lingual staff, and cashless hospitalization.
            </p>
          </div>

          <button
            onClick={() => openAuthModal('worker')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Access Worker Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
