import { useEffect, useState } from "react";
import instance from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    instance.get("/orders/my").then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map(o => (
        <div key={o._id}>
          {o.status}
        </div>
      ))}
    </div>
  );
}