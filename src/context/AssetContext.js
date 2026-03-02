// ============================================================
// ASSET CONTEXT
// Multi-Asset Structural Monitoring Platform - Demo Mode
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  ASSET_TYPES, 
  ASSET_TYPE_CONFIG, 
  getRiskLevel, 
  getAssetsByType,
  calculateRiskScore 
} from '../utils/assetTypes';
import { 
  generateDemoSensors, 
  calculateDemoRisk,
  generateDemoAlerts 
} from '../utils/demoDataGenerator';

const AssetContext = createContext();

// ============================================================
// DEMO ASSETS DATA
// ============================================================

const DEMO_ASSETS = {
  bridge: [
    { id: 'bridge-1', name: 'Golden Gate Bridge', location: 'San Francisco, CA', status: 'active' },
    { id: 'bridge-2', name: 'Brooklyn Bridge', location: 'New York, NY', status: 'active' },
    { id: 'bridge-3', name: 'Tower Bridge', location: 'London, UK', status: 'active' },
  ],
  building: [
    { id: 'building-1', name: 'Empire State Building', location: 'New York, NY', status: 'active' },
    { id: 'building-2', name: 'Burj Khalifa', location: 'Dubai, UAE', status: 'active' },
    { id: 'building-3', name: 'Willis Tower', location: 'Chicago, IL', status: 'active' },
  ],
  tunnel: [
    { id: 'tunnel-1', name: 'Channel Tunnel', location: 'UK/France', status: 'active' },
    { id: 'tunnel-2', name: 'Tokyo Bay Tunnel', location: 'Tokyo, Japan', status: 'active' },
    { id: 'tunnel-3', name: 'Gotthard Base Tunnel', location: 'Switzerland', status: 'active' },
  ],
};

// ============================================================
// ASSET PROVIDER
// ============================================================

export const AssetProvider = ({ children }) => {
  // Current selected asset type
  const [assetType, setAssetType] = useState(null);
  
  // Current selected asset
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Sensor data
  const [sensorData, setSensorData] = useState({});
  
  // Risk score
  const [riskScore, setRiskScore] = useState(50);
  
  // Risk level
  const [riskLevel, setRiskLevel] = useState('MONITORING');
  
  // Asset list
  const [assets, setAssets] = useState([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Chart data
  const [chartData, setChartData] = useState([]);
  
  // Last update time
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  
  // Connection status
  const [connectionStatus, setConnectionStatus] = useState('Initializing demo...');
  const [isLiveDataConnected, setIsLiveDataConnected] = useState(true);
  
  // Demo alerts
  const [demoAlerts, setDemoAlerts] = useState([]);
  
  // Current sensors ref for continuity
  const currentSensorsRef = useRef({});
  const timeRef = useRef(0);

  // ============================================================
  // INITIALIZE ASSET
  // ============================================================
  
  const initializeAsset = useCallback((type, asset) => {
    setIsLoading(true);
    setAssetType(type);
    setSelectedAsset(asset);
    setChartData([]);
    setDemoAlerts([]);
    currentSensorsRef.current = {};
    timeRef.current = 0;
    
    // Get demo assets for this type
    setAssets(DEMO_ASSETS[type] || []);
    
    setConnectionStatus('🔄 Demo mode - Generating sensor data...');
    setIsLiveDataConnected(true);
    setIsLoading(false);
  }, []);

  // ============================================================
  // UPDATE SENSOR DATA (Demo Loop - 2 seconds)
  // ============================================================
  
  useEffect(() => {
    if (!selectedAsset || !assetType) return;
    
    let interval;
    
    const updateDemoData = () => {
      timeRef.current += 2; // Increment time by 2 seconds
      
      // Generate demo sensor values
      const newSensors = generateDemoSensors(assetType, currentSensorsRef.current, timeRef.current);
      currentSensorsRef.current = newSensors;
      
      // Calculate risk score
      const newRisk = calculateDemoRisk(assetType, newSensors);
      
      // Get risk level
      const riskInfo = getRiskLevel(newRisk);
      
      // Generate alerts if needed
      const alerts = generateDemoAlerts(newRisk);
      
      // Update state
      setSensorData(newSensors);
      setRiskScore(newRisk);
      setRiskLevel(riskInfo.label);
      setDemoAlerts(alerts);
      setLastUpdateTime(new Date().toLocaleTimeString());
      setConnectionStatus('🟢 Live - Demo Mode');
      setIsLiveDataConnected(true);
      
      // Add to chart history
      setChartData(prev => {
        const newData = [...prev, { ...newSensors, riskScore: newRisk, time: timeRef.current }];
        // Keep last 30 points
        if (newData.length > 30) {
          return newData.slice(-30);
        }
        return newData;
      });
    };
    
    // Initial update
    updateDemoData();
    
    // Set up 2-second interval
    interval = setInterval(updateDemoData, 2000);
    
    return () => clearInterval(interval);
  }, [selectedAsset, assetType]);

  // ============================================================
  // GET SENSOR CONFIG
  // ============================================================
  
  const getSensorConfig = useCallback((sensorId) => {
    if (!assetType) return null;
    return ASSET_TYPE_CONFIG[assetType]?.sensors[sensorId] || null;
  }, [assetType]);

  // ============================================================
  // GET ALL SENSOR IDS
  // ============================================================
  
  const getAllSensorIds = useCallback(() => {
    if (!assetType) return [];
    return Object.keys(ASSET_TYPE_CONFIG[assetType]?.sensors || {});
  }, [assetType]);

  // ============================================================
  // GET ASSET CONFIG
  // ============================================================
  
  const getAssetConfig = useCallback(() => {
    if (!assetType) return null;
    return ASSET_TYPE_CONFIG[assetType];
  }, [assetType]);

  // ============================================================
  // RESET SELECTION
  // ============================================================
  
  const resetSelection = useCallback(() => {
    setAssetType(null);
    setSelectedAsset(null);
    setSensorData({});
    setRiskScore(50);
    setRiskLevel('MONITORING');
    setAssets([]);
    setChartData([]);
    setDemoAlerts([]);
    setConnectionStatus('');
    currentSensorsRef.current = {};
    timeRef.current = 0;
  }, []);

  // ============================================================
  // VALUE: CONTEXT
  // ============================================================
  
  const value = {
    // State
    assetType,
    selectedAsset,
    sensorData,
    riskScore,
    riskLevel,
    assets,
    isLoading,
    chartData,
    lastUpdateTime,
    connectionStatus,
    isLiveDataConnected,
    demoAlerts,
    
    // Actions
    initializeAsset,
    setSelectedAsset,
    resetSelection,
    getSensorConfig,
    getAllSensorIds,
    getAssetConfig,
    
    // Constants
    ASSET_TYPES,
    ASSET_TYPE_CONFIG,
    getRiskLevel,
    getAssetsByType,
    calculateRiskScore,
  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================

export const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAsset must be used within AssetProvider');
  }
  return context;
};

export default AssetContext;
