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
    return <div className="dash-loading">{t("dashboard.loading")}</div>;
  }

  return (
    <div className="dash-home">
      {/* ================= HEADER ================= */}
      <header className="dash-header">
        <h1>{t("dashboard.overview")}</h1>
        <p>{t("dashboard.subtitle")}</p>
      </header>

      {/* ================= STATS CARDS ================= */}
      <section className="dash-cards">
        <StatCard
          title={t("dashboard.cards.today_visits")}
          value={stats.visits.today}
        />
        <StatCard
          title={t("dashboard.cards.week_visits")}
          value={stats.visits.week}
        />
        <StatCard
          title={t("dashboard.cards.total_messages")}
          value={stats.messages.total}
        />
        <StatCard
          title={t("dashboard.cards.subscribers")}
          value={stats.subscribers.total}
        />
      </section>

      {/* ================= GRID CONTENT ================= */}
      <section className="dash-grid">
        <ContentBox
          title={t("dashboard.latest_messages")}
          emptyText={t("dashboard.no_data")}
          items={stats.messages.latest}
          renderItem={(item) => (
            <>
              <strong>{item.name}</strong>
              <span>{item.email}</span>
              <small>{item.subject}</small>
            </>
          )}
        />

        <ContentBox
          title={t("dashboard.latest_subscribers")}
          emptyText={t("dashboard.no_data")}
          items={stats.subscribers.latest}
          renderItem={(item) => (
            <>
              <strong>{item.email}</strong>
              <small>
                {new Date(item.created_at).toLocaleString()}
              </small>
            </>
          )}
        />
      </section>

      {/* ================= TOP PAGES ================= */}
      <section className="dash-box full">
        <h2>{t("dashboard.top_pages")}</h2>
        <ul className="dash-top-pages">
          {stats.visits.top_pages.map((p, i) => (
            <li key={i}>
              <span>{p.path}</span>
              <b>{p.count}</b>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <div className="dash-card">
      <span className="dash-card-title">{title}</span>
      <div className="dash-card-value">{value}</div>
    </div>
  );
}

function ContentBox({ title, items, renderItem, emptyText }) {
  return (
    <div className="dash-box">
      <h2>{title}</h2>

      {!items.length && <p className="dash-empty">{emptyText}</p>}

      {items.map((item) => (
        <div key={item.id || item.email} className="dash-item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
