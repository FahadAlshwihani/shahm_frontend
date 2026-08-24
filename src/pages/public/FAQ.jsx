import React, { useEffect, useState } from "react";
import { useFaqStore } from "../../store/useFaqStore";
import { useTranslation } from "react-i18next";
import "../../styles/pages/faq.css";

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const { faqs, categories, fetchFaqs, loading } = useFaqStore();
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const getText = (f, field, lang) => {
    if (f[`${field}_${lang}`]) return f[`${field}_${lang}`];
    if (f[field]?.[lang]) return f[field][lang];
    return "";
  };

  const filtered = faqs.filter((f) => {
    const matchesCategory =
      !selectedCategory || String(f.category) === String(selectedCategory);
    return matchesCategory;
  });

  // Get active category label for right col title
  const activeCategory = categories.find(
    (c) => String(c.id) === String(selectedCategory)
  );
  const rightColTitle = activeCategory
    ? isEn
      ? activeCategory.title_en
      : activeCategory.title_ar
    : t("faq.all_faqs");

  if (loading) return <p className="faq-loading">{t("faq.loading")}</p>;

  return (
    <div className="faq-page" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Header ── */}
      <div className="faq-header">
        <h1 className="faq-title">{t("faq.title")}</h1>
        <p className="faq-subtitle">{t("faq.subtitle")}</p>
      </div>

      {/* ── Full-width divider ── */}
      <div className="faq-divider-full" />

      {/* ── Two-column layout ── */}
      <div className="faq-wrapper">
        <div className="faq-content-row">

          {/* ════ LEFT COLUMN — Filters ════ */}
          <div className="faq-left-col">
            <p className="faq-browse-label">{t("faq.browse_by_topic")}</p>

            <div className="faq-categories">
              {/* ALL button */}
              <button
                className={`faq-cat-item ${!selectedCategory ? "faq-cat-item--active" : ""}`}
                onClick={() => setSelectedCategory(null)}
              >
                <span className="faq-cat-icon">
                  <svg
                    width="15"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </span>
                <span className="faq-cat-label">{t("faq.all")}</span>
              </button>

              {categories.map((cat, idx) => {
                return (
                  <React.Fragment key={cat.id}>
                    {/* Vertical divider between each pair */}
                    {idx % 2 === 1 && (
                      <>
                        {/* Horizontal row divider BEFORE this item (between rows) */}
                      </>
                    )}
                    <button
                      className={`faq-cat-item ${
                        String(selectedCategory) === String(cat.id)
                          ? "faq-cat-item--active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedCategory(
                          String(selectedCategory) === String(cat.id)
                            ? null
                            : cat.id
                        )
                      }
                    >
                      <span className="faq-cat-icon">
                        {cat.icon_url ? (
                          <img
                            src={cat.icon_url}
                            alt=""
                            width="15"
                            height="19"
                          />
                        ) : (
                          <svg
                            width="15"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <circle cx="12" cy="12" r="9" />
                          </svg>
                        )}
                      </span>
                      <span className="faq-cat-label">
                        {isEn ? cat.title_en : cat.title_ar}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* ════ RIGHT COLUMN — FAQ List ════ */}
          <div className="faq-right-col">
            {/* Section title — changes based on selected filter */}
            <h2 className="faq-section-title">{rightColTitle}</h2>

            <div className="faq-list">
              {filtered.length > 0 ? (
                filtered.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div
                      key={item.id}
                      className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                    >
                      {/* Question row */}
                      <button
                        className="faq-question"
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                      >
                        <span className="faq-q-text">
                          {isEn
                            ? getText(item, "question", "en")
                            : getText(item, "question", "ar")}
                        </span>
                        {/* Chevron arrow — down when closed, up when open */}
                        <span className="faq-arrow" aria-hidden="true">
                          <svg
                            width="11"
                            height="6"
                            viewBox="0 0 11 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L5.5 5L10 1"
                              stroke="#343C3C"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>

                      {/* Divider — color changes when open */}
                      <div className="faq-question-divider" />

                      {/* Answer */}
                      <div className="faq-answer-container">
                        <div className="faq-answer">
                          {isEn
                            ? getText(item, "answer", "en")
                            : getText(item, "answer", "ar")}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="faq-no-results">{t("faq.no_results")}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom full-width divider ── */}
      <div className="faq-divider-full faq-divider-bottom" />
    </div>
  );
}
