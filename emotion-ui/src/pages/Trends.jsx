import { pageStyle } from "../styles/ui";
import AuthCard from "../components/AuthCard";

export default function Trends() {
  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2>Тренды эмоций</h2>

        <p style={{ marginTop: 12, opacity: 0.8 }}>
          Графики и статистика появятся здесь.
        </p>
      </AuthCard>
    </div>
  );
}