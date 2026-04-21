import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="page">
      <h1>Products</h1>

      <div className="grid">
        {products.map((item) => (
          <div className="card" key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <Link to={`/products/${item._id}`}>Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}