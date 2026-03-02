// ============================================================
// ASSET TYPE DEFINITIONS
// Multi-Asset Structural Monitoring Platform
// ============================================================

// Asset Types
export const ASSET_TYPES = {
  BRIDGE: 'bridge',
  BUILDING: 'building',
  TUNNEL: 'tunnel',
};

// Asset Type Metadata
export const ASSET_TYPE_CONFIG = {
  [ASSET_TYPES.BRIDGE]: {
    id: ASSET_TYPES.BRIDGE,
    name: 'Bridge',
    icon: '🌉',
    description: 'Bridge Structural Monitoring',
    color: '#3b82f6', // Blue
    model3D: 'BridgeModel',
    // Sensor Definitions
    sensors: {
      vibration: {
        id: 'vibration',
        name: 'Vibration Level',
        unit: 'm/s²',
        icon: '📡',
        min: 5,
        max: 95,
        threshold: 70,
        baseline: 15,
        weight: 0.4,
      },
      load: {
        id: 'load',
        name: 'Load Stress',
        unit: 'MN',
        icon: '⚖️',
        min: 10,
        max: 100,
        threshold: 80,
        baseline: 35,
        weight: 0.3,
      },
      crack: {
        id: 'crack',
        name: 'Crack Width',
        unit: 'mm',
        icon: '🔍',
        min: 0,
        max: 25,
        threshold: 15,
        baseline: 5,
        weight: 0.3,
      },
      temperature: {
        id: 'temperature',
        name: 'Temperature',
        unit: '°C',
        icon: '🌡️',
        min: 10,
        max: 40,
        threshold: 35,
        baseline: 22,
        weight: 0, // Not included in risk calculation
      },
    },
    // Risk Calculation Formula
    riskFormula: (sensors) => {
      const { vibration, load, crack } = sensors;
      return (vibration * 0.4) + (crack * 0.3) + (load * 0.3);
    },
  },

  [ASSET_TYPES.BUILDING]: {
    id: ASSET_TYPES.BUILDING,
    name: 'Building',
    icon: '🏢',
    description: 'Building Structural Monitoring',
    color: '#8b5cf6', // Violet
    model3D: 'BuildingModel',
    // Sensor Definitions
    sensors: {
      tilt: {
        id: 'tilt',
        name: 'Building Tilt',
        unit: '°',
        icon: '📐',
        min: 0,
        max: 5,
        threshold: 3,
        baseline: 0.5,
        weight: 0.3,
      },
      displacement: {
        id: 'displacement',
        name: 'Displacement',
        unit: 'mm',
        icon: '↔️',
        min: 0,
        max: 50,
        threshold: 35,
        baseline: 5,
        weight: 0.3,
      },
      crack: {
        id: 'crack',
        name: 'Crack Width',
        unit: 'mm',
        icon: '🔍',
        min: 0,
        max: 20,
        threshold: 12,
        baseline: 2,
        weight: 0.2,
      },
      vibration: {
        id: 'vibration',
        name: 'Vibration Level',
        unit: 'm/s²',
        icon: '📡',
        min: 0,
        max: 30,
        threshold: 20,
        baseline: 3,
        weight: 0.2,
      },
    },
    // Risk Calculation Formula
    riskFormula: (sensors) => {
      const { tilt, displacement, crack, vibration } = sensors;
      return (tilt * 20) + (displacement * 1.5) + (crack * 3) + (vibration * 2);
    },
  },

  [ASSET_TYPES.TUNNEL]: {
    id: ASSET_TYPES.TUNNEL,
    name: 'Tunnel',
    icon: '🚇',
    description: 'Tunnel Structural Monitoring',
    color: '#f59e0b', // Amber
    model3D: 'TunnelModel',
    // Sensor Definitions
    sensors: {
      waterPressure: {
        id: 'waterPressure',
        name: 'Water Pressure',
        unit: 'kPa',
        icon: '💧',
        min: 0,
        max: 100,
        threshold: 70,
        baseline: 20,
        weight: 0.3,
      },
      humidity: {
        id: 'humidity',
        name: 'Humidity',
        unit: '%',
        icon: '💨',
        min: 30,
        max: 100,
        threshold: 85,
        baseline: 55,
        weight: 0.2,
      },
      crack: {
        id: 'crack',
        name: 'Crack Width',
        unit: 'mm',
        icon: '🔍',
        min: 0,
        max: 15,
        threshold: 10,
        baseline: 1,
        weight: 0.25,
      },
      structuralStrain: {
        id: 'structuralStrain',
        name: 'Structural Strain',
        unit: 'με',
        icon: '📊',
        min: 0,
        max: 1000,
        threshold: 700,
        baseline: 150,
        weight: 0.25,
      },
    },
    // Risk Calculation Formula
    riskFormula: (sensors) => {
      const { waterPressure, humidity, crack, structuralStrain } = sensors;
      return (waterPressure * 0.8) + (humidity * 0.5) + (crack * 5) + (structuralStrain * 0.07);
    },
  },
};

