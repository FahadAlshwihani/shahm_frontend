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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="menu-banner-icon">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.5936 2.31883C11.483 1.89372 12.517 1.89372 13.4064 2.31883C13.7928 2.50351 14.1468 2.80551 14.6371 3.22367C14.6625 3.24538 14.6884 3.2674 14.7146 3.28973C14.9526 3.49262 15.0276 3.555 15.1035 3.60585C15.2965 3.73519 15.5132 3.82495 15.7411 3.86995C15.8307 3.88764 15.9278 3.89654 16.2396 3.92143C16.2739 3.92417 16.3078 3.92685 16.3411 3.92949C16.9834 3.98046 17.4473 4.01727 17.8511 4.15991C18.7807 4.48822 19.5118 5.21935 19.8401 6.14885C19.9827 6.55267 20.0195 7.01656 20.0705 7.6589C20.0732 7.69224 20.0758 7.72607 20.0786 7.76039C20.1035 8.0722 20.1124 8.16933 20.1301 8.25894C20.175 8.48684 20.2648 8.70355 20.3941 8.89652C20.445 8.97239 20.5074 9.04737 20.7103 9.28545C20.7326 9.31166 20.7546 9.33748 20.7763 9.36293C21.1945 9.85316 21.4965 10.2072 21.6812 10.5936C22.1063 11.483 22.1063 12.517 21.6812 13.4064C21.4965 13.7928 21.1945 14.1468 20.7763 14.6371C20.7546 14.6625 20.7326 14.6883 20.7103 14.7146C20.5074 14.9526 20.445 15.0276 20.3941 15.1035C20.2648 15.2965 20.175 15.5132 20.1301 15.7411C20.1124 15.8307 20.1035 15.9278 20.0786 16.2396C20.0758 16.2739 20.0732 16.3078 20.0705 16.3411C20.0195 16.9834 19.9827 17.4473 19.8401 17.8511C19.5118 18.7807 18.7807 19.5118 17.8511 19.8401C17.4473 19.9827 16.9834 20.0195 16.3411 20.0705C16.3078 20.0732 16.2739 20.0758 16.2396 20.0786C15.9278 20.1035 15.8307 20.1124 15.7411 20.1301C15.5132 20.175 15.2965 20.2648 15.1035 20.3941C15.0276 20.445 14.9526 20.5074 14.7146 20.7103C14.6883 20.7326 14.6625 20.7546 14.6371 20.7763C14.1468 21.1945 13.7928 21.4965 13.4064 21.6812C12.517 22.1063 11.483 22.1063 10.5936 21.6812C10.2072 21.4965 9.85315 21.1945 9.3629 20.7763C9.33746 20.7546 9.31165 20.7326 9.28545 20.7103C9.04736 20.5074 8.97239 20.445 8.89652 20.3941C8.70355 20.2648 8.48684 20.175 8.25894 20.1301C8.16933 20.1124 8.0722 20.1035 7.76039 20.0786C7.72607 20.0758 7.69225 20.0732 7.6589 20.0705C7.01656 20.0195 6.55267 19.9827 6.14885 19.8401C5.21935 19.5118 4.48822 18.7807 4.15991 17.8511C4.01727 17.4473 3.98046 16.9834 3.92949 16.3411C3.92685 16.3078 3.92417 16.2739 3.92143 16.2396C3.89654 15.9278 3.88764 15.8307 3.86995 15.7411C3.82495 15.5132 3.73519 15.2965 3.60585 15.1035C3.555 15.0276 3.49262 14.9526 3.28973 14.7146C3.2674 14.6884 3.24538 14.6625 3.22368 14.6371C2.80551 14.1469 2.50351 13.7928 2.31883 13.4064C1.89372 12.517 1.89372 11.483 2.31883 10.5936C2.50351 10.2072 2.80551 9.85315 3.22367 9.36291C3.24537 9.33747 3.26739 9.31165 3.28973 9.28545C3.49262 9.04736 3.555 8.97239 3.60585 8.89652C3.73519 8.70355 3.82495 8.48684 3.86995 8.25894C3.88764 8.16933 3.89654 8.0722 3.92143 7.76039C3.92417 7.72607 3.92685 7.69225 3.92949 7.6589C3.98046 7.01657 4.01727 6.55267 4.15991 6.14885C4.48822 5.21935 5.21935 4.48822 6.14885 4.15991C6.55267 4.01727 7.01657 3.98046 7.6589 3.92949C7.69225 3.92685 7.72607 3.92417 7.76039 3.92143C8.0722 3.89654 8.16933 3.88764 8.25894 3.86995C8.48684 3.82495 8.70355 3.73519 8.89652 3.60585C8.97239 3.555 9.04736 3.49262 9.28545 3.28973C9.31165 3.26739 9.33746 3.24538 9.36291 3.22367C9.85315 2.80551 10.2072 2.50351 10.5936 2.31883ZM16.0443 8.95913C16.3383 9.25304 16.3383 9.72957 16.0443 10.0235L11.027 15.0409C10.733 15.3348 10.2565 15.3348 9.96261 15.0409L7.95565 13.0339C7.66174 12.74 7.66174 12.2635 7.95565 11.9696C8.24957 11.6757 8.72609 11.6757 9.02 11.9696L10.4948 13.4443L14.98 8.95913C15.2739 8.66522 15.7504 8.66522 16.0443 8.95913Z" fill="#353C3C" />
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

        {/* LOGIN BUTTON — kept for future use
        <button
          className="top-navbar-person-btn"
          onClick={() => (window.location.href = user ? "/dashboard" : "/login")}
          aria-label={t("navbar.user")}
        >
          <PersonIcon />
        </button>
        */}
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