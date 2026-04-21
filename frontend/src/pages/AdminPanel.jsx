import { useState, useEffect } from "react";
import api from "../api/api";
import { t } from "../i18n/i18n";
import { useAuth } from "../context/AppContext";

const STATUS_OPTIONS = ["Pending", "Paid", "Shipped", "Cancelled"];
const STATUS_COLORS = {
  Pending: "#F59E0B",
  Paid: "#10B981",
  Shipped: "#3B82F6",
  Cancelled: "#EF4444",
};
const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];
const emptyForm = { title: "", category: "", description: "", price: "" };

export default function AdminPanel() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const loadProducts = () => {
    setLoading(true);
    api.get("/products").then((res) => setProducts(res.data)).finally(() => setLoading(false));
  };
  const loadOrders = () => {
    setLoading(true);
    api.get("/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  };
  const loadUsers = () => {
    setLoading(true);
    api.get("/users").then((res) => setUsers(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === "products") loadProducts();
    else if (tab === "orders") loadOrders();
    else if (tab === "users") loadUsers();
  }, [tab]);

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price) };
    try {
      if (editId) {
        await api.put(`/products/${editId}`, data);
        showToast("Product updated!");
      } else {
        await api.post("/products", data);
        showToast("Product created!");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (p) => {
    setForm({ title: p.title, category: p.category, description: p.description, price: p.price });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    showToast("Deleted!");
    loadProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    showToast("Status updated!");
    loadOrders();
  };

  const handleRoleToggle = async (u) => {
    const newRole = u.role === "admin" ? "customer" : "admin";
    try {
      await api.put(`/users/${u._id}/role`, { role: newRole });
      showToast(`${u.name || u.email} → ${newRole}`);
      loadUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="admin-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-header">
        <h1 className="admin-header__title">{t("admin")}</h1>
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === "products" ? "admin-tab--active" : ""}`} onClick={() => setTab("products")}>
            {t("manage_products")}
          </button>
          <button className={`admin-tab ${tab === "orders" ? "admin-tab--active" : ""}`} onClick={() => setTab("orders")}>
            {t("manage_orders")}
          </button>
          <button className={`admin-tab ${tab === "users" ? "admin-tab--active" : ""}`} onClick={() => setTab("users")}>
            {t("manage_users")}
          </button>
        </div>
      </div>

      {tab === "products" && (
        <div className="admin-section">
          <div className="admin-section__header">
            <h2>{t("manage_products")}</h2>
            <button className="admin-add-btn" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>
              + {t("add_product")}
            </button>
          </div>

          {showForm && (
            <div className="admin-form-overlay">
              <div className="admin-form-card">
                <h3 className="admin-form-card__title">{editId ? t("edit") : t("add_product")}</h3>
                <form onSubmit={handleSave} className="admin-form">
                  <div className="admin-form__row">
                    <div className="admin-form__group">
                      <label>{t("title")}</label>
                      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Product name" />
                    </div>
                    <div className="admin-form__group">
                      <label>{t("category")}</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                        <option value="">Select category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="admin-form__group">
                    <label>{t("description")}</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Product description" rows={3} />
                  </div>
                  <div className="admin-form__group">
                    <label>{t("price")} ($)</label>
                    <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="0.00" />
                  </div>
                  <div className="admin-form__actions">
                    <button type="button" className="admin-cancel-btn" onClick={() => setShowForm(false)}>{t("cancel")}</button>
                    <button type="submit" className="admin-save-btn">{t("save")}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-grid">{[...Array(4)].map((_, i) => <div key={i} className="product-skeleton" />)}</div>
          ) : (
            <div className="admin-products-table">
              <div className="admin-table-head">
                <span>Title</span><span>Category</span><span>Price</span><span>Actions</span>
              </div>
              {products.map((p) => (
                <div key={p._id} className="admin-table-row">
                  <span className="admin-table-row__title">{p.title}</span>
                  <span className="admin-table-row__cat"><span className="cat-badge">{p.category}</span></span>
                  <span className="admin-table-row__price">${p.price?.toFixed(2)}</span>
                  <div className="admin-table-row__actions">
                    <button className="admin-edit-btn" onClick={() => handleEdit(p)}>{t("edit")}</button>
                    <button className="admin-delete-btn" onClick={() => handleDelete(p._id)}>{t("delete")}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="admin-section">
          <div className="admin-section__header">
            <h2>{t("all_orders")}</h2>
          </div>
          {loading ? (
            <div className="loading-grid">{[...Array(4)].map((_, i) => <div key={i} className="product-skeleton" />)}</div>
          ) : orders.length === 0 ? (
            <div className="empty-state"><div className="empty-state__icon">◇</div><p>No orders yet</p></div>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => (
                <div key={order._id} className="admin-order-card">
                  <div className="admin-order-card__header">
                    <div>
                      <div className="admin-order-card__id">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="admin-order-card__user">User: {order.userId?.slice(-6)}</div>
                    </div>
                    <div
                      className="order-status-badge"
                      style={{ background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status], borderColor: `${STATUS_COLORS[order.status]}44` }}
                    >
                      {order.status}
                    </div>
                  </div>
                  <div className="admin-order-card__items">
                    {order.items?.map((item, i) => (
                      <span key={i} className="admin-order-item">{item.title || item.productId} ×{item.qty}</span>
                    ))}
                  </div>
                  <div className="admin-order-card__footer">
                    <span className="admin-order-total">
                      ${order.items?.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0).toFixed(2)}
                    </span>
                    <div className="admin-status-select">
                      <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                        {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "users" && (
        <div className="admin-section">
          <div className="admin-section__header">
            <h2>{t("manage_users")}</h2>
          </div>
          {loading ? (
            <div className="loading-grid">{[...Array(4)].map((_, i) => <div key={i} className="product-skeleton" />)}</div>
          ) : (
            <div className="admin-products-table">
              <div className="admin-table-head" style={{ gridTemplateColumns: "2fr 2fr 1fr 140px" }}>
                <span>Name</span><span>Email</span><span>{t("role")}</span><span>Actions</span>
              </div>
              {users.map((u) => (
                <div key={u._id} className="admin-table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 140px" }}>
                  <span className="admin-table-row__title">{u.name || "—"}</span>
                  <span style={{ fontSize: 13, color: "#555" }}>{u.email}</span>
                  <span>
                    <span className="cat-badge" style={u.role === "admin" ? { background: "#eef0fd", borderColor: "#c7cefb", color: "#4f6ef7" } : {}}>
                      {u.role}
                    </span>
                  </span>
                  <div className="admin-table-row__actions">
                    {u._id !== currentUser?.id ? (
                      <button
                        className={u.role === "admin" ? "admin-delete-btn" : "admin-edit-btn"}
                        onClick={() => handleRoleToggle(u)}
                      >
                        {u.role === "admin" ? t("remove_admin") : t("make_admin")}
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: "#aaa" }}>you</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}