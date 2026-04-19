import { useState, useEffect } from "react";
import api from "../api/api";
import { t } from "../i18n/i18n";
import Field from "../components/Field";


const EMPTY = { title: "", category: "", description: "", price: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy]         = useState(false);

  const load = () =>
    api.get("/products").then((r) => setProducts(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const f = (k) => (v) => setForm({ ...form, [k]: v });

  const save = async () => {
    setBusy(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/products", payload);
      }
      setForm(EMPTY);
      load();
    } catch { }
    finally { setBusy(false); }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ title: p.title, category: p.category, description: p.description, price: String(p.price) });
  };

  const cancelEdit = () => { setEditingId(null); setForm(EMPTY); };

  const del = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="page">
      <h2 className="page-title">{t("add_product")}</h2>

      <div className="admin-grid page-wide">
        <div className="admin-form-card">
          <h3>{editingId ? t("edit") : t("add")} Product</h3>
          <Field label={t("title")}       value={form.title}       onChange={f("title")} />
          <Field label={t("category")}    value={form.category}    onChange={f("category")} />
          <Field label={t("description")} value={form.description} onChange={f("description")} />
          <Field label={t("price")}       value={form.price}       onChange={f("price")} type="number" />

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1, padding: 12 }}
              onClick={save} disabled={busy}>
              {busy ? t("loading") : editingId ? t("save") : t("add")}
            </button>
            {editingId && (
              <button className="btn btn-outline" onClick={cancelEdit}>
                {t("cancel")}
              </button>
            )}
          </div>
        </div>

        <div>
          {loading ? (
            <p className="loading-text">{t("loading")}</p>
          ) : (
            products.map((p) => (
              <div key={p._id} className="product-row">
                <div style={{ flex: 1 }}>
                  <div className="product-row__name">{p.title}</div>
                  <div className="product-row__meta">
                    {p.category} · <span>${p.price}</span>
                  </div>
                </div>
                <div className="product-row__actions">
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>
                    {t("edit")}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(p._id)}>
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}