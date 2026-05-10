import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    navigate("/login");
  };

  return (
    <Button onClick={handleLogout}>
      Выйти
    </Button>
  );
}