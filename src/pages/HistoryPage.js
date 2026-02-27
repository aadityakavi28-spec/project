import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sensorDataAPI, bridgesAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';

const HistoryPage = () => {
  const [bridges, setBridges] = useState([]);
  const [selectedBridgeId, setSelectedBridgeId] = useState('');
  const [hours, setHours] = useState(24);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch bridges on mount
  useEffect(() => {
    fetchBridges();
  }, []);

  // Fetch historical data when bridge or hours changes
  useEffect(() => {
    if (selectedBridgeId) {
      fetchHistoricalData();
    }
  }, [selectedBridgeId, hours]);

  const fetchBridges = async () => {
    try {
      const response = await bridgesAPI.getAll();
      setBridges(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedBridgeId(response.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching bridges:', err);
      setError('Failed to load bridges');
    }
  };

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sensorDataAPI.getHistory(selectedBridgeId, hours);
      const data = response.data.data || [];
      
      // Format data for chart
      const formattedData = data.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
        vibration: parseFloat(item.vibration.toFixed(2)),
        load: parseFloat(item.load.toFixed(2)),
        crack: parseFloat(item.crack.toFixed(2)),
        temperature: parseFloat(item.temperature.toFixed(2)),
        riskScore: parseFloat(item.riskScore.toFixed(2)),
      }));
      
      setHistoryData(formattedData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load historical data');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (historyData.length === 0) {
      alert('No data to download');
      return;
    }

    const selectedBridge = bridges.find((b) => b._id === selectedBridgeId);
    const headers = ['Timestamp', 'Vibration', 'Load', 'Crack', 'Temperature', 'Risk Score'];
    
    const csvContent = [
      `Bridge: ${selectedBridge?.name}`,
      `Location: ${selectedBridge?.location}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Time Range: Last ${hours} hours`,
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

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bridge-data-${selectedBridge?.name}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border-b border-blue-500 border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">📈 Historical Data</h1>
          <p className="text-gray-400 text-sm mt-1">View sensor data and trends over time</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Bridge</label>
            <select
              value={selectedBridgeId}
              onChange={(e) => setSelectedBridgeId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-blue-500 border-opacity-30 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Select a bridge --</option>
              {bridges.map((bridge) => (
                <option key={bridge._id} value={bridge._id}>
                  {bridge.name} - {bridge.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-700 border border-blue-500 border-opacity-30 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value={1}>Last 1 hour</option>
              <option value={6}>Last 6 hours</option>
              <option value={12}>Last 12 hours</option>
              <option value={24}>Last 24 hours</option>
              <option value={168}>Last 7 days</option>
              <option value={720}>Last 30 days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={downloadCSV}
              disabled={loading || historyData.length === 0}
              className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Download CSV
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading data...</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {!loading && historyData.length > 0 && (
          <div className="space-y-8">
            {/* Vibration Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Vibration</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="vibration" 
                    stroke="#3b82f6" 
                    dot={false}
                    name="Vibration (m/s²)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Load Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Load Stress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#10b981" 
                    dot={false}
                    name="Load Stress (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Crack Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Crack Width</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="crack" 
                    stroke="#f59e0b" 
                    dot={false}
                    name="Crack Width (mm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Temperature</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    dot={false}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Score Chart */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Risk Score</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="rgba(209, 213, 219, 0.5)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(209, 213, 219, 0.5)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="riskScore" 
                    stroke="#a855f7" 
                    dot={false}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Data Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Records</p>
                <p className="text-2xl font-bold text-white">{historyData.length}</p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Avg Vibration</p>
                <p className="text-2xl font-bold text-blue-400">
                  {(historyData.reduce((sum, d) => sum + d.vibration, 0) / historyData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Avg Load</p>
                <p className="text-2xl font-bold text-green-400">
                  {(historyData.reduce((sum, d) => sum + d.load, 0) / historyData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Max Risk</p>
                <p className="text-2xl font-bold text-red-400">
                  {Math.max(...historyData.map((d) => d.riskScore)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && historyData.length === 0 && selectedBridgeId && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No historical data available for this bridge</p>
          </div>
        )}

        {!selectedBridgeId && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Please select a bridge to view historical data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
