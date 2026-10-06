import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  Cpu,
  Wrench,
  Siren,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Aggregating platform intelligence & metrics...</div>;
  }

  const stats = analytics?.stats || {};
  const charts = analytics?.charts || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-purple-400" />
            Global Platform Command & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time oversight of commercial property managers, licensed technician verification, vertical fleet health, and dispatch SLAs.
          </p>
        </div>

        {stats.pendingVerification > 0 && (
          <Link
            to="/admin/verifications"
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition flex items-center gap-2 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            {stats.pendingVerification} Technician Verifications Pending
          </Link>
        )}
      </div>

      {/* Primary KPI Grid (10 Required Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          subtitle={`${stats.propertyManagersCount} PMs • ${stats.techniciansCount} Techs`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Verified Technicians"
          value={stats.verifiedTechnicians || 0}
          subtitle={`${stats.pendingVerification || 0} Pending Verification`}
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Commercial Buildings"
          value={stats.totalProperties || 0}
          subtitle="Registered Real Estate Portfolios"
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Equipment Fleet"
          value={stats.totalEquipment || 0}
          subtitle={`${stats.elevatorsCount} Elevators • ${stats.escalatorsCount} Escalators`}
          icon={Cpu}
          color="purple"
        />
        <StatCard
          title="Active Field Jobs"
          value={stats.activeJobs || 0}
          subtitle={`${stats.emergencyJobs || 0} Critical Emergencies`}
          icon={Wrench}
          color={stats.emergencyJobs > 0 ? 'rose' : 'amber'}
        />
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl text-center text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Maintenance Tickets</span>
          <strong className="text-xl font-black text-white">{stats.totalRequests || 0}</strong>
        </div>
        <div className="border-l border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completed & Certified</span>
          <strong className="text-xl font-black text-emerald-400">{stats.completedJobs || 0}</strong>
        </div>
        <div className="border-l border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Service Reports Filed</span>
          <strong className="text-xl font-black text-cyan-400">{stats.totalReports || 0}</strong>
        </div>
        <div className="border-l border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fleet Operational Rate</span>
          <strong className="text-xl font-black text-emerald-300">
            {stats.totalEquipment ? Math.round((stats.operationalEquipment / stats.totalEquipment) * 100) : 95}%
          </strong>
        </div>
      </div>

      {/* Analytics Charts using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Monthly Service Request Trends
            </h3>
            <span className="text-xs text-slate-400">Past 6 Months Activity</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTrends || []}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="requests" name="Total Requests" stroke="#0284c7" fillOpacity={1} fill="url(#reqGrad)" />
                <Area type="monotone" dataKey="completed" name="Completed Jobs" stroke="#10b981" fillOpacity={1} fill="url(#compGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Status Distribution Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Equipment Fleet Health Status
            </h3>
            <span className="text-xs text-slate-400">Real-Time Operational Audit</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.equipmentStatus || []}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Units" radius={[6, 6, 0, 0]}>
                  {charts.equipmentStatus?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : index === 2 ? '#0284c7' : '#f43f5e'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Platform Administration Modules
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/verifications"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition text-left group"
          >
            <ShieldCheck className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Technician Verification</span>
            <span className="text-[10px] text-slate-400">{stats.pendingVerification || 0} awaiting review</span>
          </Link>

          <Link
            to="/admin/users"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 transition text-left group"
          >
            <Users className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">User Management</span>
            <span className="text-[10px] text-slate-400">{stats.totalUsers || 0} registered accounts</span>
          </Link>

          <Link
            to="/properties"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition text-left group"
          >
            <Building2 className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Properties Fleet</span>
            <span className="text-[10px] text-slate-400">{stats.totalProperties || 0} commercial towers</span>
          </Link>

          <Link
            to="/admin/reports"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition text-left group"
          >
            <FileCheck2 className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Service Reports</span>
            <span className="text-[10px] text-slate-400">{stats.totalReports || 0} signed certificates</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
