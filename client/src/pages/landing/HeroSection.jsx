import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Wrench,
  Building2,
  FileCheck2,
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Storytelling & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Industry Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-cyan-400 text-xs font-semibold backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Commercial Vertical Transportation Network</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.12]">
              Smarter Elevator &amp; Escalator Maintenance Starts Here.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Connect your commercial property with verified vertical-transportation specialists. Manage equipment, request maintenance, coordinate repairs, and keep service records in one place.
            </p>

            {/* Conversion CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/register?role=PROPERTY_MANAGER"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <Building2 className="w-4 h-4" />
                <span>Find a Technician</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register?role=TECHNICIAN"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Join as a Technician</span>
              </Link>
            </div>

            {/* 3 Benefit Indicators */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Verified Specialist Onboarding</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Licenses and credentials reviewed prior to dispatch eligibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Preventive &amp; Emergency Requests</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Structured workflows for scheduled care and urgent downtime events.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Centralized Service History</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Digital equipment logs, inspection reports, and audit-ready records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Industrial SaaS Operations Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Subtle outer glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 rounded-3xl blur-xl opacity-75" />

              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl overflow-hidden p-5 sm:p-6 space-y-5">
                {/* Header banner */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">One Financial Plaza</span>
                      <span className="text-[10px] text-slate-400 font-mono">FACILITY ID: NYC-FP-084</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online System
                  </span>
                </div>

                {/* Simulated Equipment Asset Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🛗</span>
                      <span className="font-bold text-slate-200">Car #02 — High-Rise Express</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-semibold border border-blue-500/30">
                      TRACTION
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">CURRENT STATUS</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Nominal Operation
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">NEXT SCHEDULED CARE</span>
                      <span className="text-slate-200 font-semibold mt-0.5 block">Nov 15, 2026 (Monthly)</span>
                    </div>
                  </div>
                </div>

                {/* Active Maintenance Workflow Stepper */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    <span>Live Request Lifecycle</span>
                    <span className="text-[10px] font-mono text-cyan-400">REQ-8924</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-medium pt-1">
                    <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-cyan-300">
                      <span className="block font-bold">1. Logged</span>
                      <span className="text-[9px] text-slate-400">Property PM</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-cyan-300">
                      <span className="block font-bold">2. Matched</span>
                      <span className="text-[9px] text-slate-400">Vetted Tech</span>
                    </div>
                    <div className="p-2 rounded-lg bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold shadow-sm shadow-cyan-500/20 animate-pulse">
                      <span className="block">3. In Progress</span>
                      <span className="text-[9px] text-cyan-300 font-normal">Active Job</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500">
                      <span className="block">4. Report</span>
                      <span className="text-[9px]">Sign-off</span>
                    </div>
                  </div>
                </div>

                {/* Specialist Card Snippet */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      RP
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Raj Patel</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[10px] text-slate-400">Licensed Elevator Tech • 8 yrs exp</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    DISPATCHED
                  </span>
                </div>

                {/* Footer note */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-cyan-400" /> Platform-facilitated workflow
                  </span>
                  <span className="font-mono text-slate-500">ASME A17.1 Compliant Records</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
