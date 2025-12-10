// src/pages/public/Page.jsx
import React, { useEffect, useState } from "react";
import { getPublicPage } from "../../api/publicApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Team from "./Team"; // <<< مهم جداً

export default function Page() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      const res = await getPublicPage(slug);
      setPage(res.data.page || null);
    } catch (err) {
      console.error("Page load error:", err);
      setPage(null);
    }
  };

  // لو الصفحة هي فريق العمل + مفعلة → اعرض مكون الفريق الحقيقي
  if (page?.slug === "team" && page?.is_published) {
    return <Team />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Helmet>
        <title>{page?.seo?.meta_title || page?.title_ar || "Shahm"}</title>
        <meta
          name="description"
          content={page?.seo?.meta_description || ""}
        />
      </Helmet>

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
        <p>جاري التحميل…</p>
      )}
    </div>
  );
}
