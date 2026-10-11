import React, { useState } from 'react';
import {
  Cpu,
  MoveUpRight,
  ShieldCheck,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  FileCheck2,
  Wrench,
  AlertCircle,
  Activity,
  Layers
} from 'lucide-react';

export default function EquipmentShowcaseSection() {
  const [selectedUnit, setSelectedUnit] = useState('elevator');

  const demoUnits = {
    elevator: {
      id: 'EQ-7842-TR',
      name: 'High-Rise Express Car #02',
      type: 'Overhead Gearless Traction Passenger Elevator',
      building: 'Metro Financial Tower — Core North',
      status: 'Operational / Nominal',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      lastMaintenance: 'October 02, 2026',
      nextScheduled: 'November 02, 2026',
      manufacturer: 'Otis Elevators (SkyRise Series)',
      capacity: '2,000 kg (26 Passengers)',
      speed: '4.0 m/s',
      floorsServed: 'B2 to 48 (50 Landings)',
      stateTag: 'NY-DEC-88192-A'
    },
    escalator: {
      id: 'EQ-4109-ES',
      name: 'Concourse Transition Escalator #01',
      type: 'Heavy-Duty Commercial Step Escalator',
      building: 'Metro Financial Tower — East Transit Atrium',
      status: 'Operational / Nominal',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      lastMaintenance: 'September 28, 2026',
      nextScheduled: 'October 28, 2026',
      manufacturer: 'Schindler Group (Schindler 9300)',
      capacity: '7,300 persons/hour',
      speed: '0.5 m/s at 30° Incline',
      floorsServed: 'Concourse to Street Plaza',
      stateTag: 'NY-DEC-55204-C'
    }
  };

  const current = demoUnits[selectedUnit];

  const timelineSteps = [
    {
      title: 'Installation',
      category: 'Phase 1',
      desc: 'Commissioning, architectural hoistway mounting, and initial safety certification.',
      icon: Cpu,
      date: 'March 14, 2023',
      status: 'Completed'
    },
    {
      title: 'Inspection',
      category: 'Phase 2',
      desc: 'Annual municipal elevator safety check, governor test, and load verification.',
      icon: ShieldCheck,
      date: 'August 10, 2026',
      status: 'Passed'
    },
    {
      title: 'Preventive Care',
      category: 'Phase 3',
      desc: 'Monthly guide rail lubrication, brake shoe clearance, and door operator calibration.',
      icon: Activity,
      date: 'October 02, 2026',
      status: 'Signed-off'
    },
    {
      title: 'Repair',
      category: 'Phase 4',
      desc: 'On-demand component maintenance, sensor replacements, and controller firmware tuning.',
      icon: Wrench,
      date: 'Logged as needed',
      status: 'Standby'
    },
    {
      title: 'Service Report',
      category: 'Phase 5',
      desc: 'Digital sign-off uploaded to centralized asset profile for audit retention.',
      icon: FileCheck2,
      date: 'Instant Archive',
      status: 'Permanent'
    }
  ];

  return (
    <section id="equipment-showcase" className="py-20 bg-slate-950/80 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Asset Intelligence Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Centralized Equipment Management
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Every elevator and escalator is tracked with structured mechanical parameters, scheduled maintenance cadences, and an immutable historical timeline.
          </p>

          {/* Unit Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 mt-4">
            <button
              onClick={() => setSelectedUnit('elevator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedUnit === 'elevator'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🛗 Sample Elevator Asset</span>
            </button>
            <button
              onClick={() => setSelectedUnit('escalator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedUnit === 'escalator'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚡ Sample Escalator Asset</span>
            </button>
          </div>
        </div>

        {/* Demo Tag Banner */}
        <div className="mb-6 flex items-center justify-between px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Demo Preview / Illustrative Fleet Record
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Non-live mock data demonstrating platform equipment tracking
          </span>
        </div>

        {/* The Showcase Equipment Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-8">
          {/* Main Card Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 text-2xl shrink-0">
                {selectedUnit === 'elevator' ? '🛗' : '⚡'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {current.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                    {current.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{current.building}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${current.statusColor}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {current.status}
              </span>
            </div>
          </div>

          {/* Grid of Equipment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Equipment Type
              </span>
              <span className="text-xs font-bold text-slate-200 mt-1 block">
                {current.type}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Manufacturer / Series
              </span>
              <span className="text-xs font-bold text-slate-200 mt-1 block">
                {current.manufacturer}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Last Maintenance Date
              </span>
              <span className="text-xs font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {current.lastMaintenance}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Next Scheduled Maintenance
              </span>
              <span className="text-xs font-bold text-amber-300 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {current.nextScheduled}
              </span>
            </div>
          </div>

          {/* Visual Maintenance Timeline */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Visual Maintenance Lifecycle Timeline</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                5-STAGE AUDIT TRAIL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          {step.category}
                        </span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {step.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-4 h-4 text-slate-300" />
                        <h4 className="text-xs font-bold text-white">{step.title}</h4>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      {step.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
