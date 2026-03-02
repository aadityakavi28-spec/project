// ============================================================
// ASSET COMMAND CENTER
// Multi-Asset Structural Monitoring Platform
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useAsset } from '../context/AssetContext';
import { ASSET_TYPES, ASSET_TYPE_CONFIG } from '../utils/assetTypes';
import Navbar from '../components/Navbar';

const AssetCommandCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initializeAsset } = useAsset();

  const handleSelectAssetType = (assetType) => {
    // Initialize with first asset of that type
    const config = ASSET_TYPE_CONFIG[assetType];
    const defaultAsset = {
      id: `${assetType}-1`,
      name: config.name,
      location: 'Primary Location',
      status: 'active'
    };
    
    initializeAsset(assetType, defaultAsset);
    navigate('/asset-list');
  };

  const assetTypes = [
    {
      type: ASSET_TYPES.BRIDGE,
      config: ASSET_TYPE_CONFIG[ASSET_TYPES.BRIDGE],
      stats: {
        total: 4,
        active: 4,
        critical: 0,
      },
      features: [
        'Vibration Monitoring',
        'Load Stress Analysis',
        'Crack Detection',
        'Thermal Monitoring',
      ],
    },
    {
      type: ASSET_TYPES.BUILDING,
      config: ASSET_TYPE_CONFIG[ASSET_TYPES.BUILDING],
      stats: {
        total: 3,
        active: 3,
        critical: 0,
      },
      features: [
        'Tilt Detection',
        'Displacement Tracking',
        'Structural Crack Analysis',
        'Seismic Vibration',
      ],
    },
    {
      type: ASSET_TYPES.TUNNEL,
      config: ASSET_TYPE_CONFIG[ASSET_TYPES.TUNNEL],
      stats: {
        total: 3,
        active: 3,
        critical: 0,
      },
      features: [
        'Water Pressure Monitoring',
        'Humidity Control',
        'Strain Analysis',
        'Crack Detection',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-lg mb-6">
            <span className="text-3xl">🎛️</span>
            <span className="text-white font-bold text-lg">Asset Command Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Welcome back, <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Select an infrastructure asset type to monitor. Each asset provides real-time structural health analysis through digital twin visualization.
          </p>
        </div>

        {/* Asset Type Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {assetTypes.map((item) => (
            <div
              key={item.type}
              onClick={() => handleSelectAssetType(item.type)}
              className="group cursor-pointer relative overflow-hidden"
            >
              {/* Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.type === ASSET_TYPES.BRIDGE ? 'from-blue-500 to-blue-600' : item.type === ASSET_TYPES.BUILDING ? 'from-violet-500 to-violet-600' : 'from-amber-500 to-orange-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative bg-white border-2 border-slate-200 group-hover:border-transparent rounded-3xl p-8 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 bg-gradient-to-br ${item.type === ASSET_TYPES.BRIDGE ? 'from-blue-100 to-blue-200' : item.type === ASSET_TYPES.BUILDING ? 'from-violet-100 to-violet-200' : 'from-amber-100 to-amber-200'} group-hover:scale-110 transition-transform duration-500`}>
                  {item.config.icon}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-white transition-colors duration-300">
                  {item.config.name}
                </h2>
                <p className="text-text-secondary mb-6 group-hover:text-white/80 transition-colors duration-300">
                  {item.config.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-white/20 transition-colors">
                    <p className="text-2xl font-bold text-primary-600 group-hover:text-white">{item.stats.total}</p>
                    <p className="text-xs text-text-muted group-hover:text-white/70">Total</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-white/20 transition-colors">
                    <p className="text-2xl font-bold text-emerald-600 group-hover:text-white">{item.stats.active}</p>
                    <p className="text-xs text-text-muted group-hover:text-white/70">Active</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-white/20 transition-colors">
                    <p className="text-2xl font-bold text-rose-600 group-hover:text-white">{item.stats.critical}</p>
                    <p className="text-xs text-text-muted group-hover:text-white/70">Critical</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary group-hover:text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:bg-white"></span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <div className={`w-full py-4 rounded-xl font-bold text-center bg-gradient-to-r ${item.type === ASSET_TYPES.BRIDGE ? 'from-blue-500 to-blue-600' : item.type === ASSET_TYPES.BUILDING ? 'from-violet-500 to-violet-600' : 'from-amber-500 to-orange-500'} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                    Select {item.config.name} →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            Quick Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all duration-300 text-left"
            >
              <span className="text-2xl mb-2 block">🌉</span>
              <p className="font-bold text-primary-700">Bridge Dashboard</p>
              <p className="text-xs text-primary-600">Legacy view</p>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200 hover:border-secondary-400 hover:shadow-lg transition-all duration-300 text-left"
            >
              <span className="text-2xl mb-2 block">📊</span>
              <p className="font-bold text-secondary-700">Historical Data</p>
              <p className="text-xs text-secondary-600">View past readings</p>
            </button>
            <button
              onClick={() => navigate('/alerts')}
              className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200 hover:border-rose-400 hover:shadow-lg transition-all duration-300 text-left"
            >
              <span className="text-2xl mb-2 block">🔔</span>
              <p className="font-bold text-rose-700">Alerts</p>
              <p className="text-xs text-rose-600">System notifications</p>
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl border border-violet-200 hover:border-violet-400 hover:shadow-lg transition-all duration-300 text-left"
            >
              <span className="text-2xl mb-2 block">⚙️</span>
              <p className="font-bold text-violet-700">Admin Panel</p>
              <p className="text-xs text-violet-600">System management</p>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            🎯 <span className="font-semibold">Smart Infrastructure Platform</span> • 
            Deterministic Simulation Engine Active • 
            Government-Ready Architecture
          </p>
        </div>
      </main>
    </div>
  );
};

export default AssetCommandCenter;
