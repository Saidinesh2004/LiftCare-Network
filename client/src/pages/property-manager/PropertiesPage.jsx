import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  Cpu,
  Wrench,
  X,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import api from '../../services/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [postalCode, setPostalCode] = useState('10001');
  const [buildingType, setBuildingType] = useState('Commercial Office');
  const [totalFloors, setTotalFloors] = useState(25);
  const [contactPhone, setContactPhone] = useState('+1 (555) 234-5678');
  const [contactEmail, setContactEmail] = useState('facilities@building.com');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/properties');
      if (res.data.success) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProperty(null);
    setName('');
    setAddress('');
    setCity('New York');
    setState('NY');
    setPostalCode('10001');
    setBuildingType('Commercial Office');
    setTotalFloors(20);
    setContactPhone('+1 (555) 234-5678');
    setContactEmail('facilities@property.com');
    setImageUrl('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80');
    setShowModal(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingProperty(prop);
    setName(prop.name);
    setAddress(prop.address);
    setCity(prop.city);
    setState(prop.state);
    setPostalCode(prop.postalCode);
    setBuildingType(prop.buildingType);
    setTotalFloors(prop.totalFloors);
    setContactPhone(prop.contactPhone);
    setContactEmail(prop.contactEmail);
    setImageUrl(prop.imageUrl || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        address,
        city,
        state,
        postalCode,
        buildingType,
        totalFloors: Number(totalFloors),
        contactPhone,
        contactEmail,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
      };

      if (editingProperty) {
        await api.put(`/properties/${editingProperty._id}`, payload);
      } else {
        await api.post('/properties', payload);
      }
      setShowModal(false);
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? All linked elevators & escalators will also be deleted.`)) {
      try {
        await api.delete(`/properties/${id}`);
        fetchProperties();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-500" />
            Commercial Properties & Buildings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register, manage vertical transportation infrastructure, and dispatch service technicians.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Commercial Building
        </button>
      </div>

      {/* Grid of Commercial Buildings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div
            key={prop._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between group"
          >
            <div>
              {/* Building Image Banner */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                <img
                  src={prop.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-white backdrop-blur-md">
                  {prop.buildingType}
                </span>
                <span className="absolute bottom-3 left-3 text-xs font-semibold px-2 py-0.5 rounded bg-blue-600/80 text-white backdrop-blur-md">
                  {prop.totalFloors} Stories
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{prop.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {prop.address}, {prop.city}, {prop.state} {prop.postalCode}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Elevators</span>
                    <strong className="text-sm font-bold text-cyan-400">{prop.stats?.elevators || 0}</strong>
                  </div>
                  <div className="border-x border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Escalators</span>
                    <strong className="text-sm font-bold text-indigo-400">{prop.stats?.escalators || 0}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Tickets</span>
                    <strong className={`text-sm font-bold ${prop.stats?.activeRequests > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {prop.stats?.activeRequests || 0}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{prop.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{prop.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <Link
                to={`/properties/${prop._id}`}
                className="flex-1 text-center py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                Inspect Equipment Fleet <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => handleOpenEditModal(prop)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Edit Property"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(prop._id, prop.name)}
                className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-400 border border-rose-800/40 hover:text-white transition"
                title="Delete Property"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Property Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              {editingProperty ? 'Edit Commercial Property' : 'Register New Commercial Building'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Building Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Empire Vantage Tower"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 350 5th Avenue"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Building Type
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Retail Mall">Retail Mall</option>
                    <option value="Hospital / Medical">Hospital / Medical</option>
                    <option value="Hotel / Hospitality">Hotel / Hospitality</option>
                    <option value="Residential Highrise">Residential Highrise</option>
                    <option value="Industrial Facility">Industrial Facility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Total Stories / Floors
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Facilities Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Exterior Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProperty ? 'Update Property' : 'Register Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
