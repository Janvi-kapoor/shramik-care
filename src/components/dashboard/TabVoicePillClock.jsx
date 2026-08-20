import React from 'react';
import { useApp } from '../../context/AppContext';
import { DAILY_PILL_SCHEDULE } from '../../data/mockDatabase';
import { 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Check
} from 'lucide-react';

export const TabVoicePillClock = () => {
  const { 
    currentLanguage, 
    t, 
    pillAdherence, 
    togglePillSlotTaken, 
    speakText, 
    stopSpeech, 
    isAudioSpeaking, 
    currentlyPlayingSlot,
    showToast 
  } = useApp();

  const totalSlots = DAILY_PILL_SCHEDULE.length;
  const takenCount = DAILY_PILL_SCHEDULE.filter((s) => pillAdherence[s.id]).length;
  const adherencePercentage = Math.round((takenCount / totalSlots) * 100);

  // Play audio for specific dose slot in active language
  const handlePlaySlotAudio = (slot) => {
    if (isAudioSpeaking && currentlyPlayingSlot === slot.id) {
      stopSpeech();
      return;
    }

    const script = slot.audioScript[currentLanguage] || slot.audioScript['en'];
    speakText(script, slot.id);
  };

  // Play full day schedule audio in active language
  const handlePlayAllSchedule = () => {
    if (isAudioSpeaking && currentlyPlayingSlot === 'all') {
      stopSpeech();
      return;
    }

    const allScripts = DAILY_PILL_SCHEDULE.map(
      (s) => s.audioScript[currentLanguage] || s.audioScript['en']
    ).join(' ... ');

    speakText(allScripts, 'all');
  };

  const handleToggleTaken = (slotId, slotName) => {
    togglePillSlotTaken(slotId);
    if (!pillAdherence[slotId]) {
      showToast(`Marked ${slotName} as taken!`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Audio Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Native Voice Audio Guidance</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {t('pillClockTitle')}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {t('pillClockSub')}
            </p>
          </div>

          {/* Speak Full Day Schedule Button */}
          <button
            type="button"
            onClick={handlePlayAllSchedule}
            className={`w-full md:w-auto px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
              isAudioSpeaking && currentlyPlayingSlot === 'all'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/50 animate-pulse'
                : 'bg-teal-800 hover:bg-teal-900 text-white'
            }`}
          >
            {isAudioSpeaking && currentlyPlayingSlot === 'all' ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t('audioPlayingState')} (Tap to Stop)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{t('btnPlayAllDoses')}</span>
              </>
            )}
          </button>
        </div>

        {/* Adherence Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5 font-mono">
            <span>{t('adherenceProgress')}</span>
            <span className="font-bold text-teal-800">{adherencePercentage}% ({takenCount}/{totalSlots} Doses Taken)</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${adherencePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Pictographic Daily Schedule Cards */}
      <div className="space-y-4">
        {DAILY_PILL_SCHEDULE.map((slot) => {
          const isTaken = pillAdherence[slot.id];
          const isPlayingThis = isAudioSpeaking && currentlyPlayingSlot === slot.id;
          const slotTitle = slot.slotNative[currentLanguage] || slot.slotNative['en'];
          const mealNotice = slot.mealText[currentLanguage] || slot.mealText['en'];

          return (
            <div
              key={slot.id}
              className={`bg-white rounded-xl border transition-all p-5 shadow-sm ${
                isTaken
                  ? 'border-emerald-300 bg-emerald-50/10'
                  : isPlayingThis
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl p-2 rounded-lg bg-slate-50 border border-slate-200">
                    {slot.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm md:text-base font-bold text-slate-900">
                        {slotTitle}
                      </h3>
                      <span className={`px-2 py-0.2 rounded text-[10px] ${slot.badgeColor}`}>
                        {slot.time}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mt-1 text-xs font-semibold text-slate-600">
                      <span className="flex items-center space-x-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        <span>{slot.mealIcon}</span>
                        <span>{mealNotice}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                        <span>{slot.waterIcon}</span>
                        <span>1 Glass Water</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slot Voice Button */}
                <button
                  type="button"
                  onClick={() => handlePlaySlotAudio(slot)}
                  className={`self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isPlayingThis
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isPlayingThis ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>{t('audioPlayingState')}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                      <span>{t('btnPlaySlotAudio')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Medicine Pills List */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {slot.medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${med.pillColor}`}></div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {med.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {med.type} • {med.dose}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {med.instruction}
                    </span>
                  </div>
                ))}
              </div>

              {/* Check-off Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {isTaken ? '✓ Logged for today' : 'Scheduled dose'}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleTaken(slot.id, slot.slotName)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isTaken
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isTaken ? t('btnDoseCompleted') : t('btnMarkDoseTaken')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
