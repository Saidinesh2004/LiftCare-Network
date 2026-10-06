import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Wrench,
  Award,
  ExternalLink,
  Save
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function TechnicianProfilePage() {
  const { user, technician, setTechnician } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState(5);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [serviceRadius, setServiceRadius] = useState(30);
  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState('');
  const [address, setAddress] = useState('');

  // Files
  const [licenseFile, setLicenseFile] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [idFile, setIdFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/technicians/me/profile');
      if (res.data.success) {
        const t = res.data.technician;
        setProfile(t);
        setTechnician(t);
        setCompany(t.company || '');
        setExperience(t.experience || 3);
        setLicenseNumber(t.licenseNumber || '');
        setServiceRadius(t.serviceRadius || 25);
        setSkills((t.skills || []).join(', '));
        setCertifications((t.certifications || []).join(', '));
        setAddress(t.location?.address || 'New York, NY');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        company,
        experience: Number(experience),
        licenseNumber,
        serviceRadius: Number(serviceRadius),
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: certifications.split(',').map((c) => c.trim()).filter(Boolean),
        location: { address }
      };

      const res = await api.put('/technicians/me/profile', payload);
      if (res.data.success) {
        setProfile(res.data.technician);
        setTechnician(res.data.technician);
        setMessage('Technician profile successfully updated.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocuments = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const formData = new FormData();
    if (licenseFile) formData.append('licenseDocument', licenseFile);
    if (certFile) formData.append('certifications', certFile);
    if (idFile) formData.append('identityDocument', idFile);

    try {
      const res = await api.post('/technicians/me/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setMessage('Verification documents uploaded! Platform administrator notified for compliance review.');
        fetchProfile();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Document upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading technician credentials...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Technician Licensing & Professional Verification
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Maintain state elevator contractor licensing, trade credentials, and dispatch preferences.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Official Verification Status
            </span>
            <div className="flex items-center gap-2.5 mt-1">
              <StatusBadge status={profile?.verificationStatus || 'PENDING'} size="lg" />
              <span className="text-xs text-slate-300 font-medium">
                {profile?.verificationStatus === 'VERIFIED' && 'Full commercial access enabled'}
                {profile?.verificationStatus === 'PENDING' && 'Pending administrator compliance review'}
                {profile?.verificationStatus === 'RESUBMISSION_REQUESTED' && 'Document update required by admin'}
                {profile?.verificationStatus === 'REJECTED' && 'Verification declined. Contact support'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">State License No.</span>
            <span className="text-sm font-mono text-cyan-400 font-bold block">{profile?.licenseNumber}</span>
          </div>
        </div>

        {profile?.verificationNotes && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs space-y-1">
            <strong>Administrator Review Note:</strong>
            <p className="text-slate-200">{profile.verificationNotes}</p>
          </div>
        )}

        {/* Existing Uploaded Documents Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">License Document</span>
            </div>
            {profile?.documents?.licenseDoc ? (
              <a href={profile.documents.licenseDoc} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-[11px] font-bold">
                View
              </a>
            ) : (
              <span className="text-rose-400 text-[10px] uppercase font-bold">Missing</span>
            )}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Certifications</span>
            </div>
            {profile?.documents?.certDoc ? (
              <a href={profile.documents.certDoc} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-[11px] font-bold">
                View
              </a>
            ) : (
              <span className="text-rose-400 text-[10px] uppercase font-bold">Missing</span>
            )}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Identity Record</span>
            </div>
            {profile?.documents?.idDoc ? (
              <a href={profile.documents.idDoc} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-[11px] font-bold">
                View
              </a>
            ) : (
              <span className="text-rose-400 text-[10px] uppercase font-bold">Missing</span>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <UploadCloud className="w-4 h-4 text-cyan-400" /> Upload / Replace Verification Documents
        </h3>

        <form onSubmit={handleUploadDocuments} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400">
                State Elevator License (PDF/JPG)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setLicenseFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400">
                Certifications / NAEC CET (PDF/JPG)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setCertFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400">
                Government ID / Trade Registration
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setIdFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || (!licenseFile && !certFile && !idFile)}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {uploading ? 'Uploading Documents...' : 'Submit Documents for Verification'}
          </button>
        </form>
      </div>

      {/* Profile & Skills Customizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <Wrench className="w-4 h-4 text-blue-400" /> Technician Profile & Dispatch Settings
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Company / Trade Name
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                License Number
              </label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Years Experience
              </label>
              <input
                type="number"
                min={1}
                max={45}
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Operating Service Radius: {serviceRadius} KM
              </label>
              <input
                type="range"
                min={5}
                max={100}
                value={serviceRadius}
                onChange={(e) => setServiceRadius(e.target.value)}
                className="w-full mt-2 accent-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Base Service Station Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Tribeca, New York, NY"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Skills & Specialties (Comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Traction Elevators, Hydraulic Elevators, Heavy Escalators, Emergency Brakes"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Certifications & Accreditations (Comma-separated)
            </label>
            <input
              type="text"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="e.g. QEI Certified Inspector, OSHA 30, NAEC CET"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
