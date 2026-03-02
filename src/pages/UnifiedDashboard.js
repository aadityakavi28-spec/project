// ============================================================
// UNIFIED DASHBOARD
// Multi-Asset Structural Monitoring Platform - Demo Mode
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsset } from '../context/AssetContext';
import { ASSET_TYPE_CONFIG, getRiskLevel } from '../utils/assetTypes';
import Navbar from '../components/Navbar';
import SensorCard from '../components/SensorCard';
import RiskMeter from '../components/RiskMeter';
import BridgeModel from '../components/BridgeModel';
import VibrationChart from '../components/VibrationChart';
import LiveDataIndicator from '../components/LiveDataIndicator';
import MaintenanceRecommendation from '../components/MaintenanceRecommendation';

// Dynamic 3D Model Loader
const ModelLoader = ({ assetType, sensorData, riskScore }) => {
  const [BuildingModel, setBuildingModel] = useState(null);
  const [TunnelModel, setTunnelModel] = useState(null);

  useEffect(() => {
    if (assetType === 'building' && !BuildingModel) {
      import('../components/BuildingModel')
        .then(module => setBuildingModel(() => module.default))
        .catch(err => console.error('Failed to load BuildingModel:', err));
    }
    if (assetType === 'tunnel' && !TunnelModel) {
      import('../components/TunnelModel')
        .then(module => setTunnelModel(() => module.default))
        .catch(err => console.error('Failed to load TunnelModel:', err));
    }
  }, [assetType]);

  // Bridge - use existing model
  if (assetType === 'bridge') {
    return (
      <BridgeModel 
        isRisk={riskScore > 75}
        vibration={sensorData.vibration || 0}
        load={sensorData.load || 0}
        crack={sensorData.crack || 0}
        temperature={sensorData.temperature || 0}
        riskScore={riskScore}
      />
    );
  }

  // Building
  if (assetType === 'building' && BuildingModel) {
    return (
      <BuildingModel 
        isRisk={riskScore > 75}
        tilt={sensorData.tilt || 0}
        displacement={sensorData.displacement || 0}
        crack={sensorData.crack || 0}
        vibration={sensorData.vibration || 0}
        riskScore={riskScore}
      />
    );
  }

  // Tunnel
  if (assetType === 'tunnel' && TunnelModel) {
    return (
      <TunnelModel 
        isRisk={riskScore > 75}
        waterPressure={sensorData.waterPressure || 0}
        humidity={sensorData.humidity || 0}
        crack={sensorData.crack || 0}
        structuralStrain={sensorData.structuralStrain || 0}
        riskScore={riskScore}
      />
    );
  }

  // Loading state
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-xl font-semibold">Loading 3D Model...</p>
      </div>
    </div>
  );
};

