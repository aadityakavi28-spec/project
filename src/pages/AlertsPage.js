import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { assetApi } from '../utils/assetApi';
import Navbar from '../components/Navbar';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, resolved
  const [severityFilter, setSeverityFilter] = useState('all');
  const [resolvingId, setResolvingId] = useState(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchAlerts();
  }, [filter, severityFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      // For now, fetch alerts from all assets using assetApi
      // In a real implementation, there would be an admin endpoint
      const resolved = filter === 'resolved' ? true : filter === 'active' ? false : null;
      
      // Get assets and their alerts
      const response = await assetApi.getAssets();
      const assets = response.data || [];
      
      const allAlerts = [];
      for (const asset of assets.slice(0, 5)) { // Limit for performance
        try {
          const alertResponse = await assetApi.getAlerts(asset._id, resolved);
          const assetAlerts = alertResponse.data || [];
          assetAlerts.forEach(alert => {
            allAlerts.push({
              ...alert,
              assetName: asset.name,
              assetType: asset.type,
            });
          });
        } catch (e) {
          // Skip errors for individual assets
        }
      }
      
      // Sort by createdAt descending
      allAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Apply severity filter
      let filtered = allAlerts;
      if (severityFilter !== 'all') {
        filtered = filtered.filter(a => a.severity === severityFilter);
      }
      
      setAlerts(filtered);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (alertId) => {
    if (!isAdmin) return;
    
    setResolvingId(alertId);
    try {
      // In a real implementation, this would call an API
      // For now, we'll update locally
      setAlerts(prev => prev.map(alert => 
        alert._id === alertId 
          ? { ...alert, resolved: true, resolvedAt: new Date().toISOString() }
          : alert
      ));
    } catch (err) {
      console.error('Error resolving alert:', err);
      setError('Failed to resolve alert');
    } finally {
      setResolvingId(null);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical': return { label: 'Critical', color: 'text-rose-600', bg: 'bg-rose-100', dot: 'bg-rose-500' };
      case 'high': return { label: 'High', color: 'text-orange-600', bg: 'bg-orange-100', dot: 'bg-orange-500' };
      case 'medium': return { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500' };
      default: return { label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Filter counts
  const activeCount = alerts.filter(a => !a.resolved).length;
  const resolvedCount = alerts.filter(a => a.resolved).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="card-professional p-6 mb-6 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-3xl">🚨</span>
                <span>Alert Management</span>
              </h1>
              <p className="text-text-secondary mt-1">Monitor and resolve system alerts</p>
            </div>
            {isAdmin && (
              <span className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-sm font-bold">
                ⚡ Admin Access
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Status Filter */}
          <div className="flex bg-white rounded-xl border-2 border-slate-200 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-primary-500 text-white' : 'text-text-secondary hover:bg-slate-50'
              }`}
            >
              All ({activeCount + resolvedCount})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'active' ? 'bg-rose-500 text-white' : 'text-text-secondary hover:bg-slate-50'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'resolved' ? 'bg-emerald-500 text-white' : 'text-text-secondary hover:bg-slate-50'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="input-modern"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            🔄 Refresh
          </button>
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
              <p className="text-text-secondary font-medium">Loading alerts...</p>
            </div>
          </div>
        )}

        {/* Alerts Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => {
                      const badge = getSeverityBadge(alert.severity);
                      return (
                        <tr key={alert._id} className={`hover:bg-slate-50 transition-colors ${alert.resolved ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{alert.assetName || 'Unknown'}</p>
                              <p className="text-xs text-text-muted">{alert.assetType || 'bridge'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-text-secondary capitalize">{alert.type || 'risk'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-bold ${
                              alert.riskScore > 75 ? 'text-rose-600' :
                              alert.riskScore > 50 ? 'text-orange-600' :
                              alert.riskScore > 25 ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                              {alert.riskScore?.toFixed(1) || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">{alert.value?.toFixed(2) || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {alert.resolved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-xs font-bold">
                                ✓ Resolved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-600 rounded text-xs font-bold">
                                ⚠ Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-text-muted font-mono">{formatDate(alert.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!alert.resolved && isAdmin && (
                              <button
                                onClick={() => handleResolve(alert._id)}
                                disabled={resolvingId === alert._id}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                {resolvingId === alert._id ? 'Resolving...' : 'Mark Resolved'}
                              </button>
                            )}
                            {alert.resolved && (
                              <span className="text-xs text-text-muted">{formatDate(alert.resolvedAt)}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="text-4xl mb-2">✓</div>
                        <p className="text-text-primary font-semibold">No Alerts Found</p>
                        <p className="text-text-muted text-sm">All systems operating normally</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && alerts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="card-elevated p-4 rounded-xl border-2 border-slate-200">
              <p className="text-text-muted text-xs mb-1">Total</p>
              <p className="text-2xl font-bold text-primary-600">{alerts.length}</p>
            </div>
            <div className="card-elevated p-4 rounded-xl border-2 border-rose-200">
              <p className="text-text-muted text-xs mb-1">Critical</p>
              <p className="text-2xl font-bold text-rose-600">
                {alerts.filter(a => a.severity === 'critical' && !a.resolved).length}
              </p>
            </div>
            <div className="card-elevated p-4 rounded-xl border-2 border-orange-200">
              <p className="text-text-muted text-xs mb-1">High</p>
              <p className="text-2xl font-bold text-orange-600">
                {alerts.filter(a => a.severity === 'high' && !a.resolved).length}
              </p>
            </div>
            <div className="card-elevated p-4 rounded-xl border-2 border-emerald-200">
              <p className="text-text-muted text-xs mb-1">Resolved</p>
              <p className="text-2xl font-bold text-emerald-600">
                {alerts.filter(a => a.resolved).length}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlertsPage;
