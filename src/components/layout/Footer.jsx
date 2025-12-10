import React, { useEffect, useState } from "react";
import { getPublicFooter, getPublicSettings } from "../../api/publicApi";
import api from "../../api/axiosClient";

export default function Footer() {
  const [columns, setColumns] = useState([]);
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getPublicFooter().then((res) => setColumns(res.data));
    getPublicSettings().then((res) => setSettings(res.data));
  }, []);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await api.post("messaging/subscribe/", { email });
      alert("تم الاشتراك في النشرة البريدية");
      setEmail("");
    } catch (err) {
      console.error(err);
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer style={{ padding: "40px", background: "#f8f8f8" }}>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {columns.map((col) => (
          <div key={col.id} style={{ minWidth: "220px" }}>
            <h3>{col.title_ar}</h3>

            {/* Newsletter Form */}
            {col.title_ar === "أرغب في تلقي كل جديد" ? (
              <form onSubmit={subscribe}>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
                <button type="submit" style={{ marginTop: "10px" }}>
                  اشتراك
                </button>
              </form>
            ) : (
              <ul>
                {col.links.map((lnk) => (
                  <li key={lnk.id}>
                    {lnk.is_coming_soon ? (
                      // رمادي وبدون رابط
                      <span style={{ color: "#999" }}>{lnk.label_ar}</span>
                    ) : (
                      <a href={lnk.url}>{lnk.label_ar}</a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Country / Language */}
      {settings && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {settings.country} — (
          {settings.locale === "ar" ? "العربية" : "EN"})
        </div>
      )}

      {/* COPYRIGHT */}
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        © {year} — مكتب شهم للمحاماة
      </p>
    </footer>
  );
}
