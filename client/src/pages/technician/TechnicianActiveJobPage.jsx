import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Cpu,
  CheckCircle2,
  FileCheck2,
  Phone
} from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

export default function TechnicianActiveJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, joinRequestRoom, leaveRequestRoom } = useSocket();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    fetchJob();
    joinRequestRoom(id);

    return () => {
      leaveRequestRoom(id);
    };
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/maintenance/${id}`);
      if (res.data.success) {
        setRequest(res.data.request);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStatus = async (nextStatus, defaultNote = '') => {
    try {
      setUpdating(true);
      const res = await api.put(`/maintenance/${id}/status`, {
        status: nextStatus,
        note: statusNote || defaultNote || `Status updated to ${nextStatus.replace(/_/g, ' ')}`
      });
      if (res.data.success) {
        setRequest(res.data.request);
        setStatusNote('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading active work order telemetry...</div>;
  }

  if (!request) {
    return (
      <div className="p-8 text-center text-slate-400">
        Job not found.{' '}
        <Link to="/technician/jobs" className="text-blue-400">
          Back to job board
        </Link>
      </div>
    );
  }

  const currentStatus = request.status;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <Link
          to="/technician/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Technician Jobs Board
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-emerald-400" />
              Live Work Order Execution
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Unit: <strong className="text-white">{request.equipment?.equipmentId}</strong> at {request.property?.name}
            </p>
          </div>
          <StatusBadge status={currentStatus} size="lg" />
        </div>
      </div>

      {/* Main Action Command Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Technician Stage Transition Controls
          </span>

          {/* Contextual Action Button based on status */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block">Current Phase:</span>
              <strong className="text-lg font-black text-white">{currentStatus.replace(/_/g, ' ')}</strong>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentStatus === 'ASSIGNED' && 'Job assigned. Ready to depart.'}
                {currentStatus === 'ACCEPTED' && 'Order accepted. Prepare tools and mark En-Route.'}
                {currentStatus === 'ON_THE_WAY' && 'Traveling to facility. Upon arrival, check in at security desk.'}
                {currentStatus === 'ARRIVED' && 'On-site. Place safety stanchions and begin diagnostic inspection.'}
                {currentStatus === 'INSPECTION' && 'Diagnosing motor, door clutch, governor, and error codes.'}
                {currentStatus === 'IN_PROGRESS' && 'Conducting mechanical repair, parts replacement, and recalibration.'}
                {currentStatus === 'COMPLETED' && 'Work completed. Service report submitted for property manager approval.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {(currentStatus === 'ASSIGNED' || currentStatus === 'ACCEPTED') && (
                <button
                  onClick={() => handleAdvanceStatus('ON_THE_WAY', 'Technician en-route in service vehicle.')}
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" /> Start Journey (En Route)
                </button>
              )}

              {currentStatus === 'ON_THE_WAY' && (
                <button
                  onClick={() => handleAdvanceStatus('ARRIVED', 'Technician arrived on-site at commercial facility.')}
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" /> Mark Arrived On-Site
                </button>
              )}

              {currentStatus === 'ARRIVED' && (
                <button
                  onClick={() => handleAdvanceStatus('INSPECTION', 'Secured area and began diagnostic code readout & mechanical inspection.')}
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold shadow-lg shadow-yellow-600/30 transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Begin Inspection Phase
                </button>
              )}

              {currentStatus === 'INSPECTION' && (
                <button
                  onClick={() => handleAdvanceStatus('IN_PROGRESS', 'Fault isolated. Initiated active mechanical and electrical repair.')}
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" /> Begin Repair Work (In Progress)
                </button>
              )}

              {currentStatus === 'IN_PROGRESS' && (
                <Link
                  to={`/technician/submit-report/${request._id}`}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" /> Complete Work & Submit Report
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Optional Custom Note Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Log Optional Field Note with next status update:
          </label>
          <input
            type="text"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="e.g. Traffic delay on bridge, or waiting for security freight elevator escort..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Facility & Equipment Reference Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-400" /> Building Location & Access
          </h3>
          <div>
            <span className="text-base font-bold text-white block">{request.property?.name}</span>
            <p className="text-xs text-slate-300 mt-0.5">{request.property?.address}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact: {request.property?.contactPhone}</span>
            </div>
            <div>Floors: <strong className="text-white">{request.property?.totalFloors} Stories</strong></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" /> Equipment Specs
          </h3>
          <div>
            <span className="text-base font-bold text-white block">
              {request.equipment?.equipmentId} ({request.equipment?.type})
            </span>
            <span className="text-xs text-slate-400">
              {request.equipment?.manufacturer} {request.equipment?.model}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <div>Serial: <span className="font-mono text-cyan-400">{request.equipment?.serialNumber}</span></div>
            <div>Capacity: <span className="text-white">{request.equipment?.capacity}</span></div>
          </div>
        </div>
      </div>

      {/* Safety Compliance Protocol Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> ASME A17.1 Field Safety Protocols
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Lockout / Tagout (LOTO) verified on main disconnect
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Barricades & Caution signs placed at landings
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Top of Car Inspection station tested before hoistway entry
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Governor safety circuit & emergency stop checked
          </div>
        </div>
      </div>
    </div>
  );
}
