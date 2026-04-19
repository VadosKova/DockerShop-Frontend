import { useState } from "react";
import api from "../api/api";
import { useApp } from "../context/AppContext";
import { t } from "../i18n/i18n";
import Field from "../components/Field";


export default function AuthPage({ mode }) {
  const { setUser, setPage } = useApp();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr]   = useState("");
  const [busy, setBusy] = useState(false);

  const f = (k) => (v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      if (mode === "register") {
        await api.post("/auth/register", form);
        setPage("login");
      } else {
        const { data } = await api.post("/auth/login", { email: form.email, password: form.password });
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        setUser({ id: payload.id, email: form.email, role: payload.role });
        setPage("products");
      }
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally { setBusy(false); }
  };

  const isLogin = mode === "login";

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-card__head">
          <div className="auth-card__icon">⚜</div>
          <h2 className="auth-card__title">{isLogin ? t("login") : t("register")}</h2>
        </div>

        {!isLogin && <Field label={t("name")} value={form.name} onChange={f("name")} />}
        <Field label={t("email")} value={form.email} onChange={f("email")} type="email" />
        <Field label={t("password")} value={form.password} onChange={f("password")} type="password" />

        {err && <p className="error-msg">{err}</p>}

        <button className="btn btn-primary btn-lg" onClick={submit} disabled={busy}>
          {busy ? t("loading") : t("submit")}
        </button>

        <p className="auth-card__foot">
          {isLogin ? (
            <>No account?{" "}
              <button onClick={() => setPage("register")}>{t("register")}</button>
            </>
          ) : (
            <>Already registered?{" "}
              <button onClick={() => setPage("login")}>{t("login")}</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}