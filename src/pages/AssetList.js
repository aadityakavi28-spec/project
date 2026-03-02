// ============================================================
// ASSET LIST PAGE
// Multi-Asset Structural Monitoring Platform
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsset } from '../context/AssetContext';
import { ASSET_TYPE_CONFIG, getRiskLevel } from '../utils/assetTypes';
import Navbar from '../components/Navbar';

const AssetList = () => {
  const navigate = useNavigate();
  const { 
    assetType, 
    assets, 
    selectedAsset, 
    setSelectedAsset, 
    resetSelection,
    initializeAsset,
    sensorData,
    riskScore,
  } = useAsset();

  const config = assetType ? ASSET_TYPE_CONFIG[assetType] : null;

  if (!config) {
    // No asset type selected, redirect to command center
    navigate('/command-center');
    return null;
  }

  const handleSelectAsset = (asset) => {
    initializeAsset(assetType, asset);
    navigate('/unified-dashboard');
  };

  const handleBack = () => {
    resetSelection();
    navigate('/command-center');
  };

  // Generate mock data for display
  const getMockRiskScore = (assetId) => {
    // Generate deterministic but varied risk scores
    const hash = assetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 20 + (hash % 50);
  };

  const getMockStatus = (riskScore) => {
    if (riskScore > 75) return 'critical';
    if (riskScore > 50) return 'warning';
    if (riskScore > 25) return 'monitoring';
    return 'healthy';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-400 hover:bg-primary-50 flex items-center justify-center text-xl transition-all duration-300"
            >
              ←
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{config.icon}</span>
                <h1 className="text-3xl font-bold text-text-primary">{config.name} Assets</h1>
              </div>
              <p className="text-text-secondary">{config.description}</p>
            </div>
          </div>
          
          <div className={`px-6 py-3 rounded-xl bg-gradient-to-r ${assetType === 'bridge' ? 'from-blue-500' : assetType === 'building' ? 'from-violet-500' : 'from-amber-500'} to-white text-white font-bold`}>
            {assets.length} Assets Available
          </div>
        </div>

        {/* Asset Type Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>📋</span> Monitored Sensors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(config.sensors).map((sensor) => (
              <div key={sensor.id} className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">{sensor.icon}</div>
                <p className="font-bold text-text-primary">{sensor.name}</p>
                <p className="text-xs text-text-muted">{sensor.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Asset List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => {
            const risk = getMockRiskScore(asset.id);
            const status = getMockStatus(risk);
            const riskInfo = getRiskLevel(risk);
            
            return (
              <div
                key={asset.id}
                onClick={() => handleSelectAsset(asset)}
                className={`group cursor-pointer relative overflow-hidden bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  selectedAsset?.id === asset.id 
                    ? 'border-primary-500 shadow-lg' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Status Indicator */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  status === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                  status === 'monitoring' ? 'bg-yellow-100 text-yellow-700' :
                  status === 'warning' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {riskInfo.icon} {riskInfo.label}
                </div>

                <div className="p-6">
                  {/* Asset Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-gradient-to-br ${
                    assetType === 'bridge' ? 'from-blue-100 to-blue-200' :
                    assetType === 'building' ? 'from-violet-100 to-violet-200' :
                    'from-amber-100 to-amber-200'
                  }`}>
                    {config.icon}
                  </div>

                  {/* Asset Name */}
                  <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary-600 transition-colors">
                    {asset.name}
                  </h3>
                  
                  {/* Location */}
                  <p className="text-text-secondary mb-4 flex items-center gap-2">
                    <span>📍</span> {asset.location}
                  </p>

                  {/* Risk Meter Mini */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-text-muted">Risk Score</span>
                      <span className="font-bold" style={{ color: riskInfo.color }}>{risk}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${risk}%`,
                          backgroundColor: riskInfo.color 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${asset.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className="text-sm text-text-muted capitalize">{asset.status}</span>
                    </div>
                    <span className="text-sm font-bold text-primary-600 group-hover:translate-x-2 transition-transform">
                      View Dashboard →
                    </span>
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
                  assetType === 'bridge' ? 'from-blue-500 to-blue-600' :
                  assetType === 'building' ? 'from-violet-500 to-violet-600' :
                  'from-amber-500 to-orange-500'
                }`}></div>
              </div>
            );
          })}
        </div>

        {/* Add Asset Button (Placeholder) */}
        <div className="mt-8 text-center">
          <button className="px-8 py-4 bg-white border-2 border-dashed border-slate-300 rounded-xl text-text-muted hover:border-primary-400 hover:text-primary-600 transition-all duration-300">
            <span className="text-2xl mb-2 block">+</span>
            <span className="font-semibold">Add New {config.name}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AssetList;
