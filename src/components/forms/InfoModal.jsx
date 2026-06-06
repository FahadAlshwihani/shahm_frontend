// src/components/forms/InfoModal.jsx
// Info modal — visually identical to the Services srv-panel.
// Differences from Services:
//   • subtitle color is #647272 (handled in info-modal.css)
//   • panel is centered on screen, not corner-anchored
//   • tabs are static (no JS indicator measurement needed for single tab)
//   • scroll thumb tracks body scroll via onScroll handler

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axiosClient";
import "../../styles/forms/info-modal.css"; // adjust path

export default function InfoModal({ slug, isOpen, onClose, isEn }) {
  const { t } = useTranslation();
  const [data, setData]                 = useState(null);
  const [activeTab, setActiveTab]       = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef  = useRef(null);
  const tabsBarRef = useRef(null);
  const tabRefs    = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // ── Load data ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug || !isOpen) return;
    setActiveTab(0);
    setScrollProgress(0);

    async function load() {
      try {
        const res = await api.get(`public/info-modals/${slug}/`);
        setData(res.data);
      } catch (err) {
        console.error("Info modal load error:", err);
      }
    }
    load();
  }, [slug, isOpen]);

  // ── Body scroll lock ───────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Escape key ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Tab indicator measurement (same JS logic as Services) ─────────
  useEffect(() => {
    const bar     = tabsBarRef.current;
    const activeEl = tabRefs.current[activeTab];
    if (!bar || !activeEl) return;

    const barRect = bar.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();
    const isRTL   = bar.closest("[dir='rtl']") !== null;

    if (isRTL) {
      setIndicatorStyle({
        right: barRect.right - tabRect.right,
        left: "auto",
        width: tabRect.width,
      });
    } else {
      setIndicatorStyle({
        left: tabRect.left - barRect.left,
        right: "auto",
        width: tabRect.width,
      });
    }
  }, [activeTab, isOpen, isEn, data]);

  // ── Scroll thumb tracker ──────────────────────────────────────────
  const handleBodyScroll = () => {
    const el  = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 0);
  };

  if (!isOpen || !data) return null;

  // ── Build tabs from data.sections ─────────────────────────────────
  // If sections exist use them as tabs; otherwise single "content" tab
  const hasSections = data.sections && data.sections.length > 0;

  const tabs = hasSections
    ? data.sections.map((s) => ({
        id:    s.id,
        label: isEn ? s.title_en : s.title_ar,
        subtitle: isEn ? s.subtitle_en : s.subtitle_ar,
        body:  isEn ? s.body_en   : s.body_ar,
      }))
    : [{
        id:    "main",
        label: isEn
          ? (data.tab_label_en || t("info_modal.tab_default", "Details"))
          : (data.tab_label_ar || t("info_modal.tab_default_ar", "التفاصيل")),
        subtitle: isEn ? data.subtitle_en : data.subtitle_ar,
        body:  isEn ? data.description_en : data.description_ar,
      }];

  const active = tabs[activeTab] ?? tabs[0];

  const panelTitle = isEn ? data.title_en : data.title_ar;

  return (
    <div className="info-modal-root">
      {/* Backdrop */}
      <div
        className={`srv-panel__backdrop${isOpen ? " srv-panel__backdrop--visible" : ""}`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`srv-panel${isOpen ? " srv-panel--open" : ""}`}
        dir={isEn ? "ltr" : "rtl"}
        role="dialog"
        aria-modal="true"
        aria-label={panelTitle}
      >
        {/* ── Close ── */}
        <button
          type="button"
          className="srv-panel__close"
          onClick={onClose}
          aria-label={isEn ? "Close" : "إغلاق"}
        >
          <svg width="13.31" height="13.31" viewBox="0 0 14 14" fill="none">
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="#343C3C"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* ── Tabs ── */}
        <div className="srv-panel__tabs">
          <div className="srv-panel__tabs-bar" ref={tabsBarRef}>
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                className={`srv-panel__tab${activeTab === idx ? " srv-panel__tab--active" : ""}`}
                onClick={() => {
                  setActiveTab(idx);
                  setScrollProgress(0);
                  if (scrollRef.current) scrollRef.current.scrollTop = 0;
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Track + active indicator */}
          <div className="srv-panel__tabs-track">
            <div
              className="srv-panel__tabs-indicator"
              style={{
                left:  indicatorStyle.left,
                right: indicatorStyle.right,
                width: indicatorStyle.width,
              }}
            />
          </div>
        </div>

        {/* ── Meta — subtitle only (no serial number) ── */}
        <div className="srv-panel__meta">
          {active.subtitle && (
            <h2 className="srv-panel__subtitle-title">
              {active.subtitle}
            </h2>
          )}
        </div>

        {/* ── Body wrap: scroll track + content ── */}
        <div className="srv-panel__body-wrap">
          {/* Scroll track */}
          <div className="srv-panel__scroll-track">
            <div
              className="srv-panel__scroll-thumb"
              style={{ "--scroll-progress": scrollProgress }}
            />
          </div>

          {/* Scrollable content */}
          <div
            className="srv-panel__body"
            ref={scrollRef}
            onScroll={handleBodyScroll}
          >
            {active.body && (
              <p className="srv-panel__cta-desc srv-panel__section-body">
                {active.body}
              </p>
            )}
          </div>
        </div>

      </aside>
    </div>
  );
}