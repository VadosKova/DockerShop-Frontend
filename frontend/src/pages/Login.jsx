import { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem("token", res.data.token);

      const role = form.email === 'admin@gmail.com' ? 'admin' : 'customer';
      localStorage.setItem("user", JSON.stringify({ email: form.email, role }));
      navigate("/");
      window.location.reload();
    } catch { alert("Invalid credentials"); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <h2 className="text-3xl font-black text-center mb-8 tracking-tighter uppercase text-indigo-600">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="input-field" type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          <input className="input-field" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          <button className="btn-primary w-full uppercase tracking-widest">Sign In</button>
        </form>
        <p className="mt-6 text-center text-gray-500">Don't have an account? <Link to="/register" className="text-indigo-600 font-bold">Register</Link></p>
      </div>
    </div>
  );
};