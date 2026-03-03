import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { ExclamationCircleIcon, CheckCircleIcon, ArrowRightIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(formData.name, formData.email, formData.password);
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
<div className="fixed inset-0 hero-cyber grid-pattern">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto" style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}>
              <BuildingOffice2Icon className="h-10 w-10 text-slate-900" />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
<p className="text-slate-400">Join <span className="text-gradient-neon font-semibold">StructuraX</span></p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Registration</h2>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <ExclamationCircleIcon className="h-5 w-5" />
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          {success && (
<div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="font-medium text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
<label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-cyber" placeholder="John Doe" required />
            </div>
            <div>
<label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-cyber" placeholder="your@email.com" required />
            </div>
            <div>
<label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-cyber" placeholder="••••••••" required />
            </div>
            <div>
<label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-cyber" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-gradient w-full py-4 mt-6 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
              {!loading && <ArrowRightIcon className="h-5 w-5 ml-2 inline" />}
            </button>
          </form>

<p className="text-center text-slate-400 mt-6">Already have an account? <Link to="/login" className="text-cyan-400 font-semibold">Login</Link></p>
          <p className="text-center text-slate-500 mt-4"><Link to="/" className="text-slate-400 text-sm">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

