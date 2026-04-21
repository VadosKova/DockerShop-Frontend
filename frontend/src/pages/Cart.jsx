import React, { useState, useEffect } from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import API from '../api/api';

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(savedCart);
  }, []);

  const removeItem = (cartId) => {
    const updated = items.filter(i => i.cartId !== cartId);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const checkout = async () => {
    if (items.length === 0) return;
    try {
      await API.post('/orders', { items: items.map(i => i._id) });
      localStorage.setItem('cart', '[]');
      setItems([]);
      alert('Order created successfully! Notification sent to RabbitMQ.');
    } catch (err) {
      alert('Checkout failed');
    }
  };

  const total = items.reduce((sum, i) => sum + Number(i.price), 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
          <p className="text-gray-400 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.cartId} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg" />
                <div>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-indigo-600 font-medium">${item.price}</p>
                </div>
              </div>
              <button onClick={() => removeItem(item.cartId)} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <div className="mt-8 bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total amount:</span>
              <span className="text-2xl font-bold">${total}</span>
            </div>
            <button 
              onClick={checkout}
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
            >
              <CreditCard size={20} /> Checkout (Process Order)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}