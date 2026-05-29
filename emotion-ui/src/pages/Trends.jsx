import { useEffect, useState } from "react";
import { pageStyle } from "../styles/ui";
import AuthCard from "../components/AuthCard";
import { apiRequest } from "../api/client";

export default function Trends() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/trends");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.log(e);
      }
    };

    load();
  }, []);

  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2 style={title}> Тренды анализов</h2>

        {!data && <p style={{ opacity: 0.7 }}>Загрузка...</p>}

        {data && (
          <>
            <Chart title="Эмоции" items={data.emotions} color="#7b68ee" />
            <Chart title="Темы" items={data.topics} color="#4f7cff" />
          </>
        )}
      </AuthCard>
    </div>
  );
}

/* ===== ГРАФИК ===== */

function Chart({ title, items = [], color }) {
  const safe = Array.isArray(items) ? items : [];
  const max = Math.max(...safe.map(i => i.count), 1);

  return (
    <div style={block}>
      <h3 style={subtitle}>{title}</h3>

      {safe.map((item) => {
        const percent = (item.count / max) * 100;

        return (
          <div key={item.name} style={row}>
            <div style={label}>{item.name}</div>

            <div style={barBg}>
              <div
                style={{
                  ...bar,
                  width: `${percent}%`,
                  background: color,
                }}
              />
            </div>

            <div style={value}>{item.count}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== STYLES ===== */

const title = {
  fontSize: 26,
  marginBottom: 20,
};

const block = {
  marginTop: 20,
  padding: 15,
  borderRadius: 12,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const subtitle = {
  fontSize: 16,
  marginBottom: 12,
  color: "#cfd6e6",
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
};

const label = {
  width: 90,
  fontSize: 14,
  color: "#aab3c5",
};

const barBg = {
  flex: 1,
  height: 10,
  background: "rgba(255,255,255,0.08)",
  borderRadius: 6,
  overflow: "hidden",
};

const bar = {
  height: "100%",
  borderRadius: 6,
};

const value = {
  width: 30,
  textAlign: "right",
  color: "#e6eaf2",
};