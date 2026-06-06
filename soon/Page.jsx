// src/pages/public/Page.jsx
import React, { useEffect, useState } from "react";
import { getPublicPage } from "../src/api/publicApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Team from "./Team";
import FAQ from "../src/pages/public/FAQ";

import "../../styles/page.css"; // base page style

export default function Page() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const [page, setPage] = useState(null);

  // ===============================
  // Load CMS Page
  // ===============================
  useEffect(() => {
    const loadPage = async () => {
      try {
        const res = await getPublicPage(slug);
        setPage(res.data.page || null);
      } catch (err) {
        setPage(null);
      }
    };

    loadPage();
  }, [slug]);

  // ===============================
  // Special Pages
  // ===============================
  if (page?.slug === "team" && page?.is_published) {
    return <Team />;
  }

  if (!page) {
    return <p className="page-loading">{t("pages_public.loading")}</p>;
  }

  if (page?.slug === "faq" && page?.is_published) {
  return <FAQ />;
}

  // ===============================
  // Language
  // ===============================
  const isEnglish = i18n.language === "en";

  const title =
    isEnglish && page.title_en ? page.title_en : page.title_ar;

  const content =
    isEnglish && page.content_en ? page.content_en : page.content_ar;

  // ===============================
  // Render
  // ===============================
  return (
    <div className="classic-page">
      <Helmet>
        <title>{page?.seo?.meta_title || title || "Shahm"}</title>
        <meta
          name="description"
          content={page?.seo?.meta_description || ""}
        />
      </Helmet>

      <h1 className={`page-title ${isEnglish ? "en" : "ar"}`}>
        {title}
      </h1>

      <div
        className={`page-content ${isEnglish ? "en" : "ar"}`}
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </div>
  );
}
