import React, { useState, useEffect } from 'react';
import { alertsAPI, bridgesAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';

const AlertsPage = () => {
  const [bridges, setBridges] = useState([]);
  const [selectedBridgeId, setSelectedBridgeId] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch bridges on mount
  useEffect(() => {
    fetchBridges();
  }, []);

  // Fetch alerts when bridge or showResolved changes
  useEffect(() => {
    if (selectedBridgeId) {
      fetchAlerts();
    }
  }, [selectedBridgeId, showResolved]);

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

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await alertsAPI.getAlerts(selectedBridgeId, showResolved);
      setAlerts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 bg-opacity-20 border-red-500';
      case 'high':
        return 'bg-orange-500 bg-opacity-20 border-orange-500';
      case 'medium':
        return 'bg-yellow-500 bg-opacity-20 border-yellow-500';
      default:
        return 'bg-blue-500 bg-opacity-20 border-blue-500';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return '🔴 Critical';
      case 'high':
        return '🟠 High';
      case 'medium':
        return '🟡 Medium';
      default:
        return '🔵 Low';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border-b border-blue-500 border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">🚨 System Alerts</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor and manage system alerts</p>
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

          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-700 border-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">Show Resolved Alerts</span>
            </label>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={fetchAlerts}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {selectedBridgeId && alerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Alerts</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
            </div>
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-red-500 border-opacity-30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-400">
                {alerts.filter((a) => a.severity === 'critical').length}
              </p>
            </div>
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-orange-500 border-opacity-30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">High</p>
              <p className="text-2xl font-bold text-orange-400">
                {alerts.filter((a) => a.severity === 'high').length}
              </p>
            </div>
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-yellow-500 border-opacity-30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Unresolved</p>
              <p className="text-2xl font-bold text-yellow-400">
                {alerts.filter((a) => !a.resolved).length}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading alerts...</p>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {!loading && selectedBridgeId && (
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`border rounded-lg p-6 backdrop-blur-sm ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-semibold">{getSeverityBadge(alert.severity)}</span>
                        <span className="text-sm px-2 py-1 bg-black bg-opacity-30 rounded">
                          {alert.type}
                        </span>
                        {alert.resolved && (
                          <span className="text-sm px-2 py-1 bg-green-500 bg-opacity-20 rounded text-green-400">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-white font-medium mb-2">{alert.message}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-400">Value</p>
                          <p className="text-white font-semibold">{alert.value?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Risk Score</p>
                          <p className="text-white font-semibold">{alert.riskScore?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Created</p>
                          <p className="text-white font-semibold text-xs">{formatDate(alert.createdAt)}</p>
                        </div>
                        {alert.resolved && alert.resolvedAt && (
                          <div>
                            <p className="text-gray-400">Resolved</p>
                            <p className="text-white font-semibold text-xs">{formatDate(alert.resolvedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg">
                <p className="text-gray-400 text-lg">No alerts found</p>
                <p className="text-gray-500 text-sm mt-2">All systems operating normally</p>
              </div>
            )}
          </div>
        )}

        {!selectedBridgeId && (
          <div className="text-center py-12 bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg">
            <p className="text-gray-400 text-lg">Please select a bridge to view alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
