import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WorkerDashboardHeader } from '../components/dashboard/WorkerDashboardHeader';
import { DesktopSidebar } from '../components/dashboard/DesktopSidebar';
import { BottomNavBar } from '../components/dashboard/BottomNavBar';
import { HospitalModal } from '../components/dashboard/HospitalModal';
import { JanAushadhiModal } from '../components/dashboard/JanAushadhiModal';

export const WorkerDashboardPage = ({ onReturnHome }) => {
  const { activeSession } = useApp();

  if (!activeSession || activeSession.role !== 'worker') return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row selection:bg-teal-500 selection:text-white">
      {/* 1. Desktop Sidebar (md: and above) */}
      <DesktopSidebar onReturnHome={onReturnHome} />

      {/* 2. Main Content Area (Wide, Breathable Grid) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header for Mobile and Desktop info */}
        <WorkerDashboardHeader onReturnHome={onReturnHome} />

        {/* Content Container (Full Width / Max-W-6xl on Desktop) */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>

      {/* 3. Global District-Filtered Modals */}
      <HospitalModal />
      <JanAushadhiModal />

      {/* 4. Mobile Bottom Navigation Bar (Hidden on md:) */}
      <BottomNavBar />
    </div>
  );
};
