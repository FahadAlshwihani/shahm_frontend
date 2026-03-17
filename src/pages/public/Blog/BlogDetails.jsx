// src/pages/public/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { getPublicBlogPost, getPublicBlog } from "../../../api/publicApi";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/pages/blogdetails.css";

export default function BlogDetails() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const [post, setPost] = useState(null);
  const [openClause, setOpenClause] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [preferenceStep, setPreferenceStep] = useState(0);
  const [preferences, setPreferences] = useState({
    article: null,
    news: null,
    insight: null
  });

  useEffect(() => {
    load();
  }, [slug]);

  async function load() {
    const res = await getPublicBlogPost(slug);
    setPost(res.data);

    // Fetch related posts for slider
    const relatedRes = await getPublicBlog(res.data.type);
    const filtered = (relatedRes.data || []).filter(p => p.slug !== slug);
    setRelatedPosts(filtered.slice(0, 6));
  }

  const nextSlide = () => {
    setCurrentSlide(prev =>
      prev === relatedPosts.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev =>
      prev === 0 ? relatedPosts.length - 1 : prev - 1
    );
  };

  const handlePreferenceSelect = (type, interested) => {
    setPreferences(prev => ({ ...prev, [type]: interested }));

    // Move to next step or close modal
    if (preferenceStep < 2) {
      setPreferenceStep(prev => prev + 1);
    } else {
      setShowPreferencesModal(false);
      setPreferenceStep(0);
    }
  };

  const openPreferencesModal = () => {
    setShowPreferencesModal(true);
    setPreferenceStep(0);
  };

  const closePreferencesModal = () => {
    setShowPreferencesModal(false);
    setPreferenceStep(0);
  };

  // Filter posts based on preferences
  const filteredRelatedPosts = relatedPosts.filter(post => {
    if (preferences.article === false && post.type === 'article') return false;
    if (preferences.news === false && post.type === 'news') return false;
    if (preferences.insight === false && post.type === 'insight') return false;
    return true;
  });

  const renderArrows = () => {
    const prevButton = (
      <button
        key="prev"
        className="blogdetails-slider-arrow blogdetails-slider-arrow-left"
        onClick={prevSlide}
        aria-label="Previous"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 12H4M10 6L4 12L10 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );

    const nextButton = (
      <button
        key="next"
        className="blogdetails-slider-arrow blogdetails-slider-arrow-right"
        onClick={nextSlide}
        aria-label="Next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12H20M14 6L20 12L14 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );

    return isRTL ? [nextButton, prevButton] : [prevButton, nextButton];
  };

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

  const handlePDF = () => {
    window.print();
  };

  if (!post) return <p>{t("common.loading")}</p>;

  const title = isEnglish && post.title_en ? post.title_en : post.title_ar;
  const content = isEnglish && post.content_en ? post.content_en : post.content_ar;
  const hasClauses = post.clauses?.length > 0;

  const CARD_WIDTH = 440;
  const offset = currentSlide * CARD_WIDTH;
  const translateValue = isRTL ? offset : -offset;

  return (
    <div className="blogdetails-wrapper">
      {/* ================= HEADER TITLE ================= */}
      <div className="blogdetails-title">{title}</div>
      <div className="blogdetails-divider"></div>

      {/* ================= META ROW ================= */}
      <div className="blogdetails-meta">
        <div className="blogdetails-meta-col">
          <span className="blogdetails-meta-label">{t("blogdetails.date")}</span>
          <span className="blogdetails-meta-value">
            {new Date(post.created_at).toLocaleDateString(
              isEnglish ? "en-US" : "ar-SA",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </span>
        </div>

        <div className="blogdetails-meta-col center">
          <span className="blogdetails-meta-label">{t("blogdetails.read_time")}</span>
          <span className="blogdetails-meta-value">
            {post.read_time} {t("blogdetails.mins")}
          </span>
        </div>

        <div className="blogdetails-meta-actions">
          <button onClick={handleShare} title={t("blogdetails.share")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button onClick={handlePDF} title={t("blogdetails.pdf")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20M16 13H8M16 17H8M10 9H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button onClick={handlePrint} title={t("blogdetails.print")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9V2H18V9M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 14H6V22H18V14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ================= COVER IMAGE ================= */}
      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={title} className="blogdetails-cover" />
      )}

      {/* ================= TWO COLUMN HEADER: CLAUSES | TITLE ================= */}
      <div className="blogdetails-header-row">
        <div className="blogdetails-header-col">
          <h3 className="blogdetails-header-title">{t("blogdetails.clauses")}</h3>
          <div className="blogdetails-header-divider"></div>
        </div>

        <div className="blogdetails-header-col">
          <h3 className="blogdetails-header-title">{title}</h3>
          <div className="blogdetails-header-divider"></div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="blogdetails-grid">
        {/* ========= SIDEBAR (LEFT) ========= */}
        <div className="blogdetails-sidebar">
          {/* Collapsible Clauses */}
          {hasClauses && (
            <div className="blogdetails-clauses-list">
              {post.clauses.map((clause, index) => (
                <div key={clause.id} className="blogdetails-clause-item">
                  <button
                    className="blogdetails-clause-button"
                    onClick={() =>
                      setOpenClause(openClause === index ? null : index)
                    }
                  >
                    <span className="blogdetails-clause-title">
                      <span className="blogdetails-clause-number">({clause.order})</span> {isEnglish ? clause.title_en : clause.title_ar}
                    </span>
                    <svg
                      className={`blogdetails-clause-arrow ${openClause === index ? 'open' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {openClause === index && (
                    <div
                      className="blogdetails-clause-content"
                      dangerouslySetInnerHTML={{
                        __html: isEnglish
                          ? clause.content_en
                          : clause.content_ar,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Related People */}
          {post.related_people?.length > 0 && (
            <>
              <h3 className="blogdetails-sidebar-title mt-40">
                {t("blogdetails.related_people")}
              </h3>
              <div className="blogdetails-sidebar-divider"></div>

              {post.related_people.map((person) => (
                <div key={person.id} className="blogdetails-person">
                  <div className="blogdetails-person-badge"></div>
                  {(person.image_url || person.image) && (
                    <img
                      src={person.image_url || person.image}
                      alt=""
                      className="blogdetails-person-img"
                    />
                  )}
                  <div className="blogdetails-person-info">
                    <div className="blogdetails-person-name">
                      {isEnglish ? person.name_en : person.name_ar}
                    </div>
                    <div className="blogdetails-person-role">
                      {isEnglish
                        ? person.description_en
                        : person.description_ar}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ========= CONTENT (RIGHT) ========= */}
        <div className="blogdetails-content">
          {content && (
            <div
              className="blogdetails-main-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>

      {/* ================= DIVIDER BEFORE SERVICES ================= */}
      <div className="blogdetails-services-divider"></div>

      {/* ================= RELATED SERVICES ================= */}
      <section className="blogdetails-services-section">
        <h2 className="blogdetails-services-title">
          {t("blogdetails.related_services")}
        </h2>

        <div className="blogdetails-services-grid">
          <div className="blogdetails-service-wrapper">
            <div className="blogdetails-service-card">
              {/* Top Section: Icon + Reference Number */}
              <div className="blogdetails-service-header">
                <div className="blogdetails-service-icon">
                  <svg width="32" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5 3L20.5 9L18.5 11L12.5 5L14.5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.5 3L10.5 7L16.5 13L20.5 9L14.5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 14L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.5 19.5L7.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 21L10.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="blogdetails-service-reference">L-LIT-EVA-01</span>
              </div>

              {/* Title */}
              <h3 className="blogdetails-service-card-title">
                {t("blogdetails.service_card_title_1")}
              </h3>

              {/* Divider */}
              <div className="blogdetails-service-card-divider"></div>

              {/* Description */}
              <p className="blogdetails-service-card-description">
                {t("blogdetails.service_card_desc_1")}
              </p>
            </div>

            {/* Footer OUTSIDE Card */}
            <div className="blogdetails-service-footer-external">
              <Link to="/service" className="blogdetails-service-footer-link">
                {t("blogdetails.request_service")}
              </Link>
              <span className="blogdetails-service-footer-type">
                {t("blogdetails.service_type_1")}
              </span>
            </div>
          </div>

          <div className="blogdetails-service-wrapper">
            <div className="blogdetails-service-card">
              <div className="blogdetails-service-header">
                <div className="blogdetails-service-icon">
                  <svg width="32" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3V21M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 7H4L6 14H10L8 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 7H20L18 14H14L16 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="blogdetails-service-reference">L-LIT-EVA-02</span>
              </div>

              <h3 className="blogdetails-service-card-title">
                {t("blogdetails.service_card_title_2")}
              </h3>

              <div className="blogdetails-service-card-divider"></div>

              <p className="blogdetails-service-card-description">
                {t("blogdetails.service_card_desc_2")}
              </p>
            </div>

            <div className="blogdetails-service-footer-external">
              <Link to="/service" className="blogdetails-service-footer-link">
                {t("blogdetails.request_service")}
              </Link>
              <span className="blogdetails-service-footer-type">
                {t("blogdetails.service_type_2")}
              </span>
            </div>
          </div>

          <div className="blogdetails-service-wrapper">
            <div className="blogdetails-service-card">
              <div className="blogdetails-service-header">
                <div className="blogdetails-service-icon">
                  <svg width="32" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="blogdetails-service-reference">L-LIT-EVA-03</span>
              </div>

              <h3 className="blogdetails-service-card-title">
                {t("blogdetails.service_card_title_3")}
              </h3>

              <div className="blogdetails-service-card-divider"></div>

              <p className="blogdetails-service-card-description">
                {t("blogdetails.service_card_desc_3")}
              </p>
            </div>

            <div className="blogdetails-service-footer-external">
              <Link to="/service" className="blogdetails-service-footer-link">
                {t("blogdetails.request_service")}
              </Link>
              <span className="blogdetails-service-footer-type">
                {t("blogdetails.service_type_3")}
              </span>
            </div>
          </div>

          <div className="blogdetails-service-wrapper">
            <div className="blogdetails-service-card">
              <div className="blogdetails-service-header">
                <div className="blogdetails-service-icon">
                  <svg width="32" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5 3L20.5 9L18.5 11L12.5 5L14.5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.5 3L10.5 7L16.5 13L20.5 9L14.5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 14L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.5 19.5L7.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 21L10.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="blogdetails-service-reference">L-LIT-EVA-04</span>
              </div>

              <h3 className="blogdetails-service-card-title">
                {t("blogdetails.service_card_title_4")}
              </h3>

              <div className="blogdetails-service-card-divider"></div>

              <p className="blogdetails-service-card-description">
                {t("blogdetails.service_card_desc_4")}
              </p>
            </div>

            <div className="blogdetails-service-footer-external">
              <Link to="/service" className="blogdetails-service-footer-link">
                {t("blogdetails.request_service")}
              </Link>
              <span className="blogdetails-service-footer-type">
                {t("blogdetails.service_type_4")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED SLIDER (FROM BLOG.JSX) ================= */}
      {relatedPosts.length > 0 && (
        <section className="blogdetails-slider-section">
          <div className="blogdetails-slider-container">
            {/* Explore Text */}
            <p className="blogdetails-slider-explore">
              {t("blogdetails.explore_report")}
            </p>

            {/* Row 1: Title + Top Progress Bar */}
            <div className="blogdetails-slider-row-1">
              <h2 className="blogdetails-slider-title">
                {t("blogdetails.interested_in_content")}
              </h2>

              {/* Top Progress Bar */}
              <div className="blogdetails-slider-progress-bar-top">
                <div
                  className="blogdetails-slider-progress-fill-top"
                  style={{
                    width: showPreferencesModal
                      ? `${((preferenceStep + 1) / 3) * 100}%`
                      : `${((currentSlide + 1) / filteredRelatedPosts.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Row 2: Subtitle + Preferences/Steps */}
            <div className="blogdetails-slider-row-2">
              <p className="blogdetails-slider-subtitle">
                {t("blogdetails.explore_preferences")}
              </p>

              {/* Preferences Link or Steps */}
              {!showPreferencesModal ? (
                <div className="blogdetails-slider-preferences" onClick={openPreferencesModal}>
                  <span className="blogdetails-slider-preferences-text">
                    {t("blogdetails.register_preferences")}
                  </span>
                  <svg
                    className="blogdetails-slider-preferences-arrow"
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                  >
                    {isRTL ? (
                      <path
                        d="M6.5 1L1.5 6L6.5 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M1.5 1L6.5 6L1.5 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>

                </div>
              ) : (
                <div className="blogdetails-preferences-inline">
                  <div className="blogdetails-preferences-step">
                    <span className="blogdetails-preferences-step-title">
                      {preferenceStep === 0 && t("blogdetails.preference_article")}
                      {preferenceStep === 1 && t("blogdetails.preference_news")}
                      {preferenceStep === 2 && t("blogdetails.preference_insight")}
                    </span>
                    <div className="blogdetails-preferences-buttons">
                      <button
                        className="blogdetails-preferences-btn blogdetails-preferences-interested"
                        onClick={() => handlePreferenceSelect(
                          preferenceStep === 0 ? 'article' : preferenceStep === 1 ? 'news' : 'insight',
                          true
                        )}
                      >
                        {t("blogdetails.interested")}
                      </button>
                      <button
                        className="blogdetails-preferences-btn blogdetails-preferences-not-interested"
                        onClick={() => handlePreferenceSelect(
                          preferenceStep === 0 ? 'article' : preferenceStep === 1 ? 'news' : 'insight',
                          false
                        )}
                      >
                        {t("blogdetails.not_interested")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cards - Show 3 Full Cards */}
            <div className="blogdetails-slider-viewport-full">
              <div
                className="blogdetails-slider-cards"
                style={{
                  transform: `translateX(${translateValue}px)`
                }}
              >
                {filteredRelatedPosts.map((post) => {
                  const postTitle =
                    isEnglish && post.title_en
                      ? post.title_en
                      : post.title_ar;
                  const category = isEnglish
                    ? post.category_data?.name_en
                    : post.category_data?.name_ar;
                  const categoryColor =
                    post.category_data?.color || "#C59A5C";
                  const date = new Date(
                    post.created_at
                  ).toLocaleDateString(isEnglish ? "en-US" : "ar-SA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="blogdetails-slider-card"
                    >
                      {post.cover_image_url && (
                        <div className="blogdetails-slider-card-image">
                          <img
                            src={post.cover_image_url}
                            alt={postTitle}
                          />
                        </div>
                      )}

                      <div className="blogdetails-slider-card-content">

                        {post.tags?.length > 0 && (
                          <p className="blogdetails-card-tags">
                            {post.tags
                              .map(tag => isEnglish ? tag.name_en : tag.name_ar)
                              .join(", ")}
                          </p>
                        )}

                        <h3 className="blogdetails-slider-card-title">
                          {postTitle}
                        </h3>

                        <div className="blogdetails-slider-card-meta">
                          <div className="blogdetails-slider-card-category-wrapper">
                            <span
                              className="blogdetails-slider-card-category-bar"
                              style={{ backgroundColor: categoryColor }}
                            />
                            <span className="blogdetails-slider-card-category">
                              {category}
                            </span>
                          </div>

                          <span className="blogdetails-slider-card-date">
                            {date}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Progress Bar + Arrows */}
            <div className="blogdetails-slider-bottom-row">
              {/* Bottom Progress Bar */}
              <div className="blogdetails-slider-progress-bar-bottom">
                <div
                  className="blogdetails-slider-progress-fill-bottom"
                  style={{
                    width: filteredRelatedPosts.length
                      ? `${((currentSlide + 1) / filteredRelatedPosts.length) * 100}%`
                      : "0%"
                  }}
                ></div>
              </div>

              {/* Arrows */}
              <div className="blogdetails-slider-navigation">
                {renderArrows()}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}