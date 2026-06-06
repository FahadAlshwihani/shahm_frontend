import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  searchPublic,
} from "../../../api/publicApi";
import { useAuthStore } from "../../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import "../../../styles/Navbar.css";
import { usePublicStore } from "../../../store/usePublicStore";

/* ─── Verified Badge Icon ───────────────────────── */
const VerifiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="menu-banner-icon">
    <path fill="#353C3C" d="M9.53032 11.4697C9.23743 11.1768 8.76255 11.1768 8.46966 11.4697C8.17677 11.7626 8.17677 12.2374 8.46966 12.5303L10.4697 14.5303C10.7626 14.8232 11.2374 14.8232 11.5303 14.5303L15.5303 10.5303C15.8232 10.2374 15.8232 9.76256 15.5303 9.46967C15.2374 9.17677 14.7626 9.17677 14.4697 9.46967L11 12.9393L9.53032 11.4697Z" />
    <path fill="#353C3C" fillRule="evenodd" d="M13.0613 1.13669C12.5208 0.44923 11.4793 0.449229 10.9388 1.13669L9.19206 3.35829L6.47311 2.58767C5.63175 2.34921 4.78916 2.96138 4.75596 3.83525L4.64866 6.65926L1.99603 7.63397C1.17519 7.93559 0.85335 8.92611 1.34013 9.6526L2.91324 12.0003L1.34014 14.3481C0.853351 15.0746 1.17519 16.0651 1.99603 16.3667L4.64866 17.3414L4.75596 20.1654C4.78916 21.0393 5.63175 21.6515 6.47311 21.413L9.19206 20.6424L10.9388 22.864C11.4793 23.5515 12.5208 23.5515 13.0613 22.864L14.808 20.6424L17.527 21.413C18.3683 21.6515 19.2109 21.0393 19.2441 20.1654L19.3514 17.3414L22.004 16.3667C22.8249 16.0651 23.1467 15.0746 22.6599 14.3481L21.0868 12.0003L22.6599 9.6526C23.1467 8.92611 22.8249 7.93559 22.004 7.63397L19.3514 6.65926L19.2441 3.83525C19.2109 2.96138 18.3683 2.34921 17.527 2.58767L14.808 3.35829L13.0613 1.13669Z" clipRule="evenodd" />
  </svg>
);

/* ─── Hero-style CTA button ── */
const HeroBtn = ({ label, href, onClick }) => (
  <a href={href} className="menu-card-hero-btn" onClick={onClick}>
    <span className="menu-card-hero-btn-text">{label}</span>
  </a>
);

