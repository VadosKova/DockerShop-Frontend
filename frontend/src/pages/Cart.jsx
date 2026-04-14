import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import instance from "../api/api";

export default function Cart() {
  const { cart, clear } = useContext(CartContext);

  const order = async () => {
    await instance.post("/orders", { items: cart });
    clear();
    alert("Order created");
  };

  return (
    <div>
      <h2>Cart</h2>

      {cart.map((c, i) => (
        <div key={i}>{c.title}</div>
      ))}

      <button onClick={order}>Order</button>
    </div>
  );
}