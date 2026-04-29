import { useState } from "react";
import { Link } from "react-router-dom";
import { pageStyle, linkStyle } from "../styles/ui";
import { login } from "../api/auth";

import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
    const handleLogin = async () => {
  const data = await login(username, password);

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user_id", data.user_id);
    };

  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2 style={{ marginBottom: 20 }}>Access Panel</h2>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button>Sign in</Button>

        <p style={{ marginTop: 18, fontSize: 18, opacity: 0.8 }}>
          Нет аккаунта?{" "}
          <Link to="/register" style={linkStyle}>
            Создать
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}