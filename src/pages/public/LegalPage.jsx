// src/pages/public/LegalPage.jsx
import React, { useEffect, useState } from "react";
import { getPublicPage, getPublicSEO } from "../../api/publicApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function LegalPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  const [page, setPage] = useState(null);
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    loadPage();
    loadSEO();
  }, [slug, i18n.language]);

  async function loadPage() {
    try {
      const res = await getPublicPage(slug);
      setPage(res.data?.page || null);
    } catch (err) {
      console.error("Page load error:", err);
      setPage(null);
    }
  }

  async function loadSEO() {
    try {
      const res = await getPublicSEO(slug);
      setSEO(res.data || null);
    } catch (err) {
      console.error("SEO load error:", err);
    }
  }

  if (!page || !page.is_published) {
    return <p>جاري التحميل…</p>;
  }

  const title =
    isEnglish && page.title_en ? page.title_en : page.title_ar;

  const content =
    isEnglish && page.content_en ? page.content_en : page.content_ar;

  return (
    <div style={{ padding: 20 }}>
      {seo && (
        <Helmet>
          <title>{seo.meta_title || title}</title>
          <meta
            name="description"
            content={seo.meta_description || ""}
          />
          {seo.keywords && (
            <meta name="keywords" content={seo.keywords} />
          )}
        </Helmet>
      )}

      <h1>{title}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: content || "",
        }}
      />
    </div>
  );
}
