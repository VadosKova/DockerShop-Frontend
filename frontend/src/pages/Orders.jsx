import { useState, useEffect } from "react";
import api from "../api/api";
import { t } from "../i18n/i18n";

const STATUS_COLORS = {
  Pending: "#F59E0B",
  Paid: "#10B981",
  Cancelled: "#EF4444",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner-lg" /></div>;

  return (
    <div className="orders-page">
      <h1 className="page-title">{t("orders")}</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">◇</div>
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <div className="order-card__id">
                  <span className="order-card__label">{t("order_id")}</span>
                  <span className="order-card__code">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div
                  className="order-status-badge"
                  style={{ background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status], borderColor: `${STATUS_COLORS[order.status]}44` }}
                >
                  {order.status}
                </div>
              </div>

              <div className="order-card__items">
                {order.items?.map((item, i) => (
                  <div key={i} className="order-card__item">
                    <span className="order-card__item-title">{item.title || item.productId}</span>
                    <span className="order-card__item-qty">×{item.qty}</span>
                    <span className="order-card__item-price">${((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-card__footer">
                <span className="order-card__total-label">{t("total")}</span>
                <span className="order-card__total-val">
                  ${order.items?.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}