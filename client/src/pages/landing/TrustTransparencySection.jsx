import React from 'react';
import {
  ShieldCheck,
  Activity,
  FileCheck2,
  FolderLock,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function TrustTransparencySection() {
  const pillars = [
    {
      title: 'Technician License & Credential Review',
      description:
        'Technicians must submit state-issued elevator mechanic licenses, certifications, and trade credentials. Platform administrators review these records prior to approving technician accounts for dispatch eligibility.',
      icon: ShieldCheck,
      badge: 'Admin Vetting'
    },
    {
      title: 'Auditable Maintenance Request Status',
      description:
        'Every service ticket follows a transparent lifecycle: Submitted → Matched → Dispatched → In Progress → Completed. Property managers can follow work progress in real time without communication gaps.',
      icon: Activity,
      badge: 'Real-Time Visibility'
    },
    {
      title: 'Documented Digital Service Reports',
      description:
        'Upon finishing work, technicians submit structured post-service reports detailing diagnostic findings, maintenance steps completed, and parts replaced for permanent property records.',
      icon: FileCheck2,
      badge: 'Standardized Logs'
    },
    {
      title: 'Centralized Maintenance History',
      description:
        'Maintenance records are permanently indexed by equipment identifier and property location. Building teams can readily retrieve historical service data for municipal safety audits and maintenance reviews.',
      icon: FolderLock,
      badge: 'Compliance Archive'
    },
    {
      title: 'Role-Based Access Governance',
      description:
        'Granular authentication ensures property managers only access their contracted properties, technicians receive relevant job details, and administrators govern system integrity and safety compliance.',
      icon: Lock,
      badge: 'Strict Security'
    }
  ];

  return (
    <section id="trust" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Integrity &amp; Governance
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Built on Transparency, Not Empty Promises
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Vertical mobility demands absolute rigor. LiftCare Network relies on verifiable workflows, explicit credential checks, and structured accountability at every stage.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-cyan-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Platform Standard Enforced</span>
                </div>
              </div>
            );
          })}

          {/* Standards Summary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block mb-4">
                Operational Disclosure
              </span>
              <h3 className="text-base font-bold text-white mb-2">
                Commitment to Factual Representation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed space-y-2">
                <span>
                  LiftCare Network provides software infrastructure to coordinate maintenance requests and records.
                </span>
                <span className="block mt-2 text-slate-400">
                  We do not directly manufacture equipment or execute physical repairs, nor do we present simulated user counts or artificial partner endorsements.
                </span>
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Independent licensed contractor model</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
