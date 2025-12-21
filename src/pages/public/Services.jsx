// src/pages/public/Services.jsx
import React, { useEffect, useState } from "react";
import { getPublicServices, getPublicSEO } from "../../api/publicApi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";

  const [areas, setAreas] = useState([]);
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [areasRes, seoRes] = await Promise.all([
          getPublicServices(),
          getPublicSEO("services"),
        ]);

        setAreas(areasRes.data || []);
        setSEO(seoRes.data || null);
      } catch (err) {
        console.error("Services page error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {/* SEO */}
      {seo && (
        <Helmet>
          <title>{seo.meta_title}</title>
          <meta name="description" content={seo.meta_description} />
        </Helmet>
      )}

      <h1>{t("services.title")}</h1>

      {loading && <p>{t("common.loading")}</p>}

      {!loading && areas.length === 0 && (
        <p>{t("services.no_areas")}</p>
      )}

      {!loading &&
        areas.map((area) => {
          const name =
            isEnglish && area.name_en ? area.name_en : area.name_ar;

          const description =
            isEnglish && area.description_en
              ? area.description_en
              : area.description_ar;

          return (
            <div
              key={area.id}
              style={{
                marginTop: 24,
                padding: 16,
                border: "1px solid #eee",
                borderRadius: 8,
              }}
            >
              <h2>{name}</h2>

              {description && <p>{description}</p>}

              <Link
                to={`/services/${area.slug}`}
                style={{
                  marginTop: 12,
                  display: "inline-block",
                  padding: "8px 14px",
                  background: "#6a0018",
                  color: "white",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                {t("services.view_details")}
              </Link>
            </div>
          );
        })}
    </div>
  );
}
