import { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="page">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div className="card" key={order._id}>
          <p>Status: {order.status}</p>
          <p>Items: {order.items.length}</p>
        </div>
      ))}
    </div>
  );
}