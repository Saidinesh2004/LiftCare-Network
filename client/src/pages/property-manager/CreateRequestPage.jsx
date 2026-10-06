import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wrench, ArrowLeft, Building2, Cpu, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultPropertyId = queryParams.get('propertyId') || '';
  const defaultEquipmentId = queryParams.get('equipmentId') || '';

  const [properties, setProperties] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // Form
  const [selectedProperty, setSelectedProperty] = useState(defaultPropertyId);
  const [selectedEquipment, setSelectedEquipment] = useState(defaultEquipmentId);
  const [requestType, setRequestType] = useState('Routine Maintenance');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignedTechnician, setAssignedTechnician] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchEquipmentForProperty(selectedProperty);
      fetchTechniciansForProperty(selectedProperty);
    } else {
      setEquipmentList([]);
      setTechnicians([]);
    }
  }, [selectedProperty]);

  const fetchInitialData = async () => {
    try {
      const res = await api.get('/properties');
      if (res.data.success) {
        setProperties(res.data.properties);
        if (!selectedProperty && res.data.properties.length > 0) {
          setSelectedProperty(res.data.properties[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEquipmentForProperty = async (propId) => {
    try {
      const res = await api.get(`/equipment?propertyId=${propId}`);
      if (res.data.success) {
        setEquipmentList(res.data.equipment);
        if (!selectedEquipment && res.data.equipment.length > 0) {
          setSelectedEquipment(res.data.equipment[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTechniciansForProperty = async (propId) => {
    try {
      const res = await api.get(`/technicians?propertyId=${propId}&verifiedOnly=true`);
      if (res.data.success) {
        setTechnicians(res.data.technicians);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedProperty || !selectedEquipment) {
      setError('Please select both a property and an equipment unit.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        property: selectedProperty,
        equipment: selectedEquipment,
        requestType,
        priority,
        description,
        preferredDate,
        assignedTechnician: assignedTechnician || null
      };

      const res = await api.post('/maintenance', payload);
      if (res.data.success) {
        navigate(`/requests/${res.data.request._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit maintenance request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Wrench className="w-6 h-6 text-blue-500" />
          Create Commercial Maintenance Request
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Initiate scheduled maintenance, code inspections, or emergency technical intervention.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Property Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Commercial Property
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Choose Building --</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.address}, {p.city})
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Unit */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Vertical Transportation Equipment
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              required
              disabled={!selectedProperty}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">-- Choose Equipment Unit --</option>
              {equipmentList.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.equipmentId} &bull; {eq.type} ({eq.manufacturer} {eq.model}) [{eq.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Request Type and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Service Request Type
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Routine Maintenance">Routine Maintenance</option>
                <option value="Preventive Maintenance">Preventive Maintenance</option>
                <option value="Breakdown">Breakdown (Immediate Repair)</option>
                <option value="Emergency">Emergency</option>
                <option value="Inspection">Safety / Code Inspection</option>
                <option value="Installation">Installation</option>
                <option value="Replacement">Replacement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Urgency / Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="LOW">LOW (Scheduled / Deferred)</option>
                <option value="MEDIUM">MEDIUM (Standard 24-48h SLA)</option>
                <option value="HIGH">HIGH (Urgent Tenant Impact)</option>
                <option value="CRITICAL">CRITICAL (Immediate Dispatch)</option>
              </select>
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Preferred Service Date
            </label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Technical Description of Issue or Scope of Work
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe elevator vibrations, door clutch timing, hydraulic leaks, or scheduled maintenance checklist..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 leading-relaxed"
            />
          </div>

          {/* Direct Technician Assignment (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Directly Assign Licensed Technician (Optional)
            </label>
            <select
              value={assignedTechnician}
              onChange={(e) => setAssignedTechnician(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Let System Auto-Match or Assign Later --</option>
              {technicians.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.company} &bull; Score: {t.matchScore}% &bull; {t.distanceKm} KM &bull; ★ {t.rating}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Technicians sorted by match score algorithm (distance, license, experience, rating).
            </span>
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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Initiate Maintenance Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
