import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../utils/AuthContext';
import { bridgesAPI } from '../utils/api';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [bridges, setBridges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', location: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchBridges();
    }
  }, [isAdmin]);

  const fetchBridges = async () => {
    try {
      setLoading(true);
      const res = await bridgesAPI.getAll();
      setBridges(res.data.data || []);
    } catch (err) {
      console.error('Error fetching bridges:', err);
      setError('Failed to load bridges');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location) {
      setError('Please provide both name and location');
      return;
    }

    try {
      await bridgesAPI.create(form);
      setMessage('Bridge created successfully');
      setForm({ name: '', location: '' });
      fetchBridges();
    } catch (err) {
      console.error('Error creating bridge:', err);
      setError('Failed to create bridge');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Admin Panel</h1>

        {/* Bridge administration */}
        <section className="mb-10">
          <div className="card-professional p-6 mb-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Bridges Management</h2>
            {error && (
              <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl mb-4">
                {message}
              </div>
            )}
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                className="input-modern"
                name="name"
                placeholder="Bridge name"
                value={form.name}
                onChange={handleChange}
              />
              <input
                className="input-modern"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
              />
              <button
                className="btn-primary w-full md:col-span-2"
                type="submit"
              >
                <PlusIcon className="h-5 w-5 inline mr-2" />
                Add Bridge
              </button>
            </form>
          </div>

          {loading ? (
            <p className="text-text-secondary">Loading bridges...</p>
          ) : (
            <div className="card-professional overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-primary">Bridge Name</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-primary">Location</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bridges.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-text-primary font-medium">{b.name}</td>
                      <td className="px-6 py-4 text-text-secondary">{b.location}</td>
                      <td className="px-6 py-4">
                        <button className="text-rose-500 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bridges.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-text-muted">
                        No bridges found. Add one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <div className="card-professional p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">User Management</h2>
            <p className="text-text-secondary">
              (User management is not fully implemented in this demo. In production you would be able to view, edit and delete user accounts from here.)
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminPage;
