// src/pages/public/Page.jsx
import React, { useEffect, useState } from "react";
import { getPublicPage } from "../../api/publicApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Team from "./Team";
import "../../styles/page.css"; // ✅ أضف هذا

export default function Page() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const [page, setPage] = useState(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      const res = await getPublicPage(slug);
      setPage(res.data.page || null);
    } catch (err) {
      setPage(null);
    }
  };

  if (page?.slug === "team" && page?.is_published) {
    return <Team />;
  }

  if (!page) {
    return <p className="page-loading">{t("pages_public.loading")}</p>;
  }

  const isEnglish = i18n.language === "en";

  const title =
    isEnglish && page.title_en ? page.title_en : page.title_ar;

  const content =
    isEnglish && page.content_en ? page.content_en : page.content_ar;

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
