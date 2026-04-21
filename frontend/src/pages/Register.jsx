import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    let role = "customer";

    if (
      name === "admin" &&
      email === "admin@gmail.com" &&
      password === "1234"
    ) {
      role = "admin";
    }

    await api.post("/auth/register", {
      name,
      email,
      password,
      role
    });

    navigate("/login");
  };

  return (
    <div className="page center">
      <div className="card">
        <h1>Register</h1>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submit}>Register</button>
      </div>
    </div>
  );
}