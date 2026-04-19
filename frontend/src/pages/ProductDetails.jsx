import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ShoppingBag, ChevronLeft } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const buy = async () => {
    await api.post('/orders', { items: [{ productId: id, title: product.title }] });
    alert("Order Created! Check Notification Service log.");
    navigate("/orders");
  };

  if (!product) return <div className="p-20 text-center font-bold animate-pulse">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-8 font-bold uppercase text-sm transition">
        <ChevronLeft size={20}/> Back to catalog
      </button>
      
      <div className="grid md:grid-cols-2 gap-12 bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
        <div className="aspect-square bg-gray-50 rounded-[30px] flex items-center justify-center text-gray-200 text-4xl font-black uppercase">
          {product.category}
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2">{product.category}</span>
          <h1 className="text-5xl font-black mb-4 tracking-tighter leading-tight">{product.title}</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-8">
            <span className="text-4xl font-black">${product.price}</span>
            <button onClick={buy} className="btn-primary flex-1 flex items-center justify-center gap-3">
              <ShoppingBag size={20}/> ORDER NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};