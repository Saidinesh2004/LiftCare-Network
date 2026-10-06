import React from 'react';

export default function MatchScoreBadge({ score = 85, size = 'md' }) {
  const getColors = () => {
    if (score >= 90) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', bar: 'bg-emerald-500' };
    if (score >= 75) return { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400', bar: 'bg-blue-500' };
    if (score >= 60) return { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', bar: 'bg-amber-500' };
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400', bar: 'bg-rose-500' };
  };

  const colors = getColors();

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${colors.bg} ${colors.border} border ${colors.text}`}>
        ⚡ {score}% Match
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border ${colors.bg} ${colors.border}`}>
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">Match Score</span>
        <span className={`text-base font-bold leading-none ${colors.text}`}>{score}%</span>
      </div>
      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colors.bar} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
