import { Link } from "react-router-dom";
import { pageStyle, linkStyle } from "../styles/ui";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px" }}>
      <Link to="/analysis" style={linkStyle}>Анализ</Link>
      <Link to="/history" style={linkStyle}>История</Link>
      <Link to="/trends" style={linkStyle}>Тренды</Link>
      <Link to="/about" style={linkStyle}>О проекте</Link>
    </nav>
  );
}