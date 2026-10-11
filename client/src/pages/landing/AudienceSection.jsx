import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';

export default function AudienceSection() {
  const pmBenefits = [
    'Manage multiple commercial buildings and campuses from a single hub',
    'Maintain comprehensive elevator and escalator equipment records',
    'Request both routine preventive care and expedited emergency servicing',
    'Discover licensed specialists based on verified skills and real-time availability',
    'Monitor active job progress and on-site technician arrival in real time',
    'Review digital service reports immediately upon work completion',
    'Access complete, auditable equipment maintenance history for municipal audits'
  ];

  const techBenefits = [
    'Build a professional technician profile showcasing experience and certifications',
    'Submit state licenses and certifications for formal platform verification',
    'Specify equipment specializations (traction, hydraulic, escalator) and service areas',
    'View eligible maintenance and repair opportunities within your coverage territory',
    'Accept maintenance jobs when qualified and your schedule is available',
    'Update work status on-site (dispatched, arrived, in progress, resolved)',
    'Submit digital service reports with replaced parts and diagnostic notes'
  ];

  return (
    <section className="py-20 bg-slate-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Tailored Experiences
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Designed for Both Sides of Vertical Transportation
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Whether managing a multi-tower portfolio or delivering specialized technical expertise, LiftCare Network gives you tools built for your specific operational role.
          </p>
        </div>

        {/* Dual Audience Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Property Managers */}
          <div
            id="property-managers"
            className="rounded-3xl bg-slate-950/90 border border-blue-500/30 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-blue-950/20 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Background accent glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />

            <div>
              {/* Header Badge & Title */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                  Facility Leadership
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight">
                For Property Managers
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Streamline equipment administration, protect tenant mobility, eliminate paperwork friction, and maintain continuous safety readiness.
              </p>

              {/* Benefits Checklist */}
              <div className="mt-8 space-y-3">
                {pmBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 pt-6 border-t border-slate-800">
              <Link
                to="/register?role=PROPERTY_MANAGER"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started as a Property Manager</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Technicians & Service Providers */}
          <div
            id="technicians"
            className="rounded-3xl bg-slate-950/90 border border-emerald-500/30 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-emerald-950/20 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300"
          >
            {/* Background accent glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-[90px] rounded-full pointer-events-none" />

            <div>
              {/* Header Badge & Title */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Licensed Trades
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight">
                For Technicians &amp; Service Providers
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Connect with quality commercial clients, streamline your job documentation, verify credentials with confidence, and maximize productive field hours.
              </p>

              {/* Benefits Checklist */}
              <div className="mt-8 space-y-3">
                {techBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 pt-6 border-t border-slate-800">
              <Link
                to="/register?role=TECHNICIAN"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Register as a Technician</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
