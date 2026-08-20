import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_METRICS } from '../data/mockDatabase';
import { Users, TentTree, ShieldCheck, ArrowUpRight, AlertTriangle } from 'lucide-react';

export const MetricCards = () => {
  const { t, workers } = useApp();

  // Dynamic count combining base mock metrics + any newly registered workers
  const dynamicWorkerCount = MOCK_METRICS.registeredWorkers + (workers.length - 3);

  const metrics = [
    {
      id: 'workers',
      title: t('metricWorkersTitle'),
      value: dynamicWorkerCount.toLocaleString('en-IN'),
      subtext: t('metricWorkersSub'),
      tag: t('metricWorkersTag'),
      tagType: 'mint',
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      valueColor: 'text-slate-900',
      accentBorder: 'border-l-4 border-l-teal-700',
    },
    {
      id: 'camps',
      title: t('metricCampsTitle'),
      value: MOCK_METRICS.activeHealthCamps,
      subtext: t('metricCampsSub'),
      tag: t('metricCampsTag'),
      tagType: 'coral',
      icon: TentTree,
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      valueColor: 'text-slate-900',
      accentBorder: 'border-l-4 border-l-amber-500',
    },
    {
      id: 'awaz',
      title: t('metricAwazTitle'),
      value: MOCK_METRICS.awazClaimsSettled,
      subtext: t('metricAwazSub'),
      tag: t('metricAwazTag'),
      tagType: 'mint',
      icon: ShieldCheck,
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200',
      valueColor: 'text-amber-600',
      accentBorder: 'border-l-4 border-l-amber-500',
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {metrics.map((item) => {
          const Icon = item.icon;
          const isCoral = item.tagType === 'coral';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between ${item.accentBorder}`}
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.title}
                  </span>
                  <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight mt-1 ${item.valueColor}`}>
                    {item.value}
                  </span>
                </div>

                <div className={`p-2.5 rounded-lg border ${item.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Tag & Description */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-600 truncate">
                  {item.subtext}
                </span>

                <span
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap border ${
                    isCoral
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {isCoral ? (
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{item.tag}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
