import { useState, useEffect } from "react";
import api from "../api/api";
import { t, tCategory } from "../i18n/i18n";
import { useAuth } from "../context/AppContext";

const STATUS_OPTIONS = ["Pending", "Paid", "Cancelled"];
const STATUS_COLORS = {
  Pending: "#F59E0B",
  Paid: "#10B981",
  Cancelled: "#EF4444",
};
const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];
const emptyForm = { title: "", title_uk: "", category: "", description: "", description_uk: "", price: "" };

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
    api.get("/products").then((r) => setProducts(r.data)).finally(() => setLoading(false));
  };
  const loadOrders = () => {
    setLoading(true);
    api.get("/orders").then((r) => setOrders(r.data)).finally(() => setLoading(false));
  };
  const loadUsers = () => {
    setLoading(true);
    api.get("/users").then((r) => setUsers(r.data)).finally(() => setLoading(false));
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
        showToast("Updated!");
      } else {
        await api.post("/products", data);
        showToast("Created!");
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
    setForm({
      title: p.title || "",
      title_uk: p.title_uk || "",
      category: p.category || "",
      description: p.description || "",
      description_uk: p.description_uk || "",
      price: p.price || "",
    });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
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

  const field = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="admin-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-header">
        <h1 className="admin-header__title">{t("admin")}</h1>
        <div className="admin-tabs">
          {["products", "orders", "users"].map((t_) => (
            <button key={t_} className={`admin-tab ${tab === t_ ? "admin-tab--active" : ""}`} onClick={() => setTab(t_)}>
              {t(`manage_${t_}`)}
            </button>
          ))}
        </div>
      </div>

      {tab === "products" && (
        <div>
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
                      <input {...field("title")} required placeholder="iPhone 15" />
                    </div>
                    <div className="admin-form__group">
                      <label>{t("title_uk")}</label>
                      <input {...field("title_uk")} required placeholder="Айфон 15" />
                    </div>
                  </div>

                  <div className="admin-form__group">
                    <label>{t("category")}</label>
                    <select {...field("category")} required>
                      <option value="">—</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{tCategory(c)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form__row">
                    <div className="admin-form__group">
                      <label>{t("description")}</label>
                      <textarea {...field("description")} required rows={3} placeholder="Description in English" />
                    </div>
                    <div className="admin-form__group">
                      <label>{t("description_uk")}</label>
                      <textarea {...field("description_uk")} required rows={3} placeholder="Опис українською" />
                    </div>
                  </div>

                  <div className="admin-form__group">
                    <label>{t("price")} ($)</label>
                    <input type="number" step="0.01" min="0" {...field("price")} required placeholder="0.00" />
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
            <div className="skeleton-grid">{[...Array(4)].map((_, i) => <div key={i} className="skeleton" />)}</div>
          ) : (
            <div className="table">
              <div className="table-head">
                <span>{t("title")}</span><span>{t("category")}</span><span>{t("price")}</span><span>{t("actions")}</span>
              </div>
              {products.map((p) => (
                <div key={p._id} className="table-row">
                  <span>{p.title}{p.title_uk && <span className="text-muted"> / {p.title_uk}</span>}</span>
                  <span><span className="badge">{tCategory(p.category)}</span></span>
                  <span className="price">${p.price?.toFixed(2)}</span>
                  <div className="row-actions">
                    <button className="btn-edit" onClick={() => handleEdit(p)}>{t("edit")}</button>
                    <button className="btn-delete" onClick={() => handleDelete(p._id)}>{t("delete")}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div>
          <div className="admin-section__header">
            <h2>{t("all_orders")}</h2>
          </div>
          {loading ? (
            <div className="skeleton-grid">{[...Array(3)].map((_, i) => <div key={i} className="skeleton" />)}</div>
          ) : orders.length === 0 ? (
            <div className="empty-state"><p>No orders yet</p></div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card__header">
                    <div>
                      <div className="order-card__code">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-muted">User: {order.userId?.slice(-6)}</div>
                    </div>
                    <div className="status-badge" style={{ background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status], borderColor: `${STATUS_COLORS[order.status]}44` }}>
                      {order.status}
                    </div>
                  </div>
                  <div className="order-tags">
                    {order.items?.map((item, i) => (
                      <span key={i} className="order-tag">{item.title || item.productId} ×{item.qty}</span>
                    ))}
                  </div>
                  <div className="order-card__footer">
                    <span className="price">${order.items?.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0).toFixed(2)}</span>
                    <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="status-select">
                      {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "users" && (
        <div>
          <div className="admin-section__header">
            <h2>{t("manage_users")}</h2>
          </div>
          {loading ? (
            <div className="skeleton-grid">{[...Array(3)].map((_, i) => <div key={i} className="skeleton" />)}</div>
          ) : (
            <div className="table">
              <div className="table-head" style={{ gridTemplateColumns: "2fr 2fr 1fr 140px" }}>
                <span>Name</span><span>Email</span><span>{t("role")}</span><span>Actions</span>
              </div>
              {users.map((u) => (
                <div key={u._id} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 140px" }}>
                  <span>{u.name || "—"}</span>
                  <span className="text-muted">{u.email}</span>
                  <span>
                    <span className="badge" style={u.role === "admin" ? { background: "#eef0fd", borderColor: "#c7cefb", color: "#4f6ef7" } : {}}>
                      {u.role}
                    </span>
                  </span>
                  <div className="row-actions">
                    {u._id !== currentUser?.id ? (
                      <button
                        className={u.role === "admin" ? "btn-delete" : "btn-edit"}
                        onClick={() => handleRoleToggle(u)}
                      >
                        {u.role === "admin" ? t("remove_admin") : t("make_admin")}
                      </button>
                    ) : (
                      <span className="text-muted">you</span>
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