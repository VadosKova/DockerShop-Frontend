import { useState } from "react";
import api from "../api/api";
import { useApp } from "../context/AppContext";
import { t } from "../i18n/i18n";

export default function CartPage() {
  const { cart, setCart, setPage } = useApp();
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const remove = (id) => setCart(cart.filter((i) => i.productId !== id));
  const changeQty = (id, delta) =>
    setCart(cart.map((i) => i.productId === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const placeOrder = async () => {
    setBusy(true); setErr("");
    try {
      await api.post("/orders", { items: cart });
      setCart([]);
      setPage("my_orders");
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally { setBusy(false); }
  };

  return (
    <div className="page">
      <h2 className="page-title page-center">{t("cart")}</h2>

      <div className="page-center">
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🛒</div>
            <p>{t("empty_cart")}</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.productId} className="cart-row">
                <div className="cart-row__info">
                  <div className="cart-row__name">{item.title}</div>
                  <div className="cart-row__price">
                    ${item.price} × {item.qty} ={" "}
                    <strong>${(item.price * item.qty).toFixed(2)}</strong>
                  </div>
                </div>

                <div className="cart-qty">
                  <button className="qty-btn" onClick={() => changeQty(item.productId, -1)}>−</button>
                  <span style={{ color: "var(--text)", minWidth: 24, textAlign: "center" }}>
                    {item.qty}
                  </span>
                  <button className="qty-btn" onClick={() => changeQty(item.productId, +1)}>+</button>
                  <button className="qty-btn remove" onClick={() => remove(item.productId)}>✕</button>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <div>
                <div className="section-label">{t("total")}</div>
                <div className="cart-total-price">${total.toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                {err && <span className="error-msg">{err}</span>}
                <button className="btn btn-primary" style={{ padding: "12px 32px", fontSize: 15 }}
                  onClick={placeOrder} disabled={busy}>
                  {busy ? t("loading") : t("place_order")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}