export default function Navbar() {
  /* ─── Data ── */
  const [logos, setLogos] = useState({});
  const [menuLinks, setMenuLinks] = useState([]);
  const [quickAccess, setQuickAccess] = useState([]);
  const [menuImages, setMenuImages] = useState([]);

  /* ─── Scroll ── */
  const [scrolled, setScrolled] = useState(false);

  /* ─── Panel state ── */
  const [isOpen, setIsOpen] = useState(false);
  const [menuStack, setMenuStack] = useState([]);
  const [labelStack, setLabelStack] = useState([]);
  const [slideDir, setSlideDir] = useState("forward");
  const [animating, setAnimating] = useState(false);
  const [activeColItem, setActiveColItem] = useState(null);

  /* ─── Search ── */
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const panelRef = useRef(null);

  /* ═══════════════════════════════════════════════════
     LOAD DATA
  ═══════════════════════════════════════════════════ */
const headerData = usePublicStore(
  (s) => s.header
);

useEffect(() => {
  if (!headerData) return;

  const data = headerData;

  const logoMap = {};

  data
    .filter((i) => i.type === "logo")
    .forEach((i) => {
      if (i.logo_variant) {
        logoMap[i.logo_variant] = i;
      }
    });

  setLogos(logoMap);

  const links = data.filter(
    (i) =>
      i.type === "link" &&
      i.is_active &&
      i.url !== "/login" &&
      i.page !== "login"
  );

  setMenuLinks(links);

  setMenuStack([links]);

  setLabelStack([]);

  setQuickAccess(
    data.filter(
      (i) =>
        i.type === "quick_access" &&
        i.is_active
    )
  );

  const extractMenuImages = (items) => {
    let out = [];

    const walk = (nodes) => {
      nodes.forEach((n) => {
        if (
          n.type === "menu_image" &&
          n.is_active
        ) {
          out.push(n);
        }

        if (n.children?.length) {
          walk(n.children);
        }
      });
    };

    walk(items);

    return out;
  };

  setMenuImages(
    extractMenuImages(data)
  );

}, [headerData]);

  /* ═══════════════════════════════════════════════════
     SCROLL
  ═══════════════════════════════════════════════════ */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ═══════════════════════════════════════════════════
     SCROLL LOCK — lock body scroll when menu is open
  ═══════════════════════════════════════════════════ */
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
    return () => {
      // cleanup on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  /* ═══════════════════════════════════════════════════
     SEARCH
  ═══════════════════════════════════════════════════ */
  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const timer = setTimeout(() => {
      searchPublic(query, i18n.language)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, i18n.language]);

  const closeSearch = () => { setShowSearch(false); setQuery(""); setResults([]); };

  /* ═══════════════════════════════════════════════════
     MENU CONTROLS
  ═══════════════════════════════════════════════════ */
  const openMenu = () => {
    setMenuStack([menuLinks]);
    setLabelStack([]);
    setActiveColItem(null);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMenuStack([menuLinks]);
      setLabelStack([]);
      setSlideDir("forward");
      setActiveColItem(null);
    }, 400);
  };

  const goDeeper = useCallback(
    (item) => {
      if (animating) return;
      const level = menuStack.length;
      if (level >= 2) {
        setActiveColItem(item);
        return;
      }
      setAnimating(true);
      setSlideDir("forward");
      setMenuStack((p) => [...p, item.children]);
      setLabelStack((p) => [...p, isAr ? item.label_ar : item.label_en]);
      setActiveColItem(null);
      setTimeout(() => setAnimating(false), 320);
    },
    [animating, isAr, menuStack.length]
  );

  const goBack = useCallback(() => {
    if (animating || menuStack.length <= 1) return;
    setAnimating(true);
    setSlideDir("back");
    setMenuStack((p) => p.slice(0, -1));
    setLabelStack((p) => p.slice(0, -1));
    setActiveColItem(null);
    setTimeout(() => setAnimating(false), 320);
  }, [animating, menuStack.length]);

  const currentLevel = menuStack[menuStack.length - 1] || [];
  const currentLabel = labelStack[labelStack.length - 1] || null;
  const isDeep = menuStack.length > 1;

  /* ═══════════════════════════════════════════════════
     PANEL MODE DETECTION
  ═══════════════════════════════════════════════════ */
  const levelHasImages = currentLevel.some((item) => item.type === "menu_image");
  const isSecondLevel = menuStack.length === 2;
  const isExpanded =
    isSecondLevel &&
    !levelHasImages &&
    currentLevel.some((item) => item.children?.length > 0);

  /* ═══════════════════════════════════════════════════
     HREF HELPER
  ═══════════════════════════════════════════════════ */
  const resolveHref = (item) => {
    if (item.resolved_url) return item.resolved_url;
    if (item.slug) return item.slug.startsWith("/") ? item.slug : `/${item.slug}`;
    if (item.url) return item.url;
    if (item.page) return `/page/${item.page}`;
    return "#";
  };

  /* ═══════════════════════════════════════════════════
     PERSON ICON
  ═══════════════════════════════════════════════════ */
  const PersonIcon = () => (
    <div className="top-navbar-person">
      <span className="top-navbar-person-dot" />
      <svg width="23.08" height="21.81" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        aria-label={t("navbar.user")}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     LOGO PAIR
  ═══════════════════════════════════════════════════ */
  const LogoImages = ({ lang }) => {
    const full = logos[`full_${lang}`];
    const scroll = logos[`scroll_${lang}`];
    const fallback = full || scroll || Object.values(logos)[0];
    if (!fallback?.logo_url) return null;
    return (
      <>
        <img src={(full || fallback).logo_url} alt="Logo"
          className={`logo-img ${scrolled ? "logo-img--hidden" : "logo-img--visible"}`} />
        <img src={(scroll || fallback).logo_url} alt="Logo"
          className={`logo-img ${scrolled ? "logo-img--visible" : "logo-img--hidden"}`} />
      </>
    );
  };

  /* ═══════════════════════════════════════════════════
     CHEVRON SVG — direction-aware
  ═══════════════════════════════════════════════════ */
  const ChevronRight = ({ size = 6.48 }) => (
    <svg width={size} height="11" viewBox="0 0 7 11" fill="none">
      <path
        d={isAr ? "M6 1L1 5.5L6 10" : "M1 1L6 5.5L1 10"}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );

  const ChevronBack = () => (
    <svg width="6.48" height="11" viewBox="0 0 7 11" fill="none">
      <path
        d={isAr ? "M1 1L6 5.5L1 10" : "M6 1L1 5.5L6 10"}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );

  /* ═══════════════════════════════════════════════════
     RENDER NORMAL MENU ITEMS (single column)
  ═══════════════════════════════════════════════════ */
  const renderMenuItems = (items) =>
    items.map((item, idx) => {
      const label = isAr ? item.label_ar : item.label_en || item.label_ar;
      const hasKids = item.children?.filter((c) => c.is_active).length > 0;
      const hasImage = item.image_url || item.image;

      if (hasKids) {
        return (
          <li key={item.id} className="menu-item" style={{ "--item-index": idx }}>
            <button
              className="menu-item-btn"
              onClick={() => goDeeper({ ...item, children: item.children.filter((c) => c.is_active) })}
              aria-label={label}
            >
              {hasImage ? (
                <img src={item.image_url} alt={label} className="menu-item-thumb" />
              ) : (
                <span className="menu-item-label">{label}</span>
              )}
              <span className="menu-item-chevron" aria-hidden="true">
                <ChevronRight />
              </span>
            </button>
          </li>
        );
      }
      return (
        <li key={item.id} className="menu-item" style={{ "--item-index": idx }}>
          <a href={resolveHref(item)} className="menu-item-link" onClick={closeMenu}>
            {hasImage ? (
              <img src={item.image_url} alt={label} className="menu-item-thumb" />
            ) : (
              <span className="menu-item-label">{label}</span>
            )}
          </a>
        </li>
      );
    });

  /* ═══════════════════════════════════════════════════
     EXPANDED TWO-COLUMN PANEL
     Left: items same style as main menu
     Right: children of active left item
     Children with grandchildren show them on hover/click
  ═══════════════════════════════════════════════════ */
  const ExpandedPanel = () => {
    const [localActive, setLocalActive] = useState(activeColItem || currentLevel[0] || null);
    const [hoveredRight, setHoveredRight] = useState(null);

    const activeItem = localActive;
    const rightItems = activeItem?.children?.filter((c) => c.is_active) || [];

    return (
      <div className="expanded-panel-cols">
        {/* Left column */}
        <div className="expanded-col expanded-col-left">
          {currentLevel.map((item, idx) => {
            const label = isAr ? item.label_ar : item.label_en || item.label_ar;
            const isActive = localActive?.id === item.id;
            const hasKids = item.children?.filter((c) => c.is_active).length > 0;

            return (
              <button
                key={item.id}
                className={`expanded-left-item${isActive ? " expanded-left-item--active" : ""}`}
                style={{ "--item-index": idx }}
                onClick={() => {
                  if (hasKids) {
                    setLocalActive(item);
                    setActiveColItem(item);
                  } else {
                    window.location.href = resolveHref(item);
                  }
                }}
                onMouseEnter={() => {
                  if (hasKids) {
                    setLocalActive(item);
                    setActiveColItem(item);
                  }
                }}
              >
                <span className="expanded-left-label">{label}</span>
                {hasKids && (
                  <span className="menu-item-chevron" aria-hidden="true">
                    <ChevronRight />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider — hidden via CSS (.expanded-col-divider { display: none }) */}
        <div className="expanded-col-divider" />

        {/* Right column */}
        <div className="expanded-col expanded-col-right">
          {rightItems.map((child, idx) => {
            const label = isAr ? child.label_ar : child.label_en || child.label_ar;
            const hasGrandkids = child.children?.filter((c) => c.is_active).length > 0;
            const isChildActive = hoveredRight?.id === child.id;

            if (hasGrandkids) {
              return (
                <div
                  key={child.id}
                  className="expanded-right-item-wrapper"
                  onMouseEnter={() => setHoveredRight(child)}
                  onMouseLeave={() => setHoveredRight(null)}
                >
                  <span
                    className={`expanded-right-item has-children${isChildActive ? " expanded-right-item--bold" : ""}`}
                    style={{ "--item-index": idx, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    onClick={() => setHoveredRight(isChildActive ? null : child)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setHoveredRight(isChildActive ? null : child)}
                  >
                    {label}
                    <span className="menu-item-chevron" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <ChevronRight size={5} />
                    </span>
                  </span>
                  {isChildActive && (
                    <div className="expanded-submenu">
                      {child.children.filter((c) => c.is_active).map((grand, gIdx) => {
                        const grandLabel = isAr ? grand.label_ar : grand.label_en || grand.label_ar;
                        return (
                          <a
                            key={grand.id}
                            href={resolveHref(grand)}
                            className="expanded-submenu-item"
                            onClick={closeMenu}
                            style={{ "--item-index": gIdx }}
                          >
                            {grandLabel}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isBold = idx === 0;
            return (
              <a
                key={child.id}
                href={resolveHref(child)}
                className={`expanded-right-item${isBold ? " expanded-right-item--bold" : ""}`}
                style={{ "--item-index": idx }}
                onClick={closeMenu}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     CLIENT PRIVILEGES (panel footer)
  ═══════════════════════════════════════════════════ */
  const ClientPrivileges = () => {
    const images = isDeep
      ? menuImages.filter((img) => img.parent != null)
      : menuImages.filter((img) => img.parent == null);
    if (images.length === 0) return null;
    if (isDeep) return null;
    return (
      <div className="panel-footer-block">
        <p className="section-label">{t("navbar.client_privileges.title")}</p>
        <div className="menu-image-cards--banner">
          {images.map((img) => {
            const label = isAr ? img.label_ar : img.label_en || img.label_ar;
            const desc = isAr ? img.description_ar : img.description_en;
            return (
              <a key={img.id} href={resolveHref(img)} className="menu-image-card--banner" onClick={closeMenu}>
                <div className="menu-banner-header">
                  <VerifiedIcon />
                  <span className="menu-banner-title">{label}</span>
                </div>
                {desc && <p className="menu-banner-desc">{desc}</p>}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     IMAGE CARDS BODY
  ═══════════════════════════════════════════════════ */
  const ImageCardsBody = () => {
    if (!isDeep) return null;
    const currentParentId = labelStack.length
      ? menuStack[menuStack.length - 2]?.find((i) =>
          (isAr ? i.label_ar : i.label_en) === labelStack[labelStack.length - 1]
        )?.id
      : null;
    const images = menuImages.filter((img) => img.parent === currentParentId);
    return (
      <div className="image-cards-body">
        {images.map((img, idx) => {
          const label = isAr ? img.label_ar : img.label_en || img.label_ar;
          const desc = isAr ? img.description_ar : img.description_en;
          return (
            <div key={img.id} className="image-card-full" style={{ "--card-index": idx }}>
              {img.image_url ? (
                <img src={img.image_url} alt={label} className="image-card-full-img" />
              ) : (
                <div className="image-card-full-placeholder" />
              )}
              <div className="image-card-full-overlay">
                {desc && <span className="image-card-full-desc">{desc}</span>}
                <HeroBtn label={label} href={resolveHref(img)} onClick={closeMenu} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     QUICK ACCESS (panel footer)
  ═══════════════════════════════════════════════════ */
  const QuickAccessButtons = () => {
    if (quickAccess.length === 0 || isDeep) return null;
    return (
      <div className="panel-footer-block">
        <p className="section-label">{t("navbar.quick_access.title")}</p>
        <div className="quick-access-container">
          {quickAccess.slice(0, 8).map((btn, idx) => {
            const label = isAr ? btn.label_ar : btn.label_en || btn.label_ar;
            return (
              <a
                key={btn.id}
                href={resolveHref(btn)}
                className="quick-access-button"
                onClick={closeMenu}
                style={{ "--btn-index": idx }}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════
     PANEL BODY CONTENT
  ═══════════════════════════════════════════════════ */
  const currentParentIds = currentLevel.map((i) => i.parent || i.id);
  const drilledParentHasImages =
    isDeep && menuImages.some((img) => currentParentIds.includes(img.parent));

  const renderBodyContent = () => {
    if (drilledParentHasImages && isDeep) return <ImageCardsBody />;
    if (isExpanded) return <ExpandedPanel />;
    return <ul className="menu-list">{renderMenuItems(currentLevel)}</ul>;
  };

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  return (
    <>
      {/* ── TOP NAVBAR ── */}
      <header
        className={`top-navbar${scrolled ? " top-navbar-scrolled" : ""} ${isAr ? "rtl" : "ltr"}`}
      >
        <div className="top-navbar-left-group">
          <button
            className={`navbar-toggle ${isOpen ? "open" : ""}`}
            onClick={isOpen ? closeMenu : openMenu}
            aria-label={isOpen ? t("navbar.menu.close") : t("navbar.menu.open")}
          >
            <span /><span />
          </button>
          <button
            className="top-navbar-search"
            onClick={() => setShowSearch(true)}
            aria-label={t("navbar.menu.search")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        <div
          className="top-navbar-logo"
          role="button" tabIndex={0}
          onClick={() => (window.location.href = "/")}
          onKeyDown={(e) => e.key === "Enter" && (window.location.href = "/")}
        >
          <LogoImages lang={isAr ? "ar" : "en"} />
        </div>

        <button
          className="top-navbar-person-btn"
          onClick={() => (window.location.href = user ? "/dashboard" : "/login")}
          aria-label={t("navbar.user")}
        >
          <PersonIcon />
        </button>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      {showSearch && (
        <div
          className="navbar-search-overlay"
          onClick={(e) => e.target === e.currentTarget && closeSearch()}
        >
          <div className="navbar-search-box">
            <input
              autoFocus type="text"
              placeholder={isAr ? "ابحث..." : "Search..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              dir={isAr ? "rtl" : "ltr"}
            />
            <ul className="navbar-search-results">
              {results.map((r, i) => (
                <li key={i}>
                  <a href={r.url} onClick={closeSearch}>
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
            <button className="close-search" onClick={closeSearch} aria-label={t("navbar.menu.close")}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── BACKDROP ── */}
      <div
        className={`navbar-overlay ${isOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ── SIDE PANEL ── */}
      <nav
        ref={panelRef}
        className={`menu-panel${isOpen ? " menu-panel-open" : ""}${isExpanded ? " menu-panel--expanded" : ""}`}
        dir={isAr ? "rtl" : "ltr"}
        aria-label={t("navbar.menu.open")}
        aria-modal={isOpen}
      >
        {/* PANEL HEADER */}
        <div className="panel-header">
          <button
            className="navbar-close-btn"
            onClick={closeMenu}
            aria-label={t("navbar.menu.close")}
          >
            <svg width="13.31" height="13.31" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1l12 12" stroke="#343C3C" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <hr className="menu-divider" />
        </div>

        {/* PANEL BODY */}
        <div className="panel-body">
          <div
            className={`menu-slide menu-slide-active${
              animating
                ? slideDir === "forward"
                  ? " slide-exit-forward"
                  : " slide-exit-back"
                : ""
            }`}
          >
            {/* Back button */}
            {isDeep && (
              <>
                <button
                  className="menu-back-button"
                  onClick={goBack}
                  aria-label={t("navbar.menu.back")}
                >
                  <ChevronBack />
                  <span>{currentLabel || t("navbar.menu.back")}</span>
                </button>
                <hr className="menu-divider menu-divider--body" />
              </>
            )}

            {renderBodyContent()}
          </div>
        </div>

        {/* PANEL FOOTER */}
        {!isDeep && (
          <div className="panel-footer">
            <hr className="menu-divider" />
            <ClientPrivileges />
            {quickAccess.length > 0 && menuImages.filter((i) => i.parent == null).length > 0 && (
              <hr className="menu-divider menu-divider--slim" />
            )}
            <QuickAccessButtons />
          </div>
        )}
      </nav>
    </>
  );
}