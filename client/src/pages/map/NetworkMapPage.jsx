import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Building2,
  Wrench,
  Siren,
  Star,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

// Custom Map Marker Icons using Leaflet DivIcon
const createPropertyIcon = () =>
  L.divIcon({
    className: 'custom-property-pin',
    html: `
      <div style="background-color: #0284c7; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.5); border: 2px solid #ffffff; font-size: 18px;">
        🏢
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

const createTechnicianIcon = (isAvailable, isSelected) =>
  L.divIcon({
    className: 'custom-tech-pin',
    html: `
      <div style="background-color: ${isSelected ? '#8b5cf6' : isAvailable ? '#10b981' : '#64748b'}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 2px solid #ffffff; font-size: 16px;">
        🔧
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

export default function NetworkMapPage() {
  const [properties, setProperties] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [showProperties, setShowProperties] = useState(true);
  const [showTechnicians, setShowTechnicians] = useState(true);
  const [selectedTech, setSelectedTech] = useState(null);

  // NYC Center
  const mapCenter = [40.730610, -73.995242];

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const [propsRes, techsRes] = await Promise.all([
        api.get('/properties'),
        api.get('/technicians')
      ]);

      if (propsRes.data.success) setProperties(propsRes.data.properties);
      if (techsRes.data.success) setTechnicians(techsRes.data.technicians);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            Live Facilities & Technical Proximity Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial visualization of commercial high-rises, on-duty technicians, and dynamic service radii.
          </p>
        </div>

        {/* Legend / Toggles */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <button
            onClick={() => setShowProperties(!showProperties)}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              showProperties
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏢 Properties ({properties.length})
          </button>
          <button
            onClick={() => setShowTechnicians(!showTechnicians)}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              showTechnicians
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔧 Technicians ({technicians.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Leaflet Map Container */}
        <div className="lg:col-span-3 h-[600px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', background: '#0f172a' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Property Markers */}
            {showProperties &&
              properties.map((prop) => {
                const lat = prop.coordinates?.lat || 40.7128;
                const lng = prop.coordinates?.lng || -74.0060;
                return (
                  <Marker
                    key={prop._id}
                    position={[lat, lng]}
                    icon={createPropertyIcon()}
                  >
                    <Popup>
                      <div className="p-1 space-y-2 text-left min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <strong className="text-white text-xs font-bold block">{prop.name}</strong>
                          <span className="text-[10px] text-blue-400 font-semibold">{prop.totalFloors} Fl</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{prop.address}</p>
                        <div className="text-[10px] text-slate-400 space-y-0.5 border-t border-slate-800 pt-1">
                          <div>Elevators: <strong className="text-cyan-400">{prop.stats?.elevators || 0}</strong></div>
                          <div>Escalators: <strong className="text-indigo-400">{prop.stats?.escalators || 0}</strong></div>
                        </div>
                        <a
                          href={`/properties/${prop._id}`}
                          className="mt-1 block text-center py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                        >
                          Inspect Facility
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Technician Markers & Service Radius */}
            {showTechnicians &&
              technicians.map((tech) => {
                const lat = tech.location?.lat || 40.7180;
                const lng = tech.location?.lng || -74.0020;
                const isSelected = selectedTech?._id === tech._id;

                return (
                  <React.Fragment key={tech._id}>
                    <Marker
                      position={[lat, lng]}
                      icon={createTechnicianIcon(tech.availability, isSelected)}
                      eventHandlers={{
                        click: () => setSelectedTech(tech)
                      }}
                    >
                      <Popup>
                        <div className="p-1 space-y-2 text-left min-w-[220px]">
                          <div className="flex items-center justify-between">
                            <strong className="text-white text-xs font-bold block">{tech.company}</strong>
                            <span className="text-amber-400 text-xs font-bold">★ {tech.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            License: {tech.licenseNumber}
                          </span>
                          <div className="text-[10px] text-slate-300">
                            Mechanic: <strong>{tech.user?.name}</strong> ({tech.experience} Yrs)
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            Radius: {tech.serviceRadius || 25} KM coverage
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Service Radius Circle if Selected */}
                    {isSelected && (
                      <Circle
                        center={[lat, lng]}
                        radius={(tech.serviceRadius || 25) * 1000}
                        pathOptions={{
                          color: '#8b5cf6',
                          fillColor: '#8b5cf6',
                          fillOpacity: 0.12,
                          weight: 1.5,
                          dashArray: '6, 6'
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
          </MapContainer>
        </div>

        {/* Right Sidebar: Selected Technician / Quick Directory */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Selected Responder Dossier
            </h3>

            {selectedTech ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedTech.company}</h4>
                    <span className="text-[11px] text-slate-400">
                      ★ {selectedTech.rating} &bull; {selectedTech.experience} Yrs
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div>License: <strong className="text-cyan-400 font-mono">{selectedTech.licenseNumber}</strong></div>
                  <div>Base: <span>{selectedTech.location?.address}</span></div>
                  <div>Coverage: <span className="text-purple-400 font-semibold">{selectedTech.serviceRadius || 25} KM Radius</span></div>
                  <div>Status: <span className={selectedTech.availability ? 'text-emerald-400' : 'text-slate-400'}>
                    {selectedTech.availability ? 'Available for Dispatch' : 'Standby'}
                  </span></div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Specialized Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTech.skills?.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTech(null)}
                  className="w-full py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 rounded-lg transition"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Click any technician marker on the map to visualize their operational service coverage radius.
              </div>
            )}
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Proximity Telemetry
            </span>
            <div className="flex justify-between text-slate-300">
              <span>Online Technicians:</span>
              <strong className="text-emerald-400">{technicians.filter((t) => t.availability).length} Active</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Managed Properties:</span>
              <strong className="text-cyan-400">{properties.length} Facilities</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
