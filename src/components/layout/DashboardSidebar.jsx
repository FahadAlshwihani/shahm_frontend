// src/components/layout/DashboardSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import "../../styles/DashboardSidebar.css";

export default function DashboardSidebar({ isOpen, onClose }) {
  const { logout } = useAuthStore();
  const { t, i18n } = useTranslation();

  const handleLinkClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const sections = [
    {
      title: t("sidebar.general"),
      items: [
        { to: "/dashboard", label: t("sidebar.home"), end: true },
        { to: "/dashboard/messages", label: t("sidebar.messages") },
      ],
    },
    {
      title: t("sidebar.content"),
      items: [
        { to: "/dashboard/cms/heroes", label: t("sidebar.cms_heroes") },
        { to: "/dashboard/cms/pages", label: t("sidebar.cms_pages") },
        { to: "/dashboard/cms/legal", label: "Legal Pages" },
        { to: "/dashboard/cms/faq", label: t("sidebar.cms_faq") },
        { to: "/dashboard/cms/contact", label: t("sidebar.cms_contact") },
        { to: "/dashboard/cms/header", label: t("sidebar.cms_header") },
        { to: "/dashboard/cms/footer", label: t("sidebar.cms_footer") },
      ],
    },
    {
      title: t("sidebar.management"),
      items: [
        { to: "/dashboard/services", label: t("sidebar.services") },
        { to: "/dashboard/appointments", label: t("sidebar.appointments") },
        { to: "/dashboard/blog", label: t("sidebar.blog") },
        { to: "/dashboard/team", label: t("sidebar.team") },
        { to: "/dashboard/careers", label: t("sidebar.careers") },
        { to: "/dashboard/careers/applications", label: t("sidebar.applications") },
        { to: "/dashboard/users", label: t("sidebar.users") },
      ],
    },
    {
      title: t("sidebar.settings"),
      items: [
        { to: "/dashboard/seo", label: t("sidebar.seo") },
        { to: "/dashboard/settings", label: t("sidebar.system_settings") },
        { to: "/dashboard/email-settings", label: t("sidebar.email_settings") },
        {
          to: "/dashboard/email-templates",
          label: t("sidebar.email_templates"),
        },
      ],
    },
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "dashboard-sidebar-active" : ""}`}>
      {/* Brand */}
      <div className="dashboard-sidebar-brand">
        <div className="dashboard-sidebar-brand-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L28 8V16C28 23.18 22.88 29.5 16 31C9.12 29.5 4 23.18 4 16V8L16 2Z" fill="var(--color-primary)" />
          </svg>
        </div>
        <div className="dashboard-sidebar-brand-text">
          <span className="dashboard-sidebar-brand-name">Shahm</span>
          <span className="dashboard-sidebar-brand-subtitle">{t("sidebar.dashboard")}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="dashboard-sidebar-nav">
        {sections.map((section, idx) => (
          <div key={idx} className="dashboard-sidebar-nav-section">
            <div className="dashboard-sidebar-nav-title">{section.title}</div>

            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `dashboard-sidebar-link ${isActive ? "dashboard-sidebar-link-active" : ""}`
                }
                onClick={handleLinkClick}
              >
                <span className="dashboard-sidebar-link-text">{item.label}</span>
                {({ isActive }) => isActive && (
                  <svg className="dashboard-sidebar-link-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="dashboard-sidebar-footer">
        {/* Language Switcher */}
        <button
          className="dashboard-sidebar-language-toggle"
          onClick={toggleLanguage}
          title={t("sidebar.change_language")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM15.5 6H13.1C12.82 5.03 12.42 4.12 11.92 3.31C13.37 3.86 14.57 4.8 15.5 6ZM10 3.5C10.7 4.4 11.23 5.43 11.58 6H8.42C8.77 5.43 9.3 4.4 10 3.5ZM3.5 10C3.5 9.65 3.54 9.31 3.6 9H6.17C6.12 9.32 6.09 9.66 6.09 10C6.09 10.34 6.12 10.68 6.17 11H3.6C3.54 10.69 3.5 10.35 3.5 10ZM4.5 14C3.57 12.8 3.04 11.32 3.04 10H5.44C5.44 10.9 5.53 11.77 5.71 12.6C5.11 13.13 4.65 13.77 4.5 14ZM8.42 14H11.58C11.23 14.57 10.7 15.6 10 16.5C9.3 15.6 8.77 14.57 8.42 14ZM11.92 16.69C12.42 15.88 12.82 14.97 13.1 14H15.5C14.57 15.2 13.37 16.14 11.92 16.69ZM13.83 11H16.4C16.46 10.69 16.5 10.35 16.5 10C16.5 9.65 16.46 9.31 16.4 9H13.83C13.88 9.32 13.91 9.66 13.91 10C13.91 10.34 13.88 10.68 13.83 11Z" fill="currentColor" />
          </svg>
          <span className="dashboard-sidebar-language-text">{i18n.language === "en" ? "AR" : "EN"}</span>
        </button>

        {/* Logout Button */}
        <button className="dashboard-sidebar-logout" onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="dashboard-sidebar-logout-text">{t("sidebar.logout")}</span>
        </button>
      </div>
    </aside>
  );
}