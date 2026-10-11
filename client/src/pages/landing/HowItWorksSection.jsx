import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Cpu,
  Send,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Wrench,
  UserPlus,
  FileBadge2,
  BellRing,
  CheckCircle2
} from 'lucide-react';

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState('pm'); // 'pm' | 'tech'

  const pmSteps = [
    {
      step: '01',
      title: 'Register Commercial Property',
      desc: 'Create an account and set up your facility profile with address, building details, and on-site contact parameters.',
      icon: Building2,
      badge: 'Step 1'
    },
    {
      step: '02',
      title: 'Add Equipment Details',
      desc: 'Catalog your elevators and escalators with equipment IDs, manufacturer, drive type, installation year, and inspection cadence.',
      icon: Cpu,
      badge: 'Step 2'
    },
    {
      step: '03',
      title: 'Submit Request & Discover Technicians',
      desc: 'Submit routine maintenance or emergency repair requests. Discover and dispatch suitable verified specialists matched to your equipment.',
      icon: Send,
      badge: 'Step 3'
    },
    {
      step: '04',
      title: 'Track Job & Retain Reports',
      desc: 'Monitor repair status in real time, review signed digital service reports upon completion, and maintain audit-ready equipment history.',
      icon: FileCheck2,
      badge: 'Step 4'
    }
  ];

  const techSteps = [
    {
      step: '01',
      title: 'Register Profile',
      desc: 'Create a technician profile specifying contact information, company affiliation, and years in the trade.',
      icon: UserPlus
    },
    {
      step: '02',
      title: 'Submit Credentials',
      desc: 'Provide state elevator mechanics license numbers, safety certifications, and insurance documentation.',
      icon: FileBadge2
    },
    {
      step: '03',
      title: 'Admin Verification',
      desc: 'Platform administrators review submitted licenses and credentials against state licensing databases prior to granting activation.',
      icon: ShieldCheck,
      highlight: true
    },
    {
      step: '04',
      title: 'Receive Job Requests',
      desc: 'Access notifications for eligible preventive maintenance and repair requests matching your skillset and service territory.',
      icon: BellRing
    },
    {
      step: '05',
      title: 'Perform Work',
      desc: 'Coordinate with property managers, arrive on-site, inspect equipment, and execute required maintenance tasks.',
      icon: Wrench
    },
    {
      step: '06',
      title: 'Submit Digital Reports',
      desc: 'Complete standardized digital sign-offs detailing diagnostic findings, parts replaced, and return-to-service validation.',
      icon: CheckCircle2
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-950/80 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Operational Workflows
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How LiftCare Network Operates
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            A structured, transparent lifecycle tailored to commercial facility managers and licensed vertical transportation specialists.
          </p>

          {/* Role Journey Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 mt-6">
            <button
              onClick={() => setActiveTab('pm')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pm'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Property Managers (4 Steps)</span>
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tech'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>For Technicians (6 Steps)</span>
            </button>
          </div>
        </div>

        {/* Property Manager 4-Step Journey */}
        {activeTab === 'pm' && (
          <div className="animate-fadeIn space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pmSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-cyan-500/80 font-mono">
                          {step.step}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{step.badge}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <Link
                to="/register?role=PROPERTY_MANAGER"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>Get Started as a Property Manager</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Technician 6-Step Journey */}
        {activeTab === 'tech' && (
          <div className="animate-fadeIn space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border transition flex flex-col justify-between ${
                      step.highlight
                        ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/20'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-black text-emerald-500/90 font-mono">
                          {step.step}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            step.highlight
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white mb-2">
                          {step.title}
                        </h3>
                        {step.highlight && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                            Admin Vetted
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {step.highlight && (
                      <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-400/90 font-medium flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Verification required prior to job eligibility</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Verification callout banner */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start sm:items-center gap-3 max-w-3xl mx-auto">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                <strong>Credential Review Policy:</strong> Technician verification is strictly subject to administrator review. Submitting a profile does not constitute automatic authorization or dispatch approval until licenses and background information are verified.
              </p>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/register?role=TECHNICIAN"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>Register as a Licensed Technician</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