const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const { 
    assetType, 
    selectedAsset, 
    sensorData, 
    riskScore, 
    chartData,
    lastUpdateTime,
    connectionStatus,
    isLiveDataConnected,
    resetSelection,
    getSensorConfig,
    getAllSensorIds,
    getAssetConfig,
    demoAlerts,
  } = useAsset();

  // State for UI
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [nextUpdateCountdown, setNextUpdateCountdown] = useState(2);

  // Update risk status
  useEffect(() => {
    setIsHighRisk(riskScore > 75);
    setApiCallCount(prev => prev + 1);
  }, [riskScore]);

  // Countdown timer for demo mode
  useEffect(() => {
    const interval = setInterval(() => {
      setNextUpdateCountdown(prev => {
        if (prev <= 1) return 2;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!assetType || !selectedAsset) {
    navigate('/command-center');
    return null;
  }

  const config = getAssetConfig();
  const allSensorIds = getAllSensorIds();
  const riskLevelInfo = getRiskLevel(riskScore);

  const handleBack = () => {
    navigate('/asset-list');
  };

  // Get chart data for first sensor
  const chartSensorId = allSensorIds[0];
  const chartDataFormatted = chartData.map((point, index) => ({
    time: index,
    [chartSensorId]: point[chartSensorId] || 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header with Asset Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-400 hover:bg-primary-50 flex items-center justify-center text-xl transition-all duration-300"
            >
              ←
            </button>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${
                assetType === 'bridge' ? 'from-blue-100 to-blue-200' :
                assetType === 'building' ? 'from-violet-100 to-violet-200' :
                'from-amber-100 to-amber-200'
              }`}>
                {config?.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{selectedAsset.name}</h1>
                <p className="text-text-secondary flex items-center gap-2">
                  <span>📍</span> {selectedAsset.location}
                </p>
              </div>
            </div>
          </div>
          
          {/* Risk Badge */}
          <div className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 ${riskScore > 75 ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' :
            riskScore > 50 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
            riskScore > 25 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
            'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}>
            <span>{riskLevelInfo.icon}</span>
            <span>{riskLevelInfo.label} RISK</span>
            <span className="opacity-75">|</span>
            <span>{riskScore.toFixed(0)}/100</span>
          </div>
        </div>

        {/* Live Data Indicator - Always connected in demo mode */}
        <LiveDataIndicator
          isConnected={true}
          lastUpdateTime={lastUpdateTime}
          isFetching={false}
          apiCallCount={apiCallCount}
          successRate={100}
          dataSource={{ simulation: { connected: true }, weather: { connected: true }, earthquake: { connected: true } }}
          nextUpdateCountdown={nextUpdateCountdown}
        />

        {/* Demo Alert Box for High Risk */}
        {(isHighRisk || riskScore > 90) && (
          <div className="mb-6 p-6 bg-gradient-to-r from-rose-50 to-rose-100 border-2 border-rose-300 rounded-xl shadow-lg animate-pulse">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{riskScore > 90 ? '🚨' : '⚠️'}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-rose-700 mb-1">
                  {riskScore > 90 ? '🔴 CRITICAL ALERT' : '🟠 HIGH RISK DETECTED'}
                </h3>
                <p className="text-rose-600 font-medium">
                  {riskScore > 90 
                    ? 'Structural integrity compromised. Immediate inspection required!'
                    : 'Risk score exceeds safe threshold. Schedule inspection.'}
                </p>
              </div>
              <span className="text-3xl animate-bounce">⚡</span>
            </div>
          </div>
        )}

        {/* Top Section: Sensors & Risk Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Sensor Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {allSensorIds.map((sensorId) => {
              const sensorConfig = getSensorConfig(sensorId);
              if (!sensorConfig) return null;
              
              const value = sensorData[sensorId] !== undefined ? sensorData[sensorId] : sensorConfig.baseline;
              
              return (
                <SensorCard
                  key={sensorId}
                  title={sensorConfig.name}
                  value={value}
                  unit={sensorConfig.unit}
                  icon={sensorConfig.icon}
                  min={sensorConfig.min}
                  max={sensorConfig.max}
                  threshold={sensorConfig.threshold}
                />
              );
            })}
          </div>

          {/* Risk Meter - Pass generic sensors object */}
          <div className="lg:col-span-1">
            <RiskMeter
              riskScore={riskScore}
              assetType={assetType}
              sensors={sensorData}
            />
          </div>
        </div>

        {/* Maintenance Recommendation Section */}
        <div className="mb-6">
          <MaintenanceRecommendation riskScore={riskScore} />
        </div>

        {/* Bottom Section: Chart & 3D Model */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <VibrationChart 
              data={chartDataFormatted}
              title={config?.sensors[chartSensorId]?.name || 'Sensor Data'}
            />
          </div>

          {/* 3D Model */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl shadow-lg overflow-hidden bg-white border border-slate-200" style={{ height: '400px' }}>
              <ModelLoader 
                assetType={assetType}
                sensorData={sensorData}
                riskScore={riskScore}
              />
            </div>
          </div>
        </div>

        {/* Statistics Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <div className="text-center">
            <p className="text-text-muted text-sm mb-1">Risk Score</p>
            <p className={`text-2xl font-bold ${isHighRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
              {riskScore.toFixed(0)}/100
            </p>
          </div>
          <div className="text-center">
            <p className="text-text-muted text-sm mb-1">Last Update</p>
            <p className="text-2xl font-bold text-primary-600">
              {lastUpdateTime || '--:--:--'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-text-muted text-sm mb-1">Status</p>
            <p className={`text-xl font-bold ${isHighRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isHighRisk ? '🔴 Critical' : '🟢 Normal'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-text-muted text-sm mb-1">Data Source</p>
            <p className="text-lg font-bold text-primary-600">
              🔬 Demo Mode
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnifiedDashboard;
