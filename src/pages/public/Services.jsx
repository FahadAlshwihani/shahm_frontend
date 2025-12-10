import React, { useEffect, useState } from "react";
import { getPublicServices, getPublicSEO } from "../../api/publicApi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Services() {
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

      <h1>Practice Areas & Services</h1>

      {loading && <p>Loading…</p>}

      {!loading && areas.length === 0 && <p>No services found.</p>}

      {!loading &&
        areas.map((area) => (
          <div
            key={area.id}
            style={{
              marginTop: 24,
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <h2>{area.name_ar}</h2>

            {area.description_ar && <p>{area.description_ar}</p>}

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
              عرض التفاصيل
            </Link>
          </div>
        ))}
    </div>
  );
}
