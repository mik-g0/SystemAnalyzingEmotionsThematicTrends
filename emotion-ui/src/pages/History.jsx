import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

// Добавь эти словари ПЕРЕД функцией export default function History() {
const emotionTranslations = {
  "sadness": "Грусть",
  "joy": "Радость",
  "neutral": "Нейтрально",
  "disgust": "Отвращение",
  "anger": "Гнев",
  "fear": "Страх",
  "surprise": "Удивление"
};

const topicTranslations = {
  "shopping": "Покупки",
  "work": "Работа",
  "social": "Социум / Общение",
  "technology": "Технологии",
  "health": "Здоровье",
  "unknown": "Неизвестно / Общее",
  "finance": "Финансы",
  "education": "Образование"
};

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(15); // Состояние для пагинации



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
    <div style={pageContainer}>
      {/* КРУПНАЯ ТИПОГРАФИКА */}
      <header style={headerSection}>
        <h2 style={title}>История анализов</h2>
        <p style={subtitle}>Архив лингвистических логов и вычисленных эмоциональных маркеров</p>
      </header>

      {/* ЛОАДЕР ЗАГРУЗКИ */}
      {loading && (
        <div style={statusMessage}>
          <div style={spinner}></div>
          <span>Запрос к базе данных...</span>
        </div>
      )}

      {/* ПУСТАЯ ИСТОРИЯ */}
      {!loading && items.length === 0 && (
        <div style={emptyState}>
          <p style={emptyText}>Архив пуст. Проведенные анализы появятся здесь автоматически.</p>
        </div>
      )}

      {/* СПИСОК КАРТОЧЕК С ОГРАНИЧЕНИЕМ ПО ПАГИНАЦИИ */}
      <div style={listContainer}>
        {items.slice(0, visibleCount).map((item, index) => (
          <div
            key={item.id || index}
            style={historyCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Upper Panel: Metadata & Tags */}
            <div style={cardHeader}>
              <span style={metaLabel}>ЛОГ #{items.length - index}</span>

              <div style={tagGroup}>
                {/* Источник данных */}
                {item.file_name ? (
                  <span style={sourceTag}>FILE: {item.file_name}</span>
                ) : item.url ? (
                  <span style={sourceTag}>ИСТОЧНИК: URL</span>
                ) : (
                  <span style={sourceTag}>ИСТОЧНИК: ТЕКСТ</span>
                )}

                {/* Тематика */}
                {item.topic && (
                  <span style={topicTag}>
                    ТЕМА: {topicTranslations[item.topic.toLowerCase()] || item.topic}
                  </span>
                )}

                {/* Переведенная эмоция */}
                {item.emotion && (
                  <span style={emotionTag}>
                    {emotionTranslations[item.emotion.toLowerCase()] || item.emotion}
                  </span>
                )}
              </div>
            </div>

            {/* Текст аналитики */}
            <div style={cardBody}>
              <p style={textPreview}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* СТРОГАЯ КНОПКА ПАГИНАЦИИ */}
      {!loading && items.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 15)}
          style={loadMoreBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#161B22";
            e.currentTarget.style.color = "#A0AEC0";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
          }}
        >
          Показать более старые логи
        </button>
      )}
    </div>
  );
}

/* ===== СТИЛИ С ВЫВЕРЕННЫМ КОНТРАСТОМ И ЧИТАЕМОСТЬЮ ===== */

const pageContainer = {
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "10px 0 60px 0",
  boxSizing: "border-box"
};

const headerSection = {
  marginBottom: "48px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  paddingBottom: "24px"
};

const title = {
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  fontSize: "42px",
  fontWeight: "800",
  color: "#ffffff",
  margin: "0 0 12px 0",
  letterSpacing: "-0.02em"
};

const subtitle = {
  fontSize: "17px",
  color: "#8A94A6",
  margin: 0,
  lineHeight: "1.5"
};

const listContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "24px"
};

const historyCard = {
  padding: "40px",
  borderRadius: "16px",
  background: "#0D1117",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  cursor: "default",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  gap: "20px",
  flexWrap: "wrap"
};

const metaLabel = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#718096",
  letterSpacing: "0.06em"
};

const tagGroup = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const baseTag = {
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.03em"
};

const sourceTag = {
  ...baseTag,
  color: "#A0AEC0",
  background: "#161B22",
  border: "1px solid rgba(255, 255, 255, 0.05)"
};

const topicTag = {
  ...baseTag,
  color: "#E2E8F0",
  background: "rgba(113, 128, 150, 0.15)",
  border: "1px solid rgba(113, 128, 150, 0.3)"
};

const emotionTag = {
  ...baseTag,
  color: "#ffffff",
  background: "#4A5568",
  border: "1px solid #5A6578"
};

const cardBody = {
  position: "relative"
};

const textPreview = {
  fontSize: "18px",
  lineHeight: "1.8",
  color: "#B0BCCB",
  letterSpacing: "0.01em",
  margin: 0,
  wordBreak: "break-word",
  fontWeight: "400"
};

/* КНОПКА ПОКАЗАТЬ ЕЩЕ */
const loadMoreBtn = {
  display: "block",
  width: "280px",
  height: "54px",
  margin: "54px auto 0 auto",
  background: "#161B22",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  color: "#A0AEC0",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const statusMessage = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "32px 0",
  color: "#A0AEC0",
  fontSize: "18px"
};

const spinner = {
  width: "24px",
  height: "24px",
  border: "3px solid rgba(255, 255, 255, 0.05)",
  borderTop: "3px solid #4A5568",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

const emptyState = {
  padding: "80px 40px",
  border: "1px dashed rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  textAlign: "center"
};

const emptyText = {
  fontSize: "18px",
  color: "#718096",
  margin: 0
};