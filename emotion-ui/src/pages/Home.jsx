import { Link, Navigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/analysis" />;
  }

  return (
    <div className="home-page-container">

      {/* СИЛОВЫЕ СТИЛИ */}
      <style>{`
        .home-page-container {
          max-width: 960px !important;
          margin: 0 auto !important;
          padding: 90px 24px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          box-sizing: border-box !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }
        .home-badge {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 8px 16px !important;
          background: #111214 !important;
          border: 1px solid #22252a !important;
          border-radius: 4px !important;
          margin-bottom: 54px !important;
        }
        .home-status-dot {
          width: 8px !important;
          height: 8px !important;
          background: #10b981 !important;
          border-radius: 50% !important;
        }
        .home-badge-text {
          font-size: 13px !important;
          font-weight: 700 !important;
          color: #8c9ba5 !important;
          letter-spacing: 0.05em !important;
        }
        .home-hero {
          text-align: center !important;
          margin-bottom: 70px !important;
          width: 100% !important;
        }
        .home-title {
          font-size: 68px !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          margin: 0 0 24px 0 !important;
          letter-spacing: -0.03em !important;
          line-height: 1.15 !important;
        }
        .home-subtitle {
          font-size: 22px !important;
          line-height: 1.75 !important;
          color: #ffffff !important;
          margin: 0 0 44px 0 !important;
          font-weight: 400 !important;
          opacity: 0.95 !important;
        }
        .home-cta-group {
          display: flex !important;
          gap: 20px !important;
          justify-content: center !important;
        }
        .home-btn {
          padding: 22px 54px !important;
          border-radius: 6px !important;
          font-size: 20px !important;
          font-weight: 700 !important;
          text-decoration: none !important;
          transition: all 0.25s ease-in-out !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .home-btn:hover {
          transform: translateY(-2px) !important;
        }
        .home-btn-primary {
          color: #00b8ff !important;
          background: rgba(0, 184, 255, 0.06) !important;
          border: 1px solid rgba(0, 184, 255, 0.5) !important;
          box-shadow: 0 4px 20px rgba(0, 184, 255, 0.1) !important;
        }
        .home-btn-primary:hover {
          background: rgba(0, 184, 255, 0.12) !important;
          border: 1px solid rgba(0, 184, 255, 0.8) !important;
        }
        .home-btn-secondary {
          color: #ffffff !important;
          background: transparent !important;
          border: 1px solid #454b57 !important;
        }
        .home-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid #ffffff !important;
        }
        .home-metrics {
          display: flex !important;
          justify-content: space-between !important;
          width: 100% !important;
          border-top: 1px solid #22252a !important;
          border-bottom: 1px solid #22252a !important;
          padding: 44px 0 !important;
          margin-bottom: 70px !important;
          gap: 24px !important;
        }
        .home-metric-box {
          flex: 1 !important;
          text-align: center !important;
        }
        .home-metric-value {
          font-size: 52px !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          margin-bottom: 6px !important;
        }
        .home-metric-label {
          font-size: 14px !important;
          color: #626f7c !important;
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
        }
        .home-features {
          display: flex !important;
          flex-direction: column !important;
          gap: 44px !important;
          width: 100% !important;
          margin-bottom: 80px !important;
        }
        .home-feature-card {
          background: transparent !important;
          border-left: 3px solid #22252a !important;
          padding: 0 0 0 28px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          text-align: left !important;
        }
        .home-feature-meta {
          font-size: 13px !important;
          font-weight: 700 !important;
          color: #4f5666 !important;
          letter-spacing: 0.12em !important;
          margin-bottom: 12px !important;
        }
        .home-feature-title {
          font-size: 28px !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          margin: 0 0 12px 0 !important;
        }
        .home-feature-desc {
          font-size: 20px !important;
          line-height: 1.7 !important;
          color: #e2e8f0 !important;
          margin: 0 !important;
        }
        .home-footer {
          width: 100% !important;
          border-top: 1px solid #22252a !important;
          padding-top: 28px !important;
          display: flex !important;
          justify-content: space-between !important;
          font-size: 14px !important;
          color: #4f4f4f !important;
        }
      `}</style>

      {/* МАРКЕР СТАТУСА */}
      <div className="home-badge">
        <span className="home-status-dot"></span>
        <span className="home-badge-text">МОДУЛЬ АНАЛИЗА ПОДКЛЮЧЕН</span>
      </div>

      {/* ГЕРОЙ-БЛОК */}
      <section className="home-hero">
        <h1 className="home-title">Emotion Analytics System</h1>
        <p className="home-subtitle">
          Программный комплекс автоматизированного анализа текстовых данных.
          Классификация эмоциональной тональности и выявление тематических
          направлений на основе глубоких нейросетевых моделей.
        </p>

        <div className="home-cta-group">
          <Link to="/login" className="home-btn home-btn-primary">
            Войти в систему
          </Link>
          <Link to="/register" className="home-btn home-btn-secondary">
            Создать аккаунт
          </Link>
        </div>
      </section>

        {/* ПАНЕЛЬ МЕТРИК */}
        <section className="home-metrics">
          <div className="home-metric-box">
            <div className="home-metric-value">66%</div>
            <div className="home-metric-label">Точность (Accuracy)</div>
          </div>
          <div className="home-metric-box">
            <div className="home-metric-value">&lt;250ms</div>
            <div className="home-metric-label">Инференс (Inference)</div>
          </div>
          <div className="home-metric-box">
            <div className="home-metric-value">7</div>
            <div className="home-metric-label">Аффективных классов</div>
          </div>
          <div className="home-metric-box">
            <div className="home-metric-value">Dense</div>
            <div className="home-metric-label">Векторные эмбеддинги</div>
          </div>
        </section>

      {/* СПИСОК МОДУЛЕЙ */}
      <section className="home-features">
        <div className="home-feature-card">
          <div className="home-feature-meta">КОМПОНЕНТ // 01</div>
          <h3 className="home-feature-title">Анализ тональности</h3>
          <p className="home-feature-desc">
            Потоковая обработка предложений, классификация базовых эмоций с расчетом распределения вероятностей для каждого класса.
          </p>
        </div>

        <div className="home-feature-card">
          <div className="home-feature-meta">КОМПОНЕНТ // 02</div>
          <h3 className="home-feature-title">Пакетный импорт данных</h3>
          <p className="home-feature-desc">
            Загрузка массивов информации через текстовые файлы. Автоматическое разбиение на документы и формирование сводной статистики.
          </p>
        </div>

        <div className="home-feature-card">
          <div className="home-feature-meta">КОМПОНЕНТ // 03</div>
          <h3 className="home-feature-title">Сохранение результатов</h3>
          <p className="home-feature-desc">
            Хранение истории расчетов в реляционной базе данных. Доступ к результатам прошлых сессий анализа в личном кабинете.
          </p>
        </div>
      </section>

      {/* ФУТЕР */}
      <footer className="home-footer">
        <span>© {new Date().getFullYear()} Emotion Analytics System.</span>
      </footer>
    </div>
  );
}