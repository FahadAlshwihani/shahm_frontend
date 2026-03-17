import React, { useEffect, useState } from "react";
import { getPublicLegal } from "../../api/legalApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import "../../styles/pages/legalpage.css";
import LogoImage from "../../images/Logo.png";


export default function LegalPage() {

  const { slug } = useParams();
  const { i18n } = useTranslation();

  const isEnglish = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const [page, setPage] = useState(null);
  const [openClause, setOpenClause] = useState(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  async function loadPage() {
    try {
      const res = await getPublicLegal(slug);
      setPage(res.data);
    } catch (err) {
      console.error("Legal load error:", err);
    }
  }

  if (!page) return null;

  const title =
    isEnglish && page.title_en
      ? page.title_en
      : page.title_ar;

  return (
    <div className="legalpage-wrapper">

      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content={
            isEnglish
              ? page.meta_description_en
              : page.meta_description_ar
          }
        />
      </Helmet>

      {/* ================= TITLE ================= */}

      <h1 className="legalpage-title">
        {title}
      </h1>

      <div className="legalpage-divider" />

      {/* ================= BANNER ================= */}

      <div className="legalpage-banner">

        <img src={LogoImage} alt="Logo" />

      </div>

      {/* ================= HEADER ROW ================= */}

      <div className="legalpage-header-row">

        <div className="legalpage-header-col">
          <h3 className="legalpage-header-title">
            البنود
          </h3>
          <div className="legalpage-header-divider" />
        </div>

        <div className="legalpage-header-col">
          <h3 className="legalpage-header-title">
            {title}
          </h3>
          <div className="legalpage-header-divider" />
        </div>

      </div>

      {/* ================= GRID ================= */}

      <div className="legalpage-grid">

        {/* ===== SIDEBAR ===== */}

        <aside className="legalpage-sidebar">

          {page.sections?.map((section, index) => {

            const sectionTitle =
              isEnglish && section.title_en
                ? section.title_en
                : section.title_ar;

            const sectionContent =
              isEnglish && section.content_en
                ? section.content_en
                : section.content_ar;

            return (

              <div
                key={section.id}
                className="legalpage-clause-item"
              >

                <button
                  className="legalpage-clause-button"
                  onClick={() =>
                    setOpenClause(
                      openClause === index ? null : index
                    )
                  }
                >

                  <span className="legalpage-clause-title">

                    <span className="legalpage-clause-number">
                      ({index + 1})
                    </span>

                    {sectionTitle}

                  </span>

                  <svg
                    className={`legalpage-clause-arrow ${openClause === index ? "open" : ""
                      }`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
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
                    className="legalpage-clause-content"
                    dangerouslySetInnerHTML={{
                      __html: sectionContent
                    }}
                  />

                )}

              </div>

            );

          })}

        </aside>

        {/* ===== CONTENT ===== */}

        <main className="legalpage-content">

          {page.sections?.map((section) => {

            const sectionTitle =
              isEnglish && section.title_en
                ? section.title_en
                : section.title_ar;

            const sectionContent =
              isEnglish && section.content_en
                ? section.content_en
                : section.content_ar;

            return (

              <section
                key={section.id}
                id={section.anchor}
                className="legalpage-section"
              >

                <h2 className="legalpage-section-title">
                  {sectionTitle}
                </h2>

                <div
                  className="legalpage-section-content"
                  dangerouslySetInnerHTML={{
                    __html: sectionContent
                  }}
                />

              </section>

            );

          })}

        </main>

      </div>

    </div>
  );
}