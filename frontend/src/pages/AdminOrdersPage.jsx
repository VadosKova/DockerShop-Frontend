import { useState, useEffect } from "react";
import api from "../api/api";
import { t } from "../i18n/i18n";
import StatusBadge from "../components/StatusBadge";


const STATUSES = ["Pending", "Paid", "Shipped", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get("/orders").then((r) => setOrders(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div className="page">
      <h2 className="page-title">{t("manage_orders")}</h2>

      {loading ? (
        <p className="loading-text">{t("loading")}</p>
      ) : (
        <div style={{ maxWidth: 900 }}>
          {orders.map((o) => (
            <div key={o._id} className="order-card">
              <div className="order-card__head">
                <div>
                  <span className="order-id">Order #{o._id.slice(-8).toUpperCase()}</span>
                  <span style={{ color: "var(--gold-dim)", fontSize: 11, marginLeft: 16 }}>
                    User: {o.userId.slice(-8)}
                  </span>
                </div>
                <StatusBadge status={o.status} />
              </div>

              {/* Items */}
              <div style={{ marginBottom: 14 }}>
                {o.items.map((it, i) => (
                  <span key={i} className="item-tag">
                    {it.title} ×{it.qty}
                  </span>
                ))}
              </div>

              <div className="divider" />

              {/* Status buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ color: "var(--gold-muted)", fontSize: 11, letterSpacing: 1 }}>
                  {t("status").toUpperCase()}:
                </span>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`status-btn status-btn-${s}${o.status === s ? " active" : ""}`}
                    disabled={o.status === s}
                    onClick={() => updateStatus(o._id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}