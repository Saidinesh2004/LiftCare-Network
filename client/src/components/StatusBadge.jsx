import React from 'react';

const statusConfig = {
  // Request Statuses
  REQUESTED: { label: 'Requested', bg: 'bg-slate-700/60', text: 'text-slate-200', border: 'border-slate-500' },
  MATCHING: { label: 'Matching Techs', bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-500/50', animate: true },
  ASSIGNED: { label: 'Assigned', bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-500/50' },
  ACCEPTED: { label: 'Accepted', bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/50' },
  ON_THE_WAY: { label: 'On The Way', bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-500/50', animate: true },
  ARRIVED: { label: 'Arrived On-Site', bg: 'bg-teal-950/60', text: 'text-teal-400', border: 'border-teal-500/50' },
  INSPECTION: { label: 'Inspection', bg: 'bg-yellow-950/60', text: 'text-yellow-400', border: 'border-yellow-500/50' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-orange-950/60', text: 'text-orange-400', border: 'border-orange-500/50', animate: true },
  COMPLETED: { label: 'Completed', bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  APPROVED: { label: 'Approved', bg: 'bg-green-950/60', text: 'text-green-300', border: 'border-green-500/50' },
  CLOSED: { label: 'Closed', bg: 'bg-slate-800/60', text: 'text-slate-400', border: 'border-slate-600' },

  // Equipment Statuses
  Operational: { label: 'Operational', bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  'Maintenance Due': { label: 'Maintenance Due', bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-500/50' },
  'Under Maintenance': { label: 'Under Maintenance', bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/50', animate: true },
  Breakdown: { label: 'Breakdown / Offline', bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-500/50', animate: true },
  'Out of Service': { label: 'Out of Service', bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-500/50' },

  // Verification Statuses
  VERIFIED: { label: 'Verified & Licensed', bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  PENDING: { label: 'Pending Verification', bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-500/50' },
  REJECTED: { label: 'Verification Rejected', bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-500/50' },
  RESUBMISSION_REQUESTED: { label: 'Resubmission Required', bg: 'bg-orange-950/60', text: 'text-orange-400', border: 'border-orange-500/50' }
};

export default function StatusBadge({ status, size = 'sm' }) {
  const conf = statusConfig[status] || {
    label: status ? status.replace(/_/g, ' ') : 'Unknown',
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700'
  };

  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${conf.bg} ${conf.text} ${conf.border} ${sizeClasses}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${conf.text.replace('text-', 'bg-')} ${
          conf.animate ? 'animate-pulse' : ''
        }`}
      />
      {conf.label}
    </span>
  );
}
