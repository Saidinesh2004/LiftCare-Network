import React from 'react';
import { ArrowUp, ArrowDown, Activity, ShieldCheck, Zap, Gauge } from 'lucide-react';

export default function ElevatorBackground({ opacity = 'opacity-85' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${opacity} z-0`}>
      {/* 1. Deep Cyber Blueprint Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-40" />

      {/* 2. Horizontal Floor Markers */}
      <div className="absolute inset-0 flex flex-col justify-between py-12 px-6 opacity-15">
        <div className="w-full border-b border-dashed border-cyan-500 flex justify-between text-[10px] font-mono tracking-widest text-cyan-400">
          <span>ZONE A // L45 PENTHOUSE & OBSERVATORY</span>
          <span>ELEVATION: +182.5m</span>
        </div>
        <div className="w-full border-b border-dashed border-cyan-500/70 flex justify-between text-[10px] font-mono tracking-widest text-cyan-400/80">
          <span>ZONE B // L30 MID-RISE SKY LOBBY</span>
          <span>ELEVATION: +120.0m</span>
        </div>
        <div className="w-full border-b border-dashed border-cyan-500/50 flex justify-between text-[10px] font-mono tracking-widest text-cyan-400/60">
          <span>ZONE C // L15 COMMERCIAL OFFICE BANK</span>
          <span>ELEVATION: +60.0m</span>
        </div>
        <div className="w-full border-b border-dashed border-cyan-500 flex justify-between text-[10px] font-mono tracking-widest text-cyan-400">
          <span>ZONE D // L01 MAIN CONCOURSE & TRANSIT</span>
          <span>ELEVATION: 0.0m</span>
        </div>
      </div>

      {/* 3. SHAFT 1 (Left): Express Passenger Traction Lift */}
      <div className="absolute left-[4%] sm:left-[8%] top-0 bottom-0 w-24 sm:w-32 border-x border-cyan-500/15">
        {/* Steel cables running full height with pulse */}
        <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-slate-700/50 anim-cable-signal" />
        <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-slate-700/50 anim-cable-signal" style={{ animationDelay: '1.2s' }} />

        {/* Counterweight (moves opposite to car) */}
        <div className="absolute left-2 w-6 h-14 bg-gradient-to-b from-slate-700 to-slate-800 rounded border border-slate-600/50 anim-counterweight-1 flex flex-col items-center justify-center shadow-lg">
          <div className="w-4 h-1 bg-cyan-400/60 rounded-full mb-1" />
          <span className="text-[7px] font-mono text-cyan-300 font-bold rotate-90">CW-1</span>
        </div>

        {/* Elevator Cab 1 (Ascending) */}
        <div className="absolute left-1 sm:left-2 right-1 sm:right-2 h-36 bg-slate-900/90 border-2 border-cyan-500/40 rounded-xl p-2.5 backdrop-blur-sm shadow-[0_0_25px_rgba(6,182,212,0.25)] anim-elevator-1 flex flex-col justify-between">
          {/* Top Suspension Mount */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-cyan-950 border border-cyan-500/40 rounded-t flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* Cabin Header & Digital Indicator */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
            <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              CAR 01
            </span>
            <span className="bg-cyan-500/20 text-cyan-300 font-mono text-[10px] px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
              <ArrowUp className="w-3 h-3 text-cyan-400 animate-bounce" /> 42
            </span>
          </div>

          {/* Cabin Interior Window / Silhouette */}
          <div className="my-1 flex-1 rounded bg-gradient-to-b from-cyan-950/40 via-cyan-900/20 to-transparent border border-cyan-500/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)]" />
            <div className="text-[8px] font-mono text-cyan-300/80 text-center">
              <div>VFD: 2.5 m/s</div>
              <div className="text-[7px] text-emerald-400 font-bold">DOOR: LOCKED</div>
            </div>
          </div>

          {/* Bottom Safety Shoe */}
          <div className="flex justify-between items-center text-[7px] font-mono text-slate-400 pt-1 border-t border-cyan-500/10">
            <span>OTIS SKYRISE</span>
            <span className="text-cyan-400 font-bold">2000 KG</span>
          </div>
        </div>
      </div>

      {/* 4. SHAFT 2 (Right): Commercial Heavy Lift Elevator */}
      <div className="absolute right-[4%] sm:right-[9%] top-0 bottom-0 w-24 sm:w-32 border-x border-amber-500/15">
        {/* Steel cables */}
        <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-slate-700/50 anim-cable-signal" style={{ animationDelay: '0.6s' }} />
        <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-slate-700/50 anim-cable-signal" style={{ animationDelay: '2.4s' }} />

        {/* Elevator Cab 2 (Descending) */}
        <div className="absolute left-1 sm:left-2 right-1 sm:right-2 h-36 bg-slate-900/90 border-2 border-amber-500/40 rounded-xl p-2.5 backdrop-blur-sm shadow-[0_0_25px_rgba(245,158,11,0.25)] anim-elevator-2 flex flex-col justify-between">
          {/* Top Suspension Mount */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-amber-950 border border-amber-500/40 rounded-t flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          {/* Cabin Header & Digital Indicator */}
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5">
            <span className="text-[9px] font-mono font-bold text-amber-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              CAR 03
            </span>
            <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
              <ArrowDown className="w-3 h-3 text-amber-400 animate-bounce" /> 18
            </span>
          </div>

          {/* Cabin Interior Window */}
          <div className="my-1 flex-1 rounded bg-gradient-to-b from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15),transparent_70%)]" />
            <div className="text-[8px] font-mono text-amber-300/80 text-center">
              <div>FREIGHT DUAL DRIVE</div>
              <div className="text-[7px] text-amber-400 font-bold">HYD: 140 PSI</div>
            </div>
          </div>

          {/* Bottom Safety Shoe */}
          <div className="flex justify-between items-center text-[7px] font-mono text-slate-400 pt-1 border-t border-amber-500/10">
            <span>SCHINDLER 7000</span>
            <span className="text-amber-400 font-bold">4500 KG</span>
          </div>
        </div>
      </div>

      {/* 5. SHAFT 3 (Far Right, Hidden on very small screens): Panoramic High-Speed Lift */}
      <div className="hidden lg:block absolute right-[22%] top-0 bottom-0 w-28 border-x border-emerald-500/15">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700/50 anim-cable-signal" style={{ animationDelay: '1.8s' }} />

        {/* Elevator Cab 3 */}
        <div className="absolute left-2 right-2 h-32 bg-slate-900/90 border-2 border-emerald-500/40 rounded-xl p-2.5 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] anim-elevator-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1">
            <span className="text-[8px] font-mono font-bold text-emerald-400">CAR 05 (GLASS)</span>
            <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[9px] px-1 py-0.5 rounded font-black flex items-center">
              <ArrowUp className="w-2.5 h-2.5 text-emerald-400" /> 78
            </span>
          </div>
          <div className="text-[7px] font-mono text-emerald-300/80 text-center my-auto">
            <span>KONE MONOSPACE</span>
            <div className="text-emerald-400 font-semibold mt-0.5">EXPRESS ATRIUM</div>
          </div>
          <div className="flex justify-between text-[7px] font-mono text-slate-500 border-t border-emerald-500/10 pt-1">
            <span>REGEN DRIVE</span>
            <span className="text-emerald-400">100% OK</span>
          </div>
        </div>
      </div>

      {/* 6. Escalator Diagonal Mechanical Track (Center-Left) */}
      <div className="hidden md:block absolute left-[22%] lg:left-[26%] top-0 bottom-0 w-36 pointer-events-none opacity-40">
        <div className="absolute inset-0 anim-escalator-treads border-x border-cyan-500/20" />
        <div className="absolute top-1/4 left-0 right-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent h-0.5" />
        <div className="absolute top-2/4 left-0 right-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent h-0.5" />
        <div className="absolute top-3/4 left-0 right-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent h-0.5" />
      </div>

      {/* 7. Vertical Laser Scanner Beam across the Hoistway */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent anim-shaft-scan shadow-[0_0_15px_rgba(6,182,212,0.8)]" />

      {/* 8. Floating IoT Telemetry Badges (Desktop View) */}
      <div className="hidden xl:flex absolute top-20 left-[23%] anim-hud-float flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-950/50">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>VIBRATION SENSORS: 0.04g NOMINAL</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/50">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>GOVERNOR OVERSPEED: CALIBRATED</span>
        </div>
      </div>

      <div className="hidden xl:flex absolute bottom-24 right-[25%] anim-hud-float flex-col gap-3" style={{ animationDelay: '3s' }}>
        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-amber-500/30 text-[10px] font-mono text-amber-300 backdrop-blur-md shadow-lg shadow-amber-950/50">
          <Gauge className="w-3.5 h-3.5 text-amber-400" />
          <span>HYDRAULIC PRESSURE: 145 PSI (STABLE)</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-blue-500/30 text-[10px] font-mono text-blue-300 backdrop-blur-md shadow-lg shadow-blue-950/50">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>DOOR CLUTCH INTERLOCK: SECURED</span>
        </div>
      </div>

      {/* 9. Radial Vignette Overlay to ensure center card readability */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/90" />
    </div>
  );
}
