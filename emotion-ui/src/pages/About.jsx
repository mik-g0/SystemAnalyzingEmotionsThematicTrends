import React from "react";
import { pageStyle } from "../styles/ui";
import LogoutButton from "../components/LogoutButton";

export default function About() {
  return (
    /* Намертво сбрасываем центрирование родителя и убираем отступы сверху */
    <div style={{
      ...pageStyle,
      paddingTop: "20px",
      marginTop: 0,
      display: "block",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      background: "transparent"
    }}>
      <style>{`
        .about-wrapper {
          width: 100%;
          max-width: 1600px; /* Сделали контейнер еще шире */
          margin: 0;
          padding: 10px 30px;
          box-sizing: border-box;
        }

        .about-card {
          padding: 60px; /* Максимальный внутренний простор */
          border-radius: 20px;
          background: #0D1117;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-sizing: border-box;
        }

        .about-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 52px; /* Гигантский заголовок */
          font-weight: 800;
          color: #E2E8F0;
          margin: 0 0 32px 0;
          letter-spacing: -0.03em;
        }

        .about-description {
          font-size: 22px; /* Текст описания стал очень крупным и читаемым */
          line-height: 1.8;
          color: #A0AEC0;
          margin-bottom: 54px;
          max-width: 1200px;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); /* Карточки стали шире */
          gap: 32px;
          margin-bottom: 54px;
          padding: 0;
          list-style: none;
        }

        .module-item {
          padding: 44px; /* Увеличили размер карточек внутри */
          background: #161B22;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 16px;
        }

        .module-icon {
          font-size: 36px; /* Иконки стали больше */
          margin-bottom: 20px;
        }

        .module-title {
          font-size: 24px; /* Заголовки карточек крупнее */
          font-weight: 700;
          color: #E2E8F0;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .module-text {
          font-size: 16px; /* Текст в карточках крупнее */
          line-height: 1.7;
          color: #8A94A6;
          margin: 0;
        }

        .footer-section {
          margin-top: 54px;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: flex-start;
        }

        /* Фикс для кнопки, чтобы она была аккуратной, но заметной */
        .footer-section button,
        .footer-section div {
          max-width: 200px !important;
          width: 100%;
        }
      `}</style>

      <div className="about-wrapper">
        <div className="about-card">
          <h1 className="about-title">О проекте</h1>

          <p className="about-description">
            Данный сервис представляет собой программный комплекс для интеллектуального анализа текстовых данных.
            Система автоматизирует процесс обработки текстов и выявления их ключевых характеристик.
          </p>

          <ul className="modules-grid">
            <li className="module-item">
              <div className="module-title">Sentiment Analysis</div>
              <p className="module-text">
                Автоматическое определение эмоциональной окраски текста с разделением на базовые эмоции.
              </p>
            </li>

            <li className="module-item">
              <div className="module-title">Анализ трендов</div>
              <p className="module-text">
                Извлечение и структурирование актуальных тематических трендов и динамики их изменений.
              </p>
            </li>

            <li className="module-item">
              <div className="module-title">React Engine</div>
              <p className="module-text">
                Оптимизированный интерфейс взаимодействия на базе современных компонентов библиотеки React.
              </p>
            </li>
          </ul>

          <div className="footer-section">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}