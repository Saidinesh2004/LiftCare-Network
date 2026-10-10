import axios from 'axios';
import { handleMockRequest } from './mockService';

const isDev = import.meta.env.DEV;
const remoteUrl = import.meta.env.VITE_API_URL;
const hasCustomRemote = Boolean(remoteUrl && !remoteUrl.startsWith('/'));

const api = axios.create({
  baseURL: remoteUrl || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  adapter: async (config) => {
    // If running with explicit remote backend or in local dev, attempt network request first
    if (hasCustomRemote || isDev) {
      try {
        const defaultAdapter = axios.getAdapter(['xhr', 'fetch', 'http']);
        const res = await defaultAdapter(config);
        // Ensure response is actually JSON and not an HTML SPA fallback
        const isHtml = typeof res.data === 'string' && res.data.includes('<!doctype html');
        if (!isHtml) {
          return res;
        }
      } catch (err) {
        // If network error, 404, or 405 (e.g. backend server not started), gracefully fall through to mock
        console.warn('[LiftCare API] Server not accessible, using built-in demo engine:', err.message);
      }
    }

    // Static cloud deployment (e.g. Vercel) or server fallback: run instant mock service
    const mockRes = await handleMockRequest(config);
    if (mockRes.status >= 400) {
      const error = new Error(mockRes.data?.message || 'Request failed');
      error.response = {
        status: mockRes.status,
        statusText: mockRes.status === 401 ? 'Unauthorized' : 'Error',
        data: mockRes.data,
        headers: {},
        config
      };
      return Promise.reject(error);
    }

    return {
      status: mockRes.status,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: mockRes.data
    };
  }
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('liftcare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If expired, remove and optionally trigger relogin
      // localStorage.removeItem('liftcare_token');
    }
    return Promise.reject(error);
  }
);

export default api;
