import { useState, useContext } from "react";
import instance from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await instance.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);

    const payload = JSON.parse(atob(res.data.token.split(".")[1]));
    setUser(payload);
  };

  return (
    <div>
      <h2>Login</h2>
      <input onChange={e => setEmail(e.target.value)} />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}