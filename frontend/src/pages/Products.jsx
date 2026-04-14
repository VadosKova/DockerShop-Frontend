import { useEffect, useState, useContext } from "react";
import instance from "../api/api";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { add } = useContext(CartContext);

  useEffect(() => {
    instance.get("/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.map(p => (
        <div key={p._id}>
          {p.title} - {p.price}
          <button onClick={() => add(p)}>Add</button>
        </div>
      ))}
    </div>
  );
}