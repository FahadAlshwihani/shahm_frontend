// src/pages/public/AreaDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosClient";
import { useTranslation } from "react-i18next";

export default function AreaDetails() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";

  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArea();
  }, [slug]);

  async function loadArea() {
    try {
      const res = await api.get(`services/public/${slug}/`);
      setArea(res.data);
    } catch (error) {
      console.error("Error loading area:", error);
    }
    setLoading(false);
  }

  if (loading) return <p>{t("common.loading")}</p>;
  if (!area) return <p>{t("services.area_not_found")}</p>;

  const areaName =
    isEnglish && area.name_en ? area.name_en : area.name_ar;

  const areaDescription =
    isEnglish && area.description_en
      ? area.description_en
      : area.description_ar;

  return (
    <div style={{ padding: 20 }}>
      <h1>{areaName}</h1>

      {areaDescription && <p>{areaDescription}</p>}

      <hr />

      <h2>{t("services.services")}</h2>

      {area.services?.length ? (
        area.services.map((srv) => {
          const serviceTitle =
            isEnglish && srv.title_en ? srv.title_en : srv.title_ar;

          const serviceDescription =
            isEnglish && srv.description_en
              ? srv.description_en
              : srv.description_ar;

          return (
            <div
              key={srv.id}
              style={{
                marginBottom: 18,
                paddingBottom: 12,
                borderBottom: "1px solid #ddd",
              }}
            >
              <h3>{serviceTitle}</h3>
              {serviceDescription && <p>{serviceDescription}</p>}
            </div>
          );
        })
      ) : (
        <p>{t("services.no_services")}</p>
      )}

      <br />
      <Link to="/services">⬅ {t("services.back_to_services")}</Link>
    </div>
  );
}
