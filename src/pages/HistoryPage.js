import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../utils/AuthContext';
import { assetApi } from '../utils/assetApi';
import Navbar from '../components/Navbar';
import BridgeModel from '../components/BridgeModel';

const HistoryPage = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('bridge');
  const [hours, setHours] = useState(24);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestData, setLatestData] = useState(null);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCustomRange, setShowCustomRange] = useState(false);
  const { isAdmin } = useAuth();
  const simRef = useRef(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (selectedAssetId) {
      fetchHistoricalData();
      fetchLatestData();
    }
    return () => stopSimulation();
  }, [selectedAssetId, hours, selectedAssetType]);

  const fetchAssets = async () => {
    try {
      const response = await assetApi.getAssets();
      setAssets(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedAssetId(response.data[0]._id);
        setSelectedAssetType(response.data[0].type || 'bridge');
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
      // Use mock data if API fails
      setAssets([
        { _id: 'bridge-1', name: 'Golden Gate Bridge', type: 'bridge', location: 'San Francisco, CA' },
        { _id: 'bridge-2', name: 'Brooklyn Bridge', type: 'bridge', location: 'New York, NY' },
      ]);
      setSelectedAssetId('bridge-1');
    }
  };

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await assetApi.getHistoricalData(selectedAssetId, showCustomRange ? undefined : hours);
      const data = response.data || [];
      
      // Filter by custom date range if selected
      let filteredData = data;
      if (showCustomRange && customDateRange.start && customDateRange.end) {
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        filteredData = data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      const formattedData = filteredData.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
        vibration: parseFloat(item.vibration?.toFixed(2) || 0),
        load: parseFloat(item.load?.toFixed(2) || 0),
        crack: parseFloat(item.crack?.toFixed(2) || 0),
        temperature: parseFloat(item.temperature?.toFixed(2) || 0),
        riskScore: parseFloat(item.riskScore?.toFixed(2) || 0),
      }));
      
      setHistoryData(formattedData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load historical data');
      // Generate mock data for demo
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const data = [];
    const points = hours <= 24 ? hours * 4 : 48;
    const now = new Date();
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      data.push({
        timestamp: time.toLocaleTimeString(),
        vibration: 10 + Math.random() * 20,
        load: 20 + Math.random() * 30,
        crack: 2 + Math.random() * 8,
        temperature: 18 + Math.random() * 10,
        riskScore: 20 + Math.random() * 40,
      });
    }
    setHistoryData(data);
  };

  const fetchLatestData = async () => {
    try {
      if (!selectedAssetId) return;
      const res = await assetApi.getLatestData(selectedAssetId);
      if (res.data) {
        setLatestData(res.data.sensors);
      }
    } catch (err) {
      console.error('Error fetching latest data:', err);
      // Use mock data
      setLatestData({
        vibration: 15.5,
        load: 35.2,
        crack: 5.3,
        temperature: 22.1,
        riskScore: 25.8,
      });
    }
  };

  const handleAssetChange = (assetId) => {
    setSelectedAssetId(assetId);
    const asset = assets.find(a => a._id === assetId);
    if (asset) {
      setSelectedAssetType(asset.type || 'bridge');
    }
  };

  const downloadCSV = () => {
    if (historyData.length === 0) {
      alert('No data to download');
      return;
    }

    const selectedAsset = assets.find(a => a._id === selectedAssetId);
    const headers = ['Timestamp', 'Vibration', 'Load', 'Crack', 'Temperature', 'Risk Score'];
    
    const csvContent = [
      `Asset: ${selectedAsset?.name || 'Unknown'}`,
      `Location: ${selectedAsset?.location || 'N/A'}`,
      `Type: ${selectedAsset?.type || 'bridge'}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Time Range: ${showCustomRange && customDateRange.start ? `${customDateRange.start} to ${customDateRange.end}` : `Last ${hours} hours`}`,
      '',
      headers.join(','),
      ...historyData.map((row) =>
        [
          row.timestamp,
          row.vibration,
          row.load,
          row.crack,
          row.temperature,
          row.riskScore,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `asset-data-${selectedAsset?.name || 'data'}-${new Date().toISOString().split('T')[0]}.csv`;
    link.download = filename.replace(/\s+/g, '-').toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Placeholder functions for simulation (removed for clean implementation)
  const stopSimulation = () => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="card-professional p-6 mb-6 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-3xl">📈</span>
                <span>Historical Data & Analytics</span>
              </h1>
              <p className="text-text-secondary mt-1">View sensor data trends and patterns over time</p>
            </div>
            {isAdmin && (
              <span className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-sm font-bold">
                ⚡ Admin Access
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Asset Selector */}
          <div className="card-elevated border-2 border-slate-200 p-4 rounded-xl">
            <label className="block text-sm font-bold text-primary-600 mb-3">Select Asset</label>
            <select
              value={selectedAssetId}
              onChange={(e) => handleAssetChange(e.target.value)}
              className="input-modern"
            >
              <option value="">-- Select an asset --</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id} className="bg-white">
                  {asset.name} ({asset.type})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div className="card-elevated border-2 border-slate-200 p-4 rounded-xl">
            <label className="block text-sm font-bold text-primary-600 mb-3">Time Range</label>
            <select
              value={showCustomRange ? 'custom' : hours}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setShowCustomRange(true);
                } else {
                  setShowCustomRange(false);
                  setHours(Number(e.target.value));
                }
              }}
              className="input-modern"
            >
              <option value={1}>Last 1 hour</option>
              <option value={6}>Last 6 hours</option>
              <option value={12}>Last 12 hours</option>
              <option value={24}>Last 24 hours</option>
              <option value={168}>Last 7 days</option>
              <option value={720}>Last 30 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {showCustomRange && (
            <div className="card-elevated border-2 border-slate-200 p-4 rounded-xl">
              <label className="block text-sm font-bold text-primary-600 mb-3">Custom Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="input-modern text-sm"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="input-modern text-sm"
                />
              </div>
            </div>
          )}

          {/* Download Button */}
          <div className="flex items-end">
            <button
              onClick={downloadCSV}
              disabled={loading || historyData.length === 0}
              className="w-full btn-primary disabled:opacity-50"
            >
              📥 Download CSV
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-text-secondary font-medium">Loading historical data...</p>
            </div>
          </div>
        )}

        {/* 3D Model & Latest Values */}
        {!loading && selectedAssetId && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary mb-2">3D Bridge Model</h3>
                <div style={{ height: 300 }}>
                  <BridgeModel
                    riskScore={latestData?.riskScore || 25}
                    vibration={latestData?.vibration || 15}
                    load={latestData?.load || 35}
                    crack={latestData?.crack || 5}
                    temperature={latestData?.temperature || 22}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Latest Values</h3>
                {latestData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-muted text-sm">Vibration</span>
                      <span className="font-bold text-primary-600">{latestData.vibration?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted text-sm">Load</span>
                      <span className="font-bold text-emerald-600">{latestData.load?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted text-sm">Crack</span>
                      <span className="font-bold text-amber-600">{latestData.crack?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted text-sm">Temperature</span>
                      <span className="font-bold text-rose-600">{latestData.temperature?.toFixed(2)}°C</span>
                    </div>
                    <hr className="border-slate-100" />
                    <div className="flex justify-between">
                      <span className="text-text-muted text-sm">Risk Score</span>
                      <span className="font-bold text-violet-600">{latestData.riskScore?.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No latest data available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {!loading && historyData.length > 0 && (
          <div className="space-y-6">
            {/* Vibration Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Vibration Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="vibration" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Vibration (m/s²)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Load Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Load Stress Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="load" stroke="#10b981" strokeWidth={2} dot={false} name="Load Stress (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Crack Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Crack Width Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="crack" stroke="#f59e0b" strokeWidth={2} dot={false} name="Crack Width (mm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Score Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Risk Score Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="riskScore" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Risk Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-text-muted text-xs mb-1">Total Records</p>
                <p className="text-2xl font-bold text-text-primary">{historyData.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-text-muted text-xs mb-1">Avg Vibration</p>
                <p className="text-2xl font-bold text-primary-600">
                  {(historyData.reduce((sum, d) => sum + d.vibration, 0) / historyData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-text-muted text-xs mb-1">Avg Risk</p>
                <p className="text-2xl font-bold text-violet-600">
                  {(historyData.reduce((sum, d) => sum + d.riskScore, 0) / historyData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="text-text-muted text-xs mb-1">Max Risk</p>
                <p className="text-2xl font-bold text-rose-600">
                  {Math.max(...historyData.map((d) => d.riskScore)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && historyData.length === 0 && selectedAssetId && (
          <div className="card-professional p-12 text-center border-2 border-slate-200">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-text-primary font-semibold text-lg">No Historical Data Available</p>
            <p className="text-text-muted">Select a different time range or asset</p>
          </div>
        )}

        {!selectedAssetId && (
          <div className="card-professional p-12 text-center border-2 border-slate-200">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-text-primary font-semibold text-lg">Select an Asset</p>
            <p className="text-text-muted">Choose an asset from the dropdown to view historical data</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
