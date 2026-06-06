// src/pages/public/HomeHero.jsx
import React, { useRef, useState, useEffect } from "react";
import "../../styles/home.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/* ===== Play Icon SVG ===== */
const PlayIcon = () => (
  <svg
    width="9.58"
    height="12.19"
    viewBox="0 0 10 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1L9 6.5L1 12V1Z" fill="#FFFFFF" />
  </svg>
);

/* ===== Pause Icon SVG ===== */
const PauseIcon = () => (
  <svg
    width="6.49"
    height="9.38"
    viewBox="0 0 7 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="0" width="2.5" height="9.375" rx="0.5" fill="#FFFFFF" />
    <rect x="4" y="0" width="2.5" height="9.375" rx="0.5" fill="#FFFFFF" />
  </svg>
);

export default function HomeHero({ hero }) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);

  const [leftPlaying, setLeftPlaying] = useState(false);
  const [rightPlaying, setRightPlaying] = useState(false);
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile auto-play on mount
  useEffect(() => {
    if (isMobile) {
      if (leftVideoRef.current) {
        leftVideoRef.current.play();
        setLeftPlaying(true);
      }
      if (rightVideoRef.current) {
        rightVideoRef.current.play();
        setRightPlaying(true);
      }
    }
  }, [isMobile]);

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

const leftHref = hero.left_resolved_url || "#";
const rightHref = hero.right_resolved_url || "#";

const handleNavigate = (href) => {
  if (!href || href === "#") return;

  // external
  if (href.startsWith("http")) {
    window.open(href, "_blank");
    return;
  }

  // internal SPA route
  navigate(href);
};

  // ===== PLAY/PAUSE TOGGLE HANDLERS =====
  const toggleLeftVideo = (e) => {
    e.stopPropagation();
    if (!leftVideoRef.current) return;

    if (leftPlaying) {
      leftVideoRef.current.pause();
      setLeftPlaying(false);
    } else {
      leftVideoRef.current.play();
      setLeftPlaying(true);
    }
  };

  const toggleRightVideo = (e) => {
    e.stopPropagation();
    if (!rightVideoRef.current) return;

    if (rightPlaying) {
      rightVideoRef.current.pause();
      setRightPlaying(false);
    } else {
      rightVideoRef.current.play();
      setRightPlaying(true);
    }
  };

  // ===== DESKTOP MOUSE HANDLERS =====
  const handleLeftMouseEnter = () => {
    if (isMobile) return;
    setLeftHovered(true);
    if (leftVideoRef.current && !leftPlaying) {
      leftVideoRef.current.play();
      setLeftPlaying(true);
    }
  };

  const handleLeftMouseLeave = () => {
    if (isMobile) return;
    setLeftHovered(false);
    if (leftVideoRef.current && leftPlaying) {
      leftVideoRef.current.pause();
      leftVideoRef.current.currentTime = 0;
      setLeftPlaying(false);
    }
  };

  const handleRightMouseEnter = () => {
    if (isMobile) return;
    setRightHovered(true);
    if (rightVideoRef.current && !rightPlaying) {
      rightVideoRef.current.play();
      setRightPlaying(true);
    }
  };

  const handleRightMouseLeave = () => {
    if (isMobile) return;
    setRightHovered(false);
    if (rightVideoRef.current && rightPlaying) {
      rightVideoRef.current.pause();
      rightVideoRef.current.currentTime = 0;
      setRightPlaying(false);
    }
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

      {/* ===== LEFT SIDE ===== */}
      <div
        className={`hero-side left-side${leftHovered ? " is-hovered" : ""}${rightPlaying && !isMobile ? " is-dimmed" : ""
          }`}
        onMouseEnter={handleLeftMouseEnter}
        onMouseLeave={handleLeftMouseLeave}
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

            {/* Play / Pause icon — clickable */}
            <div className="hero-play-icon" onClick={toggleLeftVideo}>
              {leftPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>

            <div className="hero-content">
              <h2 className="hero-title">{leftTitle}</h2>
              <button
                className="hero-btn"
                onClick={() => handleNavigate(leftHref)}
              >
                <span className="hero-btn-text">{leftCta}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ===== RIGHT SIDE ===== */}
      <div
        className={`hero-side right-side${rightHovered ? " is-hovered" : ""}${leftPlaying && !isMobile ? " is-dimmed" : ""
          }`}
        onMouseEnter={handleRightMouseEnter}
        onMouseLeave={handleRightMouseLeave}
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

            {/* Play / Pause icon — clickable */}
            <div className="hero-play-icon" onClick={toggleRightVideo}>
              {rightPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>

            <div className="hero-content">
              <h2 className="hero-title">{rightTitle}</h2>
              <button
                className="hero-btn"
                onClick={() => handleNavigate(rightHref)}
              >
                <span className="hero-btn-text">{rightCta}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}