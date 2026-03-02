import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import {
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  if (isLandingPage && !isAuthenticated) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/command-center', label: 'Command Center', icon: <ChartBarIcon className="h-5 w-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <ChartBarIcon className="h-5 w-5" /> },
    { path: '/history', label: 'History', icon: <ClockIcon className="h-5 w-5" /> },
    { path: '/alerts', label: 'Alerts', icon: <BellIcon className="h-5 w-5" /> },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: <CogIcon className="h-5 w-5" /> }] : []),
    { path: '/profile', label: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={isAuthenticated ? "/command-center" : "/"} className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
            <div className="relative">
              <img src="/logo.svg" alt="Smart Bridge" className="h-10 w-auto group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Smart Bridge
              </h1>
              <p className="text-xs text-text-muted -mt-1">Digital Twin</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary-700">Real-time Monitoring</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            {isAuthenticated && (
              <>
                {navLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200'
                        : 'text-text-secondary hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <span className={isActive(item.path) ? 'text-white' : 'text-primary-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="relative ml-4">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-white border-2 border-slate-200 hover:border-primary-300 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-text-primary hidden xl:block">{user?.name}</span>
                    <span className={`text-xs text-text-muted transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-slide-down overflow-hidden">
                      <div className="px-5 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
                            <p className="text-xs text-text-muted truncate">{user?.email}</p>
                            <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                              user?.role === 'admin' 
                                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                            }`}>
                              {user?.role === 'admin' ? '⚡ Admin' : '⚙️ Engineer'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                        >
                          <span className="text-lg">👤</span>
                          <span>View Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-text-secondary hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
                        >
                          <span>🚪</span>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-text-primary" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-text-primary" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-slide-down">
            <div className="space-y-2">
              {isAuthenticated && navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'text-text-secondary hover:bg-primary-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 w-full transition-all duration-300"
                >
                  <span>🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
