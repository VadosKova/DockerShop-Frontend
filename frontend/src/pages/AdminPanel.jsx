import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: 0, category: '', description: '' });

  useEffect(() => {
    API.get('/orders').then(res => setOrders(res.data));
    API.get('/products').then(res => setProducts(res.data));
  }, []);

  const createProduct = async () => {
    await API.post('/products', newProduct);
    window.location.reload();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, { status });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
  };

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">Добавить товар</h2>
        <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">
          <input className="border p-2 rounded" placeholder="Название" onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
          <input className="border p-2 rounded" type="number" placeholder="Цена" onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
          <input className="border p-2 rounded" placeholder="Категория" onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
          <textarea className="border p-2 rounded col-span-2" placeholder="Описание" onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          <button onClick={createProduct} className="bg-green-600 text-white p-2 rounded col-span-2">Создать</button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Order Management</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-t">
                  <td className="p-4 text-xs">{o._id}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${o.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border rounded p-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}