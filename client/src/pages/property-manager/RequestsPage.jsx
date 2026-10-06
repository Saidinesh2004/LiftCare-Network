import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Siren,
  Search,
  Filter,
  Plus,
  Clock,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import EmergencyModal from '../../components/EmergencyModal';

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'EMERGENCY' | 'ACTIVE' | 'COMPLETED'
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Emergency Modal
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filterTab, selectedPriority, selectedStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let url = '/maintenance?';
      if (filterTab === 'EMERGENCY') url += 'isEmergency=true&';
      if (selectedPriority !== 'ALL') url += `priority=${selectedPriority}&`;
      if (selectedStatus !== 'ALL') url += `status=${selectedStatus}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter((r) => {
    if (filterTab === 'ACTIVE') {
      if (['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)) return false;
    } else if (filterTab === 'COMPLETED') {
      if (!['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)) return false;
    }

    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.equipment?.equipmentId?.toLowerCase().includes(s) ||
      r.property?.name?.toLowerCase().includes(s) ||
      r.description?.toLowerCase().includes(s) ||
      r.requestType?.toLowerCase().includes(s) ||
      r.assignedTechnician?.company?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-400" />
            Maintenance & Service Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch management, real-time lifecycle tracking, technician assignment, and approval workflow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEmergencyOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition flex items-center gap-2 animate-pulse"
          >
            <Siren className="w-4 h-4" />
            EMERGENCY SERVICE
          </button>
          <Link
            to="/requests/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Link>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'EMERGENCY', label: '🚨 Emergency Dispatches' },
            { id: 'ACTIVE', label: 'Active In-Progress' },
            { id: 'COMPLETED', label: 'Completed & Certified' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment, building, technician, issue description..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="MATCHING">MATCHING</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="ON_THE_WAY">ON_THE_WAY</option>
              <option value="ARRIVED">ARRIVED</option>
              <option value="INSPECTION">INSPECTION</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket / Equipment</th>
                <th className="py-3 px-4">Commercial Building</th>
                <th className="py-3 px-4">Type & Priority</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4">Assigned Technician</th>
                <th className="py-3 px-4">Logged At</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No maintenance requests found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        {req.equipment?.equipmentId || 'Unit'}
                        {req.isEmergency && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block max-w-xs truncate">
                        {req.description}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-semibold block">{req.property?.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block max-w-xs">
                        {req.property?.address}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-medium block">{req.requestType}</span>
                      <div className="mt-0.5">
                        <PriorityBadge priority={req.priority} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} />
                      {req.etaMinutes && (req.status === 'ACCEPTED' || req.status === 'ON_THE_WAY') && (
                        <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> ~{req.etaMinutes}m ETA
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {req.assignedTechnician ? (
                        <div>
                          <span className="text-slate-200 font-semibold block">
                            {req.assignedTechnician.company}
                          </span>
                          <span className="text-[10px] text-emerald-400">
                            ★ {req.assignedTechnician.rating || '4.8'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-400/80 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/requests/${req._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white transition font-bold text-xs"
                      >
                        Track & Review <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        onSuccess={() => fetchRequests()}
      />
    </div>
  );
}
