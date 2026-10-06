import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Star,
  Award,
  CheckCircle2,
  Clock,
  Wrench,
  ExternalLink,
  X
} from 'lucide-react';
import api from '../../services/api';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import StatusBadge from '../../components/StatusBadge';

export default function TechnicianSearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPropId = queryParams.get('propertyId') || '';

  const [technicians, setTechnicians] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(initialPropId);
  const [search, setSearch] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [loading, setLoading] = useState(true);

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [openRequests, setOpenRequests] = useState([]);
  const [targetRequestId, setTargetRequestId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchTechnicians();
  }, [selectedProperty, verifiedOnly, availableOnly, skillsFilter]);

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

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      let url = '/technicians?';
      if (selectedProperty) url += `propertyId=${selectedProperty}&`;
      if (verifiedOnly) url += `verifiedOnly=true&`;
      if (availableOnly) url += `availableOnly=true&`;
      if (skillsFilter) url += `skills=${encodeURIComponent(skillsFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

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

  const openAssignModal = async (tech) => {
    setSelectedTech(tech);
    try {
      // Fetch open requests needing technicians
      const res = await api.get('/maintenance?status=REQUESTED');
      if (res.data.success) {
        setOpenRequests(res.data.requests);
        if (res.data.requests.length > 0) {
          setTargetRequestId(res.data.requests[0]._id);
        }
      }
      setAssignModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmAssign = async () => {
    if (!targetRequestId || !selectedTech) return;
    setAssigning(true);
    try {
      const res = await api.put(`/maintenance/${targetRequestId}/assign`, {
        technicianId: selectedTech._id
      });
      if (res.data.success) {
        alert(`Successfully assigned ${selectedTech.company}!`);
        setAssignModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-emerald-400" />
          Technician Discovery & Intelligent Match Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Dynamic AI matching algorithm based on proximity distance, certification status, skills, rating, and availability.
        </p>
      </div>

      {/* Control / Match Target Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Match Against Property Location:
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- All General NYC Technicians --</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.address})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search by Skills / Specialties:
            </label>
            <input
              type="text"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              placeholder="e.g. Traction, Escalator, Hydraulic..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search Company or Name:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTechnicians()}
                placeholder="Search name, company..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="font-semibold text-emerald-400">Verified & Licensed Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="font-semibold text-blue-400">Available For Immediate Dispatch</span>
            </label>
          </div>

          <span className="text-[11px] text-slate-400">
            Showing <strong className="text-white">{technicians.length}</strong> matching licensed technicians
          </span>
        </div>
      </div>

      {/* Technician Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {technicians.map((tech) => (
          <div
            key={tech._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
          >
            <div>
              {/* Top Row: Info & Match Score */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg shadow-blue-500/20">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                      {tech.company}
                    </h3>
                    <span className="text-xs text-slate-300 font-medium">
                      {tech.user?.name || 'Master Mechanic'} &bull; {tech.experience} Years Experience
                    </span>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {tech.location?.address || 'New York, NY'}
                    </p>
                  </div>
                </div>

                <MatchScoreBadge score={tech.matchScore || 85} />
              </div>

              {/* Match Highlights Matrix */}
              <div className="grid grid-cols-4 gap-2 mt-4 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Distance</span>
                  <strong className="text-cyan-400">{tech.distanceKm || 4.2} KM</strong>
                </div>
                <div className="border-x border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Rating</span>
                  <strong className="text-amber-400 flex items-center justify-center gap-0.5">
                    ★ {tech.rating || 4.8}
                  </strong>
                </div>
                <div className="border-r border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Verified</span>
                  <strong className={tech.verificationStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>
                    {tech.verificationStatus === 'VERIFIED' ? 'YES' : 'PENDING'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Available</span>
                  <strong className={tech.availability ? 'text-emerald-400' : 'text-rose-400'}>
                    {tech.availability ? 'YES' : 'NO'}
                  </strong>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-3.5 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Skills & Certifications:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tech.skills?.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[10px] font-semibold border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                  {tech.certifications?.map((cert, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30"
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* License Number Footer */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>License: <strong className="font-mono text-slate-200">{tech.licenseNumber}</strong></span>
                <span>Jobs Completed: <strong className="text-white">{tech.completedJobs || 0}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => openAssignModal(tech)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Assign to Active Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Modal */}
      {assignModalOpen && selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setAssignModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-2">
              Assign {selectedTech.company}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select an open maintenance or emergency ticket to dispatch this licensed technician:
            </p>

            {openRequests.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 mb-4">
                No unassigned tickets found. Create a new service ticket first!
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">
                  Select Open Ticket
                </label>
                <select
                  value={targetRequestId}
                  onChange={(e) => setTargetRequestId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {openRequests.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.equipment?.equipmentId} &bull; {r.requestType} ({r.priority}) at {r.property?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              {openRequests.length > 0 && (
                <button
                  onClick={handleConfirmAssign}
                  disabled={assigning}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
