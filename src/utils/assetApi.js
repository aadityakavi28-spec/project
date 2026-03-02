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
    const response = await api.get('/assets', { params });
    return response.data;
  },

  // Get assets grouped by type
  getAssetsByType: async () => {
    const response = await api.get('/assets/types');
    return response.data;
  },

  // Get single asset
  getAsset: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  // Get latest sensor data
  getLatestData: async (id) => {
    const response = await api.get(`/assets/${id}/latest`);
    return response.data;
  },

  // Get historical data
  getHistoricalData: async (id, hours = 24, limit = 100) => {
    const response = await api.get(`/assets/${id}/history`, {
      params: { hours, limit },
    });
    return response.data;
  },

  // Get alerts for asset
  getAlerts: async (id, resolved = null) => {
    const params = resolved !== null ? { resolved } : {};
    const response = await api.get(`/assets/${id}/alerts`, { params });
    return response.data;
  },

  // Create new asset (admin)
  createAsset: async (assetData) => {
    const response = await api.post('/assets', assetData);
    return response.data;
  },

  // Maintenance reset
  performMaintenance: async (id) => {
    const response = await api.post(`/assets/${id}/maintenance`);
    return response.data;
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
