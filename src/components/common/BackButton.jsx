// src/components/common/BackButton.jsx
// Smart back button — auto-switches between dark (#343C3C) and light (#FFFFFF)
// based on the luminance of whatever is directly behind it on the page.
// Uses IntersectionObserver + getComputedStyle sampling on a sentinel element.

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/common/back-button.css"; // adjust path

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Given a CSS color string, return its relative luminance (0 = black, 1 = white).
 * Uses the WCAG formula so we make the same call as accessibility tools.
 */
function luminance(colorStr) {
  // Create an off-screen element to parse any CSS color into rgb values
  const el = document.createElement("div");
  el.style.cssText = `color:${colorStr};position:absolute;visibility:hidden`;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color; // always "rgb(r, g, b)"
  document.body.removeChild(el);

  const match = computed.match(/\d+/g);
  if (!match || match.length < 3) return 0.5; // fallback: assume mid-tone

  const [r, g, b] = match.map((v) => {
    const c = parseInt(v) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Walk up from (x, y) through the element stack and return the effective
 * background color — the first non-transparent one we find.
 */
function getBackgroundAt(x, y) {
  // Temporarily hide the button so it doesn't block the hit-test
  const btn = document.querySelector(".back-btn");
  const prevPE = btn ? btn.style.pointerEvents : "";
  const prevVis = btn ? btn.style.visibility : "";
  if (btn) { btn.style.pointerEvents = "none"; btn.style.visibility = "hidden"; }

  const elements = document.elementsFromPoint(x, y);

  if (btn) { btn.style.pointerEvents = prevPE; btn.style.visibility = prevVis; }

  for (const el of elements) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      return bg;
    }
    // Also check background-image for gradient/image backgrounds
    const bgImg = getComputedStyle(el).backgroundImage;
    if (bgImg && bgImg !== "none") {
      // Can't sample pixel color of an image directly without canvas,
      // so treat image/video backgrounds as "dark" (conservative choice)
      const tagName = el.tagName.toLowerCase();
      if (["img", "video", "canvas"].includes(tagName)) return "rgb(0,0,0)";
      if (bgImg.includes("gradient")) {
        // Very rough: check if the gradient contains dark keywords
        const hasDark = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.test(bgImg);
        if (hasDark) return bgImg; // return it so luminance() gets a fallback
      }
    }
  }

  return "rgb(255,255,255)"; // nothing found — assume white
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function BackButton() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [isDark, setIsDark] = useState(false);
  const btnRef  = useRef(null);
  const rafRef  = useRef(null);

  // ── Sample the color behind the button ──────────────────────────────────
  const sample = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width  / 2;
    const y = rect.top  + rect.height / 2;

    // On mobile the button can sit at the very top where the navbar
    // overlaps — sample slightly below the button instead so we read
    // the actual page content color, not the navbar
    const sampleY = window.innerWidth < 769
      ? Math.min(y + rect.height, window.innerHeight - 10)
      : y;

    const bg  = getBackgroundAt(x, sampleY);
    const lum = luminance(bg);

    setIsDark(lum < 0.35);
  };

  // ── Run sample on scroll + resize (throttled with rAF) ──────────────────
  useEffect(() => {
    const throttled = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        sample();
        rafRef.current = null;
      });
    };

    // Initial sample after paint
    requestAnimationFrame(sample);

    window.addEventListener("scroll", throttled, { passive: true });
    window.addEventListener("resize", throttled, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttled);
      window.removeEventListener("resize", throttled);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Navigation ───────────────────────────────────────────────────────────
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const color = isDark ? "#FFFFFF" : "#343C3C";

  return (
    <button
      ref={btnRef}
      className={`back-btn${isDark ? " back-btn--light" : ""}`}
      onClick={handleBack}
      aria-label={isAr ? "رجوع" : "Back"}
    >
      <svg
        className="back-btn__icon"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill={color}
        aria-hidden="true"
        style={{ transition: "fill 0.3s ease" }}
      >
        <path
          fillRule="evenodd"
          d="M4.297105,3.29289 L0.59,7 L4.297105,10.7071 C4.687635,11.0976 5.320795,11.0976 5.711315,10.7071 C6.101845,10.3166 6.101845,9.68342 5.711315,9.29289 L4.418425,8 L11.504215,8 C12.332615,8 13.004215,8.67157 13.004215,9.5 C13.004215,10.3284 12.332615,11 11.504215,11 L10.004215,11 C9.451935,11 9.004215,11.4477 9.004215,12 C9.004215,12.5523 9.451935,13 10.004215,13 L11.504215,13 C13.437215,13 15.004215,11.433 15.004215,9.5 C15.004215,7.567 13.437215,6 11.504215,6 L4.418425,6 L5.711315,4.70711 C6.101845,4.31658 6.101845,3.68342 5.711315,3.29289 C5.320795,2.90237 4.687635,2.90237 4.297105,3.29289 Z"
        />
      </svg>

      <span className="back-btn__label" style={{ color, transition: "color 0.3s ease" }}>
        {isAr ? t("common.back", "رجوع") : t("common.back_en", "Back")}
      </span>
    </button>
  );
}