import { createContext, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data, navigate) => {
    try {
      const res = await api.post("/auth/login", data);
      const token = res.data.token;

      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);

      if (payload.role === "admin") navigate("/admin");
      else navigate("/");
    } catch {
      navigate("/register");
    }
  };

  const register = async (data, navigate) => {
    await api.post("/auth/register", data);
    navigate("/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};