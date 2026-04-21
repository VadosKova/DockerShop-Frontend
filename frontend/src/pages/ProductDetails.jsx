import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBasket } from 'lucide-react';
import API from '../api/api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...product, cartId: Date.now() });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition">
        <ChevronLeft size={20} /> Back to Catalog
      </button>
      
      <div className="bg-white rounded-3xl shadow-sm border p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-2xl">
          PRODUCT IMAGE
        </div>
        <div>
          <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">{product.category}</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{product.title}</h1>
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
          <div className="flex items-center justify-between border-t pt-8">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            <button 
              onClick={addToCart}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-100"
            >
              <ShoppingBasket size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}