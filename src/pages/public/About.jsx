import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAboutStore } from "../../store/useAboutStore";
import { useTranslation } from "react-i18next";
import LogoImage from "../../assets/images/logo/About&Legal.png";
import "../../styles/pages/About.css";

/* ── Play Icon (from HomeHero reference) ── */
const PlayIcon = () => (
  <svg width="9.58" height="12.19" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L9 6.5L1 12V1Z" fill="#FFFFFF" />
  </svg>
);

/* ── Pause Icon (from HomeHero reference) ── */
const PauseIcon = () => (
  <svg width="6.49" height="9.38" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="2.5" height="9.375" rx="0.5" fill="#FFFFFF" />
    <rect x="4" y="0" width="2.5" height="9.375" rx="0.5" fill="#FFFFFF" />
  </svg>
);

/* ── Section block shared component ── */
function SectionBlock({ section, text, className = "" }) {
  const subtitle = text(section, "subtitle");
  const title = text(section, "title");
  const body = text(section, "body");
  return (
    <div className={`about-section-block ${className}`}>
      {subtitle && <p className="about-section-subtitle">{subtitle}</p>}
      {title && <h2 className="about-section-title">{title}</h2>}
      {body && <p className="about-section-body">{body}</p>}
    </div>
  );
}

export default function About() {
  const { about, fetchAbout, loading, error } = useAboutStore();
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  /* ── Media player state ── */
  const mediaRef = useRef(null);
  const [mediaPlaying, setMediaPlaying] = useState(false);

  /* ── Posts slider state ── */
  const [currentPost, setCurrentPost] = useState(0);
  const [postFading, setPostFading] = useState(false);
  const progressTrackRef = useRef(null);
  const isDraggingProgress = useRef(false);

  /* ── Partners marquee pause on hover ── */
  const [partnersPaused, setPartnersPaused] = useState(false);
  const [, setHoveredPartner] = useState(null);

  useEffect(() => { fetchAbout(); }, [fetchAbout]);

  const text = (obj, field, fallback = "") => {
    if (!obj) return fallback;
    return isEn
      ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
      : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
  };

  const isVideo = (url) => {
    if (!url) return false;
    return /\.(mp4|webm|mov|ogg)$/i.test(url);
  };

  const sections = [...(about?.sections || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const stats = [...(about?.stats || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const posts = [...(about?.posts || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const partners = [...(about?.partners || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const firstSection = sections[0];
  const secondSection = sections[1];
  const thirdSection = sections[2];

  /* ── Media toggle ── */
const toggleMedia = (e) => {
  e.stopPropagation();

  if (!mediaRef.current) return;

  if (mediaRef.current.paused) {
    mediaRef.current.play();
  } else {
    mediaRef.current.pause();
  }
};

  /* ── Posts slider ── */
  const maxPost = Math.max(0, posts.length - 1);
  const clampPost = useCallback(
    (v) => Math.max(0, Math.min(maxPost, v)),
    [maxPost]
  );

  const goToPost = useCallback((idx) => {
    const target = clampPost(idx);
    if (target === currentPost) return;
    setPostFading(true);
    setTimeout(() => {
      setCurrentPost(target);
      setPostFading(false);
    }, 280);
  }, [clampPost, currentPost]);

  const prevPost = () => goToPost(currentPost - 1);
  const nextPost = () => goToPost(currentPost + 1);

  /* Progress bar for posts slider */
  const getPostFromPointer = useCallback((clientX) => {
    const track = progressTrackRef.current;
    if (!track || maxPost === 0) return 0;
    const rect = track.getBoundingClientRect();
    let ratio = isRTL
      ? (rect.right - clientX) / rect.width
      : (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    return Math.round(ratio * maxPost);
  }, [maxPost, isRTL]);

  const onProgressDown = useCallback((e) => {
    isDraggingProgress.current = true;
    progressTrackRef.current?.classList.add("dragging");
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    goToPost(getPostFromPointer(clientX));
    e.preventDefault();
  }, [getPostFromPointer, goToPost]);

  const onProgressMove = useCallback((e) => {
    if (!isDraggingProgress.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    goToPost(getPostFromPointer(clientX));
  }, [getPostFromPointer, goToPost]);

  const onProgressUp = useCallback(() => {
    isDraggingProgress.current = false;
    progressTrackRef.current?.classList.remove("dragging");
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onProgressMove);
    window.addEventListener("mouseup", onProgressUp);
    window.addEventListener("touchmove", onProgressMove, { passive: false });
    window.addEventListener("touchend", onProgressUp);
    return () => {
      window.removeEventListener("mousemove", onProgressMove);
      window.removeEventListener("mouseup", onProgressUp);
      window.removeEventListener("touchmove", onProgressMove);
      window.removeEventListener("touchend", onProgressUp);
    };
  }, [onProgressMove, onProgressUp]);

  /* ── Section-level touch swipe (mobile whole section) ── */
  const sectionTouchStartX = useRef(null);
  const sectionTouchStartPost = useRef(0);

  const onSectionTouchStart = useCallback((e) => {
    sectionTouchStartX.current = e.touches[0].clientX;
    sectionTouchStartPost.current = currentPost;
  }, [currentPost]);

  const onSectionTouchEnd = useCallback((e) => {
    if (sectionTouchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - sectionTouchStartX.current;
    const threshold = 40;
    if (Math.abs(dx) > threshold) {
      const dir = dx < 0 ? 1 : -1;
      const rtlDir = isRTL ? -dir : dir;
      goToPost(sectionTouchStartPost.current + rtlDir);
    }
    sectionTouchStartX.current = null;
  }, [isRTL, goToPost]);

  const progressPercent = posts.length > 1 && maxPost > 0
    ? Math.max(4, (currentPost / maxPost) * 100)
    : 100;

  /* RTL-aware arrows for posts slider */
  const ArrowLeft = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 12H4M10 6L4 12L10 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const ArrowRight = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 12H20M14 6L20 12L14 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const PrevArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const NextArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  /* Post counter: 01 / 06 */
  const padNum = (n) => String(n).padStart(2, "0");
  const postCounter = posts.length > 0
    ? `${padNum(currentPost + 1)} / ${padNum(posts.length)}`
    : "";

  /* Current post */
  const activePost = posts[currentPost];
  const aboutLogoSrc = about?.mobile_logo_url || about?.logo_url;

  if (loading) return <main className="about-page"><p className="about-loading">{t("about.loading")}</p></main>;
  if (error) return <main className="about-page"><p className="about-loading">{t("about.error")}</p></main>;
  if (!about) return <main className="about-page"><p className="about-loading">{t("about.no_data")}</p></main>;

  return (
    <main className="about-page" dir={isRTL ? "rtl" : "ltr"}>

      {/* ══════════════════════════════════════════════════════════
          1. LOGO
          ══════════════════════════════════════════════════════════ */}
      {aboutLogoSrc && (
        <section className="about-logo-section">
          <picture>
            {about.mobile_logo_url && (
              <source
                media="(max-width: 640px)"
                srcSet={about.mobile_logo_url}
              />
            )}

            <img
              src={about.logo_url || about.mobile_logo_url}
              alt="About logo"
              className="about-logo"
            />
          </picture>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          2. HERO MEDIA — with play/pause overlay
          ══════════════════════════════════════════════════════════ */}
      {about.media_url && (
        <section className="about-hero-media-section">
          <div className="about-hero-media-wrap">
            {isVideo(about.media_url) ? (
              <video
  ref={mediaRef}
  src={about.media_url}
  className="about-hero-media"
  muted
  loop
  autoPlay
  playsInline
  preload="auto"
  onPlay={() => setMediaPlaying(true)}
  onPause={() => setMediaPlaying(false)}
/>
            ) : (
              <img src={about.media_url} alt="About hero" className="about-hero-media" />
            )}
            {isVideo(about.media_url) && (
              <button className="about-play-btn" onClick={toggleMedia} aria-label={mediaPlaying ? t("about.pause") : t("about.play")}>
                {mediaPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          3. FIRST SECTION
          ══════════════════════════════════════════════════════════ */}
      {firstSection && (
        <section className="about-section about-section-first">
          <SectionBlock section={firstSection} text={text} />
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          4. STATS
          ══════════════════════════════════════════════════════════ */}
      {stats.length > 0 && (
        <section className="about-stats-section">
          <div className="about-stats-grid">
            {stats.map((stat) => (
              <article key={stat.id} className="about-stat-card">
                <h2 className="about-stat-number">{stat.number}</h2>
                <p className="about-stat-label">{text(stat, "label")}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          5. POSTS SLIDER
          Layout: left half = media col, right half = content col
          Fading elements: image + subtitle + title + body (together)
          Static elements: arrows, progress bar, counter
          ══════════════════════════════════════════════════════════ */}
      {posts.length > 0 && (
        <section
          className="about-posts-section"
          onTouchStart={onSectionTouchStart}
          onTouchEnd={onSectionTouchEnd}
        >
          {/* Subtitle + Title — centered across full section width */}
          <div className={`about-posts-heading${postFading ? " about-posts-fading" : ""}`}>
            {text(activePost, "subtitle") && (
              <p className="about-posts-subtitle">
                {text(activePost, "subtitle")}
              </p>
            )}
            {text(activePost, "title") && (
              <h2 className="about-posts-title">
                {text(activePost, "title")}
              </h2>
            )}
          </div>

          <div className="about-posts-inner">
            {/* ── Left: media column ── */}
            <div className="about-posts-media-col">
              {/* The image is centered (75% height) within this col */}
              <div className={`about-posts-image-wrap${postFading ? " about-posts-fading" : ""}`}>
                {activePost?.image_url && (
                  <img
                    key={activePost.id}
                    src={activePost.image_url}
                    alt={text(activePost, "title", "Post")}
                    className="about-posts-image"
                  />
                )}
              </div>
            </div>

            {/* ── Right: content column ── */}
            {/* MOBILE-ONLY progress bar — divider between image and content */}
            <div
              className="about-posts-progress-track about-posts-progress-track--mobile"
              onMouseDown={onProgressDown}
              onTouchStart={onProgressDown}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={maxPost}
              aria-valuenow={currentPost}
              tabIndex={0}
            >
              <div
                className="about-posts-progress-bar"
                style={isRTL
                  ? { right: 0, width: `${progressPercent}%`, left: "auto" }
                  : { width: `${progressPercent}%` }
                }
              />
            </div>
            {/* ── Right: content column ── */}
            <div className="about-posts-content-col">
              {/* Body — fade with content */}
              {text(activePost, "body") && (
                <p className={`about-posts-body${postFading ? " about-posts-fading" : ""}`}>
                  {text(activePost, "body")}
                </p>
              )}

              {/* ── Arrows — ALWAYS VISIBLE, no fade ── */}
              <div className="about-posts-arrows-row">
                <button
                  className="about-posts-arrow about-posts-arrow--prev"
                  onClick={prevPost}
                  disabled={currentPost === 0}
                  aria-label={t("about.previous")}
                >
                  {PrevArrowIcon}
                </button>
                <button
                  className="about-posts-arrow about-posts-arrow--next"
                  onClick={nextPost}
                  disabled={currentPost >= maxPost}
                  aria-label={t("about.next")}
                >
                  {NextArrowIcon}
                </button>
              </div>

              {/* ── Progress bar — ALWAYS VISIBLE, no fade ── */}
              <div
                className="about-posts-progress-track"
                ref={progressTrackRef}
                onMouseDown={onProgressDown}
                onTouchStart={onProgressDown}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={maxPost}
                aria-valuenow={currentPost}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") isRTL ? prevPost() : nextPost();
                  if (e.key === "ArrowLeft") isRTL ? nextPost() : prevPost();
                }}
              >
                <div
                  className="about-posts-progress-bar"
                  style={isRTL
                    ? { right: 0, width: `${progressPercent}%`, left: "auto" }
                    : { width: `${progressPercent}%` }
                  }
                />
                <div
                  className="about-posts-progress-thumb"
                  style={isRTL
                    ? { right: `${progressPercent}%`, left: "auto" }
                    : { left: `${progressPercent}%` }
                  }
                />
              </div>

              {/* ── Counter — ALWAYS VISIBLE, no fade ── */}
              {posts.length > 1 && (
                <p className="about-posts-counter">{postCounter}</p>
              )}

            </div>
          </div>


        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          6. SECOND SECTION
          ══════════════════════════════════════════════════════════ */}
      {secondSection && (
        <section className="about-section about-section-second">
          <SectionBlock section={secondSection} text={text} />
          {secondSection.icons?.length > 0 && (
            <div className="about-icons-grid">
              {[...secondSection.icons]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((icon) => (
                  <div key={icon.id} className="about-icon-item">
                    <article className="about-icon-card">
                      {icon.icon_url && (
                        <img src={icon.icon_url} alt={text(icon, "label", "Icon")} className="about-icon-image" />
                      )}
                    </article>
                    <span className="about-icon-label">{text(icon, "label")}</span>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          LOGO BANNER — between section 2 and 3
          ══════════════════════════════════════════════════════════ */}
      {secondSection && thirdSection && (
        <section className="about-banner-section">
          <div className="about-banner-card">
            <img src={LogoImage} alt="Logo" className="about-banner-logo" />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          7. THIRD SECTION
          ══════════════════════════════════════════════════════════ */}
      {thirdSection && (
        <section className="about-section about-section-third">
          <SectionBlock section={thirdSection} text={text} />
          {thirdSection.icons?.length > 0 && (
            <div className="about-icons-grid">
              {[...thirdSection.icons]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((icon) => (
                  <div key={icon.id} className="about-icon-item">

                    <article className="about-icon-card">
                      {icon.icon_url && (
                        <img
                          src={icon.icon_url}
                          alt={text(icon, "label", "Icon")}
                          className="about-icon-image"
                        />
                      )}
                    </article>

                    <span className="about-icon-label">
                      {text(icon, "label")}
                    </span>

                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          FULL-WIDTH DIVIDER before partners
          ══════════════════════════════════════════════════════════ */}
      {partners.length > 0 && <div className="about-partners-divider" />}

      {/* ══════════════════════════════════════════════════════════
          8. PARTNERS — marquee / ticker
          ══════════════════════════════════════════════════════════ */}
      {partners.length > 0 && (
        <section className="about-partners-section">
          {(about.partners_subtitle_ar || about.partners_subtitle_en) && (
            <p className="about-partners-subtitle">{text(about, "partners_subtitle")}</p>
          )}
          <div className="about-partners-marquee-wrap" dir="ltr">
            {/* Track 1 — always visible, goes LTR on desktop, LTR on mobile upper */}
            <div
              className={`about-partners-track about-partners-track--row1 ${isRTL ? "about-partners-track--rtl" : "about-partners-track--ltr"} ${partnersPaused ? "about-partners-track--paused" : ""}`}
            >
              {[...partners, ...partners, ...partners].map((partner, idx) => (
                <div
                  key={`row1-${partner.id}-${idx}`}
                  className="about-partner-item"
                  onMouseEnter={() => { setPartnersPaused(true); setHoveredPartner(`r1-${idx}`); }}
                  onMouseLeave={() => { setPartnersPaused(false); setHoveredPartner(null); }}
                >
                  <img src={partner.logo_url} alt="Partner logo" className="about-partner-logo" />
                </div>
              ))}
            </div>
            {/* Track 2 — mobile only, goes opposite direction */}
            <div
              className={`about-partners-track about-partners-track--row2 about-partners-track--mobile-reverse ${partnersPaused ? "about-partners-track--paused" : ""}`}
            >
              {[...partners, ...partners, ...partners].map((partner, idx) => (
                <div
                  key={`row2-${partner.id}-${idx}`}
                  className="about-partner-item"
                  onMouseEnter={() => { setPartnersPaused(true); setHoveredPartner(`r2-${idx}`); }}
                  onMouseLeave={() => { setPartnersPaused(false); setHoveredPartner(null); }}
                >
                  <img src={partner.logo_url} alt="Partner logo" className="about-partner-logo" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
