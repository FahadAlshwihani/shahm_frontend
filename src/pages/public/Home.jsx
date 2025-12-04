// src/pages/public/Home.jsx
import React, { useEffect } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import { getPublicSEO } from "../../api/publicApi";
import { Helmet } from "react-helmet";

export default function Home() {
  const { hero, footer, fetchPublicHome } = useCmsStore();
  const [seo, setSEO] = React.useState(null);

  useEffect(() => {
    fetchPublicHome();
    loadSEO();
  }, []);

  async function loadSEO() {
    const res = await getPublicSEO("home");
    setSEO(res.data);
  }

  return (
    <div style={{ padding: 20 }}>
      {/* SEO */}
      {seo && (
        <Helmet>
          <title>{seo.meta_title}</title>
          <meta name="description" content={seo.meta_description} />
          <meta name="keywords" content={seo.keywords} />
        </Helmet>
      )}

      {/* HERO */}
      <section>
        <h1>{hero?.title_ar}</h1>
        <p>{hero?.subtitle_ar}</p>
      </section>

      <hr />

      {/* FOOTER CONTENT */}
      <section>
        <h2>Footer</h2>
        {!footer && <p>Loading footer…</p>}

        {footer?.map((col) => (
          <div key={col.id} style={{ marginBottom: 20 }}>
            <h3>{col.title_ar}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.id}>{l.label_ar}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
