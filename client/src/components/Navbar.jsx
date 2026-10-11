import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Siren,
  User,
  LogOut,
  ChevronDown,
  Radio,
  CheckCheck,
  ShieldCheck,
  Building2,
  Wrench,
  ExternalLink
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import EmergencyModal from './EmergencyModal';

export default function Navbar() {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const handleRoleSwitch = async (roleKey) => {
    setShowRoleSwitcher(false);
    await switchDemoRole(roleKey);
    navigate('/');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Platform Admin', bg: 'bg-purple-950/80 text-purple-300 border-purple-500/40', icon: ShieldCheck };
      case 'TECHNICIAN':
        return { label: 'Licensed Technician', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40', icon: Wrench };
      default:
        return { label: 'Property Manager', bg: 'bg-blue-950/80 text-blue-300 border-blue-500/40', icon: Building2 };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition transform">
                <span className="text-2xl font-black">🛗</span>
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  LiftCare <span className="text-cyan-400 font-medium text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50">NETWORK</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium tracking-wide">
                  Commercial Transportation Systems
                </span>
              </div>
            </Link>

            {/* Socket Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span>{connected ? 'Live Sync' : 'Connecting'}</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${badge.bg}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Role Switcher (Demo)
                  </div>
                  {Object.entries(DEMO_ACCOUNTS).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => handleRoleSwitch(key)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.email.split('@')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Button */}
            {(role === 'PROPERTY_MANAGER' || role === 'ADMIN') && (
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition animate-pulse"
              >
                <Siren className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">REQUEST EMERGENCY</span>
                <span className="sm:hidden">EMERGENCY</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications at this time.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => {
                            if (!notif.isRead) markAsRead(notif._id);
                            if (notif.link) {
                              navigate(notif.link);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3 text-left hover:bg-slate-800/50 transition cursor-pointer ${
                            !notif.isRead ? 'bg-slate-800/30' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                <span className="hidden lg:inline text-xs font-semibold text-white max-w-[120px] truncate">
                  {user?.name || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <p className="text-[10px] text-cyan-400 font-semibold uppercase mt-0.5">{role}</p>
                  </div>

                  {role === 'TECHNICIAN' && (
                    <Link
                      to="/technician/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition flex items-center gap-2 mt-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Technician Licenses & Profile
                    </Link>
                  )}

                  <Link
                    to="/landing"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition flex items-center gap-2 mt-1"
                  >
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    Public Landing Page
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Service Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </>
  );
}
