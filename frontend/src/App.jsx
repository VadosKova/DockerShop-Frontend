import "./App.css";
import { useState, useEffect } from "react";
import { AppCtx } from "./context/AppContext";

import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [page, setPage] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token"); return;
      }
      setUser({ id: payload.id, email: payload.email ?? "", role: payload.role });
    } catch { localStorage.removeItem("token"); }
  }, []);

  const toggleLang = () => {
    const next = lang === "en" ? "uk" : "en";
    localStorage.setItem("lang", next);
    setLang(next);
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return <AuthPage mode="login" />;
      case "register":       
        return <AuthPage mode="register" />;
      case "product":        
        return <ProductDetailPage />;
      case "cart":           
        return user?.role === "customer" ? <CartPage />          : <ProductsPage />;
      case "my_orders":      
        return user?.role === "customer" ? <MyOrdersPage />      : <ProductsPage />;
      case "admin_products": 
        return user?.role === "admin"    ? <AdminProductsPage /> : <ProductsPage />;
      case "admin_orders":   
        return user?.role === "admin"    ? <AdminOrdersPage />   : <ProductsPage />;
      default:               
        return <ProductsPage />;
    }
  };

  return (
    <AppCtx.Provider value={{
      user, setUser,
      cart, setCart,
      lang, toggleLang,
      page, setPage,
      selectedProduct, setSelectedProduct,
    }}>
      <Navbar />
      {renderPage()}
    </AppCtx.Provider>
  );
}