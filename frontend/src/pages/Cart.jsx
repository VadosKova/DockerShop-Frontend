import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/AppContext";
import api from "../api/api";
import { t } from "../i18n/i18n";

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ productId: i._id, title: i.title, price: i.price, qty: i.qty }));
      await api.post("/orders", { items: orderItems });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="cart-page">
        <div className="success-state">
          <div className="success-state__icon">✓</div>
          <h2>{t("order_placed")}</h2>
          <p>Redirecting to your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">{t("cart")}</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">◇</div>
          <p>{t("empty_cart")}</p>
          <button className="empty-state__btn" onClick={() => navigate("/products")}>
            {t("products")} →
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item__info">
                  <h3 className="cart-item__title">{item.title}</h3>
                  <span className="cart-item__category">{item.category}</span>
                </div>
                <div className="cart-item__controls">
                  <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                </div>
                <div className="cart-item__price">${(item.price * item.qty).toFixed(2)}</div>
                <button className="cart-item__remove" onClick={() => removeItem(item._id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="cart-summary__title">{t("total")}</h2>
            <div className="cart-summary__items">
              {items.map((i) => (
                <div key={i._id} className="cart-summary__row">
                  <span>{i.title} ×{i.qty}</span>
                  <span>${(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary__total">
              <span>{t("total")}</span>
              <span className="cart-summary__total-price">${total.toFixed(2)}</span>
            </div>
            <button className="cart-order-btn" onClick={handleOrder} disabled={loading}>
              {loading ? <span className="spinner" /> : t("place_order")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}