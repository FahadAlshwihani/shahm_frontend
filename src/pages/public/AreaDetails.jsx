import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosClient";

export default function AreaDetails() {
  const { slug } = useParams();
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

  if (loading) return <p>جاري التحميل...</p>;
  if (!area) return <p>المجال غير موجود.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{area.name_ar}</h1>
      <p>{area.description_ar}</p>

      <hr />

      <h2>الخدمات</h2>

      {area.services?.length ? (
        area.services.map((srv) => (
          <div
            key={srv.id}
            style={{
              marginBottom: 18,
              paddingBottom: 12,
              borderBottom: "1px solid #ddd",
            }}
          >
            <h3>{srv.title_ar}</h3>
            <p>{srv.description_ar}</p>
          </div>
        ))
      ) : (
        <p>لا توجد خدمات لهذا المجال حالياً.</p>
      )}

      <br />
      <Link to="/services">⬅ العودة إلى جميع الخدمات</Link>
    </div>
  );
}
