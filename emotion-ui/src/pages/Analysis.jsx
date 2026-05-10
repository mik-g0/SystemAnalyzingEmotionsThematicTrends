import { useState } from "react";
import { pageStyle } from "../styles/ui";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import { apiRequest } from "../api/client";

export default function Analysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
      try {
        const user_id = localStorage.getItem("user_id");

        const res = await apiRequest("/analysis", {
          method: "POST",
          body: JSON.stringify({
            text,
            user_id
          }),
        });

        const data = await res.json();
        setResult(data);

      } catch (err) {
        console.log("ERROR:", err);
      }
    };

  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2 style={{ marginBottom: 20 }}>Emotion Analysis</h2>

        <Input
          placeholder="Enter text for analysis..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button onClick={handleAnalyze}>
          Analyze
        </Button>

        {result && (
          <div style={{ marginTop: 30 }}>
            <div style={blockStyle}>
              <span style={label}>Emotion:</span>
              <span style={value}>{result.emotion}</span>
            </div>

            <div style={blockStyle}>
              <span style={label}>Topic:</span>
              <span style={value}>{result.topic}</span>
            </div>
          </div>
        )}
      </AuthCard>
    </div>
  );
}

const blockStyle = {
  marginTop: 12,
  padding: "12px 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  justifyContent: "space-between"
};

const label = {
  color: "#aab3c5",
  fontSize: 14
};

const value = {
  color: "#e6eaf2",
  fontWeight: 600
};