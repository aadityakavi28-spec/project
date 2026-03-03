
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
  PlusCircleIcon,
  BuildingOffice2Icon,
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
    ...(user?.role === 'admin' ? [
      { path: '/admin', label: 'Admin', icon: <CogIcon className="h-5 w-5" /> },
      { path: '/generate-asset', label: 'Generate', icon: <PlusCircleIcon className="h-5 w-5" /> }
    ] : []),
    { path: '/profile', label: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={isAuthenticated ? "/command-center" : "/"} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <BuildingOffice2Icon className="h-6 w-6 text-slate-900" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-cyan-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient-neon">StructuraX</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Multi-Asset Digital Twin</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
              </div>
              <span className="text-sm font-medium text-cyan-400">Live Monitoring</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated && (
              <>
                {navLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={isActive(item.path) ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="relative ml-4">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 glass-card border border-slate-600 hover:border-cyan-500/30 px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center text-slate-900 text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-white hidden xl:block">{user?.name}</span>
                    <span className={`text-xs text-slate-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-80 glass-card border border-slate-600 py-3 z-50 animate-slide-down overflow-hidden">
                      <div className="px-5 py-4 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center text-slate-900 text-lg font-bold shadow-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-xs font-bold rounded-full ${
                              user?.role === 'admin' 
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                : 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
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
                          className="flex items-center gap-3 px-5 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                          <span className="text-lg">👤</span>
                          <span>View Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
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
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-700 animate-slide-down">
            <div className="space-y-2">
              {isAuthenticated && navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 w-full transition-all duration-300"
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

