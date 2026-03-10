import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_SERVICE_ADVISORY.css";

export default function ServiceAdvisoryRequests() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const res = await api.get("services/admin/service-advisory/requests/");
    setItems(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="cms-service-advisory">
      <h1 className="cms-title">
        {t("cms.service_advisory.requests_title")}
      </h1>

      <div className="cms-card">
        <table className="cms-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("cms.service_advisory.table.name")}</th>
              <th>{t("cms.service_advisory.table.email")}</th>
              <th>{t("cms.service_advisory.table.phone")}</th>
              <th>{t("cms.service_advisory.table.service")}</th>
              <th>{t("cms.service_advisory.table.date")}</th>
              <th>{t("cms.actions.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.first_name} {r.last_name}</td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>
                  {r.items?.length
                    ? r.items
                      .map((i) => i.service?.title_ar || i.service?.title_en)
                      .join(", ")
                    : "—"}
                </td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="cms-btn-secondary"
                    onClick={() => setSelected(r)}
                  >
                    {t("cms.actions.view")}
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  {t("cms.service_advisory.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="cms-modal-overlay">
          <div className="cms-modal">
            <h3>
              {selected.first_name} {selected.last_name}
            </h3>

            <p><b>Email:</b> {selected.email}</p>
            <p><b>Phone:</b> {selected.phone}</p>
            <p><b>Message:</b> {selected.message || "—"}</p>
            {selected.voice_note && (
              <div style={{ marginTop: "10px" }}>
                <b>Voice Note:</b>
                <audio controls style={{ width: "100%", marginTop: "5px" }}>
                  <source src={selected.voice_note} />
                </audio>
              </div>
            )}

            {selected.attachment && (
              <button
                className="cms-btn-secondary"
                onClick={async () => {
                  try {
                    const res = await api.get(
                      `services/admin/service-advisory/requests/${selected.id}/download/`,
                      {
                        responseType: "blob", // ⭐⭐⭐ الأهم
                      }
                    );

                    const blob = new Blob([res.data]);
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = selected.attachment.split("/").pop(); // اسم الملف الحقيقي
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    alert("فشل تحميل الملف");
                  }
                }}
              >
                تحميل المرفق
              </button>




            )}

            <select
              value={selected.status}
              onChange={async (e) => {
                const res = await api.patch(
                  `services/admin/service-advisory/requests/${selected.id}/`,
                  { status: e.target.value }
                );
                setSelected(res.data);
                load(); // تحديث الجدول
              }}
            >
              <option value="new">جديد</option>
              <option value="replied">تم الرد</option>
              <option value="closed">مغلق</option>
            </select>

            <button
              className="cms-btn-danger"
              onClick={() => setSelected(null)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
