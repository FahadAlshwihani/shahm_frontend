// src/components/layout/DashboardNavbar.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import "../../../styles/DashboardNavbar.css";

import enLogo from "../../../assets/images/logo/en-logo.png";
import arLogo from "../../../assets/images/logo/ar-logo.png";

const PAGE_TITLE_MAP = {
  dashboard:           "sidebar.page_dashboard",
  messages:            "sidebar.page_messages",
  heroes:              "sidebar.page_heroes",
  about:               "sidebar.page_about",
  forms:               "sidebar.page_forms",
  pages:               "sidebar.page_pages",
  legal:               "sidebar.page_legal",
  faq:                 "sidebar.page_faq",
  contact:             "sidebar.page_contact",
  header:              "sidebar.page_header",
  footer:              "sidebar.page_footer",
  services:            "sidebar.page_services",
  appointments:        "sidebar.page_appointments",
  blog:                "sidebar.page_blog",
  team:                "sidebar.page_team",
  careers:             "sidebar.page_careers",
  applications:        "sidebar.page_applications",
  users:               "sidebar.page_users",
  seo:                 "sidebar.page_seo",
  settings:            "sidebar.page_settings",
  "email-settings":    "sidebar.page_email_settings",
  "email-templates":   "sidebar.page_email_templates",
};

function usePageTitle(t) {
  const { pathname } = useLocation();
  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    const key = PAGE_TITLE_MAP[segments[i]];
    if (key) return t(key);
  }
  return t("sidebar.page_dashboard");
}

export default function DashboardNavbar() {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const pageTitle = usePageTitle(t);

  return (
    <header className="dashboard-navbar" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Start: logo ── */}
      <div className="dashboard-navbar-start">
        <div className="dashboard-navbar-logo">
          <img
            src={isRTL ? arLogo : enLogo}
            alt="Shahm"
            className="dashboard-navbar-logo-img"
          />
        </div>
      </div>

      {/* ── Centre: dynamic page title ── */}
      <div className="dashboard-navbar-center">
        <span className="dashboard-navbar-title">{pageTitle}</span>
      </div>

      {/* ── End: user block ── */}
      <div className="dashboard-navbar-end">
        <div className="dashboard-navbar-user">
          <div className="dashboard-navbar-user-avatar">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" />
            </svg>
          </div>
          <div className="dashboard-navbar-user-info">
            <span className="dashboard-navbar-user-greeting">{t("sidebar.welcome")}</span>
            <span className="dashboard-navbar-user-name">{user?.full_name || t("sidebar.user")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}