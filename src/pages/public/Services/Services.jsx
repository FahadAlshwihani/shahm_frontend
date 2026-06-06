// src/pages/public/Services.jsx
// [REFERENCE: Blog.jsx — search debounce, category filter UX, active states]
// [REFERENCE: About.jsx — hero media architecture, cinematic overlay, video/image handling]
// [REFERENCE: ServicesPageCMS.jsx — CMS field mapping for hero, buttons, placeholders]

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { create } from "zustand";
import {
  getPublicServicesPage,
  getPublicMainServices,
  getPublicServices,
} from "../../../api/servicesApi";
import "../../../styles/pages/services.css";
import EnterpriseIcon from "../../../assets/images/icons/enterprise.svg";
import ExpandIcon from "../../../assets/images/icons/expand_content.svg";

// ─────────────────────────────────────────────────────────────────────────────
// ZUSTAND STORE
// [REFERENCE: Blog.jsx — clean separation: API / store / presentation]
// ─────────────────────────────────────────────────────────────────────────────
const useServicesStore = create((set, get) => ({
  // Data
  cms: null,
  mainServices: [],
  services: [],
  // UI state
  loading: true,
  selectedMain: null, // null = All
  search: "",
  debouncedSearch: "",
  openService: null, // service object shown in side panel
  panelVisible: false,

  // Actions
  setCms: (cms) => set({ cms }),
  setMainServices: (mainServices) => set({ mainServices }),
  setServices: (services) => set({ services }),
  setLoading: (loading) => set({ loading }),
  setSelectedMain: (id) => set({ selectedMain: id }),
  setSearch: (search) => set({ search }),
  setDebouncedSearch: (debouncedSearch) => set({ debouncedSearch }),
  openPanel: (service) => set({ openService: service, panelVisible: true }),
  closePanel: () => set({ panelVisible: false }),

  // Memoized filtered list (called as selector)
  getFiltered: () => {
    const { services, selectedMain, debouncedSearch } = get();
    let list = services;
    if (selectedMain) {
      list = list.filter((s) => {
        const msId =
          s.main_service_data?.id ?? s.main_service;
        return String(msId) === String(selectedMain);
      });
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (s) =>
          s.title_ar?.toLowerCase().includes(q) ||
          s.title_en?.toLowerCase().includes(q) ||
          s.serial_number?.toLowerCase().includes(q) ||
          s.short_description_ar?.toLowerCase().includes(q) ||
          s.short_description_en?.toLowerCase().includes(q)
      );
    }
    return list;
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE ICON — single deterministic SVG per service (no external deps)
// ─────────────────────────────────────────────────────────────────────────────
function ServiceIcon() {
  return (
    <img
      src={EnterpriseIcon}
      alt=""
      className="srv-card__icon-img"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// [REFERENCE: About.jsx — about-hero-media-section, about-hero-media-wrap, video handling]
// [REFERENCE: About.jsx — about-play-btn, cinematic overlay approach]
// ─────────────────────────────────────────────────────────────────────────────
function ServicesHero({ cms, isEn }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const isVideo = cms?.hero_media_type === "video" && cms?.hero_video;
  const mediaSrc = isVideo ? cms.hero_video : cms?.hero_image;
  const title = isEn ? cms?.title_en : cms?.title_ar;
  const description = isEn ? cms?.description_en : cms?.description_ar;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [mediaSrc]);

  const toggleVideo = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    // [REFERENCE: About.jsx — about-hero-media-section wrapping pattern]
    <section className="srv-hero">
      <div className="srv-hero__media-wrap">
        {/* Media layer */}
        {mediaSrc ? (
          isVideo ? (
            <video
              ref={videoRef}
              src={mediaSrc}
              className="srv-hero__media"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : (
            <img
              src={mediaSrc}
              alt={title || "Services"}
              className="srv-hero__media"
            />
          )
        ) : (
          <div className="srv-hero__media srv-hero__media--placeholder" />
        )}

        {/* Cinematic overlay gradient */}
        <div className="srv-hero__overlay" />

        {/* Centered hero content */}
        <div className="srv-hero__content">
          {cms?.hero_logo && (
            <img
              src={cms.hero_logo}
              alt="Logo"
              className="srv-hero__logo"
            />
          )}
          {title && <h1 className="srv-hero__title">{title}</h1>}
          {description && (
            <p className="srv-hero__description">{description}</p>
          )}
        </div>

        {/* Play/pause button for video */}
        {/* [REFERENCE: About.jsx — about-play-btn] */}
        {isVideo && (
          <button
            className="srv-hero__play-btn"
            onClick={toggleVideo}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                <rect x="0" y="0" width="2.5" height="9.375" rx="0.5" fill="#fff" />
                <rect x="4" y="0" width="2.5" height="9.375" rx="0.5" fill="#fff" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 13" fill="none">
                <path d="M1 1L9 6.5L1 12V1Z" fill="#fff" />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH BAR
// [REFERENCE: Blog.jsx — .blog-search, blog-search__icon, blog-search__input]
// Clone exact underline interaction, focus states, icon size transition
// ─────────────────────────────────────────────────────────────────────────────
function ServicesSearch({ value, onChange, placeholder }) {
  return (
    // [REFERENCE: Blog.jsx — blog-search]
    <div className="srv-search">
      <svg
        className="srv-search__icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M20 20L16.5 16.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        className="srv-search__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          className="srv-search__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SERVICE FILTERS
// [REFERENCE: Blog.jsx — .blog-categories, .blog-categories__item, blog-categories__item--active]
// Clone: hover states, active state, divider logic, icon behavior, RTL handling
// ─────────────────────────────────────────────────────────────────────────────
function MainServiceFilters({ mainServices, selected, onSelect, isEn }) {
  const { t } = useTranslation();

  return (
    // [REFERENCE: Blog.jsx — .blog-categories]
    <div className="srv-categories">
      {/* ALL button */}
      <button
        className={`srv-categories__item${selected === null ? " srv-categories__item--active" : ""}`}
        onClick={() => onSelect(null)}
      >
        <span className="srv-categories__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
        <span className="srv-categories__label">
          {isEn ? "All Services" : "جميع الخدمات"}
        </span>
      </button>

      {mainServices.map((ms) => (
        <React.Fragment key={ms.id}>
          {/* [REFERENCE: Blog.jsx — .blog-categories__divider] */}
          <div className="srv-categories__divider" />
          <button
            className={`srv-categories__item${String(selected) === String(ms.id) ? " srv-categories__item--active" : ""}`}
            onClick={() => onSelect(String(selected) === String(ms.id) ? null : ms.id)}
          >
            <span className="srv-categories__icon">
              {ms.icon ? (
                <img src={ms.icon} alt="" width="24" height="24" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3L4 9v11h16V9L12 3z" />
                </svg>
              )}
            </span>
            <span className="srv-categories__label">
              {isEn ? ms.title_en : ms.title_ar}
            </span>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CARD
// [REFERENCE: Design requirement — premium minimal enterprise, NOT colorful]
// ─────────────────────────────────────────────────────────────────────────────
function ServiceCard({ service, isEn, onExpand, isActive, onActivate }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const title = isEn ? service.title_en : service.title_ar;
  const parentTitle = isEn
    ? service.main_service_data?.title_en
    : service.main_service_data?.title_ar;

  const handleCardClick = () => {
    if (isMobile) {
      onExpand(service);
    } else {
      onActivate(service.id);
    }
  };

  return (
    <div className="srv-card-wrapper">
      <article
        className={`srv-card${isActive ? " srv-card--active" : ""}`}
        onClick={handleCardClick}
      >
        {/* expand arrow — top inline-end corner, desktop only */}
        {!isMobile && (
          <button
            className="srv-card__expand-btn"
            onClick={(e) => { e.stopPropagation(); onExpand(service); }}
            aria-label={`View details: ${title}`}
          >
            <img src={ExpandIcon} alt="" className="srv-card__expand-icon" />
          </button>
        )}

        {/* expand arrow — mobile top inline-end corner */}
        {isMobile && (
          <button
            className="srv-card__expand-btn srv-card__expand-btn--mobile"
            onClick={(e) => { e.stopPropagation(); onExpand(service); }}
            aria-label={`View details: ${title}`}
          >
            <img src={ExpandIcon} alt="" className="srv-card__expand-icon" />
          </button>
        )}

        {/* centered icon */}
        <div className="srv-card__icon-wrap">
          <img src={EnterpriseIcon} alt="" className="srv-card__icon-img" />
        </div>
      </article>

      {/* title below card */}
      <h3 className="srv-card__title">{title}</h3>

      {/* discover button — appears on active, desktop only */}
      {!isMobile && (
        <button
          className={`srv-card__discover${isActive ? " srv-card__discover--visible" : ""}`}
          onClick={() => onExpand(service)}
        >
          {isEn ? "Discover" : "اكتشف"}
        </button>
      )}

      {/* parent label */}
      {parentTitle && (
        <p className="srv-card__parent">{parentTitle}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE PANEL (side drawer)
// [REFERENCE: Spec — right-side info modal, NOT centered popup]
// [REFERENCE: About.jsx — about-section-body content spacing philosophy]
// ─────────────────────────────────────────────────────────────────────────────
// PATCH: Replace the entire ServicePanel function in Services.jsx
// FIND this exact block (line 386 to 554) and replace with the block below

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE PANEL (corner modal)
// ─────────────────────────────────────────────────────────────────────────────
function ServicePanel({ service, visible, onClose, isEn, cms }) {
  const { t } = useTranslation();
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const tabsBarRef = useRef(null);
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Measure real tab width + offset for the active indicator
  useEffect(() => {
    const bar = tabsBarRef.current;
    const activeEl = tabRefs.current[activeTab];
    if (!bar || !activeEl) return;

    const barRect = bar.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();

    // For RTL: measure from the right edge of the bar
    const isRTL = bar.closest("[dir='rtl']") !== null;
    if (isRTL) {
      const right = barRect.right - tabRect.right; // distance from bar's right
      setIndicatorStyle({ right, left: "auto", width: tabRect.width });
    } else {
      const left = tabRect.left - barRect.left;
      setIndicatorStyle({ left, right: "auto", width: tabRect.width });
    }
  }, [activeTab, visible, isEn]);

  // Body scroll lock
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Reset to first tab whenever a new service opens
  useEffect(() => {
    if (visible) {
      setActiveTab(0);
      setScrollProgress(0);
    }
  }, [service?.id, visible]);

  // Track scroll progress for vertical indicator
  const handleBodyScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 0);
  };

  const handleRequestClick = () => {
    onClose();
    if (!cms) return;
    const actionType = cms.primary_action_type;
    if (actionType === "url" && cms.primary_url) {
      window.open(cms.primary_url, "_blank", "noopener,noreferrer");
    } else if (actionType === "form_modal" && cms.primary_form) {
      window.dispatchEvent(
        new CustomEvent("open-form-modal", {
          detail: { formId: cms.primary_form },
        })
      );
    }
  };

  if (!service) return null;

  const title = isEn ? service.title_en : service.title_ar;
  const sections = [...(service.sections || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const buttonLabel = isEn
    ? cms?.primary_button_label_en || "Submit Request"
    : cms?.primary_button_label_ar || "إرسال الطلب";

  const activeSection = sections[activeTab] ?? null;
  const sSubtitle = isEn
    ? activeSection?.subtitle_en
    : activeSection?.subtitle_ar;
  const sContent = isEn
    ? activeSection?.content_en
    : activeSection?.content_ar;

  const fallbackContent = isEn
    ? service.short_description_en || service.short_description_ar
    : service.short_description_ar || service.short_description_en;

  return (
    <>
      {/* Backdrop — blur + darken, NO click-to-close */}
      <div
        className={`srv-panel__backdrop${visible ? " srv-panel__backdrop--visible" : ""}`}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        className={`srv-panel${visible ? " srv-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        dir={isEn ? "ltr" : "rtl"}
      >
{/* ── Close button ─────────────────────────────────────────── */}
        <button
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

        {/* ── 1. TABS — first in DOM ────────────────────────────────── */}
        {sections.length > 0 && (
          <div className="srv-panel__tabs">
            <div className="srv-panel__tabs-bar" ref={tabsBarRef}>
              {sections.map((section, idx) => {
                const label = isEn ? section.title_en : section.title_ar;
                return (
                  <button
                    key={section.id}
                    ref={(el) => { tabRefs.current[idx] = el; }}
                    className={`srv-panel__tab${
                      activeTab === idx ? " srv-panel__tab--active" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(idx);
                      setScrollProgress(0);
                      if (scrollRef.current) scrollRef.current.scrollTop = 0;
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="srv-panel__tabs-track">
              <div
                className="srv-panel__tabs-indicator"
                style={{
                  left: indicatorStyle.left,
                  right: indicatorStyle.right,
                  width: indicatorStyle.width,
                }}
              />
            </div>
          </div>
        )}

        {/* ── 2. META — 51px below the indicator line ──────────────── */}
        <div className="srv-panel__meta">
          {service.serial_number && (
            <span className="srv-panel__serial">
              {isEn ? "Service Code: " : "رمز الخدمة: "}
              {service.serial_number}
            </span>
          )}
          <h2 className="srv-panel__subtitle-title">{title}</h2>
        </div>

        {/* ── 3. BODY WRAP — scroll track + content, 62px below meta ── */}
        <div className="srv-panel__body-wrap">
          {/* Vertical scroll track — thin left column */}
          <div className="srv-panel__scroll-track">
            <div
              className="srv-panel__scroll-thumb"
              style={{ "--scroll-progress": scrollProgress }}
            />
          </div>

          {/* Scrollable content — fills remaining width */}
          <div
            className="srv-panel__body"
            ref={scrollRef}
            onScroll={handleBodyScroll}
          >
            {sections.length === 0 ? (
              <p className="srv-panel__empty-desc">{fallbackContent}</p>
            ) : (
              <div className="srv-panel__section" key={activeTab}>
                {/* srv-panel__section-subtitle hidden — kept for reference:
                {sSubtitle && (
                  <p className="srv-panel__section-subtitle">{sSubtitle}</p>
                )}
                */}
                {sContent && (
                  <p className="srv-panel__cta-desc srv-panel__section-body">
                    {sContent}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 4. CTA DIVIDER ───────────────────────────────────────── */}
        <div className="srv-panel__cta-divider" />

        {/* ── CTA section ───────────────────────────────────────────── */}
        <div className="srv-panel__cta">
          <div className="srv-panel__cta-header">
            {/* Hourglass icon */}
            <svg
              className="srv-panel__cta-icon"
              viewBox="-5 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              fill="#1C1B1F"
              aria-hidden="true"
            >
              <g
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  transform="translate(-573.000000, -359.000000)"
                  fill="#1C1B1F"
                >
                  <path d="M590,389 L578,389 L578,382 C578,379.238 580.351,377 583.25,377 L584.75,377 C587.649,377 590,379.238 590,382 L590,389 L590,389 Z M578,368 L578,361 L590,361 L590,368 C590,370.762 587.649,373 584.75,373 L583.25,373 C580.351,373 578,370.762 578,368 L578,368 Z M594,389 L592,389 L592,382 C592,378.134 588.866,375 585,375 C588.866,375 592,371.866 592,368 L592,361 L594,361 C594.553,361 595,360.553 595,360 C595,359.448 594.553,359 594,359 L574,359 C573.447,359 573,359.448 573,360 C573,360.553 573.447,361 574,361 L576,361 L576,368 C576,371.866 579.134,375 583,375 C579.134,375 576,378.134 576,382 L576,389 L574,389 C573.447,389 573,389.448 573,390 C573,390.553 573.447,391 574,391 L594,391 C594.553,391 595,390.553 595,390 C595,389.448 594.553,389 594,389 L594,389 Z" />
                </g>
              </g>
            </svg>
            <h4 className="srv-panel__cta-heading">
              {t(
                "services.panel.cta_title",
                isEn ? "Request This Service" : "طلب هذه الخدمة"
              )}
            </h4>
          </div>

          <p className="srv-panel__cta-desc">
            {t(
              "services.panel.cta_desc",
              isEn
                ? "Submit your request and our team will review your needs, define the scope, and provide the applicable fees."
                : "قدّم طلبك وسيقوم فريقنا بمراجعة احتياجاتك وتحديد النطاق وتقديم الرسوم المعمول بها."
            )}
          </p>

          <button
            className="srv-panel__cta-btn"
            onClick={handleRequestClick}
          >
            {buttonLabel}
          </button>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState({ isEn }) {
  return (
    <div className="srv-empty">
      <div className="srv-empty__icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
          <path d="M24 16v10M24 30v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="srv-empty__text">
        {isEn ? "No services found." : "لا توجد خدمات."}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING STATE
// [REFERENCE: Blog.jsx — blog-grid__loading, blog-grid__spinner]
// ─────────────────────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="srv-loading">
      <span className="srv-loading__spinner" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Services() {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const {
    cms,
    mainServices,
    loading,
    selectedMain,
    search,
    debouncedSearch,
    openService,
    panelVisible,
    setCms,
    setMainServices,
    setServices,
    setLoading,
    setSelectedMain,
    setSearch,
    setDebouncedSearch,
    openPanel,
    closePanel,
    getFiltered,
  } = useServicesStore();

  const [activeCardId, setActiveCardId] = useState(null);

  const handleCardActivate = (id) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

// Body class + scroll-based navbar transparency
  useEffect(() => {
    document.body.classList.add("services-page-active");
    document.body.classList.add("srv-at-top");

const handleScroll = () => {
      const hero = document.querySelector(".srv-hero__media-wrap");
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom > 0) {
        document.body.classList.add("srv-at-top");
      } else {
        document.body.classList.remove("srv-at-top");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.body.classList.remove("services-page-active");
      document.body.classList.remove("srv-at-top");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ── Fetch all data ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [cmsRes, msRes, svcRes] = await Promise.all([
          getPublicServicesPage(),
          getPublicMainServices(),
          getPublicServices(),
        ]);
        // CMS
        const cmsData = cmsRes.data?.results ?? cmsRes.data;
        setCms(Array.isArray(cmsData) ? cmsData[0] : cmsData);
        // Main services
        const msData = msRes.data?.results ?? msRes.data ?? [];
        setMainServices(msData);
        // Services
        const svcData = svcRes.data?.results ?? svcRes.data ?? [];
        setServices(svcData);
      } catch (err) {
        console.error("Services page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Debounce search [REFERENCE: Blog.jsx — 400ms debounce] ───────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Memoized filtered list ────────────────────────────────────────────────
  const filteredServices = useMemo(() => getFiltered(), [
    useServicesStore.getState().services,
    selectedMain,
    debouncedSearch,
  ]);

  // ── Dynamic section title ─────────────────────────────────────────────────
  const sectionTitle = useMemo(() => {
    if (!selectedMain) return isEn ? "All Services" : "جميع الخدمات";
    const ms = mainServices.find((m) => String(m.id) === String(selectedMain));
    if (!ms) return isEn ? "All Services" : "جميع الخدمات";
    return isEn ? ms.title_en : ms.title_ar;
  }, [selectedMain, mainServices, isEn]);

  // ── Search placeholder from CMS ───────────────────────────────────────────
  const searchPlaceholder = isEn
    ? cms?.search_placeholder_en || "Search for a service..."
    : cms?.search_placeholder_ar || "ابحث عن خدمة...";

  return (
    <main className="srv-page" dir={isRTL ? "rtl" : "ltr"}>
      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO
          [REFERENCE: About.jsx — about-hero-media-section + cinematic overlay]
          ═══════════════════════════════════════════════════════════════════ */}
      <ServicesHero cms={cms} isEn={isEn} />

      {/* ═══════════════════════════════════════════════════════════════════
          2. BROWSE SECTION — search + filters
          [REFERENCE: Blog.jsx — .blog-browse section]
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="srv-browse">
        <div className="srv-browse__inner">
          {/* 2a. Search [REFERENCE: Blog.jsx — blog-search exact clone] */}
          <ServicesSearch
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
          />

          {/* 2b. Browse label [REFERENCE: Blog.jsx — blog-browse__label] */}
          <p className="srv-browse__label">
            {isEn ? "Browse by Topic" : "تصفح حسب المجال"}
          </p>

          {/* 2c. Main service filters [REFERENCE: Blog.jsx — blog-categories exact clone] */}
          <MainServiceFilters
            mainServices={mainServices}
            selected={selectedMain}
            onSelect={setSelectedMain}
            isEn={isEn}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SERVICES GRID
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="srv-grid-section">
        <div className="srv-grid__inner">
          {/* Dynamic title with smooth transition */}
          <h2 className="srv-grid__heading" key={sectionTitle}>
            {sectionTitle}
          </h2>

          {loading ? (
            <LoadingState />
          ) : filteredServices.length === 0 ? (
            <EmptyState isEn={isEn} />
          ) : (
            <div className="srv-grid">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isEn={isEn}
                  onExpand={openPanel}
                  isActive={activeCardId === service.id}
                  onActivate={handleCardActivate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. SERVICE SIDE PANEL
          [REFERENCE: Spec — right-side enterprise drawer, NOT centered modal]
          ═══════════════════════════════════════════════════════════════════ */}
      <ServicePanel
        service={openService}
        visible={panelVisible}
        onClose={closePanel}
        isEn={isEn}
        cms={cms}
      />
    </main>
  );
}