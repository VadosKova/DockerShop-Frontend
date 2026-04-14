import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "http://localhost:3000";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`${API}/products/${id}`)
      .then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-page">
      <h2>{product.title}</h2>
      <span className="category">{product.category}</span>
      <p>{product.description}</p>
      <h3>${product.price}</h3>
    </div>
  );
}