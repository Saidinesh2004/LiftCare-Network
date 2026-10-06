import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Search, Building2, Cpu, Wrench, ExternalLink, DollarSign, Clock } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/service-reports');
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.equipment?.equipmentId?.toLowerCase().includes(s) ||
      r.property?.name?.toLowerCase().includes(s) ||
      r.technician?.company?.toLowerCase().includes(s) ||
      r.problemIdentified?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-emerald-400" />
          Certified Service Reports Repository
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Audit trail of all certified technical inspections, work performed, and parts replacements.
        </p>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by equipment ID, building, technician company, or issue..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400">
            No service reports found.
          </div>
        ) : (
          filtered.map((report) => (
            <div
              key={report._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">
                    {report.equipment?.equipmentId} ({report.equipment?.type})
                  </span>
                  <span className="text-xs text-slate-400">&bull; {report.property?.name}</span>
                  <StatusBadge status={report.status} />
                </div>
                <div className="text-xs text-slate-400">
                  Logged: {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Problem Identified</span>
                    <p className="text-rose-300 font-medium mt-0.5">{report.problemIdentified}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Work Performed</span>
                    <p className="text-emerald-300 mt-0.5">{report.workPerformed}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Certified Technician</span>
                    <p className="text-white font-semibold mt-0.5">{report.technician?.company}</p>
                  </div>
                  {report.partsReplaced && report.partsReplaced.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Parts Replaced</span>
                      <p className="text-cyan-300 mt-0.5">{report.partsReplaced.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">Labor: <strong className="text-white">{report.laborHours} Hours</strong></span>
                  <span className="text-slate-400">Cost: <strong className="text-emerald-400">${report.costEstimate}</strong></span>
                </div>

                {report.maintenanceRequest && (
                  <Link
                    to={`/requests/${report.maintenanceRequest._id || report.maintenanceRequest}`}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    View Request Dossier <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
