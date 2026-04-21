import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Каталог инструментов</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">Photo</div>
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p className="text-gray-500 text-sm mb-2">{p.category}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold text-indigo-600">${p.price}</span>
              <Link to={`/product/${p._id}`} className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}