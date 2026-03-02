import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { UserIcon, EnvelopeIcon, CogIcon, KeyIcon, LockClosedIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'engineer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/logo.svg" alt="Smart Bridge" className="mb-4 h-14 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-text-primary mb-1">Smart Bridge</h1>
          <p className="text-text-muted text-lg">Create Your Account</p>
        </div>

        {/* Register Card */}
        <div className="card-professional p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Join Our Platform
          </h2>

          {error && (
            <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-modern"
                placeholder="John Doe"
                required
              />
            </div>

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
              <label className="block text-sm font-semibold text-text-secondary mb-2">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-modern"
              >
                <option value="engineer" className="bg-white">Engineer (View Access)</option>
                <option value="admin" className="bg-white">Admin (Full Access)</option>
              </select>
              <p className="text-xs text-text-muted mt-2">Choose your role. You can change it later from settings.</p>
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
              <p className="text-xs text-text-muted mt-2">Minimum 6 characters required</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRightIcon className="h-5 w-5 ml-2 inline" />}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300">
              Login Now
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
        <p className="text-center text-text-muted text-xs mt-6">Built for Hackathon 2026</p>
      </div>
    </div>
  );
};

export default RegisterPage;
