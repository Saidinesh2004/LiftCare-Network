import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Siren,
  Cpu,
  MoveUpRight,
  ClipboardCheck,
  UserCheck,
  FileText,
  History,
  ArrowRight,
  Shield,
  CheckCircle2
} from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Preventive Maintenance',
      tag: 'Routine Upkeep',
      description:
        'Structured recurring service requests designed to inspect moving parts, lubricate guide rails, and prevent unplanned equipment downtime.',
      features: ['Automated maintenance intervals', 'Multi-point safety checklists', 'Pre-scheduled technician dispatch'],
      icon: CalendarCheck,
      actionText: 'Schedule Care',
      link: '/register?role=PROPERTY_MANAGER'
    },
    {
      title: 'Emergency Repair Requests',
      tag: 'Urgent Dispatch',
      description:
        'Expedited request routing for sudden stoppages, passenger entrapments, and urgent mechanical failures requiring rapid technician assignment.',
      features: ['High-priority dispatch tagging', 'Real-time specialist status updates', 'Direct incident notes & contact'],
      icon: Siren,
      actionText: 'Emergency Workflow',
      link: '/register?role=PROPERTY_MANAGER',
      highlight: true
    },
    {
      title: 'Elevator Maintenance',
      tag: 'Vertical Cars',
      description:
        'End-to-end platform coordination for traction, hydraulic, machine-room-less (MRL), and heavy freight elevator systems across commercial buildings.',
      features: ['Cable & pulley assessment', 'Hydraulic fluid & valve checks', 'Door operator & interlock audits'],
      icon: Cpu,
      actionText: 'Register Elevators',
      link: '/register?role=PROPERTY_MANAGER'
    },
    {
      title: 'Escalator Maintenance',
      tag: 'Moving Walkways',
      description:
        'Specialized workflows tailored to high-traffic escalators and moving walks, covering step band mechanics and safety combs.',
      features: ['Comb plate & step alignment', 'Handrail tension monitoring', 'Emergency brake testing logs'],
      icon: MoveUpRight,
      actionText: 'Register Escalators',
      link: '/register?role=PROPERTY_MANAGER'
    },
    {
      title: 'Equipment Inspections',
      tag: 'Code Compliance',
      description:
        'Formal inspection requests mapped to municipal and ASME A17.1 standard guidelines to ensure continuous legal operating certificates.',
      features: ['Periodic code compliance checks', 'Pre-audit documentation readiness', 'Governor & safety gear tests'],
      icon: ClipboardCheck,
      actionText: 'Request Inspection',
      link: '/register?role=PROPERTY_MANAGER'
    },
    {
      title: 'Technician Discovery',
      tag: 'Specialist Directory',
      description:
        'Search and filter verified technicians by technical certification, vertical transport specialty, geographic location, and availability.',
      features: ['License verification badges', 'Specialty skill matching', 'Transparent service history'],
      icon: UserCheck,
      actionText: 'Browse Specialists',
      link: '/register?role=PROPERTY_MANAGER'
    },
    {
      title: 'Digital Service Reports',
      tag: 'Compliance Proof',
      description:
        'Technicians submit standardized digital reports immediately upon job completion detailing work performed, parts replaced, and findings.',
      features: ['Replaced component logging', 'Technician digital signature', 'Downloadable audit documentation'],
      icon: FileText,
      actionText: 'Learn About Reports',
      link: '/register?role=PROPERTY_MANAGER'
    },
    {
      title: 'Maintenance History Management',
      tag: 'Asset Lifecycle',
      description:
        'Maintain a tamper-resistant, chronological service history for every piece of equipment across all managed commercial properties.',
      features: ['Cumulative repair tracking', 'Lifetime asset visibility', 'Exportable records for building audits'],
      icon: History,
      actionText: 'Explore Asset Records',
      link: '/register?role=PROPERTY_MANAGER'
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Platform-Supported Workflows
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Management for Vertical Systems
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            LiftCare Network equips property teams and certified service specialists with purpose-built digital tools to coordinate every phase of equipment care.
          </p>
        </div>

        {/* 8 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`flex flex-col justify-between p-6 rounded-2xl border transition duration-200 group ${
                  service.highlight
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-rose-500/30 shadow-lg shadow-rose-950/20 hover:border-rose-500/50'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        service.highlight
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-blue-600/15 text-cyan-400 border border-blue-500/30'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                        service.highlight
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 mb-6 pt-2 border-t border-slate-800/80">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={service.link}
                  className={`inline-flex items-center justify-between w-full py-2 px-3 rounded-lg text-xs font-bold transition ${
                    service.highlight
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span>{service.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Platform Transparency Notice */}
        <div className="mt-12 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start sm:items-center gap-3 max-w-3xl mx-auto">
          <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200 font-semibold">Service Delivery Note:</strong> LiftCare Network operates as an orchestration software platform and verified directory. Hands-on inspections, physical adjustments, and repairs are executed solely by licensed independent specialists and certified maintenance contractors.
          </p>
        </div>
      </div>
    </section>
  );
}
