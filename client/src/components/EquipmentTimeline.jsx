import React from 'react';
import { Calendar, Wrench, ShieldCheck, AlertTriangle, Cpu, CheckCircle2 } from 'lucide-react';

const typeIcons = {
  Installation: { icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-950/70 border-purple-500/40' },
  Maintenance: { icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-950/70 border-blue-500/40' },
  Inspection: { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-950/70 border-emerald-500/40' },
  Repair: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-950/70 border-amber-500/40' },
  'Parts Replacement': { icon: Wrench, color: 'text-cyan-400', bg: 'bg-cyan-950/70 border-cyan-500/40' },
  'Emergency Service': { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-950/70 border-rose-500/40' }
};

export default function EquipmentTimeline({ timeline = [], currentStatus = 'Operational' }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No maintenance history logged yet.
      </div>
    );
  }

  // Sort timeline chronological (or newest first)
  const sorted = [...timeline].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
      {/* Current Status Node */}
      <div className="relative flex items-start gap-4">
        <div className="absolute -left-6 mt-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Current Status</span>
            <span className="text-[11px] text-slate-400">Live State</span>
          </div>
          <p className="mt-1 text-sm font-medium text-white">Unit is currently marked as <span className="text-emerald-300 font-bold">{currentStatus}</span></p>
        </div>
      </div>

      {sorted.map((item, idx) => {
        const conf = typeIcons[item.type] || typeIcons.Maintenance;
        const Icon = conf.icon;
        const formattedDate = item.date
          ? new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'N/A';

        return (
          <div key={idx} className="relative flex items-start gap-4 group">
            <div
              className={`absolute -left-6 mt-1 w-6 h-6 rounded-full border flex items-center justify-center transition ${conf.bg}`}
            >
              <Icon className={`w-3.5 h-3.5 ${conf.color}`} />
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5 flex-1 hover:border-slate-700 transition">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${conf.bg} ${conf.color}`}>
                    {item.type}
                  </span>
                  <span className="text-sm font-semibold text-white">{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {item.description && (
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{item.description}</p>
              )}

              {item.performedBy && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Certified by: <strong className="text-slate-200">{item.performedBy}</strong></span>
                  {item.partsReplaced && item.partsReplaced.length > 0 && (
                    <span className="text-cyan-400">Parts replaced: {item.partsReplaced.join(', ')}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
