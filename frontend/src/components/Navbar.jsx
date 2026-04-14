import { Link } from "react-router-dom";
import { t } from "../i18n/i18n";

export default function Navbar() {
  return (
    <nav>
      <Link to="/products">{t("products")}</Link> | 
      <Link to="/cart">{t("cart")}</Link> | 
      <Link to="/orders">{t("orders")}</Link> | 
      <Link to="/admin">{t("admin")}</Link>
      <button onClick={() => {
        const lang = localStorage.getItem("lang") === "en" ? "ru" : "en";
        localStorage.setItem("lang", lang);
        window.location.reload();
      }}>
        {t("change_language")}
      </button>
    </nav>
  );
}