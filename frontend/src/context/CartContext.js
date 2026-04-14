import { createContext, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const add = (item) => setCart([...cart, item]);

  return (
    <CartContext.Provider value={{ cart, add }}>
      {children}
    </CartContext.Provider>
  );
}