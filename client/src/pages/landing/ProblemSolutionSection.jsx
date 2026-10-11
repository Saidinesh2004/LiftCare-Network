import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  FileQuestion,
  Clock,
  EyeOff,
  CalendarX2,
  ShieldCheck,
  FolderArchive,
  MessageSquareCheck,
  Activity,
  CalendarCheck2
} from 'lucide-react';

export default function ProblemSolutionSection() {
  const comparisons = [
    {
      challenge: 'Difficulty Finding Suitable Specialists',
      challengeDesc:
        'Sourcing certified vertical-transportation specialists on short notice often means relying on fragmented phone trees and unverified local directories.',
      challengeIcon: Search,
      solution: 'Vetted Specialist Directory',
      solutionDesc:
        'Discover technicians based on verified licensing, specific equipment specialties (hydraulic, traction, freight, escalator), and service availability.',
      solutionIcon: ShieldCheck
    },
    {
      challenge: 'Unorganized Maintenance Records',
      challengeDesc:
        'Paper logbooks stored in machine rooms get damaged, lost, or overlooked, leaving building managers unprepared for mandatory safety audits.',
      challengeIcon: FileQuestion,
      solution: 'Centralized Digital Equipment Dossiers',
      solutionDesc:
        'Every elevator and escalator has a permanent digital record capturing inspections, mechanical adjustments, component replacements, and dates.',
      solutionIcon: FolderArchive
    },
    {
      challenge: 'Delayed Communication',
      challengeDesc:
        'Unclear phone updates and slow callback loops leave tenants frustrated and building managers without answers during unexpected downtime.',
      challengeIcon: Clock,
      solution: 'Direct In-Platform Job Coordination',
      solutionDesc:
        'Automated status updates, real-time dispatch alerts, and clear notifications keep property teams informed from request to resolution.',
      solutionIcon: MessageSquareCheck
    },
    {
      challenge: 'Limited Visibility into Repair Progress',
      challengeDesc:
        'Property managers frequently have no insight into whether a technician has arrived on-site, diagnosed the fault, or completed testing.',
      challengeIcon: EyeOff,
      solution: 'Transparent Lifecycle Tracking',
      solutionDesc:
        'Live tracking from Open → Matched → In Progress to Completed, followed by standardized digital service reports with diagnostic detail.',
      solutionIcon: Activity
    },
    {
      challenge: 'Missed Preventive Maintenance Schedules',
      challengeDesc:
        'Lacking automated schedule reminders leads to lapsed routine inspections, accelerating wear and risking costly regulatory non-compliance.',
      challengeIcon: CalendarX2,
      solution: 'Proactive Maintenance Scheduling',
      solutionDesc:
        'Structured equipment profiles highlight last-serviced dates and upcoming maintenance windows so preventive care is never missed.',
      solutionIcon: CalendarCheck2
    }
  ];

  return (
    <section id="problem-solution" className="py-20 bg-slate-950/70 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Operational Transformation
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Bridging the Gap in Commercial Equipment Maintenance
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Vertical mobility systems are critical to tenant safety and daily operations. LiftCare Network replaces outdated, fragmented processes with a dependable, transparent digital platform.
          </p>
        </div>

        {/* Challenge vs Solution Cards */}
        <div className="space-y-4">
          {comparisons.map((item, idx) => {
            const ChallengeIcon = item.challengeIcon;
            const SolutionIcon = item.solutionIcon;
            return (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition duration-200"
              >
                {/* Traditional Challenge */}
                <div className="p-5 sm:p-6 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800/90 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <ChallengeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                        Common Challenge
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">
                      {item.challenge}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                      {item.challengeDesc}
                    </p>
                  </div>
                </div>

                {/* LiftCare Solution */}
                <div className="p-5 sm:p-6 bg-slate-900/40 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                    <SolutionIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                        LiftCare Network Solution
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {item.solution}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {item.solutionDesc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
