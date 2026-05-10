import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pageStyle, linkStyle } from "../styles/ui";
import { register } from "../api/auth";

import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    try {
      const data = await register(email, password);

      if (!data) {
        setError("Ошибка регистрации");
        return;
      }

      // если backend сразу возвращает токен
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
      }

      navigate("/login"); // или "/" если хочешь авто-вход

    } catch (err) {
      console.log(err);
      setError("Ошибка регистрации. Попробуйте снова.");
    }
  };

  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2>Регистрация</h2>

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

        <Button onClick={handleRegister}>
          Создать аккаунт
        </Button>

        <p style={{ marginTop: 18, fontSize: 18 }}>
          Уже есть аккаунт?{" "}
          <Link to="/login" style={linkStyle}>
            Войти
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}