import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  DollarSign,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  Siren,
  FileCheck2,
  MapPin,
  Radio
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

export default function TechnicianDashboard() {
  const { user, technician, setTechnician } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, profRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/technicians/me/profile')
      ]);

      if (reqRes.data.success) setRequests(reqRes.data.requests);
      if (profRes.data.success) setTechnician(profRes.data.technician);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      setToggling(true);
      const res = await api.patch('/technicians/me/availability');
      if (res.data.success) {
        setTechnician((prev) => ({ ...prev, availability: res.data.availability }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Toggle failed');
    } finally {
      setToggling(false);
    }
  };

  const isVerified = technician?.verificationStatus === 'VERIFIED';
  const availableJobs = requests.filter((r) => r.status === 'REQUESTED' || r.status === 'MATCHING');
  const activeJobs = requests.filter((r) =>
    ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'INSPECTION', 'IN_PROGRESS'].includes(r.status)
  );
  const completedJobs = requests.filter((r) =>
    ['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Verification Alert Banner if pending or rejected */}
      {!isVerified && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">License Verification In Progress</h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Current Status: <strong className="text-white">{technician?.verificationStatus}</strong>. Upload your state elevator credentials to unlock commercial job acceptance.
              </p>
            </div>
          </div>
          <Link
            to="/technician/profile"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shrink-0"
          >
            Upload Credentials
          </Link>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-black shadow-lg">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {technician?.company || user?.name}
              <StatusBadge status={technician?.verificationStatus || 'PENDING'} />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              License: <span className="font-mono text-slate-200">{technician?.licenseNumber}</span> &bull; {technician?.experience} Yrs Professional Experience
            </p>
          </div>
        </div>

        {/* Live Availability Switch */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-3 rounded-xl">
          <div>
            <span className="text-xs font-bold text-white block">Dispatch Status</span>
            <span className={`text-[11px] font-semibold ${technician?.availability ? 'text-emerald-400' : 'text-slate-400'}`}>
              {technician?.availability ? '● Available for Jobs' : '○ On Standby'}
            </span>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              technician?.availability
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {technician?.availability ? 'Set Standby' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Technician KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Open Jobs"
          value={availableJobs.length}
          subtitle="Requests ready for acceptance"
          icon={Wrench}
          color="blue"
        />
        <StatCard
          title="Active On-Duty Jobs"
          value={activeJobs.length}
          subtitle="In-progress & En-route tickets"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Service Rating"
          value={`★ ${technician?.rating || '4.8'}`}
          subtitle={`${technician?.ratingCount || 15} verified property reviews`}
          icon={Star}
          color="emerald"
        />
        <StatCard
          title="Platform Earnings"
          value={`$${technician?.earnings || 0}`}
          subtitle={`${completedJobs.length} certified reports approved`}
          icon={DollarSign}
          color="indigo"
        />
      </div>

      {/* Active Jobs Execution Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Active On-Duty Work Tickets ({activeJobs.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update real-time ETA, mark on-site arrival, and conduct safety inspections
            </p>
          </div>
          <Link
            to="/technician/jobs"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
          >
            Job Board <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {activeJobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No jobs currently in progress. Check available jobs below to accept a new service ticket!
            </div>
          ) : (
            activeJobs.map((req) => (
              <div
                key={req._id}
                className="p-5 hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{req.equipment?.equipmentId}</span>
                    <span className="text-xs text-slate-400">({req.equipment?.type})</span>
                    <PriorityBadge priority={req.priority} />
                    {req.isEmergency && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                        EMERGENCY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{req.description}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {req.property?.name} &bull; {req.property?.address}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={req.status} size="lg" />
                  <Link
                    to={`/technician/active-job/${req._id}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
                  >
                    Execute Job <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available Jobs Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            Available Commercial Requests in Service Area ({availableJobs.length})
          </h3>
          <Link to="/technician/jobs" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
            View All Open Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableJobs.slice(0, 4).map((req) => (
            <div
              key={req._id}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {req.equipment?.equipmentId} &bull; {req.requestType}
                  </span>
                  <PriorityBadge priority={req.priority} />
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{req.description}</p>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {req.property?.name}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Estimated Pay: ~$350 - $600</span>
                <Link
                  to={`/technician/jobs`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Accept Ticket
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
