// src/pages/dashboard/Services_Manage.jsx
import React, { useEffect, useState } from "react";
import { useServicesStore } from "../../store/useServicesStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_SERVICE.css";

export default function Services_Manage() {
  const { t } = useTranslation();

  const {
    areas,
    services,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServicesStore();

  /* ========================= AREA STATE ========================= */
  const [areaForm, setAreaForm] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    is_active: true,
  });
  const [editingArea, setEditingArea] = useState(null);

  /* ========================= SERVICE STATE ========================= */
  const [serviceForm, setServiceForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    area: "",
    is_featured: false,
    is_active: true,
  });
  const [editingService, setEditingService] = useState(null);

  /* ========================= LOAD DATA ========================= */
  useEffect(() => {
    fetchAreas();
    fetchServices();
  }, []);

  /* ========================= AREA HANDLERS ========================= */
  const handleAreaSave = async () => {
    if (!areaForm.name_ar.trim())
      return toast.error(t("cms.services.area_required"));

    const payload = {
      name_ar: areaForm.name_ar,
      name_en: areaForm.name_en,
      slug: areaForm.slug || undefined,
      is_active: true,
    };

    const result = editingArea
      ? await updateArea(editingArea.id, payload)
      : await createArea(payload);

    if (result.success) {
      toast.success(
        editingArea
          ? t("cms.services.area_updated")
          : t("cms.services.area_created")
      );
      setAreaForm({ name_ar: "", name_en: "", slug: "", is_active: true });
      setEditingArea(null);
    } else {
      toast.error(t("cms.services.area_save_failed"));
    }
  };

  const handleAreaEdit = (area) => {
    setEditingArea(area);
    setAreaForm({
      name_ar: area.name_ar,
      name_en: area.name_en,
      slug: area.slug,
      is_active: area.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAreaDelete = async (id) => {
    if (!window.confirm(t("cms.services.confirm_delete_area"))) return;
    const result = await deleteArea(id);
    result.success
      ? toast.success(t("cms.services.area_deleted"))
      : toast.error(t("cms.services.area_delete_failed"));
  };

  /* ========================= SERVICE HANDLERS ========================= */
  const handleServiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceSave = async () => {
    if (!serviceForm.title_ar.trim())
      return toast.error(t("cms.services.service_required"));

    const payload = {
      title_ar: serviceForm.title_ar,
      title_en: serviceForm.title_en,
      description_ar: serviceForm.description_ar,
      description_en: serviceForm.description_en,
      practice_area: serviceForm.area || null,
      is_featured: serviceForm.is_featured,
      is_active: true,
    };

    const result = editingService
      ? await updateService(editingService.id, payload)
      : await createService(payload);

    if (result.success) {
      toast.success(
        editingService
          ? t("cms.services.service_updated")
          : t("cms.services.service_created")
      );
      setEditingService(null);
      setServiceForm({
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        area: "",
        is_featured: false,
        is_active: true,
      });
    } else {
      toast.error(t("cms.services.service_save_failed"));
    }
  };

  const handleServiceEdit = (service) => {
    const areaId =
      service.practice_area ||
      service.practice_area_id ||
      service.area_data?.id ||
      "";

    setEditingService(service);
    setServiceForm({
      title_ar: service.title_ar,
      title_en: service.title_en,
      description_ar: service.description_ar,
      description_en: service.description_en,
      area: areaId,
      is_featured: !!service.is_featured,
      is_active: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServiceDelete = async (id) => {
    if (!window.confirm(t("cms.services.confirm_delete_service"))) return;
    const result = await deleteService(id);
    result.success
      ? toast.success(t("cms.services.service_deleted"))
      : toast.error(t("cms.services.service_delete_failed"));
  };

  /* ========================= UI ========================= */
  return (
    <div className="service-cms-container">
      <div className="service-cms-header">
        <h1 className="service-cms-title">{t("cms.services.title")}</h1>
        <p className="service-cms-subtitle">{t("cms.services.subtitle")}</p>
      </div>

      {/* ===================== PRACTICE AREAS FORM ===================== */}
      <div className="service-form-card">
        <div className="service-form-header">
          <h3>
            {editingArea
              ? t("cms.services.edit_area")
              : t("cms.services.create_area")}
          </h3>
        </div>

        <div className="service-form-section">
          <h4 className="service-section-title">
            {t("cms.services.area_info")}
          </h4>
          <div className="service-form-grid">
            <div className="service-form-group">
              <label className="service-label">
                {t("cms.services.name_ar")}
              </label>
              <input
                className="service-input"
                placeholder={t("cms.services.name_ar_placeholder")}
                value={areaForm.name_ar}
                onChange={(e) =>
                  setAreaForm({ ...areaForm, name_ar: e.target.value })
                }
              />
            </div>

            <div className="service-form-group">
              <label className="service-label">
                {t("cms.services.name_en")}
              </label>
              <input
                className="service-input"
                placeholder={t("cms.services.name_en_placeholder")}
                value={areaForm.name_en}
                onChange={(e) =>
                  setAreaForm({ ...areaForm, name_en: e.target.value })
                }
              />
            </div>

            <div className="service-form-group">
              <label className="service-label">
                {t("cms.services.slug")}
              </label>
              <input
                className="service-input"
                placeholder={t("cms.services.slug_placeholder")}
                value={areaForm.slug}
                onChange={(e) =>
                  setAreaForm({ ...areaForm, slug: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="service-form-actions">
          <button className="service-btn-primary" onClick={handleAreaSave}>
            {editingArea
              ? t("cms.services.update_area")
              : t("cms.services.create_area")}
          </button>
          {editingArea && (
            <button
              className="service-btn-cancel"
              onClick={() => {
                setEditingArea(null);
                setAreaForm({ name_ar: "", name_en: "", slug: "", is_active: true });
              }}
            >
              {t("cms.services.cancel")}
            </button>
          )}
        </div>
      </div>

      {/* ===================== PRACTICE AREAS TABLE ===================== */}
      <div className="service-list-card">
        <h2 className="service-list-title">{t("cms.services.areas_list")}</h2>
        <div className="service-table-wrapper">
          <table className="service-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("cms.services.name_ar")}</th>
                <th>{t("cms.services.name_en")}</th>
                <th>{t("cms.services.slug")}</th>
                <th>{t("cms.services.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.id}>
                  <td className="service-table-id">{a.id}</td>
                  <td className="service-table-title">{a.name_ar}</td>
                  <td className="service-table-title">{a.name_en}</td>
                  <td className="service-table-slug">{a.slug}</td>
                  <td>
                    <div className="service-table-actions">
                      <button
                        className="service-btn-edit"
                        onClick={() => handleAreaEdit(a)}
                      >
                        {t("cms.services.edit")}
                      </button>
                      <button
                        className="service-btn-delete"
                        onClick={() => handleAreaDelete(a.id)}
                      >
                        {t("cms.services.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan="5" className="service-table-empty">
                    {t("cms.services.no_areas")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="service-divider"></div>

      {/* ===================== SERVICES FORM ===================== */}
      <div className="service-form-card">
        <div className="service-form-header">
          <h3>
            {editingService
              ? t("cms.services.edit_service")
              : t("cms.services.create_service")}
          </h3>
        </div>

        <div className="service-form-section">
          <h4 className="service-section-title">
            {t("cms.services.service_info")}
          </h4>
          <div className="service-form-grid">
            <div className="service-form-group">
              <label className="service-label">
                {t("cms.services.title_ar")}
              </label>
              <input
                className="service-input"
                name="title_ar"
                placeholder={t("cms.services.title_ar_placeholder")}
                value={serviceForm.title_ar}
                onChange={handleServiceChange}
              />
            </div>

            <div className="service-form-group">
              <label className="service-label">
                {t("cms.services.title_en")}
              </label>
              <input
                className="service-input"
                name="title_en"
                placeholder={t("cms.services.title_en_placeholder")}
                value={serviceForm.title_en}
                onChange={handleServiceChange}
              />
            </div>

            <div className="service-form-group full-width">
              <label className="service-label">
                {t("cms.services.description_ar")}
              </label>
              <textarea
                className="service-textarea"
                name="description_ar"
                placeholder={t("cms.services.description_ar_placeholder")}
                value={serviceForm.description_ar}
                onChange={handleServiceChange}
              />
            </div>

            <div className="service-form-group full-width">
              <label className="service-label">
                {t("cms.services.description_en")}
              </label>
              <textarea
                className="service-textarea"
                name="description_en"
                placeholder={t("cms.services.description_en_placeholder")}
                value={serviceForm.description_en}
                onChange={handleServiceChange}
              />
            </div>

            <div className="service-form-group">
              <label className="service-label">
                {t("cms.services.area")}
              </label>
              <select
                className="service-select"
                name="area"
                value={serviceForm.area}
                onChange={handleServiceChange}
              >
                <option value="">{t("cms.services.select_area")}</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div className="service-form-group">
              <label className="service-checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={serviceForm.is_featured}
                  onChange={handleServiceChange}
                />
                <span className="service-checkbox-text">
                  {t("cms.services.featured")}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="service-form-actions">
          <button className="service-btn-primary" onClick={handleServiceSave}>
            {editingService
              ? t("cms.services.update_service")
              : t("cms.services.create_service")}
          </button>
          {editingService && (
            <button
              className="service-btn-cancel"
              onClick={() => {
                setEditingService(null);
                setServiceForm({
                  title_ar: "",
                  title_en: "",
                  description_ar: "",
                  description_en: "",
                  area: "",
                  is_featured: false,
                  is_active: true,
                });
              }}
            >
              {t("cms.services.cancel")}
            </button>
          )}
        </div>
      </div>

      {/* ===================== SERVICES TABLE ===================== */}
      <div className="service-list-card">
        <h2 className="service-list-title">{t("cms.services.services_list")}</h2>
        <div className="service-table-wrapper">
          <table className="service-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("cms.services.title_ar")}</th>
                <th>{t("cms.services.area")}</th>
                <th>{t("cms.services.featured")}</th>
                <th>{t("cms.services.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="service-table-id">{s.id}</td>
                  <td className="service-table-title">{s.title_ar}</td>
                  <td className="service-table-area">
                    {s.area_data?.name_ar || "—"}
                  </td>
                  <td>
                    <span
                      className={`service-status-badge ${
                        s.is_featured ? "featured" : "regular"
                      }`}
                    >
                      {s.is_featured
                        ? t("cms.services.yes")
                        : t("cms.services.no")}
                    </span>
                  </td>
                  <td>
                    <div className="service-table-actions">
                      <button
                        className="service-btn-edit"
                        onClick={() => handleServiceEdit(s)}
                      >
                        {t("cms.services.edit")}
                      </button>
                      <button
                        className="service-btn-delete"
                        onClick={() => handleServiceDelete(s.id)}
                      >
                        {t("cms.services.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="5" className="service-table-empty">
                    {t("cms.services.no_services")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}