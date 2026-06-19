import { Link, useLocation, Outlet } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="workspace-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

        body, html {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #000000 !important; /* Чистый черный фон */
          overflow-x: hidden !important;
        }

        .workspace-layout {
          display: flex !important;
          min-height: 100vh !important;
          width: 100vw !important;
          background-color: #000000 !important;
          color: #ffffff !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          box-sizing: border-box !important;
        }

        h1, h2, h3, h4, .workspace-title, .sidebar-logo {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
        }

        /* САЙДБАР (Глубокий графит, чтобы выделяться на черном) */
        .sidebar-panel {
          width: 340px !important;
          background-color: #0D1117 !important;
          border-right: 1px solid rgba(255, 255, 255, 0.03) !important;
          padding: 48px 28px !important;
          display: flex !important;
          flex-direction: column !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
        }

        /* Заголовок с хорошим отступом */
        .sidebar-logo {
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.03em !important;
          color: #ffffff !important;
          margin-bottom: 54px !important;
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
        }

        /* Точка теперь твоего фирменного благородного стального цвета */
        .sidebar-logo-dot {
          width: 10px;
          height: 10px;
          background-color: #a855f7 !important;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 14px rgba(168, 85, 247, 0.6) !important;
        }

        .sidebar-menu {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }

        .menu-item {
          display: flex !important;
          align-items: center !important;
          padding: 16px 22px !important;
          border-radius: 12px !important;
          font-size: 1.1rem !important;
          font-weight: 600 !important;
          color: #718096 !important;
          text-decoration: none !important;
          border: 1px solid transparent !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        /* Активный пункт меню в твоем строгом стиле */
        .menu-item.active {
          background: rgba(74, 85, 104, 0.15) !important;
          color: #e2e8f0 !important;
          border: 1px solid rgba(74, 85, 104, 0.3) !important;
        }

        .menu-item:hover:not(.active) {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.02) !important;
        }

        /* РАБОЧАЯ ОБЛАСТЬ СВЕРХУ ЧЕРНОГО ФОНА */
        .main-workspace-content {
          flex-grow: 1 !important;
          padding: 60px 100px !important;
          overflow-y: auto !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
          background-color: #000000 !important;
          box-sizing: border-box !important;
        }
      `}</style>

      <div className="sidebar-panel">
        <div className="sidebar-logo">
          <span className="sidebar-logo-dot"></span>
          Emotion Analytics
        </div>
        <div className="sidebar-menu">
          <Link to="/analysis" className={`menu-item ${location.pathname === "/analysis" ? "active" : ""}`}>
            Анализ эмоций
          </Link>
          <Link to="/history" className={`menu-item ${location.pathname === "/history" ? "active" : ""}`}>
            История поиска
          </Link>
          <Link to="/trends" className={`menu-item ${location.pathname === "/trends" ? "active" : ""}`}>
            Тренды данных
          </Link>
          <Link to="/about" className={`menu-item ${location.pathname === "/about" ? "active" : ""}`}>
            О системе
          </Link>
        </div>
      </div>

      <div className="main-workspace-content">
        <Outlet />
      </div>
    </div>
  );
}