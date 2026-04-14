import { useEffect, useState } from "react";
import instance from "../api/api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const load = () => {
    instance.get("/products").then(res => setProducts(res.data));
  };

  useEffect(load, []);

  const create = async () => {
    await instance.post("/products", { title, category, description, price });
    load();
  };

  const remove = async (id) => {
    await instance.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <h2>Admin</h2>

      <input placeholder="title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="category" onChange={e => setCategory(e.target.value)} />
      <input placeholder="description" onChange={e => setDescription(e.target.value)} />
      <input placeholder="price" onChange={e => setPrice(e.target.value)} />
      <button onClick={create}>Create</button>

      {products.map(p => (
        <div key={p._id}>
          {p.title}
          <button onClick={() => remove(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}