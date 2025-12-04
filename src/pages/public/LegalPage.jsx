// src/pages/public/LegalPage.jsx
import React, { useEffect, useState } from "react";
import { getPublicLegal, getPublicSEO } from "../../api/publicApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function LegalPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    load();
    loadSEO();
  }, [slug]);

  async function load() {
    const res = await getPublicLegal(slug);
    setPage(res.data);
  }

  async function loadSEO() {
    const res = await getPublicSEO(slug);
    setSEO(res.data);
  }

  return (
    <div style={{ padding: 20 }}>
      {seo && (
        <Helmet>
          <title>{seo.meta_title}</title>
          <meta name="description" content={seo.meta_description} />
          <meta name="keywords" content={seo.keywords} />
        </Helmet>
      )}

      <h1>{page?.title_ar}</h1>

      <div dangerouslySetInnerHTML={{ __html: page?.content_ar }} />
    </div>
  );
}
