import { pageStyle, linkStyle, textLarge } from "../styles/ui";
import AuthCard from "../components/AuthCard";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2>О проекте</h2>

        <ul style={{ marginTop: 10, fontSize: 16, lineHeight: 1.6 }}>
          <li style={textLarge}>Анализ эмоций текста</li>
          <li style={textLarge}>Выделение тематических трендов</li>
          <li style={textLarge}>Frontend: React + Vite</li>
        </ul>

        <h3 style={{ marginTop: 25 }}>Перейти:</h3>

        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          <Link to="/analysis" style={linkStyle}>Анализ</Link>
          <Link to="/history" style={linkStyle}>История</Link>
          <Link to="/trends" style={linkStyle}>Тренды</Link>
        </div>

        <div style={{ marginTop: 15 }}>
          <LogoutButton />
        </div>
      </AuthCard>
    </div>
  );
}