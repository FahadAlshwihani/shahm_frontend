import React, { useEffect, useState } from "react";
import { getPublicPage, getPublicSEO } from "../../api/publicApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Page() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      // -----------------------------
      // 1) LOAD PAGE + EMBEDDED SEO
      // -----------------------------
      const res = await getPublicPage(slug);

      setPage(res.data.page || null);
      setSEO(res.data.seo || null);
    } catch (err) {
      console.error("Page load error:", err);
      setPage(null);
    }
  };

  // ----------------------------------------
  // Fallback Title if SEO not defined
  // ----------------------------------------
  const finalMetaTitle = seo?.meta_title || page?.title_ar || "Shahm";
  const finalMetaDescription = seo?.meta_description || "";
  const finalKeywords = seo?.keywords || "";

  return (
    <div style={{ padding: 20 }}>
      {/* ------------------------------------- */}
      {/* SEO TAGS                              */}
      {/* ------------------------------------- */}
      <Helmet>
        <title>{finalMetaTitle}</title>
        <meta name="description" content={finalMetaDescription} />
        <meta name="keywords" content={finalKeywords} />

        {/* OG TAGS */}
        {seo?.og_title && <meta property="og:title" content={seo.og_title} />}
        {seo?.og_description && (
          <meta property="og:description" content={seo.og_description} />
        )}
        {seo?.og_image_url && (
          <meta property="og:image" content={seo.og_image_url} />
        )}

        {/* Canonical */}
        {seo?.canonical_url && (
          <link rel="canonical" href={seo.canonical_url} />
        )}
      </Helmet>

      {/* ------------------------------------- */}
      {/* PAGE CONTENT                           */}
      {/* ------------------------------------- */}
      {page ? (
        <>
          <h1>{page.title_ar}</h1>

          <div
            dangerouslySetInnerHTML={{
              __html: page.content_ar || "",
            }}
          />
        </>
      ) : (
        <p>جاري التحميل أو الصفحة غير موجودة…</p>
      )}
    </div>
  );
}
