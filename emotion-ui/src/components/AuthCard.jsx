import { cardStyle } from "../styles/ui";

export default function AuthCard({ children }) {
  return <div style={cardStyle}>{children}</div>;
}