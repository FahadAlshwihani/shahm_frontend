import React, { useEffect, useRef } from "react";
import { useDashboardStore } from "../../../store/useDashboardStore";
import { useTranslation } from "react-i18next";
import "../../../styles/dashboard/home.css";

export default function DashboardHome() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { stats, loadStats } = useDashboardStore();

  useEffect(() => { loadStats(); }, [loadStats]);

  if (!stats) {
    return (
      <div className="dh-loading">
        <div className="dh-spinner">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="19" stroke="var(--color-border)" strokeWidth="3"/>
            <path d="M41 22C41 11.507 32.493 3 22 3"
              stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <p>{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <div className="dh-root" dir={isRtl ? "rtl" : "ltr"}>

      {/* ── Page Header ── */}
      <header className="dh-header">
        <div className="dh-header-left">
          <h1 className="dh-title">{t("dashboard.overview")}</h1>
          <p className="dh-subtitle">{t("dashboard.subtitle")}</p>
        </div>
        <div className="dh-live-badge">
          <span className="dh-live-dot" />
          {t("dashboard.live")}
        </div>
      </header>

      {/* ── Stat Cards ── */}
      <section className="dh-cards">
        <StatCard
          title={t("dashboard.cards.today_visits")}
          value={stats.visits.today}
          color="blue"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v6.25l5.25 3.15-.75 1.23L11 14.25V7h1.5z"
                fill="currentColor"/>
            </svg>
          }
        />
        <StatCard
          title={t("dashboard.cards.week_visits")}
          value={stats.visits.week}
          color="purple"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5z"
                fill="currentColor"/>
            </svg>
          }
        />
        <StatCard
          title={t("dashboard.cards.total_messages")}
          value={stats.messages.total}
          color="amber"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6l-2 2V4h16v10z"
                fill="currentColor"/>
            </svg>
          }
        />
        <StatCard
          title={t("dashboard.cards.subscribers")}
          value={stats.subscribers.total}
          color="green"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 15.02 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                fill="currentColor"/>
            </svg>
          }
        />
      </section>

      {/* ── Two-column content ── */}
      <section className="dh-grid">
        <ContentBox
          title={t("dashboard.latest_messages")}
          emptyText={t("dashboard.no_data")}
          items={stats.messages.latest}
          icon={
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 2.5H2.5C1.12 2.5 0 3.62 0 5v10c0 1.38 1.12 2.5 2.5 2.5h15c1.38 0 2.5-1.12 2.5-2.5V5c0-1.38-1.12-2.5-2.5-2.5zM16.875 5L10 9.375 3.125 5h13.75zM2.5 15V6.25L10 11.25 17.5 6.25V15H2.5z"
                fill="currentColor"/>
            </svg>
          }
          renderItem={(item) => (
            <>
              <div className="dh-item-header">
                <strong className="dh-item-name">{item.phone}</strong>
                <span className={`dh-badge ${item.is_read ? "dh-badge--read" : "dh-badge--unread"}`}>
                  {item.is_read ? t("messages.status.closed") : t("messages.status.new")}
                </span>
              </div>
              <span className="dh-item-meta">{t(`messages.status.${item.status}`)}</span>
              <small className="dh-item-date">
                {new Date(item.created_at).toLocaleString()}
              </small>
            </>
          )}
        />

        <ContentBox
          title={t("dashboard.latest_subscribers")}
          emptyText={t("dashboard.no_data")}
          items={stats.subscribers.latest}
          icon={
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="currentColor"/>
            </svg>
          }
          renderItem={(item) => (
            <>
              <strong className="dh-item-name">{item.email}</strong>
              <small className="dh-item-date">
                {new Date(item.created_at).toLocaleString()}
              </small>
            </>
          )}
        />
      </section>

      {/* ── Top Pages ── */}
      <section className="dh-box dh-box--full">
        <div className="dh-box-header">
          <h2 className="dh-box-title">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 3h14c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1zm1 2v10h12V5H4zm2 2h8v2H6V7zm0 4h8v2H6v-2z"
                fill="currentColor"/>
            </svg>
            {t("dashboard.top_pages")}
          </h2>
          <span className="dh-count-badge">
            {stats.visits.top_pages.length} {t("dashboard.pages")}
          </span>
        </div>

        <ul className="dh-top-pages">
          {stats.visits.top_pages.map((p, i) => (
            <li key={i} className="dh-top-page-item">
              <div className="dh-top-page-left">
                <span className="dh-top-page-rank">#{i + 1}</span>
                <span className="dh-top-page-path">{p.path}</span>
              </div>
              <div className="dh-top-page-right">
                <CountUp value={p.count} />
                <span className="dh-top-page-label">{t("dashboard.visits")}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}

/* ── CountUp animation ────────────────────────────────────────── */
function CountUp({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = Number(value) || 0;
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <b className="dh-top-page-count" ref={ref}>{value}</b>;
}

/* ── StatCard ─────────────────────────────────────────────────── */
function StatCard({ title, value, icon, color }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = Number(value) || 0;
    const duration = 1000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <div className={`dh-card dh-card--${color}`}>
      <div className="dh-card-icon">{icon}</div>
      <div className="dh-card-body">
        <span className="dh-card-label">{title}</span>
        <div className="dh-card-value" ref={ref}>{value}</div>
      </div>
    </div>
  );
}

/* ── ContentBox ───────────────────────────────────────────────── */
function ContentBox({ title, items, renderItem, emptyText, icon }) {
  return (
    <div className="dh-box">
      <div className="dh-box-header">
        <h2 className="dh-box-title">{icon}{title}</h2>
        <span className="dh-count-badge">{items.length}</span>
      </div>
      {items.length === 0
        ? <p className="dh-empty">{emptyText}</p>
        : (
          <div className="dh-items">
            {items.map((item) => (
              <div key={item.id || item.email} className="dh-item">
                {renderItem(item)}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
