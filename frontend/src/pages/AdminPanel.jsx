import { useEffect, useState } from 'react';
import api from '../api/api';
import { Plus, Trash2, RefreshCcw } from 'lucide-react';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: '', price: '', category: '', description: '' });

  const loadData = () => {
    api.get('/orders').then(res => setOrders(res.data));
    api.get('/products').then(res => setProducts(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    await api.post('/products', form);
    setForm({ title: '', price: '', category: '', description: '' });
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto p-8 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-2">
            <Plus className="text-indigo-600"/> Add Product
          </h2>
          <form onSubmit={addProduct} className="space-y-4">
            <input className="input-field" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            <input className="input-field" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
            <input className="input-field" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
            <textarea className="input-field" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <button className="btn-primary w-full uppercase">Create</button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-10">
        <section>
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Active Orders</h2>
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o._id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-xs font-mono text-gray-400 mb-1">{o._id}</p>
                  <p className="font-bold">Items: {o.items.length}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider">{o.status}</span>
                  <button onClick={async () => { await api.put(`/orders/${o._id}/status`, {status: 'Shipped'}); loadData(); }} 
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition">
                    <RefreshCcw size={20}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};