import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../utils/AuthContext';
import { UserIcon, CogIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { user, isAdmin, isEngineer, logout } = useAuth();

  const getRoleInfo = () => {
    if (isAdmin) {
      return {
        name: 'Administrator',
        icon: '👤',
        gradient: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        text: 'text-violet-600',
        description: 'Full system access, user management, configuration',
        permissions: [
          '✓ View all dashboards',
          '✓ Manage users',
          '✓ Configure system settings',
          '✓ View all alerts',
          '✓ Generate reports',
          '✓ System administration',
        ],
      };
    } else if (isEngineer) {
      return {
        name: 'Engineer',
        icon: '⚙️',
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-600',
        description: 'Monitor bridges, analyze data, manage alerts',
        permissions: [
          '✓ View monitoring dashboard',
          '✓ Analyze sensor data',
          '✓ Receive alerts',
          '✓ View history',
          '✓ Export data',
          '✓ Access technical support',
        ],
      };
    } else {
      return {
        name: 'User',
        icon: '👁️',
        gradient: 'from-primary-500 to-primary-600',
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        text: 'text-primary-600',
        description: 'Limited access',
        permissions: [
          '✓ View dashboard',
          '✓ View alerts',
        ],
      };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">User Profile</h1>
          <p className="text-text-secondary">Your account information and permissions</p>
        </div>

        {/* Profile Card */}
        <div className="card-professional p-8 mb-6">
          {/* User Info */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleInfo.gradient} flex items-center justify-center text-4xl shadow-lg`}>
              {roleInfo.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-1">{user?.name}</h2>
              <p className="text-text-secondary mb-2">{user?.email}</p>
              <span className={`inline-flex items-center px-4 py-1.5 text-sm font-bold rounded-full ${roleInfo.bg} ${roleInfo.text} border ${roleInfo.border}`}>
                {roleInfo.name}
              </span>
            </div>
          </div>

          {/* Role Description */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-text-primary mb-2">Role Overview</h3>
            <p className="text-text-secondary">{roleInfo.description}</p>
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Your Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleInfo.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span className="text-text-secondary text-sm">{permission.substring(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-bold text-text-primary mb-3">Account Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">User ID:</span>
                <span className="text-primary-600 font-medium">{user?.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Email:</span>
                <span className="text-primary-600 font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Role:</span>
                <span className={`font-bold ${roleInfo.text}`}>{user?.role || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testing Information */}
        <div className="card-professional p-6 mb-6 border-l-4 border-l-amber-400">
          <h3 className="text-lg font-bold text-amber-600 mb-3">🧪 Testing Information</h3>
          <p className="text-text-secondary mb-3">This is a test account. You can:</p>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>✓ Explore all features available for your role</li>
            <li>✓ Test the complete monitoring system</li>
            <li>✓ View 3D bridge models and data visualizations</li>
            <li>✓ Switch accounts using the quick login buttons on the login page</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Link
            to="/dashboard"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-xl transition text-center flex items-center justify-center gap-2"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 px-4 rounded-xl transition text-center flex items-center justify-center gap-2"
            >
              <span>🛠️</span>
              <span>Admin</span>
            </Link>
          )}
          <Link
            to="/alerts"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition text-center flex items-center justify-center gap-2"
          >
            <span>🔔</span>
            <span>Alerts</span>
          </Link>
          <Link
            to="/history"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition text-center flex items-center justify-center gap-2"
          >
            <span>📈</span>
            <span>History</span>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
