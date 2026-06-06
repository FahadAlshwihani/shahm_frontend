// src/components/common/WhatsAppFloat.jsx
// Glassy frosted-glass floating WhatsApp button.
// Desktop: centered horizontally, travels vertically on scroll.
// Mobile: right edge (LTR) or left edge (RTL), same vertical travel.

import React, { useEffect, useState, useRef, useCallback } from "react";
import { getPublicSettings } from "../../api/publicApi";  // adjust path
import "../../styles/common/whatsapp-float.css";        // adjust path

const NAVBAR_HEIGHT      = 72;   // px — match your navbar height
const BOTTOM_MARGIN      = 24;   // px — gap to keep above footer
const DESKTOP_BREAKPOINT = 769;  // px — matches CSS media query

export default function WhatsAppFloat() {
  const [phone, setPhone] = useState(null);
  const [topPx, setTopPx] = useState(NAVBAR_HEIGHT + 20);
  const btnRef            = useRef(null);
  const rafRef            = useRef(null);

  // ── Fetch WhatsApp number ──────────────────────────────────────────
  useEffect(() => {
    getPublicSettings()
      .then((res) => {
        const num =
          res.data?.whatsapp_number ||
          res.data?.whatsapp         ||
          res.data?.phone_whatsapp   ||
          null;
        if (num) setPhone(String(num).replace(/\D/g, ""));
      })
      .catch(() => {});
  }, []);

  // ── Scroll-driven vertical position ───────────────────────────────
  const updatePosition = useCallback(() => {
    const btn  = btnRef.current;
    if (!btn) return;

    const btnH    = btn.offsetHeight;
    const vpH     = window.innerHeight;
    const scrollY = window.scrollY;
    const docH    = document.documentElement.scrollHeight;
    const isMobile = window.innerWidth < DESKTOP_BREAKPOINT;

    // Find footer to stop button before it
    const footer    = document.querySelector(".footer-wrapper") ||
                      document.querySelector("footer");
    const footerTop = footer
      ? footer.getBoundingClientRect().top + scrollY
      : docH;

    const maxScroll = Math.max(1, footerTop - vpH);
    const progress  = Math.min(1, scrollY / maxScroll);

    // Cubic ease-in-out for smooth travel
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    if (isMobile) {
      // Mobile: start below navbar, travel to near viewport bottom
      const minTop = NAVBAR_HEIGHT + 20;
      const maxTop = vpH - btnH - BOTTOM_MARGIN;
      setTopPx(Math.round(minTop + eased * (maxTop - minTop)));
    } else {
      // Desktop: start at viewport center, travel toward bottom
      const minTop = Math.round(vpH / 2 - btnH / 2);
      const maxTop = vpH - btnH - BOTTOM_MARGIN;
      setTopPx(Math.round(minTop + eased * (maxTop - minTop)));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updatePosition();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updatePosition);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updatePosition]);

  if (!phone) return null;

  return (
    <a
      ref={btnRef}
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="waf-btn"
      style={{ "--waf-top": `${topPx}px` }}
      aria-label="Contact us on WhatsApp"
    >
      <span className="waf-icon-wrap">
        <svg
          className="waf-icon"
          fill="#ffffff"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M11.42 9.49c-.19-.09-1.1-.54-1.27-.61s-.29-.09-.42.1-.48.6-.59.73-.21.14-.4 0a5.13 5.13 0 0 1-1.49-.92 5.25 5.25 0 0 1-1-1.29c-.11-.18 0-.28.08-.38s.18-.21.28-.32a1.39 1.39 0 0 0 .18-.31.38.38 0 0 0 0-.33c0-.09-.42-1-.58-1.37s-.3-.32-.41-.32h-.4a.72.72 0 0 0-.5.23 2.1 2.1 0 0 0-.65 1.55A3.59 3.59 0 0 0 5 8.2 8.32 8.32 0 0 0 8.19 11c.44.19.78.3 1.05.39a2.53 2.53 0 0 0 1.17.07 1.93 1.93 0 0 0 1.26-.88 1.67 1.67 0 0 0 .11-.88c-.05-.07-.17-.12-.36-.21z" />
          <path d="M13.29 2.68A7.36 7.36 0 0 0 8 .5a7.44 7.44 0 0 0-6.41 11.15l-1 3.85 3.94-1a7.4 7.4 0 0 0 3.55.9H8a7.44 7.44 0 0 0 5.29-12.72zM8 14.12a6.12 6.12 0 0 1-3.15-.87l-.22-.13-2.34.61.62-2.28-.14-.23a6.18 6.18 0 0 1 9.6-7.65 6.12 6.12 0 0 1 1.81 4.37A6.19 6.19 0 0 1 8 14.12z" />
        </svg>
        <span className="waf-dot" aria-hidden="true" />
      </span>
    </a>
  );
}