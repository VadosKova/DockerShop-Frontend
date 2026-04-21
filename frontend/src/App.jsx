import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Package, Shield } from 'lucide-react';
import { t } from './i18n/i18n';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ru' : 'en';
    localStorage.setItem('lang', newLang);
    setLang(newLang);
    window.location.reload();
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans">
        {user && (
          <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-indigo-600">DockerShop</Link>
            <div className="flex items-center gap-6">
              <button onClick={toggleLang} className="text-sm font-medium hover:text-indigo-600 uppercase">{lang}</button>
              <Link to="/" className="hover:text-indigo-600">{t('products')}</Link>
              <Link to="/cart" className="relative hover:text-indigo-600"><Cart size={20} /></Link>
              <Link to="/orders" className="hover:text-indigo-600"><Orders size={20} /></Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-red-500 hover:text-red-700 flex items-center gap-1">
                  <AdminPanel size={20} /> {t('admin')}
                </Link>
              )}
              <button onClick={logout} className="text-gray-500 hover:text-red-500"><LogOut size={20} /></button>
            </div>
          </nav>
        )}

        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={user ? <Catalog /> : <Navigate to="/login" />} />
            <Route path="/product/:id" element={user ? <ProductDetail /> : <Navigate to="/login" />} />
            <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;