import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Siren,
  MapPin,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

export default function TechnicianJobsPage() {
  const { technician } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('AVAILABLE'); // 'AVAILABLE' | 'ACTIVE' | 'COMPLETED'

  // Accept Modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(30);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/maintenance');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setAccepting(true);
    try {
      const res = await api.put(`/maintenance/${selectedRequest._id}/accept`, {
        etaMinutes: Number(etaMinutes)
      });
      if (res.data.success) {
        alert('Job accepted! Property manager notified of your ETA.');
        setSelectedRequest(null);
        fetchJobs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept job. License verification may be required.');
    } finally {
      setAccepting(false);
    }
  };

  const isVerified = technician?.verificationStatus === 'VERIFIED';

  const availableJobs = requests.filter(
    (r) => r.status === 'REQUESTED' || r.status === 'MATCHING'
  );

  const activeJobs = requests.filter((r) =>
    ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'INSPECTION', 'IN_PROGRESS'].includes(r.status)
  );

  const completedJobs = requests.filter((r) =>
    ['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)
  );

  const getDisplayedJobs = () => {
    if (activeTab === 'ACTIVE') return activeJobs;
    if (activeTab === 'COMPLETED') return completedJobs;
    return availableJobs;
  };

  const displayed = getDisplayedJobs();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-emerald-400" />
            Technician Job Board & Service Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accept commercial service requests, coordinate dispatch ETAs, and execute field work orders.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('AVAILABLE')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'AVAILABLE'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Available Jobs ({availableJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'ACTIVE'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Assignments ({activeJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed ({completedJobs.length})
        </button>
      </div>

      {/* Job Cards List */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400">
            No jobs found in this category.
          </div>
        ) : (
          displayed.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-black text-white">
                    {job.equipment?.equipmentId} ({job.equipment?.type})
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {job.requestType}
                  </span>
                  <PriorityBadge priority={job.priority} />
                  {job.isEmergency && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                      🚨 EMERGENCY
                    </span>
                  )}
                  <StatusBadge status={job.status} />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {job.property?.name} ({job.property?.address})
                  </span>
                  <span>Manufacturer: {job.equipment?.manufacturer}</span>
                  {job.etaMinutes && (
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ETA: {job.etaMinutes} mins
                    </span>
                  )}
                </div>
              </div>

              {/* Actions per tab */}
              <div className="flex items-center gap-3 shrink-0">
                {activeTab === 'AVAILABLE' && (
                  <button
                    onClick={() => {
                      if (!isVerified) {
                        alert('Only verified technicians can accept professional jobs. Please submit your license documents.');
                        return;
                      }
                      setSelectedRequest(job);
                      setEtaMinutes(job.isEmergency ? 20 : 35);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Accept Job Order
                  </button>
                )}

                {activeTab === 'ACTIVE' && (
                  <Link
                    to={`/technician/active-job/${job._id}`}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
                  >
                    Execute & Update <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}

                {activeTab === 'COMPLETED' && (
                  <Link
                    to={`/requests/${job._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    View Report & Certificate <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Accept Job Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-2">
              Accept Service Work Order
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Confirm your acceptance of <strong className="text-white">{selectedRequest.equipment?.equipmentId}</strong> at {selectedRequest.property?.name}.
            </p>

            <form onSubmit={handleAcceptJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Estimated Arrival Time (ETA Minutes)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={5}
                    max={180}
                    required
                    value={etaMinutes}
                    onChange={(e) => setEtaMinutes(e.target.value)}
                    className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold text-center focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400">minutes travel time</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={accepting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {accepting ? 'Confirming...' : 'Confirm Acceptance & En Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
