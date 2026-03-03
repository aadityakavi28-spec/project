// Asset API utility
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Asset API functions
export const assetApi = {
  // Get all assets
  getAssets: async (type = null) => {
    const params = type ? { type } : {};
    return api.get('/assets', { params });
  },

  // Get assets grouped by type
  getAssetsByType: async () => {
    return api.get('/assets/types');
  },

  // Get single asset
  getAsset: async (id) => {
    return api.get(`/assets/${id}`);
  },

  // Get latest sensor data
  getLatestData: async (id) => {
    return api.get(`/assets/${id}/latest`);
  },

  // Get historical data
  getHistoricalData: async (id, hours = 24, limit = 100) => {
    return api.get(`/assets/${id}/history`, {
      params: { hours, limit },
    });
  },

  // Get alerts for asset
  getAlerts: async (id, resolved = null) => {
    const params = resolved !== null ? { resolved } : {};
    return api.get(`/assets/${id}/alerts`, { params });
  },

  // Create new asset (admin)
  createAsset: async (assetData) => {
    return api.post('/assets', assetData);
  },

  // Maintenance reset
  performMaintenance: async (id) => {
    return api.post(`/assets/${id}/maintenance`);
  },
};

// IoT upload API
export const iotApi = {
  // Upload sensor data from IoT device
  uploadSensorData: async (data) => {
    const response = await api.post('/assets/iot/upload', data);
    return response.data;
  },
};

export default assetApi;
