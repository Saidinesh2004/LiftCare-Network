import React, { useState, useEffect } from 'react';
import { Siren, MapPin, ShieldCheck, CheckCircle2, AlertOctagon, X, Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import MatchScoreBadge from './MatchScoreBadge';

export default function EmergencyModal({ isOpen, onClose, defaultPropertyId = '', defaultEquipmentId = '', onSuccess }) {
  const { addToast } = useNotifications();
  const [properties, setProperties] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(defaultPropertyId);
  const [selectedEquipment, setSelectedEquipment] = useState(defaultEquipmentId);
  const [description, setDescription] = useState('Emergency elevator stoppage. Immediate technician intervention needed.');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'dispatched'
  const [dispatchResult, setDispatchResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
      setStep('form');
      setSelectedProperty(defaultPropertyId || '');
      setSelectedEquipment(defaultEquipmentId || '');
    }
  }, [isOpen, defaultPropertyId, defaultEquipmentId]);

  useEffect(() => {
    if (selectedProperty) {
      fetchEquipmentForProperty(selectedProperty);
    } else {
      setEquipmentList([]);
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProperty || !selectedEquipment) {
      alert('Please select both a property and an equipment unit.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/maintenance/emergency', {
        property: selectedProperty,
        equipment: selectedEquipment,
        description,
        autoDispatch
      });

      if (res.data.success) {
        setDispatchResult(res.data);
        setStep('dispatched');
        addToast({
          title: '🚨 Emergency Dispatched',
          message: 'Broadcast sent to nearest verified technicians!',
          type: 'danger'
        });
        if (onSuccess) onSuccess(res.data.request);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Emergency dispatch failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-rose-500/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
                <Siren className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Emergency Service Dispatch
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500 text-white tracking-wider animate-bounce">
                    Live SLA
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Priority dispatch to nearest verified elevator technicians within radius
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Commercial Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  required
                >
                  <option value="">-- Choose Property --</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.address})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Equipment Unit
                </label>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  required
                  disabled={!selectedProperty}
                >
                  <option value="">-- Choose Equipment --</option>
                  {equipmentList.map((eq) => (
                    <option key={eq._id} value={eq._id}>
                      {eq.equipmentId} - {eq.type} ({eq.manufacturer} {eq.model}) [{eq.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Emergency Situation Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe failure, trapped passenger status, noise, floor location..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-rose-500 placeholder-slate-500"
                  required
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white block">Automated Instant Dispatch</span>
                  <span className="text-xs text-slate-400">
                    Immediately allocate the closest verified technician with highest match score
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDispatch}
                    onChange={(e) => setAutoDispatch(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    'Dispatching Emergency...'
                  ) : (
                    <>
                      <Siren className="w-4 h-4" />
                      DISPATCH EMERGENCY NOW
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Emergency Dispatched Successfully!</h3>
              <p className="text-sm text-slate-400 mt-1">
                Technicians within service radius notified in real-time via Socket.IO
              </p>
            </div>

            {dispatchResult?.request?.etaMinutes && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-around">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-semibold">Estimated Arrival:</span>
                </div>
                <span className="text-2xl font-black text-white">{dispatchResult.request.etaMinutes} Mins</span>
              </div>
            )}

            {dispatchResult?.nearbyCandidates?.length > 0 && (
              <div className="text-left bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Nearest Responders In Proximity:
                </span>
                {dispatchResult.nearbyCandidates.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-900 last:border-0">
                    <span className="text-slate-200 font-medium">{c.company}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{c.distanceKm} KM away</span>
                      <span className="text-amber-400 font-bold">★ {c.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
            >
              Close & Track Live Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
