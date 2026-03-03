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
      stats: { total: 4, active: 4, critical: 0 },
      features: ['Vibration Monitoring', 'Load Stress Analysis', 'Crack Detection', 'Thermal Monitoring'],
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan',
    },
    {
      type: ASSET_TYPES.BUILDING,
      config: ASSET_TYPE_CONFIG[ASSET_TYPES.BUILDING],
      stats: { total: 3, active: 3, critical: 0 },
      features: ['Tilt Detection', 'Displacement Tracking', 'Structural Crack Analysis', 'Seismic Vibration'],
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple',
    },
    {
      type: ASSET_TYPES.TUNNEL,
      config: ASSET_TYPE_CONFIG[ASSET_TYPES.TUNNEL],
      stats: { total: 3, active: 3, critical: 0 },
      features: ['Water Pressure Monitoring', 'Humidity Control', 'Strain Analysis', 'Crack Detection'],
      gradient: 'from-lime-500 to-emerald-500',
      glow: 'shadow-lime',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-card border-neon-cyan/30 mb-6">
            <span className="text-2xl">🎛️</span>
            <span className="text-neon-cyan font-bold text-lg">Asset Command Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Welcome back, <span className="text-gradient-neon">{user?.name}</span>
          </h1>
          <p className="text-xl text-dark-400 max-w-2xl mx-auto">
            Select an infrastructure asset type to monitor. Each asset provides real-time structural health analysis through digital twin visualization.
          </p>
        </div>

        {/* Asset Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {assetTypes.map((item) => (
            <div key={item.type} onClick={() => handleSelectAssetType(item.type)} className="group cursor-pointer">
              <div className="relative h-full">
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
                <div className="relative glass-card-hover h-full p-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-4xl mb-6 shadow-${item.glow}`}>
                    {item.config.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{item.config.name}</h2>
                  <p className="text-dark-400 mb-6">{item.config.description}</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 glass-card">
                      <p className="text-2xl font-bold text-white">{item.stats.total}</p>
                      <p className="text-xs text-dark-500">Total</p>
                    </div>
                    <div className="text-center p-3 glass-card">
                      <p className="text-2xl font-bold text-neon-cyan">{item.stats.active}</p>
                      <p className="text-xs text-dark-500">Active</p>
                    </div>
                    <div className="text-center p-3 glass-card">
                      <p className="text-2xl font-bold text-rose-500">{item.stats.critical}</p>
                      <p className="text-xs text-dark-500">Critical</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-dark-400">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.gradient}`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className={`w-full py-4 rounded-xl font-bold text-center bg-gradient-to-r ${item.gradient} text-dark-900 shadow-lg group-hover:shadow-${item.glow} transition-all duration-300 group-hover:scale-105`}>
                    Select {item.config.name} →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">⚡</span>Quick Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-4 glass-card-hover text-left group">
              <span className="text-3xl mb-3 block">🌉</span>
              <p className="font-bold text-white group-hover:text-neon-cyan">Bridge Dashboard</p>
              <p className="text-xs text-dark-500">Legacy view</p>
            </button>
            <button onClick={() => navigate('/history')} className="p-4 glass-card-hover text-left group">
              <span className="text-3xl mb-3 block">📊</span>
              <p className="font-bold text-white group-hover:text-neon-purple">Historical Data</p>
              <p className="text-xs text-dark-500">View past readings</p>
            </button>
            <button onClick={() => navigate('/alerts')} className="p-4 glass-card-hover text-left group">
              <span className="text-3xl mb-3 block">🔔</span>
              <p className="font-bold text-white group-hover:text-rose-500">Alerts</p>
              <p className="text-xs text-dark-500">Notifications</p>
            </button>
            <button onClick={() => navigate('/admin')} className="p-4 glass-card-hover text-left group">
              <span className="text-3xl mb-3 block">⚙️</span>
              <p className="font-bold text-white group-hover:text-neon-lime">Admin Panel</p>
              <p className="text-xs text-dark-500">Management</p>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-dark-500">
            🎯 <span className="text-gradient-neon font-semibold">StructuraX</span> • 
            Deterministic Simulation Engine Active • 
            Enterprise-Ready Architecture
          </p>
        </div>
      </main>
    </div>
  );
};

export default AssetCommandCenter;

