// src/components/layout/DashboardSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import "../../styles/DashboardSidebar.css";

export default function DashboardSidebar({ isOpen, onClose }) {
  const { logout } = useAuthStore();
  const { t } = useTranslation();

  const handleLinkClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth <= 1024) {
      onClose();
    }
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
        { to: "/dashboard/cms/header", label: t("sidebar.cms_header") },
        { to: "/dashboard/cms/footer", label: t("sidebar.cms_footer") },
      ],
    },
    {
      title: t("sidebar.management"),
      items: [
        { to: "/dashboard/services", label: t("sidebar.services") },
        { to: "/dashboard/blog", label: t("sidebar.blog") },
        { to: "/dashboard/team", label: t("sidebar.team") },
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
    <aside className={`sh-dashboard-sidebar ${isOpen ? "active" : ""}`}>
      {/* Brand */}
      <div className="sh-dashboard-sidebar-brand">
        Shahm
        <span>Dashboard</span>
      </div>

      {/* Navigation */}
      <nav className="sh-dashboard-nav">
        {sections.map((section, idx) => (
          <div key={idx} className="sh-dashboard-nav-section">
            <div className="sh-dashboard-nav-title">{section.title}</div>

            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sh-dashboard-link ${isActive ? "active" : ""}`
                }
                onClick={handleLinkClick}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <button className="sh-dashboard-logout" onClick={logout}>
        {t("sidebar.logout")}
      </button>
    </aside>
  );
}