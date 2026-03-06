import React, { useEffect } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import { useTranslation } from "react-i18next";
import "../../styles/DashboardHome.css";

export default function DashboardHome() {
  const { t } = useTranslation();
  const { stats, loadStats } = useDashboardStore();

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) {
    return (
      <div className="dashboard-home-loading">
        <div className="dashboard-home-spinner">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="var(--color-border)" strokeWidth="3"/>
            <path d="M38 20C38 10.0589 29.9411 2 20 2" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <p>{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* ================= HEADER ================= */}
      <header className="dashboard-home-header">
        <div className="dashboard-home-header-content">
          <h1 className="dashboard-home-title">{t("dashboard.overview")}</h1>
          <p className="dashboard-home-subtitle">{t("dashboard.subtitle")}</p>
        </div>
        <div className="dashboard-home-header-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L13 8L20 9L15 14L16 20L10 17L4 20L5 14L0 9L7 8L10 2Z" fill="var(--color-primary)"/>
          </svg>
          <span>{t("dashboard.live")}</span>
        </div>
      </header>

      {/* ================= STATS CARDS ================= */}
      <section className="dashboard-home-cards">
        <StatCard
          title={t("dashboard.cards.today_visits")}
          value={stats.visits.today}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
            </svg>
          }
        />
        <StatCard
          title={t("dashboard.cards.week_visits")}
          value={stats.visits.week}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM5 7V5H19V7H5Z" fill="currentColor"/>
            </svg>
          }
        />
        <StatCard
          title={t("dashboard.cards.total_messages")}
          value={stats.messages.total}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
            </svg>
          }
        />
        <StatCard
          title={t("dashboard.cards.subscribers")}
          value={stats.subscribers.total}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
            </svg>
          }
        />
      </section>

      {/* ================= GRID CONTENT ================= */}
      <section className="dashboard-home-grid">
        <ContentBox
          title={t("dashboard.latest_messages")}
          emptyText={t("dashboard.no_data")}
          items={stats.messages.latest}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 2.5H2.5C1.83696 2.5 1.20107 2.76339 0.732233 3.23223C0.263392 3.70107 0 4.33696 0 5L0 15C0 15.663 0.263392 16.2989 0.732233 16.7678C1.20107 17.2366 1.83696 17.5 2.5 17.5H17.5C18.163 17.5 18.7989 17.2366 19.2678 16.7678C19.7366 16.2989 20 15.663 20 15V5C20 4.33696 19.7366 3.70107 19.2678 3.23223C18.7989 2.76339 18.163 2.5 17.5 2.5ZM16.875 5L10 9.375L3.125 5H16.875ZM2.5 15V6.25L10 11.25L17.5 6.25V15H2.5Z" fill="currentColor"/>
            </svg>
          }
          renderItem={(item) => (
            <>
              <div className="dashboard-home-item-header">
                <strong className="dashboard-home-item-name">{item.name}</strong>
                <span className="dashboard-home-item-badge">{t("dashboard.new")}</span>
              </div>
              <span className="dashboard-home-item-email">{item.email}</span>
              <small className="dashboard-home-item-subject">{item.subject}</small>
            </>
          )}
        />

        <ContentBox
          title={t("dashboard.latest_subscribers")}
          emptyText={t("dashboard.no_data")}
          items={stats.subscribers.latest}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" fill="currentColor"/>
            </svg>
          }
          renderItem={(item) => (
            <>
              <strong className="dashboard-home-item-email">{item.email}</strong>
              <small className="dashboard-home-item-date">
                {new Date(item.created_at).toLocaleString()}
              </small>
            </>
          )}
        />
      </section>

      {/* ================= TOP PAGES ================= */}
      <section className="dashboard-home-box dashboard-home-box-full">
        <div className="dashboard-home-box-header">
          <h2 className="dashboard-home-box-title">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17C17.55 3 18 3.45 18 4V16C18 16.55 17.55 17 17 17H3C2.45 17 2 16.55 2 16V4C2 3.45 2.45 3 3 3ZM4 5V15H16V5H4ZM6 7H14V9H6V7ZM6 11H14V13H6V11Z" fill="currentColor"/>
            </svg>
            {t("dashboard.top_pages")}
          </h2>
          <span className="dashboard-home-box-badge">{stats.visits.top_pages.length} {t("dashboard.pages")}</span>
        </div>
        <ul className="dashboard-home-top-pages">
          {stats.visits.top_pages.map((p, i) => (
            <li key={i} className="dashboard-home-top-page-item">
              <div className="dashboard-home-top-page-info">
                <span className="dashboard-home-top-page-rank">#{i + 1}</span>
                <span className="dashboard-home-top-page-path">{p.path}</span>
              </div>
              <div className="dashboard-home-top-page-count">
                <b>{p.count}</b>
                <span>{t("dashboard.visits")}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, icon }) {
  return (
    <div className="dashboard-home-card">
      <div className="dashboard-home-card-icon">{icon}</div>
      <div className="dashboard-home-card-content">
        <span className="dashboard-home-card-title">{title}</span>
        <div className="dashboard-home-card-value">{value}</div>
      </div>
    </div>
  );
}

function ContentBox({ title, items, renderItem, emptyText, icon }) {
  return (
    <div className="dashboard-home-box">
      <div className="dashboard-home-box-header">
        <h2 className="dashboard-home-box-title">
          {icon}
          {title}
        </h2>
      </div>

      {!items.length && <p className="dashboard-home-empty">{emptyText}</p>}

      <div className="dashboard-home-items">
        {items.map((item) => (
          <div key={item.id || item.email} className="dashboard-home-item">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}