import React, { useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';
import { t } from '../i18n/i18n';

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);

      const profile = await API.get('/users/me'); 
      localStorage.setItem('user', JSON.stringify(profile.data));
      setUser(profile.data);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">{t('login')}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" placeholder="Email" required
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
          {t('login')}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        No account? <Link to="/register" className="text-indigo-600 hover:underline">{t('register')}</Link>
      </p>
    </div>
  );
}