import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { WorkerDashboardHeader } from '../components/dashboard/WorkerDashboardHeader';

export const AdminDashboardPage = () => {
  return (
    <div className="government-portal min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <WorkerDashboardHeader />
      <div className="flex flex-1 relative items-start">
        <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 md:ml-[260px] lg:ml-[280px] overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
    </div>
  );
};
