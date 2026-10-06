import React from 'react';

const priorityConfig = {
  CRITICAL: { label: 'CRITICAL', bg: 'bg-rose-950/80', text: 'text-rose-400', border: 'border-rose-600', dot: 'bg-rose-500 animate-ping' },
  HIGH: { label: 'HIGH', bg: 'bg-orange-950/70', text: 'text-orange-400', border: 'border-orange-500', dot: 'bg-orange-500' },
  MEDIUM: { label: 'MEDIUM', bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-500', dot: 'bg-amber-500' },
  LOW: { label: 'LOW', bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-600', dot: 'bg-slate-400' }
};

export default function PriorityBadge({ priority = 'MEDIUM' }) {
  const conf = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider rounded-md border ${conf.bg} ${conf.text} ${conf.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {conf.label}
    </span>
  );
}
