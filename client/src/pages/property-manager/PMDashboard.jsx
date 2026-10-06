import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Cpu,
  Wrench,
  Siren,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Search,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import EmergencyModal from '../../components/EmergencyModal';

export default function PMDashboard() {
  const [properties, setProperties] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [propsRes, equipRes, reqRes] = await Promise.all([
        api.get('/properties'),
        api.get('/equipment'),
        api.get('/maintenance')
      ]);

      if (propsRes.data.success) setProperties(propsRes.data.properties);
      if (equipRes.data.success) setEquipment(equipRes.data.equipment);
      if (reqRes.data.success) setRequests(reqRes.data.requests);
    } catch (err) {
      console.error('Error fetching PM dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalProperties = properties.length;
  const elevatorsCount = equipment.filter((e) => e.type === 'Elevator').length;
  const escalatorsCount = equipment.filter((e) => e.type === 'Escalator' || e.type === 'Moving Walk').length;
  const totalEquipment = equipment.length;

  const activeRequests = requests.filter(
    (r) => !['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)
  );
  const emergencyRequests = requests.filter((r) => r.isEmergency);
  const upcomingMaintenance = equipment.filter((e) => e.status === 'Maintenance Due');
  const completedJobs = requests.filter((r) => ['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Property Operations Command Center
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Commercial Fleet
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live health monitoring, certified technician dispatching, and safety compliance across managed commercial buildings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowEmergency(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/30 transition flex items-center gap-2 animate-pulse"
          >
            <Siren className="w-4 h-4" />
            DISPATCH EMERGENCY
          </button>
          <Link
            to="/requests/new"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Log Service Request
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Managed Properties"
          value={totalProperties}
          subtitle="Commercial & Medical High-Rises"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Elevators & Escalators"
          value={totalEquipment}
          subtitle={`${elevatorsCount} Elevators • ${escalatorsCount} Escalators`}
          icon={Cpu}
          color="indigo"
        />
        <StatCard
          title="Active Service Jobs"
          value={activeRequests.length}
          subtitle={`${emergencyRequests.length} marked Critical Emergency`}
          icon={Wrench}
          color={emergencyRequests.length > 0 ? 'rose' : 'amber'}
        />
        <StatCard
          title="Completed & Certified"
          value={completedJobs.length}
          subtitle="Verified service reports logged"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Live Active Maintenance Requests Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              Active Maintenance & Emergency Jobs
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status progression from dispatch through inspection and report approval
            </p>
          </div>
          <Link
            to="/requests"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
          >
            View all requests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Equipment Unit</th>
                <th className="py-3 px-4">Commercial Property</th>
                <th className="py-3 px-4">Type / Priority</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Assigned Technician</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No active maintenance requests. All vertical transportation operational!
                  </td>
                </tr>
              ) : (
                activeRequests.slice(0, 6).map((req) => (
                  <tr key={req._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        {req.equipment?.equipmentId || 'Unit'}
                        {req.isEmergency && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {req.equipment?.type} • {req.equipment?.manufacturer}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-medium block">{req.property?.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block max-w-xs">{req.property?.address}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-slate-200">{req.requestType}</span>
                        <PriorityBadge priority={req.priority} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} />
                      {req.etaMinutes && (req.status === 'ACCEPTED' || req.status === 'ON_THE_WAY') && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400 font-medium">
                          <Clock className="w-3 h-3" /> ETA ~{req.etaMinutes} mins
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {req.assignedTechnician ? (
                        <div>
                          <span className="text-slate-200 font-semibold block">
                            {req.assignedTechnician.company}
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            ★ {req.assignedTechnician.rating || '4.8'} • Verified
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-400/80 italic text-[11px]">Searching matching tech...</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/requests/${req._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white transition font-medium text-xs"
                      >
                        Track <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buildings & Equipment Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Managed Properties Showcase */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Commercial Properties Portfolio
            </h3>
            <Link to="/properties" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
              Manage Properties
            </Link>
          </div>

          <div className="space-y-3">
            {properties.slice(0, 3).map((prop) => (
              <Link
                key={prop._id}
                to={`/properties/${prop._id}`}
                className="block p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{prop.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {prop.totalFloors} Floors
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{prop.address}, {prop.city}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-300">
                  <span>Elevators: <strong className="text-white">{prop.stats?.elevators || 0}</strong></span>
                  <span>Escalators: <strong className="text-white">{prop.stats?.escalators || 0}</strong></span>
                  <span className={prop.stats?.activeRequests > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {prop.stats?.activeRequests || 0} Active Tickets
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Equipment Health & Maintenance Radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Equipment Attention Radar
            </h3>
            <Link to="/equipment" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              Fleet View
            </Link>
          </div>

          <div className="space-y-3">
            {equipment
              .filter((e) => e.status !== 'Operational')
              .slice(0, 4)
              .map((eq) => (
                <Link
                  key={eq._id}
                  to={`/equipment/${eq._id}`}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {eq.equipmentId} ({eq.type})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {eq.property?.name || 'Commercial Building'} • {eq.manufacturer} {eq.model}
                    </span>
                  </div>
                  <StatusBadge status={eq.status} />
                </Link>
              ))}

            {equipment.filter((e) => e.status !== 'Operational').length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                All units operational! No maintenance alerts pending.
              </div>
            )}
          </div>
        </div>
      </div>

      <EmergencyModal
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
        onSuccess={() => fetchDashboardData()}
      />
    </div>
  );
}
