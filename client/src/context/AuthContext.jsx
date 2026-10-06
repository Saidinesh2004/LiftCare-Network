import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = {
  ADMIN: { email: 'admin@liftcare.com', password: 'password123', label: 'Platform Admin' },
  PROPERTY_MANAGER: { email: 'pm1@apexprop.com', password: 'password123', label: 'Property Manager (Sarah Chen)' },
  TECHNICIAN: { email: 'tech1@patellift.com', password: 'password123', label: 'Verified Tech (Raj Patel)' },
  TECHNICIAN_ESCALATOR: { email: 'tech4@metroescalator.com', password: 'password123', label: 'Escalator Specialist (Sarah J.)' },
  TECHNICIAN_PENDING: { email: 'tech9@nextgenlift.com', password: 'password123', label: 'Pending Verification (Zack T.)' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('liftcare_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setTechnician(res.data.technician || null);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('liftcare_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('liftcare_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setTechnician(res.data.technician || null);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('liftcare_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setTechnician(res.data.technician || null);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('liftcare_token');
    setToken(null);
    setUser(null);
    setTechnician(null);
  };

  const switchDemoRole = async (key) => {
    const creds = DEMO_ACCOUNTS[key];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.technician) setTechnician(res.data.technician);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Profile update failed' };
    }
  };

  const value = {
    user,
    technician,
    token,
    role: user?.role || null,
    loading,
    login,
    register,
    logout,
    updateProfile,
    switchDemoRole,
    setTechnician
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
