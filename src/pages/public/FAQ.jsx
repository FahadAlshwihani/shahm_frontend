import React, { useEffect, useState } from "react";
import { useFaqStore } from "../../store/useFaqStore";
import { useTranslation } from "react-i18next";
import "../../styles/pages/faq.css";

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const { faqs, fetchFaqs, loading } = useFaqStore();

  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const isEn = i18n.language === "en";

  const filtered = faqs.filter((f) => {
    const q = query.toLowerCase();
    return (
      f.question_ar.toLowerCase().includes(q) ||
      f.question_en.toLowerCase().includes(q) ||
      f.answer_ar.toLowerCase().includes(q) ||
      f.answer_en.toLowerCase().includes(q)
    );
  });

  if (loading) return <p>{t("faq.loading")}</p>;

  return (
    <div className="faq-page">
      {/* Title */}
      <h1 className="faq-title-center">
        {t("faq.title")}
      </h1>

      {/* Full Width Divider */}
      <div className="faq-title-divider"></div>

      {/* FAQ + Search */}
      <div className="faq-wrapper">
        {/* Two Column Layout: Search Left, Questions Right */}
        <div className="faq-content-row">
          
          {/* Left Column - Search */}
          <div className="faq-search-column">
            <div className="faq-search-box">
              <svg 
                className="faq-search-icon" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M14 14L11.1 11.1" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <input
                className="faq-search"
                placeholder={t("faq.search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column - FAQ List */}
          <div className="faq-list-column">
            <div className="faq-list">
              {filtered.length > 0 ? (
                filtered.map((item, i) => {
                  const isOpen = openIndex === i;

                  return (
                    <div
                      key={item.id}
                      className={`faq-item ${isOpen ? "open" : ""}`}
                    >
                      {/* Question with bottom border */}
                      <button
                        className="faq-question"
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                      >
                        <span className="faq-q-text">
                          {isEn ? item.question_en : item.question_ar}
                        </span>

                        <span className="faq-arrow">
                          ▾
                        </span>
                      </button>

                      {/* Answer container with border above */}
                      <div className="faq-answer-container">
                        {/* Border between question and answer */}
                        <div className="faq-answer-border"></div>
                        
                        {/* Answer text */}
                        <div className="faq-answer">
                          {isEn ? item.answer_en : item.answer_ar}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="faq-no-results">
                  {t("faq.no_results")}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      {/* Full Width Divider */}
      <div className="faq-end-divider"></div>
    </div>
  );
}