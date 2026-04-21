import { useAuth } from "../context/AppContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/AppContext";
import { t } from "../i18n/i18n";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];
function getColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const { lang } = useAuth();

  const getTitle = (p) => lang === "uk" && p.title_uk ? p.title_uk : p.title;
  const getDesc  = (p) => lang === "uk" && p.description_uk ? p.description_uk : p.description;

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="page-loading"><div className="spinner-lg" /></div>;
  if (!product) return <div className="page-loading"><p>Product not found</p></div>;

  const color = getColor(getTitle(product) || "x");
  const hasImage = product.image && !imgError;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← {t("back")}</button>

      <div className="detail-card">
        <div className="detail-card__image">
          {hasImage ? (
            <img
              src={`${API_URL}/products/image/${product.image}`}
              alt={getTitle(product)}
              className="detail-card__img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="detail-card__placeholder" style={{ background: `linear-gradient(135deg, ${color}22, ${color}55)` }}>
              <div className="detail-card__image-icon" style={{ color }}>◈</div>
            </div>
          )}
        </div>

        <div className="detail-card__info">
          <div className="detail-card__badge">✓ {t("in_stock")}</div>
          <h1 className="detail-card__title">{getTitle(product)}</h1>
          <p className="detail-card__desc">{getDesc(product)}</p>

          <div className="detail-meta-item">
            <span className="detail-meta-item__label">{t("category")}</span>
            <span className="detail-meta-item__value">{tCategory(product.category)}</span>
          </div>

          <div className="detail-card__purchase">
            <div className="detail-card__price">${product.price?.toFixed(2)}</div>
            <button
              className={`detail-card__btn ${added ? "detail-card__btn--added" : ""}`}
              onClick={handleAdd}
            >
              {added ? `✓ ${t("added")}` : `+ ${t("add_to_cart")}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}