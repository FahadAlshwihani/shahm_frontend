import React, { useEffect, useState, useMemo } from "react";
import { getPublicTeam, getTeamPage } from "../../src/api/teamApi";
import { useTranslation } from "react-i18next";
import "../../../styles/pages/team.css";

/* ===============================
   CONFIG
=============================== */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/* ===============================
   HELPERS
=============================== */

const buildImage = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

const cleanHTML = (html) => {
  if (!html) return "";

  const text = html
    .replace(/<p><br><\/p>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  return text ? html : "";
};

export default function Team() {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";

  /* ===============================
      STATES
  =============================== */

  const [members, setMembers] = useState([]);
  const [page, setPage] = useState({});

  const [search, setSearch] = useState("");

  const [selectedField, setSelectedField] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  /* ===============================
      LOAD
  =============================== */

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [m, p] = await Promise.all([getPublicTeam(), getTeamPage()]);

    setMembers(m?.data || []);
    setPage(p?.data || {});
  }

  /* ===============================
      UNIQUE FILTER VALUES
  =============================== */

  const fields = useMemo(() => {
    return [
      ...new Set(
        members.map((m) => (isEn ? m.field_en : m.field_ar)).filter(Boolean)
      ),
    ];
  }, [members, isEn]);

  const sectors = useMemo(() => {
    return [
      ...new Set(
        members.map((m) => (isEn ? m.sector_en : m.sector_ar)).filter(Boolean)
      ),
    ];
  }, [members, isEn]);

  /* ===============================
      FILTER LOGIC
  =============================== */

  const filtered = members.filter((m) => {
    const name = isEn ? m.name_en : m.name_ar;

    const matchSearch = name?.toLowerCase().includes(search.toLowerCase());

    const memberField = isEn ? m.field_en : m.field_ar;
    const memberSector = isEn ? m.sector_en : m.sector_ar;

    const matchField = selectedField ? memberField === selectedField : true;

    const matchSector = selectedSector ? memberSector === selectedSector : true;

    return matchSearch && matchField && matchSector;
  });

  /* ===============================
      CONTENT
  =============================== */

  const title = isEn ? page.title_en : page.title_ar;
  const desc = cleanHTML(isEn ? page.description_en : page.description_ar);
  const content = cleanHTML(isEn ? page.content_en : page.content_ar);
  const heroDesc = cleanHTML(
    isEn ? page.hero_description_en : page.hero_description_ar
  );

  /* ===============================
      RENDER
  =============================== */

  return (
    <div className="team-page" dir={isEn ? "ltr" : "rtl"}>
      {/* ===== ROW 1: TITLE & DESCRIPTION ===== */}
      <section className="team-header">
        {title && <h1 className="team-title-center">{title}</h1>}
        {desc && (
          <div
            className="team-description-center"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        )}
      </section>

      {/* Divider after header */}
      <div className="team-header-divider"></div>

      {/* ===== ROW 2: HERO IMAGE & DESCRIPTION ===== */}
      <section className="team-hero-section">
        {page.hero_image && (
          <div className="team-hero-image-wrapper">
            <img
              src={buildImage(page.hero_image)}
              alt={title || t("team.hero_alt")}
              className="team-hero-image"
            />
          </div>
        )}

        {heroDesc && (
          <div
            className="team-hero-description"
            dangerouslySetInnerHTML={{ __html: heroDesc }}
          />
        )}
      </section>

      {/* ===== ROW 3: SEARCH & FILTERS ===== */}
      <section className="team-filters-section">
        {/* Search Row */}
        <div className="team-search-row">
          <svg
            className="team-search-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            className="team-search-input"
            placeholder={t("team.search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters Row */}
        <div className="team-filters-row">
          {/* Field Filter */}
          <div className="team-filter-wrapper">
            <select
              className="team-filter-select"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <option value="">{t("team.all_fields")}</option>
              {fields.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div className="team-filter-wrapper">
            <select
              className="team-filter-select"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              <option value="">{t("team.all_sectors")}</option>
              {sectors.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ===== TEAM CARDS GRID ===== */}
      <section className="team-cards-section">
        <div className="team-grid">
          {filtered.map((m) => (
            <div key={m.id} className="team-card">
              {/* Member Image */}
              {m.profile_image_url && (
                <div className="team-card-image-wrapper">
                  <img
                    src={buildImage(m.profile_image_url)}
                    alt={isEn ? m.name_en : m.name_ar}
                    className="team-card-image"
                  />
                </div>
              )}

              {/* Member Info (Name + Experience) */}
              <div className="team-card-info">
                {/* Member Name */}
                <h3 className="team-card-name">
                  {isEn ? m.name_en : m.name_ar}
                </h3>

                {/* Experience/Description */}
                {(m.experience_ar || m.experience_en) && (
                  <div
                    className="team-card-experience"
                    dangerouslySetInnerHTML={{
                      __html: cleanHTML(
                        isEn ? m.experience_en : m.experience_ar
                      ),
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filtered.length === 0 && (
          <div className="team-no-results">
            <p>{t("team.no_results")}</p>
          </div>
        )}
      </section>

      {/* ===== ROW 4: MIDDLE CONTENT (CENTERED TEXT) ===== */}
      {content && (
        <section className="team-middle-content">
          <div
            className="team-content-text"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
      )}

      {/* ===== ROW 5: BOTTOM IMAGE ===== */}
      {page.bottom_image && (
        <section className="team-bottom-section">
          <div className="team-bottom-image-wrapper">
            <img
              src={buildImage(page.bottom_image)}
              alt={t("team.bottom_image_alt")}
              className="team-bottom-image"
            />
          </div>
        </section>
      )}

      {/* ===== ROW 6 & 7: CTA BUTTONS ===== */}
      <section className="team-cta-section">
        <div className="team-cta-wrapper">

          {/* Right CTA Block */}
          {page.right_link_visible && page.right_link_url && (
            <div className="team-cta-block team-cta-right">
              {(page.right_cta_title_ar || page.right_cta_title_en) && (
                <div
                  className="team-cta-title"
                  dangerouslySetInnerHTML={{
                    __html: isEn
                      ? page.right_cta_title_en
                      : page.right_cta_title_ar,
                  }}
                />
              )}

              <a href={page.right_link_url} className="team-cta-link">
                {isEn ? page.right_link_text_en : page.right_link_text_ar}
              </a>
            </div>
          )}

          {/* Left CTA Block */}
          {page.left_link_visible && page.left_link_url && (
            <div className="team-cta-block team-cta-left">
              {(page.left_cta_title_ar || page.left_cta_title_en) && (
                <div
                  className="team-cta-title"
                  dangerouslySetInnerHTML={{
                    __html: isEn
                      ? page.left_cta_title_en
                      : page.left_cta_title_ar,
                  }}
                />
              )}

              <a href={page.left_link_url} className="team-cta-link">
                {isEn ? page.left_link_text_en : page.left_link_text_ar}
              </a>
            </div>
          )}

        </div>
      </section>


    </div>
  );
}