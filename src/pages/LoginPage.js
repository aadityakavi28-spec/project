import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { 
  BoltIcon, 
  CogIcon, 
  UserIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  ArrowRightIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email) => {
    const mockUser = MOCK_USERS[email];
    if (!mockUser) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await login(email, mockUser.password);
      setSuccess(`Logged in as ${mockUser.name}! Redirecting...`);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 hero-cyber grid-pattern">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto" style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}>
              <BuildingOffice2Icon className="h-10 w-10 text-slate-900" />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to <span className="text-gradient-neon font-semibold">StructuraX</span></p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Authentication</h2>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-cyber"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-cyber"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full text-base py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRightIcon className="h-5 w-5 ml-2" />}
            </button>
          </form>

          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-500 font-medium">or quick access</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button onClick={() => quickLogin('admin@example.com')} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-xl transition disabled:opacity-50 flex items-center justify-between px-5">
              <span className="flex items-center gap-2 text-white font-semibold"><BoltIcon className="h-5 w-5 text-purple-400" />Admin</span>
              <span className="text-sm text-slate-400">admin@example.com</span>
            </button>
            <button onClick={() => quickLogin('engineer@example.com')} disabled={loading} className="w-full py-4 bg-gradient-to-r from-lime-500/20 to-cyan-500/20 hover:from-lime-500/30 hover:to-cyan-500/30 border border-lime-500/30 rounded-xl transition disabled:opacity-50 flex items-center justify-between px-5">
              <span className="flex items-center gap-2 text-white font-semibold"><CogIcon className="h-5 w-5 text-lime-400" />Engineer</span>
              <span className="text-sm text-slate-400">engineer@example.com</span>
            </button>
            <button onClick={() => quickLogin('demo@example.com')} disabled={loading} className="w-full py-4 bg-slate-800 border border-slate-600 hover:border-slate-500 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-between px-5 hover:bg-slate-700">
              <span className="flex items-center gap-2 text-cyan-400"><UserIcon className="h-5 w-5" />Demo</span>
              <span className="text-sm text-slate-400">demo@example.com</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
            <p className="text-sm text-slate-400"><span className="font-semibold text-cyan-400">Demo Password:</span> <code className="bg-slate-900 px-2 py-1 rounded text-cyan-400 text-xs font-mono border border-slate-700">password123456</code></p>
          </div>

          <p className="text-center text-slate-400 mt-6">Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">Register Here</Link></p>
          <p className="text-center text-slate-500 mt-4"><Link to="/" className="text-slate-400 hover:text-white text-sm">← Back to Home</Link></p>
        </div>
        <p className="text-center text-slate-500 text-xs mt-6">🚀 Secured with enterprise encryption</p>
      </div>
    </div>
  );
};

export default LoginPage;

