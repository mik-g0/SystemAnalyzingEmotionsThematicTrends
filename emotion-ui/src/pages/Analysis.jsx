import { useState } from "react";
import { apiRequest } from "../api/client";

export default function Analysis() {
  const [text, setText] = useState("");
  const [batchText, setBatchText] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [inputMode, setInputMode] = useState("text"); // text | batch | file | url
  const [result, setResult] = useState(null);
  const [batchResult, setBatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setBatchResult(null);

      let res;
      let data;

      if (inputMode === "text") {
        res = await apiRequest("/analysis", {
          method: "POST",
          body: JSON.stringify({ text }),
        });
        if (!res.ok) {
          setError(`Ошибка сервера: ${res.status}`);
          setLoading(false);
          return;
        }
        data = await res.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setResult(data);
      }

      if (inputMode === "batch") {
        const lines = batchText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        if (lines.length === 0) {
          setError("Добавьте хотя бы один комментарий (по одному на строку)");
          setLoading(false);
          return;
        }

        res = await apiRequest("/analysis/batch", {
          method: "POST",
          body: JSON.stringify({ texts: lines }),
        });
        if (!res.ok) {
          setError(`Ошибка сервера: ${res.status}`);
          setLoading(false);
          return;
        }
        data = await res.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setBatchResult(data);
      }

      if (inputMode === "url") {
        setError("Анализ по ссылке пока в разработке");
        setLoading(false);
        return;
      }

      if (inputMode === "file") {
        if (!file) {
          setError("Выберите файл");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("token");
        const rawRes = await fetch("http://127.0.0.1:8000/analysis/file/batch", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        data = await rawRes.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setBatchResult(data);
      }

    } catch (err) {
      console.log("ERROR:", err);
      setError("Что-то пошло не так. Проверьте подключение к серверу.");
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => setText("");
  const clearBatchText = () => setBatchText("");

  const batchLineCount = batchText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0).length;

  return (
    <div className="large-analysis-card">
      <style>{`
        /* Масштабная и широкая сетка карточки из раздела About */
        .large-analysis-card {
          width: 95% !important;
          max-width: 1600px !important;
          background: #0D1117 !important;
          border: 1px solid rgba(255, 255, 255, 0.03) !important;
          border-radius: 20px !important;
          padding: 60px !important;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8) !important;
          box-sizing: border-box !important;
          margin-top: 0 !important;
        }

        /* Крупный заголовок рабочей области */
        .workspace-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 2.6rem !important;
          font-weight: 800 !important;
          letter-spacing: -0.03em !important;
          color: #ffffff !important;
          margin: 0 0 40px 0 !important;
        }

        .tabs-container {
          display: flex !important;
          gap: 12px !important;
          margin-bottom: 44px !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
          padding-bottom: 24px !important;
        }

        .tab-button {
          flex: 1 !important;
          padding: 18px 24px !important;
          border-radius: 10px !important;
          font-size: 1.1rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          background: transparent !important;
          border: 1px solid transparent !important;
          color: #718096 !important;
          text-align: center !important;
          white-space: nowrap !important;
        }

        .tab-button.active {
          background: rgba(74, 85, 104, 0.15) !important;
          color: #ffffff !important;
          border: 1px solid rgba(74, 85, 104, 0.3) !important;
        }

        /* Увеличенная область ввода */
        .large-textarea {
          width: 100% !important;
          min-height: 280px !important;
          padding: 32px !important;
          background-color: #161b22 !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
          border-radius: 14px !important;
          font-size: 1.25rem !important;
          line-height: 1.7 !important;
          outline: none !important;
          resize: vertical !important;
          box-sizing: border-box !important;
          font-family: inherit !important;
          transition: border-color 0.2s !important;
        }
        .large-textarea:focus {
          border-color: #4A5568 !important;
        }

        .url-standalone-input {
          width: 100% !important;
          padding: 24px 32px !important;
          background-color: #161b22 !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
          border-radius: 14px !important;
          font-size: 1.25rem !important;
          outline: none !important;
          box-sizing: border-box !important;
          transition: border-color 0.2s !important;
        }
        .url-standalone-input:focus {
          border-color: #4A5568 !important;
        }

/* ГЛАВНАЯ КНОПКА ЗАПУСКА — аккуратная и отцентрированная */
        .action-analyze-btn {
          display: block !important;
          width: auto !important; /* Убираем растягивание на всю ширину */
          min-width: 280px !important; /* Задаем красивую базовую ширину */
          height: 50px !important;
          background: #4A5568 !important;
          color: #ffffff !important;
          font-size: 1.05rem !important;
          font-weight: 600 !important;
          border: none !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          text-transform: uppercase !important;
          letter-spacing: 0.03em !important;
          transition: background 0.2s !important;
          margin: 24px auto 0 auto !important; /* Центрируем за счет auto по бокам */
          padding: 0 36px !important; /* Добавляем внутренние отступы, чтобы текст не зажимался */
        }
        .action-analyze-btn:hover:not(:disabled) {
          background: #3A4454 !important;
        }

        .actions-bar {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-top: 16px !important;
        }

        .clear-btn {
          padding: 12px 24px !important;
          font-size: 1.05rem !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          cursor: pointer !important;
          background: #161b22 !important;
          color: #718096 !important;
          transition: all 0.2s !important;
        }
        .clear-btn:hover {
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .char-counter {
          font-size: 1.05rem !important;
          color: #4A5568 !important;
        }

        /* Крупный и представительный блок отображения результатов */
        .result-block {
          margin-top: 54px !important;
          padding: 48px !important;
          background: #161b22 !important;
          border: 1px solid rgba(255, 255, 255, 0.03) !important;
          border-radius: 16px !important;
        }

        .result-heading {
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          margin-bottom: 28px !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding-bottom: 20px !important;
          color: #ffffff !important;
        }
      `}</style>

      <h2 className="workspace-title">Анализ текстовых данных</h2>

      {/* ТАБЫ ВЫБОРА РЕЖИМА */}
      <div className="tabs-container">
        <button
          className={`tab-button ${inputMode === "text" ? "active" : ""}`}
          onClick={() => setInputMode("text")}
        >
          Одиночный текст
        </button>
        <button
          className={`tab-button ${inputMode === "batch" ? "active" : ""}`}
          onClick={() => setInputMode("batch")}
        >
          Список комментариев
        </button>
        <button
          className={`tab-button ${inputMode === "file" ? "active" : ""}`}
          onClick={() => setInputMode("file")}
        >
          Импорт файла
        </button>
        <button
          className={`tab-button ${inputMode === "url" ? "active" : ""}`}
          onClick={() => setInputMode("url")}
        >
          Анализ по URL
        </button>
      </div>

      {/* ПОЛЯ ВВОДА */}
      <div style={{ marginBottom: "20px" }}>
        {inputMode === "text" && (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите или вставьте текст для проведения комплексного анализа..."
              className="large-textarea"
            />
            <div className="actions-bar">
              <button className="clear-btn" onClick={clearText}>Очистить поле</button>
              <div className="char-counter">{text.length} символов</div>
            </div>
          </>
        )}

        {inputMode === "batch" && (
          <>
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder={"Вставьте массив данных (каждый комментарий на новой строке):\n\nПример: Отличный модуль, работает быстро.\nПример: Доставка задержалась на три дня..."}
              className="large-textarea"
              style={{ minHeight: 340 }}
            />
            <div className="actions-bar">
              <button className="clear-btn" onClick={clearBatchText}>Очистить список</button>
              <div className="char-counter">{batchLineCount} строк заполнено</div>
            </div>
          </>
        )}

        {inputMode === "url" && (
          <div style={{ padding: "12px 0" }}>
            <input
              type="text"
              placeholder="Вставьте ссылку на веб-страницу или API-источник..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="url-standalone-input"
            />
          </div>
        )}

        {inputMode === "file" && (
          <div style={fileUploadWrapper}>
            <input
              type="file"
              accept=".txt,.pdf,.docx,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              style={fileInput}
            />
            <div style={hint}>
              Поддерживаются форматы TXT, PDF, DOCX, CSV. Файл автоматически сегментируется по строкам.
            </div>
          </div>
        )}
      </div>

      {/* КНОПКА ЗАПУСКА */}
      <button
        onClick={handleAnalyze}
        className="action-analyze-btn"
        style={{
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
        disabled={loading}
      >
        {loading ? "Выполняется расчет..." : "Запустить анализ данных"}
      </button>

      {error && <div style={errorBox}>{error}</div>}

      {/* ПОЛНЫЙ ОДИНАРНЫЙ ОТЧЕТ */}
      {result && (
        <div className="result-block">
          <h3 className="result-heading">Метрики обработки текста</h3>

          <div style={row}>
            <span style={label}>Основная эмоция:</span>
            <span style={value}>{emotionTranslations[result.emotion.toLowerCase()] || result.emotion}</span>
          </div>

          {result.confidence !== undefined && (
            <div style={row}>
              <span style={label}>Уверенность модели:</span>
              <span style={value}>{Math.round(result.confidence * 100)}%</span>
            </div>
          )}

          {result.sentiment && (
            <div style={row}>
              <span style={label}>Общая тональность:</span>
              <span style={{ ...value, color: sentimentColor(result.sentiment) }}>
                {sentimentLabel(result.sentiment)}
              </span>
            </div>
          )}

          <div style={row_last}>
            <span style={label}>Определенная тематика:</span>
            <span style={value}>{topicTranslations[result.topic.toLowerCase()] || result.topic}</span>
          </div>

          {result.top_emotions && result.top_emotions.length > 1 && (
            <div style={{ marginTop: 32 }}>
              <span style={subTitle}>Вторичные эмоциональные маркеры:</span>
              <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                {result.top_emotions.slice(1).map((e, i) => (
                  <span key={i} style={pill}>
                    {e.label} — {Math.round(e.score * 100)}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ПОЛНЫЙ СВОДНЫЙ МАССИВНЫЙ ОТЧЕТ */}
      {batchResult && batchResult.total_texts && (
        <div className="result-block">
          <h3 className="result-heading">Сводный аналитический отчет</h3>

          <div style={row}>
            <span style={label}>Объем выборки:</span>
            <span style={value}>{batchResult.total_texts} ед.</span>
          </div>

          <div style={row}>
            <span style={label}>Доминирующий эмоциональный фон:</span>
            <span style={value}>
              {batchResult.dominant_emotion ? (emotionTranslations[batchResult.dominant_emotion.toLowerCase()] || batchResult.dominant_emotion) : "—"}
            </span>
          </div>

          <div style={row}>
            <span style={label}>Ключевой вектор обсуждения:</span>
            <span style={value}>
              {batchResult.dominant_topic ? (topicTranslations[batchResult.dominant_topic.toLowerCase()] || batchResult.dominant_topic) : "—"}
            </span>
          </div>

          <div style={row_last}>
            <span style={label}>Уровень деструктивных данных:</span>
            <span style={{ ...value, color: batchResult.overall_negative_ratio > 40 ? "#ef4444" : "#10b981" }}>
              {batchResult.overall_negative_ratio}%
            </span>
          </div>

          {/* Распределение эмоций */}
          {batchResult.emotion_distribution && (
            <div style={{ marginTop: 36 }}>
              <div style={subTitle}>Плотность распределения эмоций</div>
              {batchResult.emotion_distribution.map((e) => (
                <div key={e.name} style={barRow}>
                  <span style={barLabel}>{emotionTranslations[e.name.toLowerCase()] || e.name}</span>
                  <div style={barTrack}>
                    <div style={{ ...barFill, width: `${e.percent}%`, background: "#4A5568" }} />
                  </div>
                  <span style={barPercent}>{e.percent}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Распределение тем */}
          {batchResult.topic_distribution && (
            <div style={{ marginTop: 36 }}>
              <div style={subTitle}>Тематическое сегментирование</div>
              {batchResult.topic_distribution.map((t) => (
                <div key={t.name} style={barRow}>
                  <span style={barLabel}>{topicTranslations[t.name.toLowerCase()] || t.name}</span>
                  <div style={barTrack}>
                    <div style={{ ...barFill, width: `${t.percent}%`, background: "#718096" }} />
                  </div>
                  <span style={barPercent}>{t.percent}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Аномалии и критические точки */}
          {batchResult.alerts && batchResult.alerts.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <div style={subTitle_Alert}>Критические маркеры</div>
              {batchResult.alerts.map((a, i) => (
                <div key={i} style={alertBox}>
                  В сегменте <strong>«{a.topic ? (topicTranslations[a.topic.toLowerCase()] || a.topic) : "Неизвестно"}»</strong> доля негативных сообщений составила <strong>{a.negative_ratio}%</strong> (из {a.sample_size} проанализированных логов).
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===== ВСПОМОГАТЕЛЬНЫЕ СТИЛИ И ХЕЛПЕРЫ ===== */
function sentimentLabel(s) {
  if (s === "positive") return "Положительная";
  if (s === "negative") return "Отрицательная";
  return "Нейтральная";
}

function sentimentColor(s) {
  if (s === "positive") return "#10b981";
  if (s === "negative") return "#ef4444";
  return "#718096";
}

const hint = { marginTop: "16px", fontSize: "1.1rem", color: "#4A5568", lineHeight: "1.5" };
const fileUploadWrapper = { background: "#161b22", border: "1px dashed rgba(255, 255, 255, 0.05)", borderRadius: "14px", padding: "60px 30px", textAlign: "center" };
const fileInput = { fontSize: "1.1rem", color: "#718096", cursor: "pointer" };
const errorBox = { marginTop: "28px", padding: "20px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.03)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444", fontSize: "1.1rem" };

const row = { display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.04)", fontSize: "1.2rem" };
const row_last = { display: "flex", justifyContent: "space-between", padding: "18px 0 0 0", fontSize: "1.2rem" };
const label = { color: "#718096" };
const value = { color: "#ffffff", fontWeight: "600" };

const pill = { padding: "8px 16px", borderRadius: "20px", background: "#161b22", border: "1px solid rgba(255, 255, 255, 0.05)", color: "#718096", fontSize: "1rem", fontWeight: "500" };
const subTitle = { fontSize: "1.1rem", color: "#ffffff", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.8px" };
const subTitle_Alert = { ...subTitle, color: "#ef4444", marginTop: "12px" };

const barRow = { display: "flex", alignItems: "center", gap: "20px", marginBottom: "18px" };
const barLabel = { width: "180px", fontSize: "1.1rem", color: "#718096", flexShrink: 0 };
const barTrack = { flex: 1, height: "12px", borderRadius: "6px", background: "#161b22", overflow: "hidden" };
const barFill = { height: "100%", borderRadius: "6px" };
const barPercent = { width: "60px", fontSize: "1.1rem", color: "#ffffff", textAlign: "right", fontWeight: "600", flexShrink: 0 };
const alertBox = { padding: "18px 22px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.02)", border: "1px solid rgba(239, 68, 68, 0.1)", color: "#a0aec0", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "14px" };