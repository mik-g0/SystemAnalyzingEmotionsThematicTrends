import { useState } from "react";
import { pageStyle } from "../styles/ui";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
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

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setBatchResult(null);

      let res;
      let data;

      // ---- ОДИН ТЕКСТ ----
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

      // ---- СПИСОК КОММЕНТАРИЕВ (батч) ----
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

      // ---- URL (пока не реализовано на бэкенде) ----
      if (inputMode === "url") {
        setError("Анализ по ссылке пока в разработке");
        setLoading(false);
        return;
      }

      // ---- ФАЙЛ (batch-режим: файл разбивается на строки/предложения) ----
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
    <div style={pageStyle}>
      <AuthCard>
        <h2 style={title}>Анализ текста</h2>

        {/* MODE SWITCH */}
        <div style={modeSwitch}>
          <button
            style={inputMode === "text" ? activeBtn : btn}
            onClick={() => setInputMode("text")}
          >
            Текст
          </button>

          <button
            style={inputMode === "batch" ? activeBtn : btn}
            onClick={() => setInputMode("batch")}
          >
            Список комментариев
          </button>

          <button
            style={inputMode === "file" ? activeBtn : btn}
            onClick={() => setInputMode("file")}
          >
            Файл
          </button>

          <button
            style={inputMode === "url" ? activeBtn : btn}
            onClick={() => setInputMode("url")}
          >
            Ссылка
          </button>
        </div>

        {/* INPUT AREA */}
        <div style={inputBox}>
          {inputMode === "text" && (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите текст для анализа..."
                style={textarea}
              />

              <div style={textActions}>
                <button style={smallBtn} onClick={clearText}>
                  Очистить
                </button>

                <div style={counter}>{text.length} знаков</div>
              </div>
            </>
          )}

          {inputMode === "batch" && (
            <>
              <textarea
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder={"Вставьте комментарии, по одному на строку:\n\nОтличный сервис, всё понравилось\nДоставка задержалась на неделю\nПродукт сломался через день"}
                style={{ ...textarea, minHeight: 220 }}
              />

              <div style={textActions}>
                <button style={smallBtn} onClick={clearBatchText}>
                  Очистить
                </button>

                <div style={counter}>{batchLineCount} комментариев</div>
              </div>
            </>
          )}

          {inputMode === "url" && (
            <Input
              placeholder="Вставьте ссылку..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={bigInput}
            />
          )}

          {inputMode === "file" && (
            <>
              <input
                type="file"
                accept=".txt,.pdf,.docx,.csv"
                onChange={(e) => setFile(e.target.files[0])}
                style={fileInput}
              />
              <div style={hint}>
                Файл будет разбит на отдельные комментарии (по строкам или предложениям)
              </div>
            </>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAnalyze}
          style={analyzeBtn}
          disabled={loading}
        >
          {loading ? "Анализируем..." : "Анализировать"}
        </button>

        {/* ERROR */}
        {error && <div style={errorBox}>{error}</div>}

        {/* RESULT — один текст */}
        {result && (
          <div style={resultBox}>
            <div style={row}>
              <span style={label}>Эмоция:</span>
              <span style={value}>{result.emotion}</span>
            </div>

            {result.confidence !== undefined && (
              <div style={row}>
                <span style={label}>Уверенность:</span>
                <span style={value}>{Math.round(result.confidence * 100)}%</span>
              </div>
            )}

            {result.sentiment && (
              <div style={row}>
                <span style={label}>Тональность:</span>
                <span style={{ ...value, color: sentimentColor(result.sentiment) }}>
                  {sentimentLabel(result.sentiment)}
                </span>
              </div>
            )}

            <div style={row}>
              <span style={label}>Тема:</span>
              <span style={value}>{result.topic}</span>
            </div>

            {result.top_emotions && result.top_emotions.length > 1 && (
              <div style={{ marginTop: 16 }}>
                <span style={label}>Другие эмоции:</span>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {result.top_emotions.slice(1).map((e, i) => (
                    <span key={i} style={pill}>
                      {e.label} {Math.round(e.score * 100)}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULT — батч (список комментариев / файл) */}
        {batchResult && batchResult.total_texts && (
          <div style={resultBox}>
            <div style={row}>
              <span style={label}>Проанализировано:</span>
              <span style={value}>{batchResult.total_texts} текстов</span>
            </div>

            <div style={row}>
              <span style={label}>Преобладающая эмоция:</span>
              <span style={value}>{batchResult.dominant_emotion}</span>
            </div>

            <div style={row}>
              <span style={label}>Преобладающая тема:</span>
              <span style={value}>{batchResult.dominant_topic}</span>
            </div>

            <div style={row}>
              <span style={label}>Доля негатива:</span>
              <span style={{ ...value, color: batchResult.overall_negative_ratio > 40 ? "#e57373" : "#e6eaf2" }}>
                {batchResult.overall_negative_ratio}%
              </span>
            </div>

            {/* распределение эмоций */}
            <div style={{ marginTop: 20 }}>
              <div style={subTitle}>Распределение эмоций</div>
              {batchResult.emotion_distribution.map((e) => (
                <div key={e.name} style={barRow}>
                  <span style={barLabel}>{e.name}</span>
                  <div style={barTrack}>
                    <div style={{ ...barFill, width: `${e.percent}%` }} />
                  </div>
                  <span style={barPercent}>{e.percent}%</span>
                </div>
              ))}
            </div>

            {/* распределение тем */}
            <div style={{ marginTop: 20 }}>
              <div style={subTitle}>Распределение тем</div>
              {batchResult.topic_distribution.map((t) => (
                <div key={t.name} style={barRow}>
                  <span style={barLabel}>{t.name}</span>
                  <div style={barTrack}>
                    <div style={{ ...barFill, width: `${t.percent}%`, background: "#5dcaa5" }} />
                  </div>
                  <span style={barPercent}>{t.percent}%</span>
                </div>
              ))}
            </div>

            {/* алерты */}
            {batchResult.alerts && batchResult.alerts.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={subTitle}>Тревожные сигналы</div>
                {batchResult.alerts.map((a, i) => (
                  <div key={i} style={alertBox}>
                    По теме «{a.topic}» {a.negative_ratio}% комментариев негативные
                    (на выборке из {a.sample_size})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </AuthCard>
    </div>
  );
}

/* ===== HELPERS ===== */

function sentimentLabel(s) {
  if (s === "positive") return "Положительная";
  if (s === "negative") return "Отрицательная";
  return "Нейтральная";
}

function sentimentColor(s) {
  if (s === "positive") return "#81c995";
  if (s === "negative") return "#e57373";
  return "#e6eaf2";
}

/* ===== STYLES ===== */

const title = {
  marginBottom: 25,
  fontSize: 40,
  color: "#e6eaf2",
};

const modeSwitch = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
  flexWrap: "wrap",
};

const btn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "transparent",
  color: "#aab3c5",
  cursor: "pointer",
  fontSize: 16,
};

const activeBtn = {
  ...btn,
  background: "rgba(120, 120, 255, 0.25)",
  color: "#fff",
  border: "1px solid rgba(120, 120, 255, 0.6)",
};

const inputBox = {
  padding: 18,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  marginBottom: 20,
};

const textarea = {
  width: "96%",
  minHeight: 180,
  padding: 15,
  borderRadius: 10,
  fontSize: 18,
  resize: "vertical",
  outline: "none",
  background: "rgba(0,0,0,0.2)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.1)",
  overflowY: "auto",
};

const textActions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 12,
};

const smallBtn = {
  padding: "6px 12px",
  fontSize: 14,
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
};

const counter = {
  fontSize: 13,
  color: "#aab3c5",
};

const hint = {
  marginTop: 10,
  fontSize: 13,
  color: "#aab3c5",
};

const analyzeBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: 12,
  background: "linear-gradient(90deg, #6a5acd, #7b68ee)",
  color: "white",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  marginTop: 12,
  fontSize: 18,
};

const errorBox = {
  marginTop: 16,
  padding: 14,
  borderRadius: 10,
  background: "rgba(229, 115, 115, 0.12)",
  border: "1px solid rgba(229, 115, 115, 0.3)",
  color: "#e57373",
  fontSize: 15,
};

const resultBox = {
  marginTop: 28,
  padding: 20,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 12,
  fontSize: 18,
};

const label = {
  color: "#aab3c5",
};

const value = {
  color: "#e6eaf2",
  fontWeight: 600,
};

const fileInput = {
  fontSize: 14,
};

const bigInput = {
  fontSize: 16,
  padding: 12,
};

const pill = {
  padding: "4px 10px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.08)",
  color: "#aab3c5",
  fontSize: 13,
};

const subTitle = {
  fontSize: 16,
  color: "#e6eaf2",
  fontWeight: 600,
  marginBottom: 12,
};

const barRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 8,
};

const barLabel = {
  width: 100,
  fontSize: 13,
  color: "#aab3c5",
  flexShrink: 0,
};

const barTrack = {
  flex: 1,
  height: 8,
  borderRadius: 4,
  background: "rgba(255,255,255,0.06)",
  overflow: "hidden",
};

const barFill = {
  height: "100%",
  background: "#7f77dd",
  borderRadius: 4,
};

const barPercent = {
  width: 44,
  fontSize: 13,
  color: "#e6eaf2",
  textAlign: "right",
  flexShrink: 0,
};

const alertBox = {
  padding: 12,
  borderRadius: 10,
  background: "rgba(229, 115, 115, 0.1)",
  border: "1px solid rgba(229, 115, 115, 0.25)",
  color: "#e57373",
  fontSize: 14,
  marginBottom: 8,
};
