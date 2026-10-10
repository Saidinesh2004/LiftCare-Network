import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Building2, Wrench, ShieldAlert } from 'lucide-react';
import ElevatorBackground from '../../components/ElevatorBackground';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('PROPERTY_MANAGER'); // 'PROPERTY_MANAGER' | 'TECHNICIAN'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Technician-specific
  const [experience, setExperience] = useState(4);
  const [licenseNumber, setLicenseNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name,
      email,
      password,
      role,
      phone,
      companyName,
      company: companyName,
      experience: Number(experience),
      licenseNumber: licenseNumber || `NY-ELEV-${Math.floor(10000 + Math.random() * 90000)}`
    };

    const res = await register(payload);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <ElevatorBackground />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-xl shadow-blue-500/30 mb-3">
          <span className="text-2xl">🛗</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Create LiftCare Account</h2>
        <p className="mt-1 text-xs text-slate-400">Join the commercial vertical transportation network</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md py-8 px-6 sm:px-10 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => setRole('PROPERTY_MANAGER')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === 'PROPERTY_MANAGER'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Property Manager
            </button>
            <button
              type="button"
              onClick={() => setRole('TECHNICIAN')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === 'TECHNICIAN'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Licensed Technician
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jonathan Drake"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={role === 'PROPERTY_MANAGER' ? 'Metro Tower LLC' : 'Apex Lift Solutions'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {role === 'TECHNICIAN' && (
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Professional Credentials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. NY-ELEV-90214"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-2.5 rounded-lg text-white text-sm font-bold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                role === 'TECHNICIAN'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              }`}
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Complete Registration
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
