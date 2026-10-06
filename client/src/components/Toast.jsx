import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-blue-500/40 bg-slate-900/95 text-blue-300';
        let Icon = Info;

        if (toast.type === 'danger') {
          borderClass = 'border-rose-500/80 bg-slate-950/95 text-rose-300 shadow-rose-900/30';
          Icon = AlertCircle;
        } else if (toast.type === 'success') {
          borderClass = 'border-emerald-500/60 bg-slate-900/95 text-emerald-300 shadow-emerald-900/20';
          Icon = CheckCircle2;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md animate-slideIn ${borderClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold text-white leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
