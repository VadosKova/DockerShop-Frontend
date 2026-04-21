import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import { t } from '../i18n/i18n';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{t('register')}</h2>
      {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded text-sm text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Name" required
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          onChange={e => setForm({...form, name: e.target.value})}
        />
        <input 
          type="email" placeholder="Email" required
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
          {t('register')}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-500">
        Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">{t('login')}</Link>
      </p>
    </div>
  );
}