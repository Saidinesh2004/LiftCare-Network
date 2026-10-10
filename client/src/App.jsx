import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/Toast';
import ElevatorBackground from './components/ElevatorBackground';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Property Manager Pages
import PMDashboard from './pages/property-manager/PMDashboard';
import PropertiesPage from './pages/property-manager/PropertiesPage';
import PropertyDetailPage from './pages/property-manager/PropertyDetailPage';
import EquipmentPage from './pages/property-manager/EquipmentPage';
import EquipmentDetailPage from './pages/property-manager/EquipmentDetailPage';
import RequestsPage from './pages/property-manager/RequestsPage';
import RequestDetailPage from './pages/property-manager/RequestDetailPage';
import CreateRequestPage from './pages/property-manager/CreateRequestPage';
import TechnicianSearchPage from './pages/property-manager/TechnicianSearchPage';

// Technician Pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianJobsPage from './pages/technician/TechnicianJobsPage';
import TechnicianActiveJobPage from './pages/technician/TechnicianActiveJobPage';
import SubmitReportPage from './pages/technician/SubmitReportPage';
import TechnicianProfilePage from './pages/technician/TechnicianProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TechnicianVerificationPage from './pages/admin/TechnicianVerificationPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Shared Map
import NetworkMapPage from './pages/map/NetworkMapPage';

// Protected Layout component
const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Synchronizing LiftCare Network...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <ElevatorBackground opacity="opacity-30" />
      <Navbar />
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

// Dynamic Home Page Route depending on role
const RoleHomeDispatcher = () => {
  const { role } = useAuth();
  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'TECHNICIAN') return <TechnicianDashboard />;
  return <PMDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedLayout>
                    <RoleHomeDispatcher />
                  </ProtectedLayout>
                }
              />

              {/* Commercial Properties */}
              <Route
                path="/properties"
                element={
                  <ProtectedLayout>
                    <PropertiesPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/properties/:id"
                element={
                  <ProtectedLayout>
                    <PropertyDetailPage />
                  </ProtectedLayout>
                }
              />

              {/* Equipment Fleet */}
              <Route
                path="/equipment"
                element={
                  <ProtectedLayout>
                    <EquipmentPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/equipment/:id"
                element={
                  <ProtectedLayout>
                    <EquipmentDetailPage />
                  </ProtectedLayout>
                }
              />

              {/* Maintenance Requests */}
              <Route
                path="/requests"
                element={
                  <ProtectedLayout>
                    <RequestsPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/requests/new"
                element={
                  <ProtectedLayout>
                    <CreateRequestPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/requests/:id"
                element={
                  <ProtectedLayout>
                    <RequestDetailPage />
                  </ProtectedLayout>
                }
              />

              {/* Technician Match Directory */}
              <Route
                path="/technicians"
                element={
                  <ProtectedLayout>
                    <TechnicianSearchPage />
                  </ProtectedLayout>
                }
              />

              {/* Technician Dedicated Modules */}
              <Route
                path="/technician/jobs"
                element={
                  <ProtectedLayout>
                    <TechnicianJobsPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/technician/active-job/:id"
                element={
                  <ProtectedLayout>
                    <TechnicianActiveJobPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/technician/submit-report/:requestId"
                element={
                  <ProtectedLayout>
                    <SubmitReportPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/technician/profile"
                element={
                  <ProtectedLayout>
                    <TechnicianProfilePage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/technician/reports"
                element={
                  <ProtectedLayout>
                    <AdminReportsPage />
                  </ProtectedLayout>
                }
              />

              {/* Admin Modules */}
              <Route
                path="/admin/verifications"
                element={
                  <ProtectedLayout>
                    <TechnicianVerificationPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedLayout>
                    <UserManagementPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedLayout>
                    <AdminReportsPage />
                  </ProtectedLayout>
                }
              />

              {/* Geospatial Network Map */}
              <Route
                path="/map"
                element={
                  <ProtectedLayout>
                    <NetworkMapPage />
                  </ProtectedLayout>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
