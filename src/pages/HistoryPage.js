// ============================================================
// ENHANCED HISTORY PAGE
// Advanced Analytics & Historical Trends Dashboard
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useAsset } from '../context/AssetContext';
import { ASSET_TYPES, ASSET_TYPE_CONFIG, getRiskLevel } from '../utils/assetTypes';
import Navbar from '../components/Navbar';
import Model3DController, { StressLegendPanel } from '../components/Model3DController';

const HistoryPage = () => {
  const { assetType, selectedAsset, sensorData, riskScore, chartData, initializeAsset } = useAsset();

  // State
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedSensor, setSelectedSensor] = useState('vibration');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Initialize with default asset if none selected
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

  // Generate mock historical data based on current sensor data
  const generateHistoricalData = useMemo(() => {
    const data = [];
    const points = timeRange === '1h' ? 12 : timeRange === '6h' ? 36 : timeRange === '24h' ? 48 : 60;
    const now = Date.now();
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now - (i * 60 * 60 * 1000));
      const baseVibration = sensorData.vibration || 15;
      const baseLoad = sensorData.load || 35;
      const baseCrack = sensorData.crack || 5;
      const baseTemp = sensorData.temperature || 22;
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: time.toLocaleDateString(),
        timestamp: time.getTime(),
        vibration: baseVibration + (Math.random() - 0.5) * 20,
        load: baseLoad + (Math.random() - 0.5) * 30,
        crack: baseCrack + (Math.random() - 0.5) * 3,
        temperature: baseTemp + (Math.random() - 0.5) * 8,
        riskScore: riskScore + (Math.random() - 0.5) * 20,
      });
    }
    return data;
  }, [timeRange, sensorData, riskScore]);

  // Statistics calculations
  const stats = useMemo(() => {
    const data = generateHistoricalData;
    if (data.length === 0) return null;

    const values = data.map(d => d[selectedSensor]);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const change = values[values.length - 1] - values[0];

    return { avg, min, max, change, dataLength: data.length };
  }, [generateHistoricalData, selectedSensor]);

  // Risk distribution for pie chart
  const riskDistribution = useMemo(() => {
    const data = generateHistoricalData;
    const low = data.filter(d => d.riskScore < 25).length;
    const medium = data.filter(d => d.riskScore >= 25 && d.riskScore < 50).length;
    const high = data.filter(d => d.riskScore >= 50 && d.riskScore < 75).length;
    const critical = data.filter(d => d.riskScore >= 75).length;

    return [
      { name: 'Low Risk', value: low, color: '#10b981' },
      { name: 'Monitor', value: medium, color: '#eab308' },
      { name: 'Warning', value: high, color: '#f97316' },
      { name: 'Critical', value: critical, color: '#ef4444' },
    ];
  }, [generateHistoricalData]);

  // Sensor options
  const getSensorOptions = () => {
    if (!assetType) return [];
    const config = ASSET_TYPE_CONFIG[assetType];
    return Object.entries(config?.sensors || {}).map(([key, val]) => ({
      id: key,
      name: val.name,
      unit: val.unit,
      icon: val.icon
    }));
  };

  const sensorOptions = getSensorOptions();
  const config = ASSET_TYPE_CONFIG[assetType];

  // Colors for charts
  const chartColors = {
    vibration: '#0ea5e9',
    load: '#10b981',
    crack: '#f59e0b',
    temperature: '#ef4444',
    riskScore: '#8b5cf6',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Historical Analytics
            </h1>
            <p className="text-slate-400 mt-1">
              Advanced trend analysis and pattern recognition for structural health monitoring
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {range === '1h' ? '1 Hour' : range === '6h' ? '6 Hours' : range === '24h' ? '24 Hours' : '7 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'trends', label: '📈 Trends', icon: '📈' },
            { id: 'analysis', label: '🔬 Analysis', icon: '🔬' },
            { id: '3d', label: '🎮 3D Model', icon: '🎮' },
            { id: 'export', label: '📤 Export', icon: '📤' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TRENDS TAB */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Sensor Selector & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sensor Dropdown */}
              <div className="lg:col-span-1 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <label className="block text-sm font-bold text-slate-300 mb-3">Select Metric</label>
                <div className="space-y-2">
                  {sensorOptions.map((sensor) => (
                    <button
                      key={sensor.id}
                      onClick={() => setSelectedSensor(sensor.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        selectedSensor === sensor.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white'
                          : 'bg-slate-700/30 text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-xl">{sensor.icon}</span>
                      <span className="font-medium">{sensor.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Average</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {stats?.avg?.toFixed(2)}
                    <span className="text-sm text-slate-400 ml-1">{sensorOptions.find(s => s.id === selectedSensor)?.unit}</span>
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Minimum</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stats?.min?.toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Maximum</p>
                  <p className="text-2xl font-bold text-rose-400">
                    {stats?.max?.toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Change</p>
                  <p className={`text-2xl font-bold ${stats?.change >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {stats?.change >= 0 ? '↑' : '↓'} {Math.abs(stats?.change || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Trend Chart */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400">📈</span>
                  {sensorOptions.find(s => s.id === selectedSensor)?.name} Over Time
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                  >
                    {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={generateHistoricalData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors[selectedSensor] || '#0ea5e9'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColors[selectedSensor] || '#0ea5e9'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey={selectedSensor} 
                    stroke={chartColors[selectedSensor] || '#0ea5e9'} 
                    fillOpacity={1} 
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                    name={sensorOptions.find(s => s.id === selectedSensor)?.name}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Multi-Line Chart */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-400">📊</span>
                All Metrics Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="vibration" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Vibration" />
                  <Line type="monotone" dataKey="load" stroke="#10b981" strokeWidth={2} dot={false} name="Load" />
                  <Line type="monotone" dataKey="crack" stroke="#f59e0b" strokeWidth={2} dot={false} name="Crack" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution Pie Chart */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-rose-400">🎯</span>
                Risk Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Hourly Comparison */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">📊</span>
                Peak Values Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={generateHistoricalData.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="vibration" fill="#0ea5e9" name="Vibration" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="load" fill="#10b981" name="Load" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Health Score Trend */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">💚</span>
                Structural Health Score Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={generateHistoricalData}>
                  <defs>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="riskScore" 
                    stroke="#10b981" 
                    fill="url(#healthGradient)" 
                    strokeWidth={2}
                    name="Health Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3D MODEL TAB */}
        {activeTab === '3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50" style={{ height: '500px' }}>
                <Model3DController showHighlights={true} enableRotation={true} />
              </div>
            </div>
            <div className="space-y-4">
              <StressLegendPanel showHighlights={true} />
              
              {/* Model Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-300 mb-3">3D Controls</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>🖱️ <strong className="text-white">Click + Drag</strong> - Rotate Model</p>
                  <p>🔍 <strong className="text-white">Scroll</strong> - Zoom In/Out</p>
                  <p>👆 <strong className="text-white">Right Click + Drag</strong> - Pan View</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-300 mb-3">Current Readings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vibration</span>
                    <span className="text-cyan-400 font-bold">{(sensorData.vibration || 0).toFixed(2)} m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Load</span>
                    <span className="text-emerald-400 font-bold">{(sensorData.load || 0).toFixed(2)} MN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Crack</span>
                    <span className="text-amber-400 font-bold">{(sensorData.crack || 0).toFixed(2)} mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT TAB */}
        {activeTab === 'export' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-cyan-400">📤</span>
                Export Historical Data
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <h4 className="font-bold text-white mb-2">Export Format</h4>
                  <p className="text-sm text-slate-400">Choose your preferred data format for export</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 transition-all text-left">
                    <span className="text-2xl mb-2 block">📄</span>
                    <p className="font-bold text-white">CSV</p>
                    <p className="text-xs text-slate-400">Comma-separated values</p>
                  </button>
                  
                  <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all text-left">
                    <span className="text-2xl mb-2 block">📋</span>
                    <p className="font-bold text-white">JSON</p>
                    <p className="text-xs text-slate-400">JavaScript Object Notation</p>
                  </button>

                  <button className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl hover:from-emerald-500/30 hover:to-teal-500/30 transition-all text-left">
                    <span className="text-2xl mb-2 block">📑</span>
                    <p className="font-bold text-white">PDF Report</p>
                    <p className="text-xs text-slate-400">Full analysis report</p>
                  </button>

                  <button className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl hover:from-amber-500/30 hover:to-orange-500/30 transition-all text-left">
                    <span className="text-2xl mb-2 block">🖼️</span>
                    <p className="font-bold text-white">Screenshot</p>
                    <p className="text-xs text-slate-400">PNG image export</p>
                  </button>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all mt-4">
                  📥 Download {timeRange} Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;

