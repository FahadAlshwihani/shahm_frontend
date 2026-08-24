// src/components/common/dashboard/Modal.jsx
// ─── GLOBAL Dashboard Modal ────────────────────────────────────
// Centered, glassy, viewport-fitted, scroll-locked.
// Tabs: sliding underline indicator — identical to srv-panel__tabs pattern.

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";


const IconClose = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
    <path d="M15 5 5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Modal — global centered dashboard modal
 *
 * Props:
 *  open          {bool}         controls visibility
 *  onClose       {fn}           called when close btn or Escape pressed
 *  title         {string}       header title
 *  subtitle      {ReactNode}    optional below-title content (badges, meta)
 *
 *  tabDefs       {Array}        tab definitions — Modal owns the tab bar & indicator
 *                               Each item: { id: string, label: string }
 *  activeTab     {string}       controlled active tab id
 *  onTabChange   {fn(id)}       called when user clicks a tab
 *
 *  footer        {ReactNode}    footer content (action buttons etc.)
 *  children      {ReactNode}    scrollable body content
 *  dir           {string}       "ltr" | "rtl"
 *  width         {number}       max dialog width in px (default 858)
 *  className     {string}       extra class on .dash-modal dialog
 *  headerRight   {ReactNode}    extra content in header alongside close btn
 *
 *  theme         {string}       OPTIONAL — page-theme class (e.g. "cms-hero-theme")
 *                                that defines the CSS custom properties consumed by
 *                                this page's design system. Required any time Modal
 *                                content uses page-scoped tokens, because Portal
 *                                detaches the dialog from the page's DOM ancestry,
 *                                so it can no longer inherit those tokens otherwise.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  tabDefs,
  activeTab,
  onTabChange,
  footer,
  children,
  dir = "ltr",
  width = 858,
  className = "",
  headerRight,
  theme = "",
}) {
  const tabsBarRef = useRef(null);
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: "auto", right: "auto", width: 0 });

  // ── Body scroll-lock ───────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("dash-modal-open");
    return () => document.body.classList.remove("dash-modal-open");
  }, [open]);

  // ── Escape to close ────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Sliding underline indicator — mirrors srv-panel logic exactly ──
  const measureIndicator = useCallback(() => {
    if (!tabDefs || !tabsBarRef.current) return;
    const activeIdx = tabDefs.findIndex((t) => t.id === activeTab);
    const bar = tabsBarRef.current;
    const activeEl = tabRefs.current[activeIdx];
    if (!bar || !activeEl) return;

    const barRect = bar.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();
    const isRTL = dir === "rtl";

    if (isRTL) {
      const right = barRect.right - tabRect.right;
      setIndicator({ right, left: "auto", width: tabRect.width });
    } else {
      const left = tabRect.left - barRect.left;
      setIndicator({ left, right: "auto", width: tabRect.width });
    }
  }, [activeTab, dir, tabDefs]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => measureIndicator());
    return () => cancelAnimationFrame(id);
  }, [open, measureIndicator]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [open, measureIndicator]);

  if (!open) return null;

  const hasTabs = Array.isArray(tabDefs) && tabDefs.length > 0;

  return createPortal(
    <div className="dash-modal-backdrop" dir={dir} aria-modal="true" role="dialog">
      <div
        className={`dash-modal ${theme} ${className}`}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="dash-modal-header">
          <div className="dash-modal-header-left">
            {title && <h2 className="dash-modal-title">{title}</h2>}
            {subtitle && <div className="dash-modal-subtitle">{subtitle}</div>}
          </div>
          <div className="dash-modal-header-right">
            {headerRight}
            <button
              className="dash-modal-close"
              onClick={onClose}
              type="button"
              aria-label="Close"
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* ── Tabs — srv-panel__tabs pattern ── */}
        {hasTabs && (
          <div className="dash-modal-tabs">
            <div className="dash-modal-tabs-bar" ref={tabsBarRef}>
              {tabDefs.map((tab, idx) => (
                <button
                  key={tab.id}
                  ref={(el) => { tabRefs.current[idx] = el; }}
                  className={`dash-modal-tab${activeTab === tab.id ? " dash-modal-tab--active" : ""}`}
                  onClick={() => onTabChange?.(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="dash-modal-tabs-track">
              <div
                className="dash-modal-tabs-indicator"
                style={{
                  left: indicator.left,
                  right: indicator.right,
                  width: indicator.width,
                }}
              />
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="dash-modal-body">{children}</div>

        {/* ── Footer ── */}
        {footer && <div className="dash-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}