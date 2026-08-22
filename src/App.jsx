import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { AppProvider } from './context/AppContext';

// Modals & Globals
import { LandingNavbar } from './components/LandingNavbar';
import { AppHeader } from './components/AppHeader';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

// Pages
import { LandingAuthPage } from './pages/LandingAuthPage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { MedicalDiaryPage } from './pages/MedicalDiaryPage';
import { DoctorWorkstationPage } from './pages/DoctorWorkstationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Doctor Views
import { DoctorQRScannerView } from './components/doctor/DoctorQRScannerView';
import { DoctorPatientLookup } from './components/doctor/DoctorPatientLookup';
import { DoctorVoiceTranslator } from './components/doctor/DoctorVoiceTranslator';
import { DoctorOverviewView } from './components/doctor/DoctorOverviewView';

// Admin Views
import { AdminHeatmapView } from './components/admin/AdminHeatmapView';
import { AdminCampDispatcherView } from './components/admin/AdminCampDispatcherView';
import { AdminAlertBroadcastView } from './components/admin/AdminAlertBroadcastView';
import { AdminInsuranceClaimsView } from './components/admin/AdminInsuranceClaimsView';

// Worker Views
import { TabHealthPassport } from './components/dashboard/TabHealthPassport';
import { TabAiScanner } from './components/dashboard/TabAiScanner';
import { TabVoicePillClock } from './components/dashboard/TabVoicePillClock';
import { TabWelfareWallet } from './components/dashboard/TabWelfareWallet';

const ToastNotification = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[999] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold ${
        isSuccess
          ? 'bg-emerald-950 text-emerald-100 border-emerald-600'
          : isError
          ? 'bg-rose-950 text-rose-100 border-rose-600'
          : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-teal-400 flex-shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ allowedRole }) => {
  const { activeSession } = useApp();

  if (!activeSession) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && activeSession.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const MainContent = () => {
  const { activeSession } = useApp();

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTE: LANDING */}
        <Route path="/" element={
          activeSession ? (
            <Navigate to={`/${activeSession.role === 'worker' ? 'worker/health-id' : activeSession.role === 'doctor' ? 'doctor/scanner' : 'admin/overview'}`} replace />
          ) : (
            <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
              <LandingNavbar />
              <main className="flex-1">
                <LandingAuthPage />
              </main>
              <Footer />
            </div>
          )
        } />

        {/* WORKER ROUTES */}
        <Route element={<ProtectedRoute allowedRole="worker" />}>
            <Route path="/worker" element={<WorkerDashboardPage onReturnHome={() => {}} />}>
              <Route index element={<Navigate to="health-id" replace />} />
              <Route path="health-id" element={<TabHealthPassport />} />
              <Route path="medicines" element={<TabAiScanner />} />
              <Route path="voice-care" element={<TabVoicePillClock />} />
              <Route path="schemes" element={<TabWelfareWallet />} />
              <Route path="diary" element={<MedicalDiaryPage />} />
            </Route>
        </Route>

        {/* DOCTOR ROUTES */}
        <Route element={<ProtectedRoute allowedRole="doctor" />}>
          <Route path="/doctor" element={
            <DoctorWorkstationPage />
          }>
            <Route index element={<Navigate to="scanner" replace />} />
            <Route path="dashboard" element={<DoctorOverviewView />} />
            <Route path="scanner" element={<DoctorQRScannerView />} />
            <Route path="patients" element={<DoctorPatientLookup />} />
            <Route path="consult" element={<DoctorPatientLookup />} />
            <Route path="analytics" element={<DoctorOverviewView />} />
            <Route path="records" element={<DoctorPatientLookup />} />
            <Route path="translator" element={<DoctorVoiceTranslator />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminDashboardPage />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminHeatmapView />} />
            <Route path="advisories" element={<AdminAlertBroadcastView />} />
            <Route path="camps" element={<AdminCampDispatcherView />} />
            <Route path="operations" element={<AdminCampDispatcherView />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthModal />
      <ToastNotification />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
