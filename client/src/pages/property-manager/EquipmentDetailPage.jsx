import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Cpu,
  ArrowLeft,
  Building2,
  Calendar,
  Wrench,
  Siren,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  FileCheck2,
  Plus,
  X
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import EquipmentTimeline from '../../components/EquipmentTimeline';
import EmergencyModal from '../../components/EmergencyModal';

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status Change State
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Add History Event State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('Maintenance');
  const [eventDesc, setEventDesc] = useState('');
  const [eventInspector, setEventInspector] = useState('');

  // Emergency Modal
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/equipment/${id}`);
      if (res.data.success) {
        setEquipment(res.data.equipment);
        setNewStatus(res.data.equipment.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdatingStatus(true);
      const res = await api.patch(`/equipment/${id}/status`, {
        status: newStatus,
        note: statusNote || `Status changed to ${newStatus}`
      });
      if (res.data.success) {
        setEquipment(res.data.equipment);
        setStatusNote('');
        alert('Equipment status updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddHistoryEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/equipment/${id}/history`, {
        type: eventType,
        title: eventTitle,
        description: eventDesc,
        performedBy: eventInspector
      });
      if (res.data.success) {
        setShowEventModal(false);
        setEventTitle('');
        setEventDesc('');
        setEventInspector('');
        fetchEquipment();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log timeline event');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading equipment unit telemetry & timeline...</div>;
  }

  if (!equipment) {
    return (
      <div className="p-8 text-center text-slate-400">
        Equipment record not found.{' '}
        <Link to="/equipment" className="text-blue-400">
          Return to fleet list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/equipment"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Equipment Directory
        </Link>
      </div>

      {/* Equipment Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{equipment.type === 'Elevator' ? '🛗' : '🪜'}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {equipment.type} Fleet Unit
            </span>
            <StatusBadge status={equipment.status} size="lg" />
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight">
            {equipment.equipmentId}
            <span className="text-slate-400 text-xl font-medium ml-2">({equipment.manufacturer} {equipment.model})</span>
          </h1>

          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Installed at{' '}
            <Link to={`/properties/${equipment.property?._id}`} className="text-blue-400 hover:underline font-semibold">
              {equipment.property?.name}
            </Link>{' '}
            • {equipment.property?.address}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setEmergencyOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition flex items-center gap-2 animate-pulse"
          >
            <Siren className="w-4 h-4" />
            DISPATCH EMERGENCY
          </button>
          <Link
            to={`/requests/new?propertyId=${equipment.property?._id}&equipmentId=${equipment._id}`}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Service Ticket
          </Link>
        </div>
      </div>

      {/* Technical Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rated Capacity</span>
          <span className="text-lg font-bold text-white mt-1 block">{equipment.capacity}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{equipment.subType}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Floors / Travel Zone</span>
          <span className="text-lg font-bold text-cyan-400 mt-1 block">{equipment.floorsServed}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Serial: {equipment.serialNumber}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Certified Service</span>
          <span className="text-lg font-bold text-emerald-400 mt-1 block">
            {new Date(equipment.lastMaintenanceDate).toLocaleDateString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Passed Safety Verification</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Next Inspection Due</span>
          <span className="text-lg font-bold text-amber-400 mt-1 block">
            {new Date(equipment.nextMaintenanceDate).toLocaleDateString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Municipal Code Compliance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Complete Equipment Maintenance Timeline */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Complete Lifecycle Maintenance History
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chronological timeline: Commissioning &rarr; Maintenance &rarr; Inspection &rarr; Repairs &rarr; Parts &rarr; Current Status
              </p>
            </div>

            <button
              onClick={() => setShowEventModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition flex items-center gap-1.5 self-start"
            >
              <Plus className="w-3.5 h-3.5" /> Log Custom Event
            </button>
          </div>

          <EquipmentTimeline
            timeline={equipment.historyTimeline}
            currentStatus={equipment.status}
          />
        </div>

        {/* Right Col: Quick Status Controls & Specifications */}
        <div className="space-y-6">
          {/* Status Override Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Update Unit Status
            </h3>
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Target Operating Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Operational">Operational (Safe for Use)</option>
                  <option value="Maintenance Due">Maintenance Due (Flagged for service)</option>
                  <option value="Under Maintenance">Under Maintenance (Technician on-site)</option>
                  <option value="Breakdown">Breakdown (Immediate shutdown)</option>
                  <option value="Out of Service">Out of Service (Lockout / Tagout)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Reason / Log Note
                </label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional log entry for equipment history..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition border border-slate-700"
              >
                {updatingStatus ? 'Updating...' : 'Save Status Change'}
              </button>
            </form>
          </div>

          {/* Technical Specs Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Manufacturer Specification
            </h3>

            <div className="space-y-2 divide-y divide-slate-800/80 text-slate-300">
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Manufacturer</span>
                <strong className="text-white">{equipment.manufacturer}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Model Series</span>
                <span className="text-white">{equipment.model}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Sub-Type</span>
                <span className="text-white">{equipment.subType}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Commission Date</span>
                <span className="text-white">{new Date(equipment.installationDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Property Manager</span>
                <span className="text-white">{equipment.property?.propertyManager?.name || 'Assigned Manager'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Timeline Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-3">Add Custom Timeline Event</h3>

            <form onSubmit={handleAddHistoryEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Event Category
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Repair">Repair</option>
                  <option value="Parts Replacement">Parts Replacement</option>
                  <option value="Emergency Service">Emergency Service</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Hydraulic Oil Replacement"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Inspector / Performed By
                </label>
                <input
                  type="text"
                  value={eventInspector}
                  onChange={(e) => setEventInspector(e.target.value)}
                  placeholder="e.g. Master Elevator Inspector"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Description / Findings
                </label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Details of inspection, test results, parts replaced..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
                >
                  Log Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        defaultPropertyId={equipment.property?._id}
        defaultEquipmentId={equipment._id}
        onSuccess={() => fetchEquipment()}
      />
    </div>
  );
}
