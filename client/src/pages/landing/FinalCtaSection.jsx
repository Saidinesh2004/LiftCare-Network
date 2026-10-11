import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Wrench,
  LogIn,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function FinalCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Layers className="w-3.5 h-3.5" />
          <span>Unified Vertical Mobility Coordination</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Take Control of Your Maintenance Workflow.
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Bring property records, specialist discovery, service requests, and maintenance history into one organized workflow.
        </p>

        {/* Conversion Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto">
          <Link
            to="/register?role=PROPERTY_MANAGER"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <Building2 className="w-4 h-4" />
            <span>Register as a Property Manager</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register?role=TECHNICIAN"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md"
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>Join as a Technician</span>
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        </div>

        {/* Micro-guarantees / Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            No Long-Term Contracts
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Role-Aware Onboarding
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Vetted Technical Network
          </span>
        </div>
      </div>
    </section>
  );
}
