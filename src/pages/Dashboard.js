// ============================================================
// ENHANCED DASHBOARD
// Multi-Asset Structural Monitoring Platform
// Main Focus: 3D Model with All Asset Information
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsset } from '../context/AssetContext';
import { ASSET_TYPES, ASSET_TYPE_CONFIG, getRiskLevel } from '../utils/assetTypes';
import Navbar from '../components/Navbar';
import SensorCard from '../components/SensorCard';
import RiskMeter from '../components/RiskMeter';
import Model3DController, { StressLegendPanel } from '../components/Model3DController';
import BridgeModel from '../components/BridgeModel';
import BuildingModel from '../components/BuildingModel';
import TunnelModel from '../components/TunnelModel';
import VibrationChart from '../components/VibrationChart';
import MaintenanceRecommendation from '../components/MaintenanceRecommendation';
import LiveDataIndicator from '../components/LiveDataIndicator';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    assetType, 
    selectedAsset, 
    sensorData, 
    riskScore, 
    riskLevel,
    chartData,
    lastUpdateTime,
    connectionStatus,
    isLiveDataConnected,
    initializeAsset,
    getSensorConfig,
    getAllSensorIds,
    getAssetConfig,
    demoAlerts,
  } = useAsset();

  // State for UI
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [nextUpdateCountdown, setNextUpdateCountdown] = useState(2);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [is3DExpanded, setIs3DExpanded] = useState(false);

  // Initialize with default bridge if no asset selected
  useEffect(() => {
    if (!assetType) {
      // Initialize with default bridge
      initializeAsset(ASSET_TYPES.BRIDGE, {
        id: 'bridge-1',
        name: 'Golden Gate Bridge',
        location: 'San Francisco, CA',
        status: 'active'
      });
    }
  }, [assetType, initializeAsset]);

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

  const config = getAssetConfig();
  const allSensorIds = getAllSensorIds();
  const riskLevelInfo = getRiskLevel(riskScore);

  // Get chart data for first sensor
  const chartSensorId = allSensorIds[0];
  const chartDataFormatted = chartData.map((point, index) => ({
    time: index,
    [chartSensorId]: point[chartSensorId] || 0,
  }));

  // Render the appropriate 3D model based on asset type
  const render3DModel = () => {
    const modelProps = {
      isRisk: isHighRisk,
      riskScore: riskScore,
    };

    // Add sensor-specific props for animation
    if (assetType === ASSET_TYPES.BRIDGE) {
      return <BridgeModel {...modelProps} vibration={sensorData.vibration} load={sensorData.load} crack={sensorData.crack} temperature={sensorData.temperature} />;
    } else if (assetType === ASSET_TYPES.BUILDING) {
      return <BuildingModel {...modelProps} sensors={sensorData} />;
    } else if (assetType === ASSET_TYPES.TUNNEL) {
      return <TunnelModel {...modelProps} sensors={sensorData} />;
    }
    return <BridgeModel {...modelProps} />;
  };

  // Get asset type icon and gradient
  const getAssetDisplayInfo = () => {
    if (assetType === ASSET_TYPES.BRIDGE) {
      return {
        icon: '🌉',
        gradient: 'from-cyan-500 to-blue-500',
        name: 'Bridge'
      };
    } else if (assetType === ASSET_TYPES.BUILDING) {
      return {
        icon: '🏢',
        gradient: 'from-purple-500 to-pink-500',
        name: 'Building'
      };
    } else if (assetType === ASSET_TYPES.TUNNEL) {
      return {
        icon: '🚇',
        gradient: 'from-emerald-500 to-lime-500',
        name: 'Tunnel'
      };
    }
    return {
      icon: '🌉',
      gradient: 'from-cyan-500 to-blue-500',
      name: 'Bridge'
    };
  };

  const assetDisplay = getAssetDisplayInfo();

  // Quick switch between asset types
  const handleAssetTypeChange = (newType) => {
    const typeConfig = ASSET_TYPE_CONFIG[newType];
    initializeAsset(newType, {
      id: `${newType}-1`,
      name: typeConfig.name,
      location: 'Primary Location',
      status: 'active'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            {/* Asset Type Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAssetTypeChange(ASSET_TYPES.BRIDGE)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  assetType === ASSET_TYPES.BRIDGE 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                🌉 Bridge
              </button>
              <button
                onClick={() => handleAssetTypeChange(ASSET_TYPES.BUILDING)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  assetType === ASSET_TYPES.BUILDING 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                🏢 Building
              </button>
              <button
                onClick={() => handleAssetTypeChange(ASSET_TYPES.TUNNEL)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  assetType === ASSET_TYPES.TUNNEL 
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                🚇 Tunnel
              </button>
            </div>
          </div>

          {/* Asset Info & Risk Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${assetDisplay.gradient}`}>
                {assetDisplay.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{selectedAsset?.name || 'Select Asset'}</h1>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <span>📍</span> {selectedAsset?.location || 'No location'}
                </p>
              </div>
            </div>
            
            {/* Risk Badge */}
            <div className={`px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 ${
              riskScore > 75 ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' :
              riskScore > 50 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
              riskScore > 25 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
              'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}>
              <span>{riskLevelInfo?.icon || '🟢'}</span>
              <span>{riskLevelInfo?.label || 'LOW'}</span>
              <span className="opacity-60">|</span>
              <span className="font-mono">{riskScore?.toFixed(0) || 0}/100</span>
            </div>
          </div>
        </div>

        {/* Live Data Indicator */}
        <div className="mb-6">
          <LiveDataIndicator
            isConnected={isLiveDataConnected}
            lastUpdateTime={lastUpdateTime}
            isFetching={false}
            apiCallCount={apiCallCount}
            successRate={100}
            dataSource={{ simulation: { connected: true } }}
            nextUpdateCountdown={nextUpdateCountdown}
          />
        </div>

        {/* High Risk Alert */}
        {(isHighRisk || riskScore > 90) && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{riskScore > 90 ? '🚨' : '⚠️'}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400">
                  {riskScore > 90 ? '🔴 CRITICAL STRUCTURAL ALERT' : '🟠 HIGH RISK DETECTED'}
                </h3>
                <p className="text-red-300/80 text-sm">
                  {riskScore > 90 
                    ? 'Immediate inspection required! Structural integrity may be compromised.'
                    : 'Schedule inspection. Risk threshold exceeded.'}
                </p>
              </div>
              <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT: 3D Model Focus with Sensor Data */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT PANEL: Sensor Cards */}
          <div className="xl:col-span-3 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">📊</span> Live Sensors
            </h3>
            <div className="space-y-3">
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

            {/* Risk Meter */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <span className="text-purple-400">🎯</span> Risk Assessment
              </h3>
              <RiskMeter
                riskScore={riskScore}
                assetType={assetType}
                sensors={sensorData}
              />
            </div>
          </div>

          {/* CENTER: Main 3D Model - HERO ELEMENT */}
          <div className="xl:col-span-7">
            <div className="relative">
              {/* 3D Model Container - Larger and Prominent */}
              <div 
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 transition-all duration-500 ${
                  is3DExpanded ? 'h-[600px]' : 'h-[500px]'
                }`}
              >
                {/* 3D Canvas */}
                <div className="absolute inset-0">
                  <Model3DController 
                    showHighlights={true}
                    enableRotation={true}
                    enableZoom={true}
                  />
                </div>

                {/* Overlay Info */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    Live 3D
                  </div>
                  <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                    {assetDisplay.name} Digital Twin
                  </div>
                </div>

                {/* Model Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setIs3DExpanded(!is3DExpanded)}
                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    title={is3DExpanded ? 'Collapse' : 'Expand'}
                  >
                    {is3DExpanded ? '➖' : '➕'}
                  </button>
                </div>

                {/* Bottom Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-400">Status</p>
                        <p className={`text-sm font-bold ${isHighRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                          {isHighRisk ? '🔴 CRITICAL' : '🟢 OPERATIONAL'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Last Update</p>
                        <p className="text-sm font-bold text-white">
                          {lastUpdateTime || '--:--:--'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Risk Score</p>
                        <p className={`text-sm font-bold ${isHighRisk ? 'text-red-400' : 'text-cyan-400'}`}>
                          {riskScore?.toFixed(1)}/100
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stress Legend */}
              <StressLegendPanel showHighlights={true} />
            </div>

            {/* Vibration Chart Below 3D */}
            <div className="mt-6">
              <VibrationChart 
                data={chartDataFormatted}
                title={config?.sensors[chartSensorId]?.name || 'Sensor Data'}
              />
            </div>
          </div>

          {/* RIGHT PANEL: Additional Info */}
          <div className="xl:col-span-2 space-y-4">
            {/* Maintenance Recommendation */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <span className="text-amber-400">🔧</span> Recommendations
              </h3>
              <MaintenanceRecommendation riskScore={riskScore} />
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h4 className="text-sm font-bold text-slate-300 mb-3">Asset Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Type</span>
                  <span className="text-white font-medium">{assetDisplay.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="text-white">{selectedAsset?.location || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sensors</span>
                  <span className="text-white">{allSensorIds.length} Active</span>
                </div>
              </div>
            </div>

            {/* Demo Alerts */}
            {demoAlerts && demoAlerts.length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-red-500/30">
                <h4 className="text-sm font-bold text-red-400 mb-3">Active Alerts</h4>
                <div className="space-y-2">
                  {demoAlerts.map((alert, idx) => (
                    <div key={idx} className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-xs text-red-300">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-xs text-slate-400 mb-1">Risk Score</p>
            <p className={`text-2xl font-bold ${isHighRisk ? 'text-red-400' : 'text-emerald-400'}`}>
              {riskScore?.toFixed(0) || 0}/100
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-xs text-slate-400 mb-1">Data Source</p>
            <p className="text-lg font-bold text-cyan-400">🔬 Demo Mode</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-xs text-slate-400 mb-1">Asset Type</p>
            <p className="text-lg font-bold text-white">{assetDisplay.name}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-xs text-slate-400 mb-1">Connection</p>
            <p className="text-lg font-bold text-emerald-400">🟢 Live</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

