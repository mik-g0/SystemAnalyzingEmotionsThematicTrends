import { Link } from "react-router-dom";
import { pageStyle, linkStyle } from "../styles/ui";
import AuthCard from "../components/AuthCard";


export default function Home() {
  return (
    <div style={pageStyle}>
      <AuthCard>
        <h1>Emotion Analytics System</h1>

        <h2 style={{ opacity: 0.7, lineHeight: 1.5 }}>
          Платформа для анализа эмоциональных и тематических данных.</h2>
        <h2 style={{ opacity: 0.7, lineHeight: 1.5 }}>
            Здесь можно зарегистрироваться, войти и получить доступ к системе.</h2>


        <div style={{ marginTop: 20 }}>
          <Link to="/login" style={linkStyle}>Войти</Link>{" "}
          |{" "}
          <Link to="/register" style={linkStyle}>Регистрация</Link>
        </div>
      </AuthCard>
    </div>
  );
}