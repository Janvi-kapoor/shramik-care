import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DoctorNavbar } from '../components/doctor/DoctorNavbar';
import { DoctorSidebar } from '../components/doctor/DoctorSidebar';
import { DoctorBottomNav } from '../components/doctor/DoctorBottomNav';

export const DoctorWorkstationPage = ({ onReturnHome }) => {
  const { activeSession } = useApp();

  if (!activeSession || activeSession.role !== 'doctor') return null;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      {/* 1. Sidebar (Desktop) */}
      <DoctorSidebar onReturnHome={onReturnHome} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DoctorNavbar onReturnHome={onReturnHome} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Nav */}
        <DoctorBottomNav />
      </div>
    </div>
  );
};
