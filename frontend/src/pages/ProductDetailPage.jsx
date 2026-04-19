import { useApp } from "../context/AppContext";
import { t } from "../i18n/i18n";

export default function ProductDetailPage() {
  const { selectedProduct: p, cart, setCart, setPage, user } = useApp();
  if (!p) return null;

  const addToCart = () => {
    const existing = cart.find((i) => i.productId === p._id);
    if (existing) {
      setCart(cart.map((i) => i.productId === p._id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { productId: p._id, title: p.title, price: p.price, qty: 1 }]);
    }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => setPage("products")}>
        ← {t("back")}
      </button>

      <div className="product-detail page-wide">
        <div className="product-detail__img">🛍</div>

        <div>
          <span className="card__category">{p.category}</span>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            color: "var(--text)",
            margin: "16px 0 12px",
          }}>
            {p.title}
          </h1>

          <p style={{ color: "var(--gold-muted)", lineHeight: 1.75, marginBottom: 28 }}>
            {p.description}
          </p>

          <div className="product-detail__price">${p.price}</div>
          <p className="in-stock">✓ {t("in_stock")}</p>

          {user?.role === "customer" && (
            <button
              className="btn btn-primary btn-lg"
              style={{ marginTop: 28 }}
              onClick={addToCart}
            >
              {t("add_to_cart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}