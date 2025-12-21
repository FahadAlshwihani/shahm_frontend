// src/pages/public/HomeHero.jsx
import React, { useRef } from "react";
import "../../styles/home.css";
import { useTranslation } from "react-i18next";

export default function HomeHero({ hero }) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
const leftVideoRef = useRef(null);
const rightVideoRef = useRef(null);

  if (!hero) return null;

  const media = hero.media || [];

  const logoDesktop = media.find(
    (m) => m.media_type === "logo_desktop" && m.is_active
  );

  const logoMobile = media.find(
    (m) => m.media_type === "logo_mobile" && m.is_active
  );

const visuals = media
  .filter(
    (m) =>
      (m.media_type === "image" || m.media_type === "video") &&
      m.is_active
  )
  .slice(0, 2);

const leftVisual = visuals[0];
const rightVisual = visuals[1];


  // ================= LANGUAGE AWARE TEXT =================
  const leftTitle =
    isEnglish && hero.left_title_en
      ? hero.left_title_en
      : hero.left_title_ar || "منهج شهم";

  const rightTitle =
    isEnglish && hero.right_title_en
      ? hero.right_title_en
      : hero.right_title_ar || "الخبرات القانونية";

  const leftCta =
    isEnglish && hero.left_button_text_en
      ? hero.left_button_text_en
      : hero.left_button_text_ar || "استكشف";

  const rightCta =
    isEnglish && hero.right_button_text_en
      ? hero.right_button_text_en
      : hero.right_button_text_ar || "استكشف";
  // =======================================================

  const leftHref =
    hero.left_button_url ||
    (hero.left_button_page_slug ? `/page/${hero.left_button_page_slug}` : "#");

  const rightHref =
    hero.right_button_url ||
    (hero.right_button_page_slug ? `/page/${hero.right_button_page_slug}` : "#");

  const handleNavigate = (href) => {
    if (!href || href === "#") return;
    window.location.href = href;
  };

  return (
    <section className="dual-hero-wrapper">
      {/* DESKTOP LOGO */}
      {logoDesktop && (
        <div className="hero-center-logo desktop-only">
          <img src={logoDesktop.file_url} className="center-logo" alt="Logo" />
        </div>
      )}

      {/* MOBILE LOGO */}
      {logoMobile && (
        <div className="hero-mobile-logo mobile-only">
          <img
            src={logoMobile.file_url}
            className="mobile-logo"
            alt="Mobile Logo"
          />
        </div>
      )}

<div
  className="hero-side left-side"
  onMouseEnter={() => {
    if (leftVideoRef.current) {
      leftVideoRef.current.play();
    }
  }}
  onMouseLeave={() => {
    if (leftVideoRef.current) {
      leftVideoRef.current.pause();
      leftVideoRef.current.currentTime = 0;
    }
  }}
>
  {leftVisual && (
    <>
      {leftVisual.media_type === "video" ? (
        <video
          ref={leftVideoRef}
          className="hero-img hero-video"
          src={leftVisual.file_url}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img src={leftVisual.file_url} className="hero-img" alt="" />
      )}

      <div className="hero-gray-overlay hero-gray-overlay-left" />
      <div className="hero-content">
        <h2 className="hero-title">{leftTitle}</h2>
        <button
          className="hero-btn"
          onClick={() => handleNavigate(leftHref)}
        >
          {leftCta}
        </button>
      </div>
    </>
  )}
</div>




<div
  className="hero-side right-side"
  onMouseEnter={() => {
    if (rightVideoRef.current) {
      rightVideoRef.current.play();
    }
  }}
  onMouseLeave={() => {
    if (rightVideoRef.current) {
      rightVideoRef.current.pause();
      rightVideoRef.current.currentTime = 0;
    }
  }}
>
  {rightVisual && (
    <>
      {rightVisual.media_type === "video" ? (
        <video
          ref={rightVideoRef}
          className="hero-img hero-video"
          src={rightVisual.file_url}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img src={rightVisual.file_url} className="hero-img" alt="" />
      )}

      <div className="hero-gray-overlay hero-gray-overlay-right" />
      <div className="hero-content">
        <h2 className="hero-title">{rightTitle}</h2>
        <button
          className="hero-btn"
          onClick={() => handleNavigate(rightHref)}
        >
          {rightCta}
        </button>
      </div>
    </>
  )}
</div>


    </section>
  );
}
