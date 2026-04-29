import { useState } from "react";
import { Link } from "react-router-dom";
import { pageStyle, linkStyle } from "../styles/ui";

import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={pageStyle}>
      <AuthCard>
        <h2>System Enrollment</h2>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.targetы.value)}
        />

        <Button>Create account</Button>

        <p style={{ marginTop: 18, fontSize: 18 }}>
          Уже есть аккаунт?{" "}
          <Link to="/login" style={linkStyle}>Войти</Link>
        </p>
      </AuthCard>
    </div>
  );
}