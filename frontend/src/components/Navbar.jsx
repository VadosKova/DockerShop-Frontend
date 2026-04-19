import { useApp } from "../context/AppContext";
import { t } from "../i18n/i18n";

export default function Navbar() {
  const { user, setUser, setCart, toggleLang, page, setPage, cart } = useApp();

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCart([]);
    setPage("products");
  };

  return (
    <nav className="navbar">
      <button className="navbar__logo" onClick={() => setPage("products")}>
        <span className="navbar__logo-icon">⚜</span>
        <span className="navbar__logo-text">Maison</span>
      </button>

      <div className="navbar__nav">
        <NavLink
          label={t("products")}
          active={page === "products"}
          onClick={() => setPage("products")}
        />

        {user?.role === "customer" && (
          <>
            <NavLink
              label={cartCount > 0 ? `${t("cart")} (${cartCount})` : t("cart")}
              active={page === "cart"}
              onClick={() => setPage("cart")}
            />
            <NavLink
              label={t("my_orders")}
              active={page === "my_orders"}
              onClick={() => setPage("my_orders")}
            />
          </>
        )}

        {user?.role === "admin" && (
          <>
            <NavLink
              label={t("add_product")}
              active={page === "admin_products"}
              onClick={() => setPage("admin_products")}
            />
            <NavLink
              label={t("manage_orders")}
              active={page === "admin_orders"}
              onClick={() => setPage("admin_orders")}
            />
          </>
        )}
      </div>

      <div className="navbar__right">
        <button className="btn-lang" onClick={toggleLang}>
          {t("change_lang")}
        </button>

        {user ? (
          <>
            <span className="navbar__user">
              {t("hello")},{" "}
              <strong>{user.email.split("@")[0]}</strong>
              {user.role === "admin" && (
                <span className="badge-admin">ADMIN</span>
              )}
            </span>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              {t("logout")}
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPage("login")}
            >
              {t("login")}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setPage("register")}
            >
              {t("register")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ label, active, onClick }) {
  return (
    <button
      className={`navbar__link${active ? " active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}