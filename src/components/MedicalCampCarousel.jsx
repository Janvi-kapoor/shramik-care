import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Stethoscope, 
  Users, 
  Sparkles,
  Activity,
  Pill,
  ShieldCheck
} from 'lucide-react';

const CAMP_SLIDES = [
  {
    id: 1,
    tag: "Active Field Camp",
    tagColor: "bg-emerald-500 text-white",
    district: "Ernakulam Hub",
    title: "Perumbavoor Plywood Hub Medical Camp",
    subtitle: "On-site 14-digit ABHA passport generation, pulmonary screening & AWAZ insurance linkage.",
    timing: "05:30 PM - 09:30 PM",
    venue: "Bhai Colony Ground, Perumbavoor",
    doctor: "Dr. P.K. Thomas (General Medicine)",
    turnout: "350+ Workers Screened",
    badges: ["ABHA Smart ID", "Pulmonary X-Ray", "AWAZ Seeding"],
    themeGradient: "from-[#042F2E] via-[#0D5C52] to-[#064E3B]",
    accentIcon: Stethoscope
  },
  {
    id: 2,
    tag: "Evening Outpost",
    tagColor: "bg-amber-500 text-slate-950 font-bold",
    district: "Kochi Metro Corridor",
    title: "Kaloor Metro Workers Health Outpost",
    subtitle: "Multilingual Hindi & Bengali tele-triage, vital screening, and free occupational health kits.",
    timing: "07:00 PM - 10:30 PM",
    venue: "Kaloor Stadium Transit Yard",
    doctor: "Dr. Ananya Menon (Public Health)",
    turnout: "220+ Workers Screened",
    badges: ["Multilingual Voice", "Tetanus Booster", "Blood Sugar"],
    themeGradient: "from-[#0F172A] via-[#1E293B] to-[#0D5C52]",
    accentIcon: Activity
  },
  {
    id: 3,
    tag: "Mobile Diagnostic Van",
    tagColor: "bg-teal-600 text-white",
    district: "Aluva Industrial Belt",
    title: "Aluva Taluk Mobile Medical Unit",
    subtitle: "Digital chest X-ray van, doctor triage, and Jan Aushadhi generic medicine distribution.",
    timing: "09:00 AM - 01:00 PM",
    venue: "Aluva Market Community Center",
    doctor: "Dr. K.S. Nambiar (KMC Verified)",
    turnout: "400+ Registered",
    badges: ["Mobile X-Ray", "ECG Onboard", "100% Cashless"],
    themeGradient: "from-[#0D5C52] via-[#064E3B] to-[#022c22]",
    accentIcon: Pill
  },
  {
    id: 4,
    tag: "Generic Drug Hub",
    tagColor: "bg-indigo-600 text-white",
    district: "Perumbavoor Cluster",
    title: "PM Jan Aushadhi Generic Pharmacy Drive",
    subtitle: "Up to 85% discount on certified generic medicines with instant QR prescription matching.",
    timing: "08:00 AM - 08:00 PM",
    venue: "Perumbavoor Taluk Hospital Kiosk",
    doctor: "Kerala Medical Services Corp (KMSCL)",
    turnout: "1,200+ Prescriptions Filled",
    badges: ["85% Price Savings", "Generic Paracetamol", "Cashless"],
    themeGradient: "from-[#1e1b4b] via-[#115e59] to-[#042f2e]",
    accentIcon: Sparkles
  }
];

export const MedicalCampCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAMP_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + CAMP_SLIDES.length) % CAMP_SLIDES.length);
  };

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % CAMP_SLIDES.length);
  };

  const current = CAMP_SLIDES[currentIndex];
  const AccentIcon = current.accentIcon;

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden shadow-xl border border-slate-700/50 bg-slate-900 text-white select-none transition-all duration-300"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Kerala Gradient Theme */}
      <div className={`absolute inset-0 bg-gradient-to-br ${current.themeGradient} transition-colors duration-500`}></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-black/40 pointer-events-none"></div>

      {/* Main Slide Card */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between min-h-[340px] sm:min-h-[370px]">
        {/* Top Tag & Icon */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${current.tagColor}`}>
              {current.tag}
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md text-teal-200 text-[11px] font-medium border border-white/10">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{current.district}</span>
            </span>
          </div>

          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
            <AccentIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Center Content */}
        <div className="my-2 space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed line-clamp-2">
            {current.subtitle}
          </p>

          {/* Timing & Doctor Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/5 truncate">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{current.timing}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/5 truncate">
              <Stethoscope className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
              <span className="truncate">{current.doctor}</span>
            </div>
          </div>

          {/* Service Feature Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {current.badges.map((b, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 rounded bg-white/10 backdrop-blur-md text-[10px] font-medium text-emerald-200 border border-white/10"
              >
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Turnout & Slide Controls */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>{current.turnout}</span>
          </div>

          {/* Dots and Navigation */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 mr-1">
              {CAMP_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/30'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
