import { buttonStyle } from "../styles/ui";

export default function Button({ children, ...props }) {
  return <button {...props} style={buttonStyle}>{children}</button>;
}