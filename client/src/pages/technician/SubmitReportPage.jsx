import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileCheck2,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Wrench,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';
import api from '../../services/api';

export default function SubmitReportPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [inspectionDetails, setInspectionDetails] = useState('');
  const [problemIdentified, setProblemIdentified] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [partsInput, setPartsInput] = useState('');
  const [partsList, setPartsList] = useState([]);
  const [recommendations, setRecommendations] = useState('Routine 30-day lubrication and governor check recommended.');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [laborHours, setLaborHours] = useState(3.0);
  const [costEstimate, setCostEstimate] = useState(480);

  // Before & After Images (Simulated URLs or file inputs)
  const [beforeImages, setBeforeImages] = useState([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
  ]);
  const [afterImages, setAfterImages] = useState([
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80'
  ]);
  const [newBeforeUrl, setNewBeforeUrl] = useState('');
  const [newAfterUrl, setNewAfterUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/maintenance/${requestId}`);
      if (res.data.success) {
        setRequest(res.data.request);
        // Pre-fill smart defaults based on the issue description
        setProblemIdentified(`Diagnosed failure on ${res.data.request.equipment?.equipmentId}: ${res.data.request.description}`);
        setInspectionDetails('Visual and electronic diagnostics performed on drive machine, safety circuits, door clutch interlocks, and guide shoes.');
        setWorkPerformed('Replaced damaged components, cleaned hoistway sensors, tightened terminals, and completed 5 test travel cycles with full load verification.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = () => {
    if (partsInput.trim() && !partsList.includes(partsInput.trim())) {
      setPartsList([...partsList, partsInput.trim()]);
      setPartsInput('');
    }
  };

  const handleRemovePart = (index) => {
    setPartsList(partsList.filter((_, i) => i !== index));
  };

  const handleAddBeforeImage = () => {
    if (newBeforeUrl.trim()) {
      setBeforeImages([...beforeImages, newBeforeUrl.trim()]);
      setNewBeforeUrl('');
    }
  };

  const handleAddAfterImage = () => {
    if (newAfterUrl.trim()) {
      setAfterImages([...afterImages, newAfterUrl.trim()]);
      setNewAfterUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!inspectionDetails || !problemIdentified || !workPerformed) {
      setError('Please fill in inspection details, problem identified, and work performed.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        maintenanceRequestId: requestId,
        inspectionDetails,
        problemIdentified,
        workPerformed,
        partsReplaced: partsList,
        recommendations,
        beforeImages,
        afterImages,
        technicianNotes,
        laborHours: Number(laborHours),
        costEstimate: Number(costEstimate)
      };

      const res = await api.post('/service-reports', payload);
      if (res.data.success) {
        alert('Service Report submitted successfully! Sent to Property Manager for review and approval.');
        navigate('/technician/jobs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading job data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <Link
          to={`/technician/active-job/${requestId}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Active Job
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-emerald-400" />
          File Technical Service Report
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Certify completed repair on <strong className="text-white">{request?.equipment?.equipmentId}</strong> at {request?.property?.name}.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inspection Details */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              1. Inspection & Diagnostic Details
            </label>
            <textarea
              rows={3}
              required
              value={inspectionDetails}
              onChange={(e) => setInspectionDetails(e.target.value)}
              placeholder="Detail visual, mechanical, electrical diagnostics, error codes, and safety checks..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Problem Identified */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Root Cause / Problem Identified
            </label>
            <textarea
              rows={2}
              required
              value={problemIdentified}
              onChange={(e) => setProblemIdentified(e.target.value)}
              placeholder="e.g. Worn polyurethane roller guide caused excessive car friction; faulty interlock relay contacts."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Work Performed */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              3. Work Performed & Certification Actions
            </label>
            <textarea
              rows={3}
              required
              value={workPerformed}
              onChange={(e) => setWorkPerformed(e.target.value)}
              placeholder="Describe repairs executed, tension adjustments, lubrication, safety drop tests..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Parts Replaced */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              4. Parts Replaced
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={partsInput}
                onChange={(e) => setPartsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPart())}
                placeholder="Type part name (e.g. Door Clutch Roller, 24V Backup Battery, Oil Seal) and press Add"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddPart}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Part
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {partsList.map((part, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-medium"
                >
                  🔩 {part}
                  <button
                    type="button"
                    onClick={() => handleRemovePart(idx)}
                    className="hover:text-rose-400 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              5. Recommendations for Property Manager
            </label>
            <input
              type="text"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Photo Evidence Section */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              6. Photographic Repair Evidence (Before / After)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Add Before Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newBeforeUrl}
                    onChange={(e) => setNewBeforeUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddBeforeImage}
                    className="px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  {beforeImages.map((img, i) => (
                    <img key={i} src={img} alt="Before" className="w-16 h-14 rounded-lg object-cover border border-slate-700" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Add After Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newAfterUrl}
                    onChange={(e) => setNewAfterUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddAfterImage}
                    className="px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  {afterImages.map((img, i) => (
                    <img key={i} src={img} alt="After" className="w-16 h-14 rounded-lg object-cover border border-emerald-600/50" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Labor Hours & Cost Estimate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Labor Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                required
                value={laborHours}
                onChange={(e) => setLaborHours(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Billing / Service Estimate ($ USD)
              </label>
              <input
                type="number"
                min="50"
                max="20000"
                required
                value={costEstimate}
                onChange={(e) => setCostEstimate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
          </div>

          {/* Technician Sign-Off Note */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Technician Safety & Code Certification Statement
            </label>
            <input
              type="text"
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              placeholder="e.g. Certified under Master Elevator License NY-ELEV-94821; tested at 100% capacity."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting Report...' : 'SUBMIT SERVICE REPORT FOR APPROVAL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
