import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/AppContext";
import { t, tCategory } from "../i18n/i18n";
import { useAuth } from "../context/AppContext";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];

function getColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [toast, setToast] = useState("");
  const { addItem } = useCart();
  const { lang } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await api.get("/products", { params });
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const getTitle = (p) => lang === "uk" && p.title_uk ? p.title_uk : p.title;
  const getDesc = (p) => lang === "uk" && p.description_uk ? p.description_uk : p.description;

  const handleAdd = (product, e) => {
    e.stopPropagation();
    addItem(product);
    setToast(`${getTitle(product)} ${t("add_to_cart").toLowerCase()}!`);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="products-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="products-hero">
        <h1>{t("products")}</h1>
      </div>

      <div className="products-controls">
        <div className="search-box">
          <input
            className="search-box__input"
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="category-pills">
          <button className={`pill ${!category ? "pill--active" : ""}`} onClick={() => setCategory("")}>
            {t("filter_category")}
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`pill ${category === cat ? "pill--active" : ""}`} onClick={() => setCategory(cat === category ? "" : cat)}>
              {tCategory(cat)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="skeleton-grid">{[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 270 }} />)}</div>
      ) : products.length === 0 ? (
        <div className="empty-state"><p>{t("no_products")}</p></div>
      ) : (
        <div className="products-grid">
          {products.map((p) => {
            const color = getColor(p.title || "x");
            return (
              <div key={p._id} className="product-card" onClick={() => navigate(`/products/${p._id}`)}>
                <div className="product-card__image" style={{ background: `linear-gradient(135deg, ${color}33, ${color}66)` }}>
                  <div style={{ fontSize: 32, color }}>◈</div>
                  <div className="product-card__category-tag">{tCategory(p.category)}</div>
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{getTitle(p)}</h3>
                  <p className="product-card__desc">{getDesc(p)?.slice(0, 70)}…</p>
                  <div className="product-card__footer">
                    <span className="product-card__price">${p.price?.toFixed(2)}</span>
                    <button className="product-card__btn" onClick={(e) => handleAdd(p, e)}>
                      + {t("add_to_cart")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}