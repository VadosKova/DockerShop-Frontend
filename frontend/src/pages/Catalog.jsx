import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { t } from '../i18n/i18n';

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">{t('products')}</h1>
          <p className="text-gray-400">Selected items for your setup</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(p => (
          <Link to={`/product/${p._id}`} key={p._id} className="group bg-white p-2 rounded-3xl border border-transparent hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300">
            <div className="aspect-square bg-gray-50 rounded-2xl mb-4 flex items-center justify-center text-gray-300 font-bold text-xl group-hover:scale-95 transition-transform uppercase">
              {p.category}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{p.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-2xl font-black text-gray-900">${p.price}</span>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-widest">New</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};