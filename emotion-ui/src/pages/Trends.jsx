import { useEffect, useState } from "react";
import { pageStyle } from "../styles/ui";
import { apiRequest } from "../api/client";

export default function Trends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("overview");

  const emotionTranslations = {
    sadness: "Грусть",
    joy: "Радость",
    neutral: "Нейтрально",
    disgust: "Отвращение",
    anger: "Гнев",
    fear: "Страх",
    surprise: "Удивление",
    unknown: "Неизвестно",
  };

  const topicTranslations = {
    shopping: "Покупки",
    work: "Работа",
    social: "Социум",
    technology: "Технологии",
    health: "Здоровье",
    family: "Семья",
    money: "Финансы",
    education: "Образование",
    entertainment: "Развлечения",
    food: "Еда",
    travel: "Путешествия",
    pets: "Домашние животные",
    work_stress: "Стресс на работе",
    empty: "Пусто",
    unknown: "Неизвестно",
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/trends");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to load trends:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div style={{ ...pageStyle, background: "transparent", display: "block", width: "100%" }}>
        <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "40px 0" }}>
          <p style={{ opacity: 0.6, textAlign: "center", padding: "40px", color: "#A0AEC0", fontSize: "1.1rem" }}>
            Загрузка аналитики трендов...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ ...pageStyle, background: "transparent", display: "block", width: "100%" }}>
        <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "40px 0" }}>
          <p style={{ opacity: 0.6, textAlign: "center", padding: "40px", color: "#A0AEC0", fontSize: "1.1rem" }}>
            Данные для анализа трендов не найдены. Проанализируйте несколько текстов.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...pageStyle,
        /* УБИВАЕМ синюю рамку и сжатие из pageStyle */
        background: "transparent",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
        display: "block",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        padding: "40px 0"
      }}
    >
      <style>{`
        .trends-wrapper {
          display: block !important;
          width: 100% !important;
          max-width: 1100px !important;
          margin: 0 auto !important;
          padding: 0 20px 60px 20px !important;
          box-sizing: border-box !important;
        }

        .trends-card {
          width: 100% !important;
          background: #161B22 !important; /* Цвет как на странице О проекте */
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 16px !important;
          padding: 48px !important;
          box-sizing: border-box !important;
        }

        .trends-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 36px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 24px;
          gap: 20px;
        }

        .trends-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 2.2rem !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
          color: #ffffff !important;
          margin: 0 !important;
        }

        .trends-tabs {
          display: flex;
          gap: 10px;
        }

        .trends-tab-btn {
          padding: 12px 20px !important;
          border-radius: 8px !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          background: transparent !important;
          border: 1px solid transparent !important;
          color: #718096 !important;
        }

        .trends-tab-btn:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.03) !important;
        }

        .trends-tab-btn.active {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .metric-card {
          padding: 32px !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 12px !important;
        }

        .metric-label {
          font-size: 0.9rem !important;
          font-weight: 700 !important;
          color: #718096 !important;
          margin-bottom: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
        }

        .metric-value {
          font-size: 3rem !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          letter-spacing: -0.02em !important;
          line-height: 1.1;
        }

        .metric-subtext {
          font-size: 0.95rem !important;
          color: #8A94A6 !important;
          margin-top: 12px !important;
        }

        .section-title {
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          margin: 48px 0 24px 0 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding-bottom: 12px !important;
        }

        .chart-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 18px;
        }

        .chart-label {
          width: 180px !important;
          font-size: 1.05rem !important;
          color: #B0BCCB !important;
          flex-shrink: 0;
        }

        .chart-bar-track {
          flex: 1;
          height: 24px !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border-radius: 6px !important;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.02) !important;
        }

        .chart-bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .chart-value {
          width: 60px !important;
          text-align: right;
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          flex-shrink: 0;
        }

        .growth-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .growth-positive {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        .alert-item {
          padding: 24px !important;
          background: rgba(239, 68, 68, 0.03) !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
          border-radius: 12px !important;
          margin-bottom: 16px !important;
          font-size: 1.05rem !important;
          color: #B0BCCB !important;
          line-height: 1.6 !important;
        }

        .alert-date {
          font-weight: 700;
          color: #ef4444;
          letter-spacing: 0.02em;
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px !important;
          margin-top: 24px !important;
        }

        @media (max-width: 900px) {
          .timeline-grid { grid-template-columns: repeat(2, 1fr); }
          .metrics-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .timeline-grid { grid-template-columns: 1fr; }
        }

        .timeline-day-block {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 12px !important;
          padding: 24px !important;
          display: flex;
          flex-direction: column;
        }

        .timeline-date {
          font-weight: 700 !important;
          color: #ffffff !important;
          margin-bottom: 20px !important;
          font-size: 1.1rem !important;
          letter-spacing: 0.02em !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
          padding-bottom: 12px !important;
        }

        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .timeline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem !important;
          color: #B0BCCB !important;
        }

        .timeline-label {
          color: #A0AEC0;
        }

        .timeline-count {
          font-weight: 700 !important;
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.06) !important;
          padding: 4px 10px !important;
          border-radius: 4px !important;
          font-size: 0.95rem !important;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px !important;
          color: #718096 !important;
          font-size: 1.05rem !important;
          border: 1px dashed rgba(255, 255, 255, 0.05) !important;
          border-radius: 12px !important;
        }
      `}</style>

      <div className="trends-wrapper">
        <div className="trends-card">
          <div className="trends-header">
            <h1 className="trends-title">Аналитика трендов</h1>
            <div className="trends-tabs">
              <button
                className={`trends-tab-btn ${view === "overview" ? "active" : ""}`}
                onClick={() => setView("overview")}
              >
                Обзор
              </button>
              <button
                className={`trends-tab-btn ${view === "timeline" ? "active" : ""}`}
                onClick={() => setView("timeline")}
              >
                Архив
              </button>
              {data.alerts && data.alerts.length > 0 && (
                <button
                  className={`trends-tab-btn ${view === "alerts" ? "active" : ""}`}
                  onClick={() => setView("alerts")}
                >
                  Всплески ({data.alerts.length})
                </button>
              )}
            </div>
          </div>

          {/* ===== OVERVIEW ===== */}
          {view === "overview" && (
            <>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Эмоциональный индекс</div>
                  <div className="metric-value">{data.emotional_index || 50}</div>
                  <div className="metric-subtext">
                    {data.emotional_index > 60
                      ? "Позитивный фон"
                      : data.emotional_index > 40
                      ? "Нейтральный фон"
                      : "Негативный фон"}
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Позитивные комментарии</div>
                  <div className="metric-value">{data.positive_ratio || 0}%</div>
                  <div className="metric-subtext">Доля позитивного контента</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Негативные комментарии</div>
                  <div
                    className="metric-value"
                    style={{
                      color: (data.negative_ratio || 0) > 40 ? "#ef4444" : "#10b981",
                    }}
                  >
                    {data.negative_ratio || 0}%
                  </div>
                  <div className="metric-subtext">Доля критического контента</div>
                </div>
              </div>

              <div>
                <h2 className="section-title">Распределение эмоций</h2>
                {data.emotions && data.emotions.length > 0 ? (
                  data.emotions.map((e) => {
                    const percent = data.total_analyzed
                      ? ((e.count / data.total_analyzed) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={e.name} className="chart-row">
                        <div className="chart-label">
                          {emotionTranslations[e.name.toLowerCase()] || e.name}
                        </div>
                        <div className="chart-bar-track">
                          <div
                            className="chart-bar-fill"
                            style={{
                              width: `${percent}%`,
                              background: getEmotionColor(e.name),
                            }}
                          />
                        </div>
                        <div className="chart-value">{percent}%</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">Данные отсутствуют</div>
                )}
              </div>

               <div>
                <h2 className="section-title">Распределение тем</h2>
                {data.topics && data.topics.length > 0 ? (
                  data.topics
                    .filter(t => t.name !== "empty") // Исключаем "empty"
                    .map((t) => {
                      const percent = data.total_analyzed
                        ? ((t.count / data.total_analyzed) * 100).toFixed(1)
                        : 0;
                      return (
                      <div key={t.name} className="chart-row">
                        <div className="chart-label">
                          {topicTranslations[t.name.toLowerCase()] || t.name}
                        </div>
                        <div className="chart-bar-track">
                          <div
                            className="chart-bar-fill"
                            style={{
                              width: `${percent}%`,
                              background: "rgba(255, 255, 255, 0.4)",
                            }}
                          />
                        </div>
                        <div className="chart-value">{percent}%</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">Данные отсутствуют</div>
                )}
              </div>

              {data.top_growing_topics && data.top_growing_topics.length > 0 && (
                <div>
                  <h2 className="section-title">Быстрорастущие темы</h2>
                  {data.top_growing_topics.map((t, i) => (
                    <div key={i} className="chart-row">
                      <div className="chart-label">
                        {topicTranslations[t.topic.toLowerCase()] || t.topic}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", color: "#718096", marginBottom: 6 }}>
                          {t.old_ratio}% → {t.recent_ratio}%
                        </div>
                        <span className="growth-badge growth-positive">
                          + {t.growth_pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===== TIMELINE ===== */}
          {view === "timeline" && (
            <>
              <h2 className="section-title">Эмоциональная детализация по дням (последние 30 дней)</h2>
              {data.timeline && Object.keys(data.timeline).length > 0 ? (
                <div className="timeline-grid">
                  {Object.entries(data.timeline)
                    .reverse()
                    .map(([date, dayData]) => (
                      <div key={date} className="timeline-day-block">
                        <div className="timeline-date">{date}</div>
                        <div className="timeline-items">
                          {dayData.emotions &&
                            Object.entries(dayData.emotions).map(([emotion, count]) => (
                              <div key={emotion} className="timeline-item">
                                <span className="timeline-label">
                                  {emotionTranslations[emotion.toLowerCase()] || emotion}
                                 </span>
                                <span className="timeline-count">{count}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="empty-state">Недостаточно данных для анализа динамики</div>
              )}
            </>
          )}

          {/* ===== ALERTS ===== */}
          {view === "alerts" && (
            <>
              <h2 className="section-title">Критические изменения фона</h2>
              {data.alerts && data.alerts.length > 0 ? (
                data.alerts.map((alert, i) => (
                  <div key={i} className="alert-item">
                    <div style={{ marginBottom: 12 }}>
                      <span className="alert-date">{alert.date}</span>
                      {alert.severity === "high" && (
                        <span style={{ marginLeft: 12, padding: "4px 8px", background: "rgba(239, 68, 68, 0.15)", borderRadius: "6px", color: "#ef4444", fontWeight: 700, fontSize: "0.85rem" }}>
                          КРИТИЧЕСКИЙ УРОВЕНЬ
                        </span>
                      )}
                    </div>
                    <div>
                      Зафиксирован всплеск негативных комментариев:{" "}
                      <strong>{alert.negative_ratio}%</strong> из {alert.count} сообщений.
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Существенных отклонений не зафиксировано</div>
              )}
            </>
          )}

          <div style={{ marginTop: 50, paddingTop: 24, borderTop: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "1rem", color: "#718096" }}>
            Всего обработано: <strong style={{ color: "#ffffff" }}>{data.total_analyzed}</strong> сообщений за <strong style={{ color: "#ffffff" }}>период в 30 дней</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== HELPERS ===== */
function getEmotionColor(emotion) {
  const colors = {
    joy: "#10b981",
    surprise: "#3b82f6",
    neutral: "#6b7280",
    fear: "#f59e0b",
    sadness: "#8b5cf6",
    anger: "#ef4444",
    disgust: "#06b6d4",
  };
  return colors[emotion.toLowerCase()] || "#718096";
}