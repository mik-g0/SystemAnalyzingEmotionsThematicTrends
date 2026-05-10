import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pageStyle, linkStyle } from "../styles/ui";
import { login } from "../api/auth";

import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const data = await login(email, password);

      if (!data || !data.access_token) {
        setError("Неверный логин или пароль");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_id", data.user_id);

      navigate("/about");

    } catch (err) {
      console.log(err);
      setError("Ошибка входа. Попробуйте снова.");
    }
  };

  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2 style={{ marginBottom: 20 }}>Вход</h2>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>
            {error}
          </p>
        )}

        <Button onClick={handleLogin}>
          Войти
        </Button>

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