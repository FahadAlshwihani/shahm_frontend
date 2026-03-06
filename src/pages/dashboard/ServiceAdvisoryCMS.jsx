import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";
import "../../styles/CMS_SERVICE_ADVISORY.css";

export default function ServiceAdvisoryCMS() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title_top_ar: "",
    title_top_en: "",
    description_top_ar: "",
    description_top_en: "",
    title_bottom_ar: "",
    title_bottom_en: "",
    description_bottom_ar: "",
    description_bottom_en: "",
  });

  const loadData = async () => {
    const res = await api.get("services/admin/service-advisory/");
    if (res.data) setForm(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("services/admin/service-advisory/", form);
    toast.success(t("cms.service_advisory.success.saved"));
  };

  return (
    <div className="cms-service-advisory">
      <h1 className="cms-title">{t("cms.service_advisory.content_title")}</h1>
      <p className="cms-subtitle">
        {t("cms.service_advisory.content_subtitle")}
      </p>

      <form onSubmit={submit} className="cms-card">
        <h3>{t("cms.service_advisory.sections.top")}</h3>

        <input
          placeholder={t("cms.service_advisory.placeholders.title_top_ar")}
          value={form.title_top_ar}
          onChange={(e) => setForm({ ...form, title_top_ar: e.target.value })}
        />
        <input
          placeholder={t("cms.service_advisory.placeholders.title_top_en")}
          value={form.title_top_en}
          onChange={(e) => setForm({ ...form, title_top_en: e.target.value })}
        />

        <textarea
          placeholder={t("cms.service_advisory.placeholders.description_top_ar")}
          value={form.description_top_ar}
          onChange={(e) =>
            setForm({ ...form, description_top_ar: e.target.value })
          }
        />
        <textarea
          placeholder={t("cms.service_advisory.placeholders.description_top_en")}
          value={form.description_top_en}
          onChange={(e) =>
            setForm({ ...form, description_top_en: e.target.value })
          }
        />

        <h3>{t("cms.service_advisory.sections.bottom")}</h3>

        <input
          placeholder={t("cms.service_advisory.placeholders.title_bottom_ar")}
          value={form.title_bottom_ar}
          onChange={(e) =>
            setForm({ ...form, title_bottom_ar: e.target.value })
          }
        />
        <input
          placeholder={t("cms.service_advisory.placeholders.title_bottom_en")}
          value={form.title_bottom_en}
          onChange={(e) =>
            setForm({ ...form, title_bottom_en: e.target.value })
          }
        />

        <textarea
          placeholder={t("cms.service_advisory.placeholders.description_bottom_ar")}
          value={form.description_bottom_ar}
          onChange={(e) =>
            setForm({ ...form, description_bottom_ar: e.target.value })
          }
        />
        <textarea
          placeholder={t("cms.service_advisory.placeholders.description_bottom_en")}
          value={form.description_bottom_en}
          onChange={(e) =>
            setForm({ ...form, description_bottom_en: e.target.value })
          }
        />

        <button type="submit" className="cms-btn-primary">
          {t("cms.service_advisory.actions.save")}
        </button>
      </form>
    </div>
  );
}