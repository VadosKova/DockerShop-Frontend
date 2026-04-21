import { Link, useNavigate } from "react-router-dom";
import { t } from "../i18n/i18n";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const changeLang = () => {
    const current = localStorage.getItem("lang") || "en";
    localStorage.setItem("lang", current === "en" ? "ru" : "en");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h2>DockerShop</h2>

      <div className="nav-links">
        <Link to="/products">{t("products")}</Link>
        <Link to="/cart">{t("cart")}</Link>
        <Link to="/orders">{t("orders")}</Link>

        {role === "admin" && (
          <Link to="/admin">{t("admin")}</Link>
        )}

        <button onClick={changeLang}>{t("change_language")}</button>
        <button onClick={logout}>{t("logout")}</button>
      </div>
    </nav>
  );
}