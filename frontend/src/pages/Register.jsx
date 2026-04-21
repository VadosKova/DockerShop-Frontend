import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AppContext";
import { t } from "../i18n/i18n";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      const res = await api.post("/auth/login", { email: form.email, password: form.password });
      login(res.data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-deco">
        <div className="auth-deco__circle auth-deco__circle--1" />
        <div className="auth-deco__circle auth-deco__circle--2" />
        <div className="auth-deco__circle auth-deco__circle--3" />
        <div className="auth-deco__text">DockerShop</div>
      </div>
      <div className="auth-card">
        <div className="auth-card__logo">◆</div>
        <h1 className="auth-card__title">{t("register")}</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label>{t("name")}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder=" "
              required
            />
          </div>
          <div className="auth-form__group">
            <label>{t("email")}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder=" "
              required
            />
          </div>
          <div className="auth-form__group">
            <label>{t("password")}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder=" "
              required
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : t("sign_up")}
          </button>
        </form>

        <p className="auth-switch">
          {t("have_account")}{" "}
          <Link to="/login">{t("sign_in")}</Link>
        </p>
      </div>
    </div>
  );
}