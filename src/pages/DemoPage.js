import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Demo Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Demo Dashboard</h1>
            <p className="text-text-muted text-sm">Read-only preview of the Smart Bridge monitoring system</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-white text-text-primary font-medium rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:shadow-md transition-all"
            >
              Login
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <Dashboard />
    </div>
  );
};

export default DemoPage;
