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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* 1. Full-Width Top Header (Like Landing Page) */}
      <WorkerDashboardHeader onReturnHome={onReturnHome} />

      {/* Main Layout Area below Header */}
      <div className="flex flex-1 relative items-start">
        {/* 2. Desktop Sidebar (Fixed below header) */}
        <DesktopSidebar onReturnHome={onReturnHome} />

        {/* 3. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-[260px] lg:ml-[280px]">
          {/* Content Container */}
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-6 py-6 pb-24 md:pb-12">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global District-Filtered Modals */}
      <HospitalModal />
      <JanAushadhiModal />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};
