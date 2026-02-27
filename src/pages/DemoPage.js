import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Demo Header */}
      <div className="bg-blue-600 text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Demo Dashboard</h1>
            <p className="text-blue-100 text-sm">Read-only preview of the Smart Bridge monitoring system</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-blue-600 font-medium rounded hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded transition"
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
