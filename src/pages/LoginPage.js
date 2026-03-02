import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { EnvelopeIcon, KeyIcon, BoltIcon, CogIcon, UserIcon, IdentificationIcon, ExclamationCircleIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, MOCK_USERS } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await login(formData.email, formData.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick login functions
  const quickLogin = async (email) => {
    const mockUser = MOCK_USERS[email];
    if (!mockUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await login(email, mockUser.password);
      setSuccess(`Logged in as ${mockUser.name}! Redirecting...`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/logo.svg" alt="Smart Bridge" className="mb-4 h-14 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-text-primary mb-1">Smart Bridge</h1>
          <p className="text-text-muted text-lg">Digital Twin Platform</p>
        </div>

        {/* Main Card */}
        <div className="card-professional p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-modern"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-modern"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRightIcon className="h-5 w-5 ml-2 inline" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-muted font-medium">or quick login</span>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => quickLogin('admin@example.com')}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-5 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center gap-2"><BoltIcon className="h-5 w-5" />Admin</span>
              <span className="text-xs opacity-75 font-normal">admin@example.com</span>
            </button>

            <button
              onClick={() => quickLogin('engineer@example.com')}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-5 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center gap-2"><CogIcon className="h-5 w-5" />Engineer</span>
              <span className="text-xs opacity-75 font-normal">engineer@example.com</span>
            </button>

            <button
              onClick={() => quickLogin('demo@example.com')}
              disabled={loading}
              className="w-full py-3.5 bg-white text-text-primary font-semibold rounded-xl transition border-2 border-slate-200 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-5 hover:shadow-md"
            >
              <span className="flex items-center gap-2 text-primary-600"><IdentificationIcon className="h-5 w-5" />Demo</span>
              <span className="text-xs text-text-muted font-normal">demo@example.com</span>
            </button>
          </div>

          {/* Test Credentials Info */}
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-semibold text-primary-600">💡 Quick Start:</span>
              <br />
              All passwords: 
              <code className="bg-white px-2 py-1 rounded text-primary-600 text-xs mx-1 font-mono border border-primary-200">password123456</code>
            </p>
          </div>

          {/* Register Link */}
          <p className="text-center text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300">
              Register Here
            </Link>
          </p>

          {/* Home Link */}
          <p className="text-center text-text-muted mt-4">
            <Link to="/" className="text-text-muted hover:text-text-secondary transition-colors duration-300 text-sm font-medium">
              ← Back to Home
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <p className="text-center text-text-muted text-xs mt-6">🚀 Built for Hackathon 2026</p>
      </div>
    </div>
  );
};

export default LoginPage;
