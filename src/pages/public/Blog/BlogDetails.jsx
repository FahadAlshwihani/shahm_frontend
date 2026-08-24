// src/pages/public/BlogDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  getPublicPostDetails
} from "../../../api/publicApi";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/pages/blogdetails.css";
import { sanitizeCmsHtml } from "../../../utils/sanitizeHtml";


export default function BlogDetails() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";

  const [post, setPost] = useState(null);

  // Smart navbar: track if user has scrolled past the hero image
  const heroRef = useRef(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when the route slug changes.
  }, [slug]);

  // Intersection observer to detect when hero is out of view
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero is NOT intersecting, we're past it → navbar goes back to default
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-65px 0px 0px 0px" }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [post]); // re-run once post loads and heroRef is attached

  // Add/remove body class so Navbar.css smart overrides kick in
  useEffect(() => {
    if (pastHero) {
      document.body.classList.remove("blogdetails-over-hero");
    } else {
      document.body.classList.add("blogdetails-over-hero");
    }
    return () => {
      document.body.classList.remove("blogdetails-over-hero");
    };
  }, [pastHero]);

  async function load() {
    const res = await getPublicPostDetails(slug);
    setPost(res.data);
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      });
    }
  };

  if (!post) return <p>{t("common.loading")}</p>;

  const title = isEnglish && post.title_en ? post.title_en : post.title_ar;
  const content = isEnglish ? post.intro_en : post.intro_ar;

  return (
    <div className="blogdetails-wrapper">

      {/* ================= DESKTOP: TITLE ================= */}
      <div className="blogdetails-title blogdetails-title--desktop">{title}</div>

      {/* ================= MOBILE: HERO IMAGE WITH TITLE OVERLAY ================= */}
      <div className="blogdetails-mobile-hero" ref={heroRef}>
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={title}
            className="blogdetails-mobile-hero-img"
          />
        )}
        <div className="blogdetails-mobile-hero-overlay">
          <h1 className="blogdetails-mobile-hero-title">{title}</h1>
        </div>
      </div>

      {/* ================= DESKTOP: COVER IMAGE ================= */}
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={title}
          className="blogdetails-cover blogdetails-cover--desktop"
        />
      )}

      {/* ================= META ROW: DATE LEFT | BUTTONS RIGHT ================= */}
      <div className="blogdetails-meta">
        <div className="blogdetails-meta-date">
          {new Date(post.created_at).toLocaleDateString(
            isEnglish ? "en-US" : "ar-SA",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </div>

        {/* Mobile "Option" label — shown only on mobile above buttons */}
        <div className="blogdetails-mobile-option-label">
          {t("blogdetails.option")}
        </div>

        <div className="blogdetails-meta-actions">
          {/* Share Button */}
          <button className="blogdetails-action-btn" onClick={handleShare}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <span className="blogdetails-action-label">{t("blogdetails.share")}</span>
          </button>

          <div className="blogdetails-actions-divider" />

          {/* Print Button */}
          <button className="blogdetails-action-btn" onClick={handlePrint}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9V2H18V9M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M18 14H6V22H18V14Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <span className="blogdetails-action-label">{t("blogdetails.print")}</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="blogdetails-content">
        {post.sections?.length > 0 ? (
          post.sections.map((section) => (
            <div key={section.id} className="blogdetails-section">
              <h2 className="blogdetails-section-title">
                {isEnglish ? section.title_en : section.title_ar}
              </h2>
              <div className="blogdetails-section-divider" />
              <div
                className="blogdetails-main-content"
                dangerouslySetInnerHTML={{
                  __html: sanitizeCmsHtml(
                    isEnglish ? section.content_en : section.content_ar
                  ),
                }}
              />
            </div>
          ))
        ) : (
          content && (
            <div
              className="blogdetails-main-content"
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(content) }}
            />
          )
        )}
      </div>
    </div>
  );
}
