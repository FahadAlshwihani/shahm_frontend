// src/pages/public/Team.jsx
import React, { useEffect, useState } from "react";
import { getPublicTeam } from "../../api/teamApi";
import { getPublicSEO } from "../../api/publicApi";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function Team() {
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";

  const [team, setTeam] = useState([]);
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    loadTeam();
    loadSEO();
  }, []);

  async function loadTeam() {
    const res = await getPublicTeam();
    setTeam(res.data || []);
  }

  async function loadSEO() {
    const res = await getPublicSEO("team");
    setSEO(res.data);
  }

  return (
    <div style={{ padding: 20 }}>
      {seo && (
        <Helmet>
          <title>{seo.meta_title}</title>
          <meta name="description" content={seo.meta_description} />
        </Helmet>
      )}

      <h1>{t("team_public.title")}</h1>

      {!team.length && <p>{t("team_public.no_members")}</p>}

      {team.map((m) => {
        const name =
          isEnglish && m.name_en ? m.name_en : m.name_ar;

        const jobTitle =
          isEnglish && m.job_title_en
            ? m.job_title_en
            : m.job_title_ar;

        const bio =
          isEnglish && m.bio_en ? m.bio_en : m.bio_ar;

        const experience =
          isEnglish && m.experience_en
            ? m.experience_en
            : m.experience_ar;

        return (
          <div key={m.id} style={{ marginBottom: 32 }}>
            <h2>{name}</h2>
            {jobTitle && <h4>{jobTitle}</h4>}

            {bio && (
              <div
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            )}

            {experience && (
              <>
                <h5>{t("team_public.experience")}</h5>
                <div
                  dangerouslySetInnerHTML={{ __html: experience }}
                />
              </>
            )}

            {m.profile_image_url && (
              <img
                src={m.profile_image_url}
                alt={name}
                width={120}
                style={{
                  borderRadius: 8,
                  marginTop: 12,
                  display: "block",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
