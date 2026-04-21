import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="page">
      <div className="card">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p>${product.price}</p>
        <button onClick={addToCart}>Add to cart</button>
      </div>
    </div>
  );
}