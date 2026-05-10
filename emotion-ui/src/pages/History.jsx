import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { pageStyle } from "../styles/ui";

import AuthCard from "../components/AuthCard";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await apiRequest("/history");
        const data = await res.json();

        setItems(data);
      } catch (err) {
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2>История анализов</h2>

        {loading && <p style={{ marginTop: 10 }}>Загрузка...</p>}

        {!loading && items.length === 0 && (
          <p style={{ marginTop: 10 }}>История пуста</p>
        )}

        <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, index) => (
            <div key={item.id || index} style={cardStyle}>
              <p><b>Text:</b> {item.text}</p>
              <p><b>Emotion:</b> {item.emotion}</p>
              <p><b>Topic:</b> {item.topic}</p>
            </div>
          ))}
        </div>
      </AuthCard>
    </div>
  );
}

const cardStyle = {
  padding: 12,
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)"
};