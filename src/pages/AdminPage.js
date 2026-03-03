import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../utils/AuthContext';
import { assetApi } from '../utils/assetApi';
import {
  HomeModernIcon,
  BuildingOffice2Icon,
  RocketLaunchIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CloudIcon,
  ServerStackIcon,
  SignalIcon,
  CpuChipIcon,
  KeyIcon,
  DocumentTextIcon,
  CircleStackIcon,
  WifiIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChartPieIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  UserGroupIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  CommandLineIcon,
  ServerIcon,
  EllipsisHorizontalIcon,
  BellAlertIcon,
  UserPlusIcon,
  ShieldVariantsIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AdminPage = () => {
  const { isAdmin, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'bridge',
    location: '',
    ownerType: 'government',
    structuralType: 'suspension',
    yearBuilt: 2024,
    description: ''
  });

  // Stats
  const [stats, setStats] = useState({
    totalAssets: 5,
    bridges: 2,
    buildings: 2,
    tunnels: 1,
    criticalAlerts: 2,
    totalAlerts: 15,
    systemHealth: 98,
    uptime: 99.9
  });

  // Mock users for demo
  const [users] = useState([
    { id: 1, name: 'Admin User', email: 'admin@structurax.com', role: 'admin', status: 'active', lastLogin: '2026-02-27' },
    { id: 2, name: 'John Engineer', email: 'engineer@structurax.com', role: 'engineer', status: 'active', lastLogin: '2026-02-26' },
    { id: 3, name: 'Sarah Tech', email: 'tech@structurax.com', role: 'engineer', status: 'active', lastLogin: '2026-02-25' },
    { id: 4, name: 'Mike Viewer', email: 'demo@structurax.com', role: 'viewer', status: 'inactive', lastLogin: '2026-02-20' },
  ]);

  // Mock system logs
  const [systemLogs] = useState([
    { id: 1, time: '10:45:32', type: 'info', message: 'System health check completed - All services operational' },
    { id: 2, time: '10:44:15', type: 'success', message: 'Asset data synchronized successfully' },
    { id: 3, time: '10:43:02', type: 'warning', message: 'High memory usage detected on server node 3' },
    { id: 4, time: '10:42:18', type: 'info', message: 'New user registration: engineer@company.com' },
    { id: 5, time: '10:41:05', type: 'error', message: 'Failed to connect to sensor gateway BRG-001' },
    { id: 6, time: '10:40:22', type: 'success', message: 'Backup completed - 2.4GB data archived' },
    { id: 7, time: '10:39:10', type: 'info', message: 'Scheduled maintenance started for sector A' },
    { id: 8, time: '10:38:45', type: 'success', message: 'API rate limit reset for IoT device IOT-042' },
  ]);

  // Mock alerts
  const [alerts] = useState([
    { id: 1, severity: 'critical', title: 'Critical Risk Detected', asset: 'Golden Gate Bridge', message: 'Vibration levels exceeded threshold', time: '10:42 AM', resolved: false },
    { id: 2, severity: 'high', title: 'Maintenance Required', asset: 'Tower Building A', message: 'Scheduled maintenance overdue', time: '09:15 AM', resolved: false },
    { id: 3, severity: 'medium', title: 'Sensor Offline', asset: 'Metro Tunnel B2', message: 'Connection lost to humidity sensor', time: '08:30 AM', resolved: true },
    { id: 4, severity: 'low', title: 'Data Sync Warning', asset: 'Highway Bridge H-42', message: 'High latency detected', time: 'Yesterday', resolved: false },
  ]);

  useEffect(() => {
    if (isAdmin) {
      fetchAssets();
      fetchStats();
    }
  }, [isAdmin]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await assetApi.getAssets();
      setAssets(res.data || []);
    } catch (err) {
      // Use mock data if API fails
      setAssets([
        { _id: '1', name: 'Golden Gate Bridge', type: 'bridge', location: 'San Francisco, CA', status: 'critical', healthIndex: 0.45, riskScore: 78 },
        { _id: '2', name: 'Empire State Building', type: 'building', location: 'New York, NY', status: 'operational', healthIndex: 0.92, riskScore: 12 },
        { _id: '3', name: 'Channel Tunnel', type: 'tunnel', location: 'UK/France', status: 'alert', healthIndex: 0.75, riskScore: 35 },
        { _id: '4', name: 'Brooklyn Bridge', type: 'bridge', location: 'New York, NY', status: 'operational', healthIndex: 0.88, riskScore: 18 },
        { _id: '5', name: 'Willis Tower', type: 'building', location: 'Chicago, IL', status: 'operational', healthIndex: 0.95, riskScore: 8 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await assetApi.getAssetsByType();
      const data = res.data;
      setStats({
        totalAssets: (data.bridge?.total || 0) + (data.building?.total || 0) + (data.tunnel?.total || 0),
        bridges: data.bridge?.total || 0,
        buildings: data.building?.total || 0,
        tunnels: data.tunnel?.total || 0,
        criticalAlerts: 2,
        totalAlerts: 15,
        systemHealth: 98,
        uptime: 99.9
      });
    } catch (err) {
      // Use defaults
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await assetApi.createAsset(newAsset);
      setSuccess('Asset created successfully!');
      setShowAddModal(false);
      setNewAsset({ name: '', type: 'bridge', location: '', ownerType: 'government', structuralType: 'suspension', yearBuilt: 2024, description: '' });
      fetchAssets();
    } catch (err) {
      setError('Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    setAssets(assets.filter(a => a._id !== id));
    setSuccess('Asset deleted successfully');
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { id: 'assets', label: 'Asset Management', icon: HomeModernIcon },
    { id: 'users', label: 'User Management', icon: UserGroupIcon },
    { id: 'alerts', label: 'Alert Center', icon: BellAlertIcon },
    { id: 'system', label: 'System Health', icon: CogIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
    <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trendUp ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-emerald-500/20 text-emerald-400';
      case 'alert': return 'bg-amber-500/20 text-amber-400';
      case 'critical': return 'bg-rose-500/20 text-rose-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
          </div>
          <p className="text-slate-400">Manage your StructuraX infrastructure from one centralized hub</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Assets" value={stats.totalAssets} icon={HomeModernIcon} color="bg-gradient-to-br from-cyan-500 to-blue-500" trend="+2 this month" trendUp={true} />
              <StatCard title="Active Alerts" value={stats.criticalAlerts} icon={BellAlertIcon} color="bg-gradient-to-br from-rose-500 to-red-500" trend={stats.criticalAlerts > 0 ? 'Needs attention' : 'All clear'} trendUp={stats.criticalAlerts > 0} />
              <StatCard title="System Health" value={`${stats.systemHealth}%`} icon={HeartIcon} color="bg-gradient-to-br from-emerald-500 to-teal-500" trend="Stable" trendUp={true} />
              <StatCard title="Uptime" value={`${stats.uptime}%`} icon={ServerIcon} color="bg-gradient-to-br from-purple-500 to-pink-500" trend="Last 30 days" trendUp={true} />
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BoltIcon className="h-5 w-5 text-cyan-400" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowAddModal(true)} className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl hover:from-cyan-500/30 hover:to-purple-500/30 transition-all group">
                    <PlusIcon className="h-6 w-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-white font-medium">Add Asset</p>
                  </button>
                  <button className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl hover:from-emerald-500/30 hover:to-teal-500/30 transition-all group">
                    <ArrowPathIcon className="h-6 w-6 text-emerald-400 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                    <p className="text-sm text-white font-medium">Sync Data</p>
                  </button>
                  <button className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl hover:from-amber-500/30 hover:to-orange-500/30 transition-all group">
                    <DocumentDuplicateIcon className="h-6 w-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-white font-medium">Backup Now</p>
                  </button>
                  <button className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all group">
                    <CogIcon className="h-6 w-6 text-purple-400 mb-2 group-hover:rotate-90 transition-transform duration-500" />
                    <p className="text-sm text-white font-medium">Settings</p>
                  </button>
                </div>
              </div>

              {/* Recent System Logs */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CommandLineIcon className="h-5 w-5 text-purple-400" />
                  System Logs
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {systemLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                      <span className="text-xs text-slate-500 font-mono mt-1">{log.time}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        log.type === 'error' ? 'bg-rose-500/20 text-rose-400' :
                        log.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                        log.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>{log.type}</span>
                      <p className="text-sm text-slate-300 flex-1">{log.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Overview */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ChartPieIcon className="h-5 w-5 text-cyan-400" />
                Asset Distribution
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl text-center">
                  <RocketLaunchIcon className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.bridges}</p>
                  <p className="text-sm text-slate-400">Bridges</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-center">
                  <BuildingOffice2Icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.buildings}</p>
                  <p className="text-sm text-slate-400">Buildings</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl text-center">
                  <EllipsisHorizontalIcon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.tunnels}</p>
                  <p className="text-sm text-slate-400">Tunnels</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Asset Management</h2>
              <button onClick={() => setShowAddModal(true)} className="btn-cyber flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Add New Asset
              </button>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2">
                <XCircleIcon className="h-5 w-5" />
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                {success}
              </div>
            )}

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Asset</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Type</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Location</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Health</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {assets.map(asset => (
                      <tr key={asset._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              asset.type === 'bridge' ? 'bg-cyan-500/20' :
                              asset.type === 'building' ? 'bg-purple-500/20' : 'bg-emerald-500/20'
                            }`}>
                              {asset.type === 'bridge' ? <RocketLaunchIcon className="h-5 w-5 text-cyan-400" /> :
                               asset.type === 'building' ? <BuildingOffice2Icon className="h-5 w-5 text-purple-400" /> :
                               <EllipsisHorizontalIcon className="h-5 w-5 text-emerald-400" />}
                            </div>
                            <span className="font-medium text-white">{asset.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300 capitalize">{asset.type}</td>
                        <td className="px-6 py-4 text-slate-400">{asset.location}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  asset.healthIndex > 0.8 ? 'bg-emerald-500' :
                                  asset.healthIndex > 0.5 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${(asset.healthIndex || 0.5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-400">{Math.round((asset.healthIndex || 0.5) * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteAsset(asset._id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">User Management</h2>
              <button className="btn-cyber flex items-center gap-2">
                <UserPlusIcon className="h-5 w-5" />
                Add User
              </button>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Role</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Last Login</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                            user.role === 'engineer' ? 'bg-cyan-500/20 text-cyan-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-2 ${user.status === 'active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                            <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Alert Center</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg text-sm font-medium">Critical ({alerts.filter(a => a.severity === 'critical' && !a.resolved).length})</button>
                <button className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium">All Active ({alerts.filter(a => !a.resolved).length})</button>
              </div>
            </div>

            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`glass-card p-4 border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-rose-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-amber-500' : 'border-l-slate-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'critical' ? <ExclamationCircleIcon className="h-5 w-5" /> :
                         alert.severity === 'high' ? <ExclamationTriangleIcon className="h-5 w-5" /> :
                         <BellIcon className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{alert.title}</h4>
                        <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{alert.asset} • {alert.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.resolved && (
                        <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors">
                          Resolve
                        </button>
                      )}
                      <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">System Health Monitor</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ServerIcon className="h-6 w-6 text-cyan-400" />
                  <h3 className="font-semibold text-white">API Server</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-emerald-400 font-medium">Operational</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">Response: 45ms</p>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CloudIcon className="h-6 w-6 text-purple-400" />
                  <h3 className="font-semibold text-white">Cloud Services</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-emerald-400 font-medium">Operational</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">Uptime: 99.98%</p>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CircleStackIcon className="h-6 w-6 text-emerald-400" />
                  <h3 className="font-semibold text-white">Database</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-emerald-400 font-medium">Operational</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">Connections: 24/100</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">System Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <CpuChipIcon className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">34%</p>
                  <p className="text-xs text-slate-400">CPU Usage</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <CircleStackIcon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">2.4 GB</p>
                  <p className="text-xs text-slate-400">Memory</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <SignalIcon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-xs text-slate-400">Active Sensors</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <WifiIcon className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">99.9%</p>
                  <p className="text-xs text-slate-400">Network Uptime</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">System Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Cog6ToothIcon className="h-5 w-5 text-cyan-400" />
                  General Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <div>
                      <p className="text-white font-medium">Auto-refresh Data</p>
                      <p className="text-sm text-slate-400">Automatically sync asset data every 30 seconds</p>
                    </div>
                    <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-slate-400">Send email alerts for critical issues</p>
                    </div>
                    <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-white font-medium">Maintenance Mode</p>
                      <p className="text-sm text-slate-400">Enable for scheduled maintenance</p>
                    </div>
                    <button className="w-12 h-6 bg-slate-600 rounded-full relative">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <ShieldExclamationIcon className="h-5 w-5 text-purple-400" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Require 2FA for all admin accounts</p>
                    </div>
                    <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <div>
                      <p className="text-white font-medium">API Rate Limiting</p>
                      <p className="text-sm text-slate-400">Protect against DDoS attacks</p>
                    </div>
                    <button className="w-12 h-6 bg-cyan-500 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-white font-medium">Session Timeout</p>
                      <p className="text-sm text-slate-400">Auto logout after 30 minutes</p>
                    </div>
                    <select className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add New Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Asset Name</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="input-cyber w-full"
                  placeholder="e.g., Brooklyn Bridge"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                    className="input-cyber w-full"
                  >
                    <option value="bridge">Bridge</option>
                    <option value="building">Building</option>
                    <option value="tunnel">Tunnel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Year Built</label>
                  <input
                    type="number"
                    value={newAsset.yearBuilt}
                    onChange={(e) => setNewAsset({...newAsset, yearBuilt: parseInt(e.target.value)})}
                    className="input-cyber w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input
                  type="text"
                  value={newAsset.location}
                  onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                  className="input-cyber w-full"
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Owner Type</label>
                <select
                  value={newAsset.ownerType}
                  onChange={(e) => setNewAsset({...newAsset, ownerType: e.target.value})}
                  className="input-cyber w-full"
                >
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                  <option value="public">Public-Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                  className="input-cyber w-full h-24"
                  placeholder="Brief description of the asset..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-cyber disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

