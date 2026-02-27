import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show full navbar on landing page
  const isLandingPage = location.pathname === '/';

  if (isLandingPage && !isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 hover:opacity-80 transition">
            <div className="text-2xl">🌉</div>
            <h1 className="text-2xl font-bold hidden sm:block">Smart Bridge</h1>
          </Link>

          {/* Center - Status */}
          <div className="flex items-center space-x-4">
            <div className="text-sm opacity-90">
              Real-time Structural Monitoring
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Right - Navigation & User */}
          <div className="flex items-center space-x-6">
            {isAuthenticated && (
              <>
                {/* Navigation Links */}
                <div className="hidden md:flex space-x-4">
                  <Link
                    to="/dashboard"
                    className={`hover:bg-blue-700 px-3 py-2 rounded transition ${
                      location.pathname === '/dashboard' ? 'bg-blue-700' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/features"
                    className={`hover:bg-blue-700 px-3 py-2 rounded transition ${
                      location.pathname === '/features' ? 'bg-blue-700' : ''
                    }`}
                  >
                    Features
                  </Link>
                  <Link
                    to="/history"
                    className={`hover:bg-blue-700 px-3 py-2 rounded transition ${
                      location.pathname === '/history' ? 'bg-blue-700' : ''
                    }`}
                  >
                    History
                  </Link>
                  <Link
                    to="/alerts"
                    className={`hover:bg-blue-700 px-3 py-2 rounded transition ${
                      location.pathname === '/alerts' ? 'bg-blue-700' : ''
                    }`}
                  >
                    Alerts
                  </Link>
                  <Link
                    to="/profile"
                    className={`hover:bg-blue-700 px-3 py-2 rounded transition ${
                      location.pathname === '/profile' ? 'bg-blue-700' : ''
                    }`}
                  >
                    Profile
                  </Link>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
                  >
                    <span className="text-lg">👤</span>
                    <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                    <span className="text-xs">▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                        <div className="mt-2 flex gap-2">
                          <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                            user?.role === 'admin' 
                              ? 'bg-purple-600 text-white' 
                              : user?.role === 'engineer'
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {user?.role === 'admin' ? '👤 Admin' : user?.role === 'engineer' ? '⚙️ Engineer' : '👤 User'}
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition"
                      >
                        👤 View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