// Risk Level Thresholds
export const RISK_LEVELS = {
  LOW: { min: 0, max: 25, label: 'LOW', color: '#10b981', icon: '🟢' },
  MONITORING: { min: 26, max: 50, label: 'MONITORING', color: '#eab308', icon: '🟡' },
  WARNING: { min: 51, max: 75, label: 'WARNING', color: '#f97316', icon: '🟠' },
  CRITICAL: { min: 76, max: 100, label: 'CRITICAL', color: '#ef4444', icon: '🔴' },
};

// Get Risk Level from Score
export const getRiskLevel = (riskScore) => {
  if (riskScore > 75) return RISK_LEVELS.CRITICAL;
  if (riskScore > 50) return RISK_LEVELS.WARNING;
  if (riskScore > 25) return RISK_LEVELS.MONITORING;
  return RISK_LEVELS.LOW;
};

// Get Asset Type Config
export const getAssetConfig = (assetType) => {
  return ASSET_TYPE_CONFIG[assetType] || ASSET_TYPES.BRIDGE;
};

// Get all sensor IDs for an asset type
export const getSensorIds = (assetType) => {
  const config = ASSET_TYPE_CONFIG[assetType];
  return config ? Object.keys(config.sensors) : [];
};

// Get sensor config
export const getSensorConfig = (assetType, sensorId) => {
  const config = ASSET_TYPE_CONFIG[assetType];
  return config?.sensors[sensorId] || null;
};

// Calculate risk score
export const calculateRiskScore = (assetType, sensorValues) => {
  const config = ASSET_TYPE_CONFIG[assetType];
  if (!config) return 0;
  
  const risk = config.riskFormula(sensorValues);
  return Math.min(100, Math.max(0, risk)); // Clamp between 0-100
};

// Mock Asset Data
export const MOCK_ASSETS = {
  [ASSET_TYPES.BRIDGE]: [
    { id: 'bridge-1', name: 'Golden Gate Bridge', location: 'San Francisco, CA', status: 'active' },
    { id: 'bridge-2', name: 'Brooklyn Bridge', location: 'New York, NY', status: 'active' },
    { id: 'bridge-3', name: 'Tower Bridge', location: 'London, UK', status: 'active' },
    { id: 'bridge-4', name: 'Sydney Harbour Bridge', location: 'Sydney, Australia', status: 'active' },
  ],
  [ASSET_TYPES.BUILDING]: [
    { id: 'building-1', name: 'Empire State Building', location: 'New York, NY', status: 'active' },
    { id: 'building-2', name: 'Burj Khalifa', location: 'Dubai, UAE', status: 'active' },
    { id: 'building-3', name: 'Willis Tower', location: 'Chicago, IL', status: 'active' },
  ],
  [ASSET_TYPES.TUNNEL]: [
    { id: 'tunnel-1', name: 'Channel Tunnel', location: 'UK/France', status: 'active' },
    { id: 'tunnel-2', name: 'Tokyo Bay Tunnel', location: 'Tokyo, Japan', status: 'active' },
    { id: 'tunnel-3', name: 'Gotthard Base Tunnel', location: 'Switzerland', status: 'active' },
  ],
};

// Get assets by type
export const getAssetsByType = (assetType) => {
  return MOCK_ASSETS[assetType] || [];
};

export default ASSET_TYPE_CONFIG;
