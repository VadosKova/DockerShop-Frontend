import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { t } from "../i18n/i18n";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(
        atob(res.data.token.split(".")[1])
      );

      localStorage.setItem("role", payload.role);
      navigate("/products");
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t("login")}</h1>
        <p className="auth-subtitle">
          Welcome back to your student marketplace
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button" onClick={submit}>
          {t("login")}
        </button>

        <p className="auth-link-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}