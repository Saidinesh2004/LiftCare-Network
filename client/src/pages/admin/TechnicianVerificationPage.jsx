import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  Award,
  ExternalLink,
  MapPin,
  Clock,
  Wrench,
  Search,
  X
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function TechnicianVerificationPage() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Review Modal State
  const [selectedTech, setSelectedTech] = useState(null);
  const [actionType, setActionType] = useState('VERIFIED'); // 'VERIFIED' | 'REJECTED' | 'RESUBMISSION_REQUESTED'
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, [statusFilter]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      let url = '/admin/verifications?';
      if (statusFilter !== 'ALL') url += `status=${statusFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setTechnicians(res.data.technicians);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (tech, action) => {
    setSelectedTech(tech);
    setActionType(action);
    setNotes(
      action === 'VERIFIED'
        ? 'State elevator license and contractor credentials verified and active.'
        : action === 'RESUBMISSION_REQUESTED'
        ? 'Uploaded license image was illegible. Please upload a clear PDF scan of your state credential.'
        : 'Credentials could not be verified under state regulatory records.'
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedTech) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/admin/verifications/${selectedTech._id}`, {
        status: actionType,
        verificationNotes: notes
      });
      if (res.data.success) {
        alert(`Technician verification status updated to ${actionType}!`);
        setSelectedTech(null);
        fetchTechnicians();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            Technician Verification & Regulatory Compliance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review state elevator licenses, OSHA safety records, and approve professional dispatch authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'RESUBMISSION_REQUESTED', 'VERIFIED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Queue Cards */}
      <div className="space-y-4">
        {technicians.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400">
            No technicians found in this verification status queue.
          </div>
        ) : (
          technicians.map((tech) => (
            <div
              key={tech._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{tech.company}</h3>
                    <span className="text-xs text-slate-300 font-medium">
                      Mechanic: {tech.user?.name} &bull; {tech.experience} Yrs Experience &bull; {tech.user?.email}
                    </span>
                  </div>
                  <StatusBadge status={tech.verificationStatus} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">License Number</span>
                    <strong className="font-mono text-cyan-400">{tech.licenseNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Base Location</span>
                    <span className="text-slate-200 truncate block">{tech.location?.address}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Service Radius</span>
                    <span className="text-slate-200">{tech.serviceRadius || 25} KM</span>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Documents:</span>
                  {tech.documents?.licenseDoc ? (
                    <a
                      href={tech.documents.licenseDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold hover:bg-blue-900 transition flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> State License <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-semibold">No License File</span>
                  )}

                  {tech.documents?.certDoc && (
                    <a
                      href={tech.documents.certDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" /> Certifications <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {tech.documents?.idDoc && (
                    <a
                      href={tech.documents.idDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold hover:bg-purple-900 transition flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> ID File <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {tech.verificationNotes && (
                  <p className="text-xs text-amber-300/80 bg-amber-950/30 p-2 rounded-lg border border-amber-900/40">
                    <strong>Note:</strong> {tech.verificationNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons for Administrator */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenReview(tech, 'VERIFIED')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleOpenReview(tech, 'RESUBMISSION_REQUESTED')}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Request Resubmission
                </button>
                <button
                  onClick={() => handleOpenReview(tech, 'REJECTED')}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTech(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-2">
              Confirm Verification Decision: {actionType.replace(/_/g, ' ')}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Technician: <strong className="text-white">{selectedTech.company}</strong> ({selectedTech.licenseNumber})
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Compliance / Verification Audit Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason or instructions sent directly to technician notification feed..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTech(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 rounded-lg text-white text-xs font-bold transition ${
                    actionType === 'VERIFIED'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : actionType === 'RESUBMISSION_REQUESTED'
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {submitting ? 'Applying...' : `Confirm ${actionType.replace(/_/g, ' ')}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
