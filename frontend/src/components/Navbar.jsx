import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useCart } from "../context/AppContext";
import { t, translations } from "../i18n/i18n";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout, lang, setLang } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "uk" : "en");
    forceUpdate(n => n + 1);
  };

  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/products" className="navbar__brand">
          DockerShop
        </Link>

        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <Link to="/products" className={`navbar__link ${isActive("/products") ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>
            {t("products")}
          </Link>
          <Link to="/cart" className={`navbar__link navbar__link--cart ${isActive("/cart") ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>
            {t("cart")}
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>
          <Link to="/orders" className={`navbar__link ${isActive("/orders") ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>
            {t("orders")}
          </Link>
          {user.role === "admin" && (
            <Link to="/admin" className={`navbar__link navbar__link--admin ${isActive("/admin") ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>
              {t("admin")}
            </Link>
          )}
        </div>

        <div className="navbar__actions">
          <button className="navbar__lang" onClick={toggleLang}>
            {translations[lang === "en" ? "uk" : "en"].change_language}
          </button>
          <span className="navbar__user">{user.role === "admin" ? "👑" : "👤"}</span>
          <button className="navbar__logout" onClick={handleLogout}>
            {t("logout")}
          </button>
          <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}