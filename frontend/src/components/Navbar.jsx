import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { t } from '../i18n/i18n';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const lang = localStorage.getItem("lang") || "en";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleLang = () => {
    localStorage.setItem("lang", lang === "en" ? "ru" : "en");
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter">DOCKERSHOP</Link>
      
      <div className="flex items-center gap-6 text-sm font-medium">
        <button onClick={toggleLang} className="flex items-center gap-1 hover:text-indigo-600 uppercase">
          <Globe size={16}/> {lang}
        </button>

        {user ? (
          <>
            <Link to="/" className="hover:text-indigo-600">{t('products')}</Link>
            <Link to="/orders" className="hover:text-indigo-600">{t('orders')}</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-1 text-red-500 hover:text-red-600">
                <LayoutDashboard size={18}/> {t('admin')}
              </Link>
            )}
            <button onClick={logout} className="text-gray-400 hover:text-gray-600"><LogOut size={20}/></button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-indigo-600">{t('login')}</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">{t('register')}</Link>
          </div>
        )}
      </div>
    </nav>
  );
};