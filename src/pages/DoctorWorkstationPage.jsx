import React from 'react';
import { useApp } from '../context/AppContext';
import { DoctorNavbar } from '../components/doctor/DoctorNavbar';
import { DoctorSidebar } from '../components/doctor/DoctorSidebar';
import { DoctorBottomNav } from '../components/doctor/DoctorBottomNav';
import { DoctorOverviewView } from '../components/doctor/DoctorOverviewView';
import { DoctorPatientLookupView } from '../components/doctor/DoctorPatientLookupView';
import { DoctorVoiceTranslatorView } from '../components/doctor/DoctorVoiceTranslatorView';
import { DoctorCampRegistryView } from '../components/doctor/DoctorCampRegistryView';

export const DoctorWorkstationPage = ({ onReturnHome }) => {
  const { activeDoctorTab, activeSession } = useApp();

  if (!activeSession || activeSession.role !== 'doctor') return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row selection:bg-teal-500 selection:text-white">
      {/* 1. Desktop Multi-Page Sidebar (md: and above) */}
      <DoctorSidebar onReturnHome={onReturnHome} />

      {/* 2. Main Workstation Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <DoctorNavbar onReturnHome={onReturnHome} />

        {/* Dynamic Distinct Tab Views (max-w-7xl on Desktop) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          {activeDoctorTab === 'overview' && <DoctorOverviewView />}
          {activeDoctorTab === 'patient-lookup' && <DoctorPatientLookupView />}
          {activeDoctorTab === 'voice-translator' && <DoctorVoiceTranslatorView />}
          {activeDoctorTab === 'camp-registry' && <DoctorCampRegistryView />}
        </main>
      </div>

      {/* 3. Mobile Doctor Bottom Navigation Bar (Hidden on md:) */}
      <DoctorBottomNav />
    </div>
  );
};
