import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [lang, setLangState] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const setLang = (l) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, lang, setLang }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// --- Cart Context ---
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });

  const save = (newItems) => {
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  const addItem = (product) => {
    const existing = items.find((i) => i._id === product._id);
    if (existing) {
      save(items.map((i) => i._id === product._id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      save([...items, { ...product, qty: 1 }]);
    }
  };

  const removeItem = (id) => save(items.filter((i) => i._id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id);
    save(items.map((i) => i._id === id ? { ...i, qty } : i));
  };
  const clearCart = () => save([]);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);