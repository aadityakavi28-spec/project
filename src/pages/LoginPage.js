import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌉</div>
          <h1 className="text-3xl font-bold text-white">Smart Bridge</h1>
          <p className="text-blue-300">Digital Twin Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-blue-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-blue-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Quick Login Buttons */}
          <div className="mt-8 pt-6 border-t border-blue-500 border-opacity-30">
            <p className="text-sm text-gray-300 text-center mb-4 font-semibold">🚀 Quick Login (Test Accounts)</p>
            
            <div className="space-y-3">
              <button
                onClick={() => quickLogin('admin@example.com')}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-4"
              >
                <span>👤 Admin Account</span>
                <span className="text-xs opacity-75">admin@example.com</span>
              </button>

              <button
                onClick={() => quickLogin('engineer@example.com')}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-4"
              >
                <span>⚙️ Engineer Account</span>
                <span className="text-xs opacity-75">engineer@example.com</span>
              </button>

              <button
                onClick={() => quickLogin('demo@example.com')}
                disabled={loading}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-blue-300 font-medium rounded-lg transition border border-blue-500 border-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-4"
              >
                <span>🎯 Demo Account</span>
                <span className="text-xs opacity-75">demo@example.com</span>
              </button>
            </div>

            {/* Test Credentials Info */}
            <div className="mt-4 p-3 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg">
              <p className="text-xs text-gray-300 leading-relaxed">
                <span className="font-semibold text-blue-300">💡 Test Credentials:</span>
                <br />
                All passwords: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 text-xs">password123456</code>
                <br />
                Click quick login buttons above ⬆️
              </p>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Register
            </Link>
          </p>

          {/* Home Link */}
          <p className="text-center text-gray-400 mt-4">
            <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
