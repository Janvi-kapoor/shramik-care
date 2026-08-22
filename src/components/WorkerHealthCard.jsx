import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import QRCode from 'qrcode';

export const WorkerHealthCard = ({ worker, isModalView = false, onProceed }) => {
  const { t, showToast } = useApp();

  if (!worker) return null;

  const [qrUrl, setQrUrl] = useState('');
  useEffect(() => {
    QRCode.toDataURL(worker.qrCodeData || `SHRAMIKCARE://${worker.id}`, { margin: 1, width: 220 }).then(setQrUrl).catch(() => setQrUrl(''));
  }, [worker]);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-[#f7f8ff] relative flex flex-col h-full min-h-[220px]">

      {/* Background Gradient/Polygon Mock */}
      <div className="absolute top-0 right-0 w-64 h-full pointer-events-none opacity-50">
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-400 via-indigo-300 to-transparent" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0% 100%, 30% 0)' }}></div>
         <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-bl from-purple-300 via-blue-200 to-transparent" style={{ clipPath: 'polygon(100% 0, 100% 70%, 40% 100%, 50% 0)' }}></div>
      </div>

      <div className="p-6 md:p-8 flex-1 relative z-10 flex flex-col sm:flex-row justify-between">

        {/* Left Side Info */}
        <div className="flex flex-col justify-between">

          <div className="flex items-center space-x-3 mb-8">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="50" cy="35" r="22" stroke="url(#card_grad1)" strokeWidth="12" />
                <circle cx="35" cy="65" r="22" stroke="url(#card_grad2)" strokeWidth="12" />
                <circle cx="65" cy="65" r="22" stroke="url(#card_grad3)" strokeWidth="12" />
                <defs>
                  <linearGradient id="card_grad1" x1="28" y1="13" x2="72" y2="57" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3934b1" />
                    <stop offset="1" stopColor="#5a52d9" />
                  </linearGradient>
                  <linearGradient id="card_grad2" x1="13" y1="43" x2="57" y2="87" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5a52d9" />
                    <stop offset="1" stopColor="#8c85fa" />
                  </linearGradient>
                  <linearGradient id="card_grad3" x1="43" y1="43" x2="87" y2="87" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4a3ed6" />
                    <stop offset="1" stopColor="#6c5ce7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#3b17c6] leading-tight drop-shadow-sm">
                ShramikCare
              </h1>
              <p className="text-[10px] font-bold text-[#5a32fa] uppercase tracking-wider">
                HEALTH ID CARD
              </p>
            </div>
          </div>

          <div>
             <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Name</p>
             <p className="text-[19px] font-extrabold text-slate-800 mb-4 tracking-tight">{worker.name}</p>

             <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Health ID</p>
             <p className="text-sm font-bold text-slate-800 font-mono tracking-wider mb-4">{worker.id}</p>

             <div className="grid grid-cols-2 gap-x-6 gap-y-3">
               <div>
                 <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Age & Gender</p>
                 <p className="text-xs font-bold text-slate-800">28 • Male</p>
               </div>
               <div>
                 <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Origin State</p>
                 <p className="text-xs font-bold text-slate-800">Bihar</p>
               </div>
               <div>
                 <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Audio Lang</p>
                 <p className="text-xs font-bold text-slate-800">{worker.preferredLanguage === 'hi' ? 'Hindi (हिंदी)' : worker.preferredLanguage === 'ml' ? 'Malayalam (മലയാളം)' : worker.preferredLanguage === 'bn' ? 'Bengali' : 'Hindi (हिंदी)'}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side QR Code */}
        <div className="mt-6 sm:mt-0 flex flex-col items-end justify-center">
            <div className="w-28 h-28 sm:w-[136px] sm:h-[136px] bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-center relative">
              {qrUrl && <img src={qrUrl} alt="Worker Health ID QR code" className="w-full h-full" />}
            </div>
        </div>
      </div>

      <div className="w-full bg-white/70 backdrop-blur-md border-t border-white py-3 text-center relative z-10 shadow-inner">
         <p className="text-[11px] font-semibold text-slate-600">Scan this QR at any healthcare facility</p>
      </div>

    </div>
  );
};
