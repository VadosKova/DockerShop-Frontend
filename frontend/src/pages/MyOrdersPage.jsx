import { useState, useEffect } from "react";
import api from "../api/api";
import { t } from "../i18n/i18n";
import StatusBadge from "../components/StatusBadge";


export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h2 className="page-title page-center">{t("my_orders")}</h2>

      <div className="page-center">
        {loading ? (
          <p className="loading-text">{t("loading")}</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <p>{t("no_orders")}</p>
          </div>
        ) : (
          orders.map((o) => {
            const total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
            return (
              <div key={o._id} className="order-card">
                <div className="order-card__head">
                  <span className="order-id">Order #{o._id.slice(-8).toUpperCase()}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="order-items">
                  {o.items.map((it, i) => (
                    <div key={i} className="order-item-row">
                      <span>{it.title} × {it.qty}</span>
                      <span>${(it.price * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  {t("total")}: ${total.toFixed(2)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}