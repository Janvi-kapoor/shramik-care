import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingAuthPage } from './pages/LandingAuthPage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { DoctorWorkstationPage } from './pages/DoctorWorkstationPage';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertCircle, Info, ArrowRight, LayoutDashboard, Stethoscope } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
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

const MainContent = () => {
  const { activeSession } = useApp();
  const [viewOverride, setViewOverride] = useState(null);

  // 1. Doctor Session Active
  if (activeSession && activeSession.role === 'doctor' && viewOverride !== 'landing') {
    return (
      <>
        <DoctorWorkstationPage onReturnHome={() => setViewOverride('landing')} />
        <ToastNotification />
      </>
    );
  }

  // 2. Worker Session Active
  if (activeSession && activeSession.role === 'worker' && viewOverride !== 'landing') {
    return (
      <>
        <WorkerDashboardPage onReturnHome={() => setViewOverride('landing')} />
        <ToastNotification />
      </>
    );
  }

  // 3. Guest / Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
      {/* If any user is logged in while viewing Landing page, show top sticky shortcut to return */}
      {activeSession && (
        <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 py-2 px-4 text-center shadow-sm flex items-center justify-center space-x-2">
          <span className="text-xs font-bold">
            Active Session: <strong>{activeSession.user.name} ({activeSession.role.toUpperCase()})</strong>
          </span>
          <button
            onClick={() => setViewOverride('dashboard')}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-slate-950 text-amber-300 font-bold text-xs hover:bg-slate-900 transition-colors ml-2"
          >
            {activeSession.role === 'doctor' ? (
              <>
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Open Doctor Workstation</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Open Worker Dashboard</span>
              </>
            )}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <LandingNavbar />
      <main className="flex-1">
        <LandingAuthPage />
      </main>
      <Footer />
      <AuthModal />
      <ToastNotification />
    </div>
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
