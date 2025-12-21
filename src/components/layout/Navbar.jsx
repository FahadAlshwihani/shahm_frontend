import React, { useEffect, useState } from "react";
import {
  getPublicHeader,
  getPublicSettings,
  searchPublic,
} from "../../api/publicApi";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import "../../styles/Navbar.css";

export default function Navbar() {
  const [links, setLinks] = useState([]);
  const [logo, setLogo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // 🔍 Search states
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    getPublicHeader().then((res) => {
      const logoItem = res.data.find((l) => l.type === "logo");
      const menuItems = res.data.filter(
        (l) =>
          l.type !== "logo" &&
          l.is_active &&
          l.url !== "/login" &&
          l.page !== "login"
      );

      setLogo(logoItem || null);
      setLinks(menuItems);
    });

    getPublicSettings().then((res) => setSettings(res.data));
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchPublic(query, i18n.language)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, i18n.language]);

  const closeSearch = () => {
    setShowSearch(false);
    setQuery("");
    setResults([]);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* ================= Top Fixed Navbar ================= */}
      <header className={`top-navbar ${isAr ? "rtl" : "ltr"}`}>
        {isAr ? (
          <>
            {/* Menu Toggle (Right for Arabic) */}
            <button
              className={`navbar-toggle ${isOpen ? "open" : ""}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "إغلاق" : "القائمة"}
            >
              <span />
              <span />
            </button>

            {/* Logo (Center) */}
            <div
              className="top-navbar-logo"
              role="button"
              onClick={() => (window.location.href = "/")}
            >
              {logo?.logo_url && <img src={logo.logo_url} alt="Logo" />}
            </div>

            {/* Search Icon (Left for Arabic) */}
            <button
              className="top-navbar-search"
              onClick={() => setShowSearch(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Search Icon (Left for English) */}
            <button
              className="top-navbar-search"
              aria-label="Search"
              onClick={() => setShowSearch(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Logo (Center) */}
            <div
              className="top-navbar-logo"
              role="button"
              onClick={() => (window.location.href = "/")}
            >
              {logo?.logo_url && <img src={logo.logo_url} alt="Logo" />}
            </div>

            {/* Menu Toggle (Right for English) */}
            <button
              className={`navbar-toggle ${isOpen ? "open" : ""}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "Close" : "Menu"}
            >
              <span />
              <span />
            </button>
          </>
        )}
      </header>

      {/* ================= Search Overlay ================= */}
      {showSearch && (
        <div className="navbar-search-overlay">
          <div className="navbar-search-box">
            <input
              autoFocus
              type="text"
              placeholder={isAr ? "ابحث..." : "Search..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <ul className="navbar-search-results">
              {results.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    onClick={closeSearch}
                  >
                    <span className={`tag ${r.type}`}>{r.type}</span>
                    {r.title}
                  </a>
                </li>
              ))}

              {query.length >= 2 && results.length === 0 && (
                <li className="no-results">
                  {isAr ? "لا توجد نتائج" : "No results found"}
                </li>
              )}
            </ul>

            <button className="close-search" onClick={closeSearch}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ================= Overlay ================= */}
      <div
        className={`navbar-overlay ${isOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ================= Side Drawer Menu ================= */}
      <nav
        className={`navbar ${isOpen ? "open" : ""}`}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <div className="navbar-close" onClick={closeMenu}>
          <div className="navbar-close-icon" />
          <span className="navbar-close-text">
            {isAr ? "إغلاق" : "Close"}
          </span>
        </div>

        {/* Navigation Links */}
        <ul className="navbar-list">
          {links.map((link) => (
            <li key={link.id}>
              {link.children?.length > 0 ? (
                <>
                  <div className="navbar-item">
                    <span className="navbar-item-label">
                      {isAr
                        ? link.label_ar
                        : link.label_en || link.label_ar}
                    </span>
                    <span className="navbar-item-arrow">‹</span>
                  </div>

                  <ul className="navbar-sublist">
                    {link.children
                      .filter((c) => c.is_active)
                      .map((child) => (
                        <li key={child.id}>
                          <a
                            href={child.url || `/page/${child.page_slug}`}
                            onClick={closeMenu}
                          >
                            {isAr
                              ? child.label_ar
                              : child.label_en || child.label_ar}
                          </a>
                        </li>
                      ))}
                  </ul>
                </>
              ) : (
                <a
                  href={link.url || `/page/${link.page_slug}`}
                  onClick={closeMenu}
                >
                  {isAr
                    ? link.label_ar
                    : link.label_en || link.label_ar}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Footer - Country / Language */}
        <div className="navbar-footer">
          <div className="navbar-location-lang">
            <div
              className="navbar-location"
              onClick={() =>
                setShowLangDropdown(!showLangDropdown)
              }
            >
              <span className="navbar-location-label">
                {t("footer.country_label")}
              </span>

              <span className="navbar-location-value">
                {settings?.country || t("footer.country_default")} (
                {isAr
                  ? t("footer.language_ar")
                  : t("footer.language_en")}
                )
              </span>

              <span className="navbar-location-arrow">▾</span>
            </div>

            {showLangDropdown && (
              <div className="navbar-lang-dropdown">
                <button
                  className={isAr ? "active" : ""}
                  onClick={() => {
                    i18n.changeLanguage("ar");
                    setShowLangDropdown(false);
                  }}
                >
                  {t("footer.language_ar")}
                </button>
                <button
                  className={!isAr ? "active" : ""}
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setShowLangDropdown(false);
                  }}
                >
                  {t("footer.language_en")}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
