import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DoctorSidebar } from '../components/doctor/DoctorSidebar';
import { DoctorBottomNav } from '../components/doctor/DoctorBottomNav';
import { WorkerDashboardHeader } from '../components/dashboard/WorkerDashboardHeader';

export const DoctorWorkstationPage = ({ onReturnHome }) => {
  const { activeSession } = useApp();

  if (!activeSession || activeSession.role !== 'doctor') return null;

  return (
    <div className="doctor-portal min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <WorkerDashboardHeader onReturnHome={onReturnHome} />

      <div className="flex flex-1 relative items-start">
        <DoctorSidebar onReturnHome={onReturnHome} />

        <main className="flex-1 min-w-0 md:ml-[260px] lg:ml-[280px] w-full px-4 sm:px-6 lg:px-6 py-6 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>
      <DoctorBottomNav />
    </div>
  );
};
