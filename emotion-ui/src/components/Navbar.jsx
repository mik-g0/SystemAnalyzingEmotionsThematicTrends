import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Главная</Link>
      <Link to="/analysis">Анализ</Link>
      <Link to="/history">История</Link>
      <Link to="/trends">Тренды</Link>
      <Link to="/about">О проекте</Link>
    </nav>
  );
}