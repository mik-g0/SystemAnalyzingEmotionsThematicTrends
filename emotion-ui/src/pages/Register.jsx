import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await register(email, password);
      if (!data) {
        setError("Ошибка создания учетной записи");
        return;
      }
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
      }
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Ошибка регистрации. Сервер недоступен.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">

      <style>{`
        /* 1. Полный экран и глубокий черный цвет */
        .auth-page-wrapper {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          min-height: 100vh !important;
          width: 100vw !important;
          background-color: #000000 !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          margin: 0 !important;
          padding: 40px !important;
          box-sizing: border-box !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
        }

        /* 2. ГИГАНТСКАЯ КАРТОЧКА (Ширина 640px под стиль крупных ИИ-интерфейсов) */
        .custom-auth-card {
          width: 100% !important;
          max-width: 640px !important;
          background: #0d1117 !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 20px !important;
          padding: 64px 60px !important; /* Огромные внутренние отступы */
          box-sizing: border-box !important;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8) !important;
        }

        /* 3. Крупная плашка сверху */
        .auth-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 8px 18px !important;
          background: rgba(0, 188, 212, 0.05) !important;
          border: 1px solid rgba(0, 188, 212, 0.2) !important;
          border-radius: 30px !important;
          font-size: 0.9rem !important; /* Крупнее */
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
          color: #00bcd4 !important;
          margin-bottom: 32px !important;
        }

        .auth-badge-dot {
          width: 8px !important;
          height: 8px !important;
          background-color: #00bcd4 !important;
          border-radius: 50% !important;
          box-shadow: 0 0 10px #00bcd4 !important;
        }

        /* 4. Огромные заголовки */
        .auth-title {
          font-size: 3.2rem !important; /* Очень крупный заголовок, как на главной */
          font-weight: 800 !important;
          letter-spacing: -0.03em !important;
          color: #ffffff !important;
          margin: 0 0 16px 0 !important;
          text-align: center !important;
        }

        .auth-subtitle {
          font-size: 1.2rem !important; /* Крупный читаемый текст */
          color: #8c9ba5 !important;
          margin: 0 0 44px 0 !important;
          text-align: center !important;
          line-height: 1.6 !important;
        }

        /* 5. Массивные поля ввода */
        .input-field-wrapper {
          width: 100% !important;
          margin-bottom: 24px !important;
        }

        .input-field-wrapper input {
          width: 100% !important;
          height: 64px !important; /* Высокие инпуты */
          font-size: 1.2rem !important; /* Крупный текст внутри */
          padding: 0 20px !important;
          background-color: #161b22 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          border-radius: 10px !important;
          box-sizing: border-box !important;
        }

        /* Блок ошибки */
        .auth-error {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.08) !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
          padding: 16px !important;
          border-radius: 10px !important;
          font-size: 1.1rem !important;
          margin-bottom: 28px !important;
          text-align: center !important;
        }

        /* 6. Мощная кнопка */
        .custom-auth-btn-container {
          width: 100% !important;
          height: 64px !important; /* Высота в тон инпутам */
          margin-top: 16px !important;
        }

        .custom-auth-btn-container button {
          width: 100% !important;
          height: 100% !important;
          font-size: 1.25rem !important; /* Огромный текст на кнопке */
          font-weight: 700 !important;
          border-radius: 10px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.02em !important;
        }

        /* 7. Подвал формы */
        .auth-footer {
          margin-top: 40px !important;
          font-size: 1.1rem !important;
          color: #8c9ba5 !important;
          text-align: center !important;
        }

        .auth-link {
          color: #00bcd4 !important;
          text-decoration: none !important;
          font-weight: 700 !important;
          margin-left: 8px !important;
        }

        .auth-link:hover {
          text-decoration: underline !important;
        }
      `}</style>

      <div className="custom-auth-card">

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="auth-badge">
            <span className="auth-badge-dot"></span>
            Регистрация нового аналитика
          </div>
        </div>

        <h2 className="auth-title">Регистрация</h2>
        <p className="auth-subtitle">Создайте учетную запись для доступа к системе автоматизированного анализа текстовых данных</p>
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="input-field-wrapper">
          <Input
            type="email"
            placeholder="Электронная почта (Email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-field-wrapper">
          <Input
            type="password"
            placeholder="Пароль (Password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="custom-auth-btn-container">
          <Button onClick={handleRegister} disabled={loading}>
            {loading ? "Создание профиля..." : "Создать аккаунт"}
          </Button>
        </div>

        <p className="auth-footer">
          Уже есть аккаунт?
          <Link to="/login" className="auth-link">
            Войти в систему
          </Link>
        </p>
      </div>
    </div>
  );
}