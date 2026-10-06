import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Building2,
  Cpu,
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Siren,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

const ALL_STATUSES = [
  'REQUESTED',
  'MATCHING',
  'ASSIGNED',
  'ACCEPTED',
  'ON_THE_WAY',
  'ARRIVED',
  'INSPECTION',
  'IN_PROGRESS',
  'COMPLETED',
  'APPROVED',
  'CLOSED'
];

export default function RequestDetailPage() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const { socket, joinRequestRoom, leaveRequestRoom } = useSocket();

  const [request, setRequest] = useState(null);
  const [serviceReport, setServiceReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review Report State
  const [reviewing, setReviewing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  useEffect(() => {
    fetchRequestData();
    joinRequestRoom(id);

    if (socket) {
      socket.on('job:status_changed', (data) => {
        if (data.requestId === id) {
          fetchRequestData();
        }
      });
      socket.on('report:submitted', (data) => {
        if (data.requestId === id) {
          fetchRequestData();
        }
      });
    }

    return () => {
      leaveRequestRoom(id);
      if (socket) {
        socket.off('job:status_changed');
        socket.off('report:submitted');
      }
    };
  }, [id, socket]);

  const fetchRequestData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/maintenance/${id}`);
      if (res.data.success) {
        setRequest(res.data.request);
      }

      // Check for service report
      try {
        const repRes = await api.get(`/service-reports/request/${id}`);
        if (repRes.data.success) {
          setServiceReport(repRes.data.report);
        }
      } catch (repErr) {
        setServiceReport(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewReport = async (action) => {
    if (!serviceReport) return;
    try {
      setReviewing(true);
      const res = await api.put(`/service-reports/${serviceReport._id}/review`, {
        action,
        managerFeedback: feedback
      });
      if (res.data.success) {
        alert(action === 'APPROVE' ? 'Service Report Approved & Certified!' : 'Revision requested.');
        setShowRevisionModal(false);
        fetchRequestData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Review action failed');
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading service request tracker...</div>;
  }

  if (!request) {
    return (
      <div className="p-8 text-center text-slate-400">
        Request not found.{' '}
        <Link to="/requests" className="text-blue-400">
          Return to requests
        </Link>
      </div>
    );
  }

  const currentStatusIndex = ALL_STATUSES.indexOf(request.status);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Maintenance Board
        </Link>
      </div>

      {/* Main Request Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PriorityBadge priority={request.priority} />
              {request.isEmergency && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                  CRITICAL EMERGENCY
                </span>
              )}
              <StatusBadge status={request.status} size="lg" />
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              {request.requestType} &bull; {request.equipment?.equipmentId}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {request.description}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-right min-w-[200px]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ticket ID</span>
            <span className="text-xs font-mono text-cyan-400 font-bold block">{request._id}</span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Logged: {new Date(request.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 11-Stage Status Progression Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Real-Time Lifecycle Pipeline (11 Stages)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-1.5 text-center">
            {ALL_STATUSES.map((st, idx) => {
              const isPast = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              let pillStyle = 'bg-slate-950 text-slate-500 border-slate-800';
              if (isPast) {
                pillStyle = 'bg-blue-950/60 text-blue-300 border-blue-500/40';
              } else if (isCurrent) {
                pillStyle = 'bg-blue-600 text-white border-blue-400 font-bold shadow-lg shadow-blue-600/30 animate-pulse';
              }

              return (
                <div
                  key={st}
                  className={`p-2 rounded-lg border text-[10px] uppercase tracking-wider transition ${pillStyle}`}
                >
                  <div className="font-semibold truncate">{st.replace(/_/g, ' ')}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Details & Service Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Property, Equipment & Technician details */}
        <div className="space-y-6">
          {/* Facility Location Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" /> Commercial Building
            </h3>
            <div>
              <span className="text-base font-bold text-white block">{request.property?.name}</span>
              <p className="text-xs text-slate-400 mt-0.5">{request.property?.address}</p>
            </div>
            <div className="text-xs text-slate-300 pt-1">
              <span>Facility Desk: {request.property?.contactPhone}</span>
            </div>
          </div>

          {/* Equipment Unit Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> Equipment Specs
            </h3>
            <div>
              <span className="text-sm font-bold text-white block">
                {request.equipment?.equipmentId} ({request.equipment?.type})
              </span>
              <span className="text-xs text-slate-400">
                {request.equipment?.manufacturer} {request.equipment?.model}
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <div>Serial: <span className="font-mono text-white">{request.equipment?.serialNumber}</span></div>
              <div>Capacity: <span className="text-white">{request.equipment?.capacity}</span></div>
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Assigned Technician
            </h3>

            {request.assignedTechnician ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {request.assignedTechnician.company}
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      ★ {request.assignedTechnician.rating || '4.8'} &bull; {request.assignedTechnician.experience} yrs exp
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div>License: <span className="font-mono text-emerald-400">{request.assignedTechnician.licenseNumber}</span></div>
                  <div>Verification: <strong className="text-emerald-300">{request.assignedTechnician.verificationStatus}</strong></div>
                  {request.etaMinutes && (
                    <div className="text-cyan-400 font-semibold flex items-center gap-1 pt-1 border-t border-slate-800">
                      <Clock className="w-3.5 h-3.5" /> En route ETA: {request.etaMinutes} minutes
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-amber-400/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                <p>No technician currently assigned.</p>
                <Link
                  to={`/technicians?propertyId=${request.property?._id}`}
                  className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  Find & Match Technician
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Service Report & Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Report Card (If Completed) */}
          {serviceReport ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Post-Maintenance Documentation
                  </span>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-emerald-400" />
                    Technician Service & Inspection Report
                  </h2>
                </div>
                <StatusBadge status={serviceReport.status} size="lg" />
              </div>

              {/* Inspection Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Inspection Findings
                  </span>
                  <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                    {serviceReport.inspectionDetails}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Problem Identified
                  </span>
                  <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-rose-300 font-medium leading-relaxed">
                    {serviceReport.problemIdentified}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Work Performed
                  </span>
                  <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300 leading-relaxed">
                    {serviceReport.workPerformed}
                  </p>
                </div>

                {serviceReport.partsReplaced && serviceReport.partsReplaced.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Parts Replaced
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {serviceReport.partsReplaced.map((part, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-medium"
                        >
                          🔩 {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Technician Recommendations
                  </span>
                  <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                    {serviceReport.recommendations}
                  </p>
                </div>

                {/* Evidence Photos */}
                {(serviceReport.beforeImages?.length > 0 || serviceReport.afterImages?.length > 0) && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Repair Evidence Photos
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {serviceReport.beforeImages?.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-slate-800 relative group">
                          <img src={img} alt="Before repair" className="w-full h-28 object-cover" />
                          <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-[10px] px-1.5 py-0.5 rounded text-white font-semibold">
                            Before Repair
                          </span>
                        </div>
                      ))}
                      {serviceReport.afterImages?.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-slate-800 relative group">
                          <img src={img} alt="After repair" className="w-full h-28 object-cover" />
                          <span className="absolute bottom-1.5 left-1.5 bg-emerald-950/90 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-semibold border border-emerald-500/40">
                            After Certification
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Labor & Cost Summary */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Labor Hours</span>
                    <strong className="text-white text-sm">{serviceReport.laborHours} Hours</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Service Cost</span>
                    <strong className="text-emerald-400 text-sm">${serviceReport.costEstimate}</strong>
                  </div>
                </div>

                {serviceReport.managerFeedback && (
                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-300 text-xs">
                    <strong>Manager Review Note:</strong> {serviceReport.managerFeedback}
                  </div>
                )}
              </div>

              {/* Approval Actions (For Property Manager / Admin) */}
              {(role === 'PROPERTY_MANAGER' || role === 'ADMIN') && serviceReport.status === 'PENDING_APPROVAL' && (
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
                  <button
                    onClick={() => setShowRevisionModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => handleReviewReport('APPROVE')}
                    disabled={reviewing}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {reviewing ? 'Approving...' : 'APPROVE & CERTIFY EQUIPMENT'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Service Report Pending</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                The technician will submit detailed inspection findings, before/after photos, and replaced parts upon job completion.
              </p>
            </div>
          )}

          {/* Timeline Event Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Activity Audit Trail
            </h3>

            <div className="space-y-3">
              {request.timeline?.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge status={entry.status} />
                    <span className="text-[10px] text-slate-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 pt-0.5">{entry.note}</p>
                  <span className="text-[10px] text-slate-500 block">Logged by {entry.updatedBy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-2">Request Service Report Revision</h3>
            <p className="text-xs text-slate-400 mb-4">
              Provide feedback to the technician explaining what additional details or photos are required.
            </p>

            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Please clarify if the door interlock contacts were re-calibrated..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewReport('REVISION')}
                disabled={reviewing}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
