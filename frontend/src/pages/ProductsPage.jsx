import { useState, useEffect } from "react";
import api from "../api/api";
import { useApp } from "../context/AppContext";
import { t } from "../i18n/i18n";

export default function ProductsPage() {
  const { setPage, setSelectedProduct, cart, setCart, user } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const { data } = await api.get("/products", { params });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search, category]);

  const allCategories = ["", ...new Set(products.map((p) => p.category))];

  const addToCart = (p) => {
    const existing = cart.find((i) => i.productId === p._id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.productId === p._id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([
        ...cart,
        { productId: p._id, title: p.title, price: p.price, qty: 1 },
      ]);
    }
  };

  const openProduct = (p) => {
    setSelectedProduct(p);
    setPage("product");
  };

  return (
    <div className="page">
      <div className="hero">
        <h1 className="hero__title">Our Collection</h1>
        <p className="hero__sub">Handpicked products of exceptional quality</p>
      </div>

      <div className="filters">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c || t("all")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading-text">{t("loading")}</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p>{t("no_products")}</p>
        </div>
      ) : (
        <div className="product-grid page-wide">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onView={() => openProduct(p)}
              onCart={() => addToCart(p)}
              showCart={!!user && user.role === "customer"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product: p, onView, onCart, showCart }) {
  return (
    <div className="card">
      <div className="card__thumb" onClick={onView}>🛍</div>

      <div className="card__body">
        <span className="card__category">{p.category}</span>

        <h3 className="card__title" onClick={onView}>
          {p.title}
        </h3>

        <p className="card__desc">
          {p.description?.slice(0, 90)}…
        </p>

        <div className="card__footer">
          <span className="card__price">${p.price}</span>

          {showCart && (
            <button className="btn btn-primary btn-sm" onClick={onCart}>
              {t("add_to_cart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}