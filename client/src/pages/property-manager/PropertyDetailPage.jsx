import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Cpu,
  Plus,
  Wrench,
  Siren,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import EmergencyModal from '../../components/EmergencyModal';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Equipment Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [eqType, setEqType] = useState('Elevator'); // 'Elevator' | 'Escalator'
  const [equipmentId, setEquipmentId] = useState('');
  const [subType, setSubType] = useState('Passenger Traction Elevator');
  const [manufacturer, setManufacturer] = useState('Otis');
  const [model, setModel] = useState('Gen2 High-Performance');
  const [serialNumber, setSerialNumber] = useState('');
  const [capacity, setCapacity] = useState('1600 kg / 21 Persons');
  const [floorsServed, setFloorsServed] = useState('1-25');
  const [status, setStatus] = useState('Operational');
  const [submitting, setSubmitting] = useState(false);

  // Emergency Modal
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [targetEquipmentId, setTargetEquipmentId] = useState('');

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/properties/${id}`);
      if (res.data.success) {
        setProperty(res.data.property);
        setEquipment(res.data.equipment);
        setRecentRequests(res.data.recentRequests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = (type) => {
    setEqType(type);
    if (type === 'Escalator') {
      setEquipmentId(`ESCL-${property?.name?.substring(0, 3).toUpperCase()}-0${equipment.length + 1}`);
      setSubType('Commercial Step-Type');
      setManufacturer('Schindler');
      setModel('Schindler 9300');
      setCapacity('7,500 Persons / hr');
      setFloorsServed('Ground to Level 2');
    } else {
      setEquipmentId(`ELEV-${property?.name?.substring(0, 3).toUpperCase()}-0${equipment.length + 1}`);
      setSubType('High-Rise Passenger Traction');
      setManufacturer('Otis');
      setModel('SkyRise Express');
      setCapacity('1800 kg / 24 Persons');
      setFloorsServed(`1-${property?.totalFloors || 20}`);
    }
    setSerialNumber(`SN-${Math.floor(100000 + Math.random() * 900000)}`);
    setStatus('Operational');
    setShowAddModal(true);
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        property: id,
        equipmentId,
        type: eqType,
        subType,
        manufacturer,
        model,
        serialNumber,
        capacity,
        floorsServed,
        status
      };
      await api.post('/equipment', payload);
      setShowAddModal(false);
      fetchPropertyDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add equipment unit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Loading property facility details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 text-center text-slate-400">
        Property not found.{' '}
        <Link to="/properties" className="text-blue-400">
          Return to properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties Directory
        </Link>
      </div>

      {/* Property Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="h-56 w-full relative bg-slate-950">
          <img
            src={property.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          <div className="absolute bottom-5 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white mb-2 inline-block">
                {property.buildingType}
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{property.name}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {property.address}, {property.city}, {property.state} {property.postalCode}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenAdd('Elevator')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                <Plus className="w-3.5 h-3.5" /> Add Elevator
              </button>
              <button
                onClick={() => handleOpenAdd('Escalator')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-3.5 h-3.5" /> Add Escalator
              </button>
            </div>
          </div>
        </div>

        {/* Building Details Bar */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 bg-slate-950/40 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Stories</span>
            <strong className="text-white text-base">{property.totalFloors} Floors</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Units</span>
            <strong className="text-cyan-400 text-base">{equipment.length} Units</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Facilities Contact</span>
            <span className="text-slate-200 block truncate">{property.contactPhone}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Emergency Desk</span>
            <span className="text-slate-200 block truncate">{property.contactEmail}</span>
          </div>
        </div>
      </div>

      {/* Equipment Units Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Vertical Transportation Equipment ({equipment.length})
          </h2>
          <span className="text-xs text-slate-400">
            Otis, Schindler, KONE, TK Elevator Commercial Fleets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((eq) => (
            <div
              key={eq._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white flex items-center gap-2">
                    {eq.type === 'Elevator' ? '🛗' : '🪜'} {eq.equipmentId}
                  </span>
                  <StatusBadge status={eq.status} />
                </div>
                <span className="text-xs font-semibold text-slate-300 block mt-1">
                  {eq.manufacturer} {eq.model}
                </span>
                <span className="text-[11px] text-slate-400 block">{eq.subType}</span>

                <div className="mt-3.5 space-y-1.5 text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Serial No:</span>
                    <span className="text-slate-200 font-mono">{eq.serialNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Capacity:</span>
                    <span className="text-slate-200 font-medium">{eq.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Floors Served:</span>
                    <span className="text-slate-200 font-medium">{eq.floorsServed}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                    <span>Next Inspection:</span>
                    <span className="text-amber-400 font-semibold">
                      {new Date(eq.nextMaintenanceDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                <Link
                  to={`/equipment/${eq._id}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  History & Specs <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => {
                    setTargetEquipmentId(eq._id);
                    setEmergencyModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-400 hover:text-white transition"
                  title="Emergency Dispatch for this unit"
                >
                  <Siren className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Maintenance Requests for this Building */}
      {recentRequests.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            Recent Service & Maintenance Requests
          </h3>

          <div className="divide-y divide-slate-800">
            {recentRequests.map((req) => (
              <div key={req._id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{req.requestType}</span>
                    <PriorityBadge priority={req.priority} />
                    {req.isEmergency && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                        EMERGENCY
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 mt-1 max-w-xl">{req.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={req.status} />
                  <Link
                    to={`/requests/${req._id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    View Ticket
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Elevator/Escalator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              Add {eqType} Unit to {property.name}
            </h3>

            <form onSubmit={handleAddEquipment} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Equipment ID
                  </label>
                  <input
                    type="text"
                    required
                    value={equipmentId}
                    onChange={(e) => setEquipmentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Manufacturer
                  </label>
                  <select
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Otis">Otis</option>
                    <option value="Schindler">Schindler</option>
                    <option value="KONE">KONE</option>
                    <option value="TK Elevator">TK Elevator</option>
                    <option value="Mitsubishi Electric">Mitsubishi Electric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Model Name / Code
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    required
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Capacity Specification
                  </label>
                  <input
                    type="text"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Floors / Levels Served
                  </label>
                  <input
                    type="text"
                    required
                    value={floorsServed}
                    onChange={(e) => setFloorsServed(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Sub-Type Description
                </label>
                <input
                  type="text"
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {submitting ? 'Commissioning...' : `Add ${eqType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        defaultPropertyId={property._id}
        defaultEquipmentId={targetEquipmentId}
        onSuccess={() => fetchPropertyDetails()}
      />
    </div>
  );
}
