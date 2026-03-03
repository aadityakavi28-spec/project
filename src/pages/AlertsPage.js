// ============================================================
// ENHANCED ALERTS PAGE
// Real-time Alert Monitoring & Management System
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsset } from '../context/AssetContext';
import { ASSET_TYPES, ASSET_TYPE_CONFIG, getRiskLevel } from '../utils/assetTypes';
import Navbar from '../components/Navbar';
import Model3DController from '../components/Model3DController';

const AlertsPage = () => {
  const navigate = useNavigate();
  const { assetType, selectedAsset, riskScore, sensorData, demoAlerts, initializeAsset } = useAsset();

  // State
  const [activeTab, setActiveTab] = useState('live');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showResolved, setShowResolved] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Initialize with default asset
  useEffect(() => {
    if (!assetType) {
      initializeAsset(ASSET_TYPES.BRIDGE, {
        id: 'bridge-1',
        name: 'Golden Gate Bridge',
        location: 'San Francisco, CA',
        status: 'active'
      });
    }
  }, [assetType, initializeAsset]);

  // Generate real-time mock alerts based on risk score
  const realTimeAlerts = useMemo(() => {
    const alerts = [];
    const now = Date.now();

    // Generate alerts based on current risk score
    if (riskScore > 75) {
      alerts.push({
        id: 'critical-1',
        severity: 'critical',
        title: 'Critical Structural Risk',
        message: 'Vibration levels exceeded critical threshold. Immediate inspection required.',
        timestamp: new Date(now - 5 * 60000).toISOString(),
        asset: selectedAsset?.name || 'Golden Gate Bridge',
        sensor: 'Vibration',
        value: (sensorData?.vibration || 0).toFixed(2),
        unit: 'm/s²',
        resolved: false
      });
    }

    if (riskScore > 50) {
      alerts.push({
        id: 'high-1',
        severity: 'high',
        title: 'High Load Detected',
        message: 'Load stress approaching maximum capacity. Monitor closely.',
        timestamp: new Date(now - 15 * 60000).toISOString(),
        asset: selectedAsset?.name || 'Golden Gate Bridge',
        sensor: 'Load Stress',
        value: (sensorData?.load || 0).toFixed(2),
        unit: 'MN',
        resolved: false
      });
    }

    // Add some additional demo alerts
    alerts.push(
      {
        id: 'medium-1',
        severity: 'medium',
        title: 'Temperature Fluctuation',
        message: 'Unusual temperature patterns detected. Check thermal sensors.',
        timestamp: new Date(now - 45 * 60000).toISOString(),
        asset: selectedAsset?.name || 'Golden Gate Bridge',
        sensor: 'Temperature',
        value: (sensorData?.temperature || 0).toFixed(2),
        unit: '°C',
        resolved: false
      },
      {
        id: 'low-1',
        severity: 'low',
        title: 'Routine Check Reminder',
        message: 'Scheduled maintenance check due in 24 hours.',
        timestamp: new Date(now - 2 * 3600000).toISOString(),
        asset: selectedAsset?.name || 'Golden Gate Bridge',
        sensor: 'System',
        value: '24h',
        unit: '',
        resolved: false
      },
      {
        id: 'info-1',
        severity: 'low',
        title: 'Data Synchronization Complete',
        message: 'All sensor data synchronized successfully.',
        timestamp: new Date(now - 30 * 60000).toISOString(),
        asset: selectedAsset?.name || 'Golden Gate Bridge',
        sensor: 'System',
        value: '100%',
        unit: '',
        resolved: true
      }
    );

    // Add demo alerts from context
    if (demoAlerts && demoAlerts.length > 0) {
      demoAlerts.forEach((alert, idx) => {
        alerts.push({
          id: `demo-${idx}`,
          severity: alert.severity,
          title: alert.severity === 'critical' ? 'Critical Alert' : 'Warning',
          message: alert.message,
          timestamp: alert.timestamp,
          asset: selectedAsset?.name || 'Golden Gate Bridge',
          sensor: 'Multiple',
          value: riskScore?.toFixed(0) || '0',
          unit: '',
          resolved: false
        });
      });
    }

    return alerts;
  }, [riskScore, selectedAsset, demoAlerts, sensorData]);

  // Filter alerts
  const filteredAlerts = realTimeAlerts.filter(alert => {
    if (!showResolved && alert.resolved) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

  // Statistics
  const stats = useMemo(() => {
    const total = realTimeAlerts.length;
    const critical = realTimeAlerts.filter(a => a.severity === 'critical' && !a.resolved).length;
    const high = realTimeAlerts.filter(a => a.severity === 'high' && !a.resolved).length;
    const medium = realTimeAlerts.filter(a => a.severity === 'medium' && !a.resolved).length;
    const low = realTimeAlerts.filter(a => a.severity === 'low' && !a.resolved).length;
    const resolved = realTimeAlerts.filter(a => a.resolved).length;

    return { total, critical, high, medium, low, resolved };
  }, [realTimeAlerts]);

  // Get severity colors
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-500/20',
          border: 'border-rose-500/30',
          text: 'text-rose-400',
          icon: '🚨',
          glow: 'shadow-rose-500/20'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/20',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          icon: '⚠️',
          glow: 'shadow-orange-500/20'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          icon: '🔔',
          glow: 'shadow-amber-500/20'
        };
      default:
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          icon: 'ℹ️',
          glow: 'shadow-emerald-500/20'
        };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🚨</span>
              Alert Center
            </h1>
            <p className="text-slate-400 mt-1">
              Real-time structural health monitoring alerts and notifications
            </p>
          </div>

          {/* Sound Toggle & Refresh */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-xl transition-all ${
                soundEnabled 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
              🔄 Auto-refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📊</span>
              <p className="text-xs text-slate-400">Total</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🚨</span>
              <p className="text-xs text-rose-400">Critical</p>
            </div>
            <p className="text-2xl font-bold text-rose-400">{stats.critical}</p>
          </div>
          <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <p className="text-xs text-orange-400">High</p>
            </div>
            <p className="text-2xl font-bold text-orange-400">{stats.high}</p>
          </div>
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔔</span>
              <p className="text-xs text-amber-400">Medium</p>
            </div>
            <p className="text-2xl font-bold text-amber-400">{stats.medium}</p>
          </div>
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✅</span>
              <p className="text-xs text-emerald-400">Resolved</p>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.resolved}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'live', label: '📡 Live Alerts', count: stats.critical + stats.high + stats.medium },
            { id: 'history', label: '📜 History', count: stats.resolved },
            { id: '3d', label: '🎮 3D View', count: 0 },
            { id: 'settings', label: '⚙️ Settings', count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab.tab === tab.id ? 'bg-white/20' : 'bg-rose-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* LIVE ALERTS TAB */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-2"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Only</option>
                <option value="medium">Medium Only</option>
                <option value="low">Low Only</option>
              </select>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showResolved}
                  onChange={(e) => setShowResolved(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600"
                />
                Show Resolved
              </label>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => {
                  const config = getSeverityConfig(alert.severity);
                  return (
                    <div
                      key={alert.id}
                      className={`relative p-5 rounded-2xl border ${config.bg} ${config.border} ${
                        alert.resolved ? 'opacity-60' : ''
                      } transition-all hover:scale-[1.01]`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`text-3xl ${alert.resolved ? 'opacity-50' : ''}`}>
                          {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`font-bold ${config.text}`}>{alert.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${config.bg} ${config.text}`}>
                              {alert.severity}
                            </span>
                            {alert.resolved && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                Resolved
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{alert.message}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span>📍 {alert.asset}</span>
                            <span>📊 {alert.sensor}: {alert.value}{alert.unit}</span>
                            <span>⏰ {formatTimeAgo(alert.timestamp)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {!alert.resolved ? (
                            <button
                              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                            >
                              ✓ Resolved
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate('/dashboard')}
                              className="px-4 py-2 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Animated border for critical alerts */}
                      {!alert.resolved && alert.severity === 'critical' && (
                        <div className="absolute inset-0 rounded-2xl animate-pulse border-2 border-rose-500/50 pointer-events-none"></div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-white mb-2">All Clear!</h3>
                  <p className="text-slate-400">No active alerts at this time</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Alert History</h3>
            <div className="space-y-3">
              {realTimeAlerts.filter(a => a.resolved).map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                  <span className="text-2xl">✅</span>
                  <div className="flex-1">
                    <p className="text-slate-300">{alert.title}</p>
                    <p className="text-xs text-slate-500">{alert.asset} • {formatTimeAgo(alert.timestamp)}</p>
                  </div>
                  <span className="text-emerald-400 text-sm">Resolved</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3D VIEW TAB */}
        {activeTab === '3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50" style={{ height: '500px' }}>
                <Model3DController showHighlights={true} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="font-bold text-white mb-3">Active Alerts on Model</h4>
                <div className="space-y-2">
                  {filteredAlerts.filter(a => !a.resolved).slice(0, 3).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg ${getSeverityConfig(alert.severity).bg} border ${getSeverityConfig(alert.severity).border}`}>
                      <p className={`text-sm font-medium ${getSeverityConfig(alert.severity).text}`}>{alert.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{alert.sensor}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="font-bold text-white mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button onClick={() => navigate('/dashboard')} className="w-full py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    Go to Dashboard
                  </button>
                  <button onClick={() => navigate('/history')} className="w-full py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6">Alert Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Critical Alerts</p>
                    <p className="text-sm text-slate-400">Show alerts for risk score above 75</p>
                  </div>
                  <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Sound Notifications</p>
                    <p className="text-sm text-slate-400">Play sound for new alerts</p>
                  </div>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-cyan-500' : 'bg-slate-600'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${soundEnabled ? 'right-1' : 'left-1'}`}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-400">Receive email for critical alerts</p>
                  </div>
                  <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Auto-refresh</p>
                    <p className="text-sm text-slate-400">Automatically refresh alerts every 30s</p>
                  </div>
                  <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlertsPage;

