import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const load = () => {
    api.get("/products").then((res) => setProducts(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const addProduct = async () => {
    await api.post("/products", {
      title,
      category: "General",
      description: "Student product",
      price
    });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="page">
      <h1>Admin Panel</h1>

      <div className="card">
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {products.map((item) => (
        <div className="card" key={item._id}>
          <h3>{item.title}</h3>
          <button onClick={() => remove(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}