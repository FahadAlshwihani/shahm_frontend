// src/components/layout/DashboardLayout.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import "../../../styles/layout/dashboard/layout.css";

const QUICK_LINKS = [
  { href: "/",             key: "sidebar.footer_link_home" },
  { href: "/services",     key: "sidebar.footer_link_services" },
  { href: "/about",        key: "sidebar.footer_link_about" },
  { href: "/blog",         key: "sidebar.footer_link_blog" },
  { href: "/contact",      key: "sidebar.footer_link_contact" },
  { href: "/faq",          key: "sidebar.footer_link_faq" },
];

export default function DashboardLayout({ children }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({ 0: true, 1: true, 2: true, 3: true });

  const toggleCollapse = () => setIsCollapsed((v) => !v);

  const toggleSection = (idx) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenSections((prev) => ({ ...prev, [idx]: true }));
    } else {
      setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
    }
  };

  return (
    <div
      className={[
        "dashboard-layout-root",
        isCollapsed ? "layout-sidebar-collapsed" : "",
      ].filter(Boolean).join(" ")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DashboardSidebar
        isOpen={true}
        onClose={() => {}}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        openSections={openSections}
        onToggleSection={toggleSection}
      />

      <div className="dashboard-layout-main">
        <DashboardNavbar />

        <main className="dashboard-layout-content">{children}</main>

        <footer className="dashboard-layout-footer">
          <div className="dashboard-layout-footer-content">
            <p className="dashboard-layout-footer-text">
              © {new Date().getFullYear()} Shahm. {t("sidebar.footer_rights")}
            </p>

            <nav
              className="dashboard-layout-footer-links"
              aria-label={t("sidebar.footer_quick_links")}
            >
              {QUICK_LINKS.map((link, i) => (
                <React.Fragment key={link.href}>
                  {i > 0 && <span className="dashboard-layout-footer-divider">·</span>}
                  <a
                    href={link.href}
                    className="dashboard-layout-footer-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(link.key)}
                  </a>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
