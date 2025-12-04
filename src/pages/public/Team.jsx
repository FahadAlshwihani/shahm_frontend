// src/pages/public/Team.jsx
import React, { useEffect, useState } from "react";
import { getPublicTeam, getPublicSEO } from "../../api/publicApi";
import { Helmet } from "react-helmet";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    load();
    loadSEO();
  }, []);

  async function load() {
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
        </Helmet>
      )}

      <h1>فريق العمل</h1>

      {!team.length && <p>لا يوجد أعضاء.</p>}

      {team.map((m) => (
        <div key={m.id} style={{ marginBottom: 20 }}>
          <h2>{m.name_ar}</h2>
          <p>{m.job_title_ar}</p>
          <p>{m.bio_ar}</p>
        </div>
      ))}
    </div>
  );
}
