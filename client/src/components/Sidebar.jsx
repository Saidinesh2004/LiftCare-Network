import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Cpu,
  Wrench,
  PlusCircle,
  Users,
  MapPin,
  FileCheck2,
  ShieldCheck,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { role } = useAuth();

  const getLinks = () => {
    if (role === 'ADMIN') {
      return [
        { to: '/', label: 'Admin Overview', icon: LayoutDashboard },
        { to: '/admin/verifications', label: 'Tech Verifications', icon: ShieldCheck, highlight: true },
        { to: '/properties', label: 'All Properties', icon: Building2 },
        { to: '/equipment', label: 'All Equipment Units', icon: Cpu },
        { to: '/requests', label: 'Maintenance Requests', icon: Wrench },
        { to: '/admin/reports', label: 'Service Reports Repository', icon: FileCheck2 },
        { to: '/admin/users', label: 'User Management', icon: Users },
        { to: '/map', label: 'Live Network Map', icon: MapPin }
      ];
    }

    if (role === 'TECHNICIAN') {
      return [
        { to: '/', label: 'Technician Dashboard', icon: LayoutDashboard },
        { to: '/technician/jobs', label: 'Available & Active Jobs', icon: Wrench, highlight: true },
        { to: '/technician/profile', label: 'License & Documents', icon: ShieldCheck },
        { to: '/technician/reports', label: 'Submitted Reports', icon: FileCheck2 },
        { to: '/map', label: 'Service Area Map', icon: MapPin }
      ];
    }

    // PROPERTY_MANAGER
    return [
      { to: '/', label: 'Manager Dashboard', icon: LayoutDashboard },
      { to: '/properties', label: 'Commercial Buildings', icon: Building2 },
      { to: '/equipment', label: 'Elevators & Escalators', icon: Cpu },
      { to: '/requests', label: 'Maintenance Requests', icon: Wrench },
      { to: '/requests/new', label: 'Create Service Request', icon: PlusCircle, highlight: true },
      { to: '/technicians', label: 'Discover Technicians', icon: UserCheck },
      { to: '/map', label: 'Live Facilities Map', icon: MapPin }
    ];
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div className="px-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {role ? role.replace(/_/g, ' ') : 'NAVIGATION'}
          </span>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  } ${link.highlight && !isActive ? 'border border-blue-500/20 text-cyan-300' : ''}`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Compliance / Status Widget */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Safety Standard</span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
            ASME A17.1
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          All technicians vetted with verified state elevator licenses and active insurance.
        </p>
      </div>
    </aside>
  );
}
