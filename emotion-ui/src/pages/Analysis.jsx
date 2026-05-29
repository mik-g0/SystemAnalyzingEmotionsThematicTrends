import { useState } from "react";
import { pageStyle } from "../styles/ui";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import { apiRequest } from "../api/client";

export default function Analysis() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [inputMode, setInputMode] = useState("text");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const user_id = localStorage.getItem("user_id");

      let res;

      if (inputMode === "text") {
        res = await apiRequest("/analysis", {
          method: "POST",
          body: JSON.stringify({
            text,
            user_id,
            type: "text"
          }),
        });
      }

      if (inputMode === "url") {
        res = await apiRequest("/analysis", {
          method: "POST",
          body: JSON.stringify({
            url,
            user_id,
            type: "url"
          }),
        });
      }

      if (inputMode === "file") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", user_id);
        formData.append("type", "file");

        res = await fetch("http://127.0.0.1:8000/analysis", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => setText("");

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

                <div style={counter}>
                  {text.length} знаков
                </div>
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
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              style={fileInput}
            />
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

        {/* RESULT */}
        {result && (
          <div style={resultBox}>
            <div style={row}>
              <span style={label}>Emotion:</span>
              <span style={value}>{result.emotion}</span>
            </div>

            <div style={row}>
              <span style={label}>Topic:</span>
              <span style={value}>{result.topic}</span>
            </div>
          </div>
        )}

      </AuthCard>
    </div>
  );
}

/* ===== STYLES (УВЕЛИЧЕННЫЕ) ===== */

const title = {
  marginBottom: 25,
  fontSize: 40,
  color: "#e6eaf2",
};

const modeSwitch = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
};

const btn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "transparent",
  color: "#aab3c5",
  cursor: "pointer",
  fontSize: 20,
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

/* 🔥 TEXTAREA С АВТО-РАСШИРЕНИЕМ */
const textarea = {
  width: "96%",
  minHeight: 200,
  maxHeight: 500,
  padding: 15,
  borderRadius: 10,
  fontSize: 20,
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
  marginTop: 15,
};

const smallBtn = {
  padding: "6px 12px",
  fontSize: 15,
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
  fontSize: 20,
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
  fontSize: 20,
};

const label = {
  color: "#aab3c5",
};

const value = {
  color: "#e6eaf2",
  fontWeight: 600,
};

const fileInput = {
  fontSize: 15,
};

const bigInput = {
  fontSize: 16,
  padding: 12,
};