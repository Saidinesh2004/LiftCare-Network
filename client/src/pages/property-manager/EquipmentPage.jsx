import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Search,
  Filter,
  Building2,
  Calendar,
  AlertTriangle,
  Siren,
  Plus,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import EmergencyModal from '../../components/EmergencyModal';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedProperty, setSelectedProperty] = useState('ALL');

  // Emergency Modal
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyUnit, setEmergencyUnit] = useState(null);

  useEffect(() => {
    fetchEquipment();
    fetchProperties();
  }, [selectedType, selectedStatus, selectedProperty]);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties');
      if (res.data.success) setProperties(res.data.properties);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      let url = '/equipment?';
      if (selectedType !== 'ALL') url += `type=${selectedType}&`;
      if (selectedStatus !== 'ALL') url += `status=${selectedStatus}&`;
      if (selectedProperty !== 'ALL') url += `propertyId=${selectedProperty}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setEquipment(res.data.equipment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEquipment();
  };

  const filtered = equipment.filter((eq) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      eq.equipmentId?.toLowerCase().includes(s) ||
      eq.manufacturer?.toLowerCase().includes(s) ||
      eq.model?.toLowerCase().includes(s) ||
      eq.serialNumber?.toLowerCase().includes(s) ||
      eq.property?.name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Vertical Transportation Fleet Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete inventory of passenger elevators, service freight lifts, and commercial escalators.
          </p>
        </div>

        <Link
          to="/requests/new"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Maintenance
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment ID, manufacturer, model, serial number..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Types</option>
              <option value="Elevator">Elevators Only</option>
              <option value="Escalator">Escalators Only</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance Due">Maintenance Due</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Breakdown">Breakdown</option>
              <option value="Out of Service">Out of Service</option>
            </select>

            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Commercial Buildings</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-white transition"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Equipment Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Equipment Unit</th>
                <th className="py-3 px-4">Building Location</th>
                <th className="py-3 px-4">Manufacturer / Model</th>
                <th className="py-3 px-4">Capacity & Floors</th>
                <th className="py-3 px-4">Next Inspection</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No equipment records found matching the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.type === 'Elevator' ? '🛗' : '🪜'}</span>
                        <div>
                          <span className="font-bold text-white block">{item.equipmentId}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.serialNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-medium block">
                        {item.property?.name || 'Property'}
                      </span>
                      <span className="text-[10px] text-slate-400 block max-w-xs truncate">
                        {item.property?.address}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-semibold block">{item.manufacturer}</span>
                      <span className="text-[10px] text-slate-400">{item.model}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 block">{item.capacity}</span>
                      <span className="text-[10px] text-slate-400">Serves: {item.floorsServed}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 block">
                        {new Date(item.nextMaintenanceDate).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Last: {new Date(item.lastMaintenanceDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/equipment/${item._id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-bold transition flex items-center gap-1"
                        >
                          Specs & Timeline <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => {
                            setEmergencyUnit(item);
                            setEmergencyModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-400 hover:text-white transition"
                          title="Trigger Emergency Dispatch"
                        >
                          <Siren className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        defaultPropertyId={emergencyUnit?.property?._id}
        defaultEquipmentId={emergencyUnit?._id}
        onSuccess={() => fetchEquipment()}
      />
    </div>
  );
}
