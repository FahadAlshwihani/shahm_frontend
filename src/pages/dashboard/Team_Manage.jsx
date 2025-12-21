import React, { useEffect, useState } from "react";
import { useTeamStore } from "../../store/useTeamStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_TEAM.css";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function Team_Manage() {
  const { t } = useTranslation();
  const { members, fetchMembers, createMember, updateMember, deleteMember } =
    useTeamStore();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name_ar: "",
    name_en: "",
    job_title_ar: "",
    job_title_en: "",
    role: "lawyer",
    bio_ar: "",
    bio_en: "",
    experience_ar: "",
    experience_en: "",
    linkedin_url: "",
    order: 0,
    is_active: true,
    profile_image: null,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.name_ar.trim())
      return toast.error(t("cms.team.errors.name_required"));

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) fd.append(key, form[key]);
    });

    let result;
    if (editing) {
      result = await updateMember(editing.id, fd);
    } else {
      result = await createMember(fd);
    }

    if (result.success) {
      toast.success(
        editing
          ? t("cms.team.success.member_updated")
          : t("cms.team.success.member_created")
      );
      setEditing(null);
      setForm({
        name_ar: "",
        name_en: "",
        job_title_ar: "",
        job_title_en: "",
        role: "lawyer",
        bio_ar: "",
        bio_en: "",
        experience_ar: "",
        experience_en: "",
        linkedin_url: "",
        order: 0,
        is_active: true,
        profile_image: null,
      });
    } else {
      toast.error(t("cms.team.errors.save_failed"));
    }
  };

  const handleEdit = (m) => {
    setEditing(m);
    setForm({
      name_ar: m.name_ar,
      name_en: m.name_en,
      job_title_ar: m.job_title_ar,
      job_title_en: m.job_title_en,
      role: m.role,
      bio_ar: m.bio_ar,
      bio_en: m.bio_en,
      experience_ar: m.experience_ar,
      experience_en: m.experience_en,
      linkedin_url: m.linkedin_url,
      order: m.order,
      is_active: m.is_active,
      profile_image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("cms.team.confirm_delete"))) return;
    const r = await deleteMember(id);
    if (r.success) toast.success(t("cms.team.success.member_deleted"));
  };

  return (
    <div className="team-cms-container">
      <div className="team-cms-header">
        <h1 className="team-cms-title">{t("cms.team.title")}</h1>
        <p className="team-cms-subtitle">{t("cms.team.subtitle")}</p>
      </div>

      {/* FORM */}
      <div className="team-form-card">
        <div className="team-form-header">
          <h2>
            {editing
              ? t("cms.team.edit_member")
              : t("cms.team.create_member")}
          </h2>
        </div>

        <div className="team-form-section">
          <h3 className="team-section-title">
            {t("cms.team.sections.basic_info")}
          </h3>
          <div className="team-form-grid">
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.name_ar")}
              </label>
              <input
                className="team-input"
                name="name_ar"
                value={form.name_ar}
                onChange={handleChange}
                placeholder={t("cms.team.placeholders.name_ar")}
              />
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.name_en")}
              </label>
              <input
                className="team-input"
                name="name_en"
                value={form.name_en}
                onChange={handleChange}
                placeholder={t("cms.team.placeholders.name_en")}
              />
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.job_title_ar")}
              </label>
              <input
                className="team-input"
                name="job_title_ar"
                value={form.job_title_ar}
                onChange={handleChange}
                placeholder={t("cms.team.placeholders.job_title_ar")}
              />
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.job_title_en")}
              </label>
              <input
                className="team-input"
                name="job_title_en"
                value={form.job_title_en}
                onChange={handleChange}
                placeholder={t("cms.team.placeholders.job_title_en")}
              />
            </div>
            <div className="team-form-group">
              <label className="team-label">{t("cms.team.fields.role")}</label>
              <select
                className="team-select"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="lawyer">{t("cms.team.roles.lawyer")}</option>
                <option value="partner">{t("cms.team.roles.partner")}</option>
                <option value="consultant">
                  {t("cms.team.roles.consultant")}
                </option>
                <option value="advisor">{t("cms.team.roles.advisor")}</option>
                <option value="manager">{t("cms.team.roles.manager")}</option>
                <option value="other">{t("cms.team.roles.other")}</option>
              </select>
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.order")}
              </label>
              <input
                className="team-input"
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
              />
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.linkedin_url")}
              </label>
              <input
                className="team-input"
                name="linkedin_url"
                value={form.linkedin_url}
                onChange={handleChange}
                placeholder={t("cms.team.placeholders.linkedin_url")}
              />
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.profile_image")}
              </label>
              <input
                className="team-input-file"
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="team-form-section">
          <h3 className="team-section-title">
            {t("cms.team.sections.biography")}
          </h3>
          <div className="team-form-grid">
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.bio_ar")}
              </label>
              <div className="team-editor-wrapper">
                <SunEditor
                  setContents={form.bio_ar}
                  onChange={(content) =>
                    setForm((prev) => ({ ...prev, bio_ar: content }))
                  }
                  setOptions={{
                    height: 200,
                    buttonList: [
                      ["undo", "redo"],
                      ["bold", "italic", "underline"],
                      ["fontSize", "formatBlock"],
                      ["align", "list"],
                      ["link"],
                      ["codeView"],
                    ],
                  }}
                />
              </div>
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.bio_en")}
              </label>
              <div className="team-editor-wrapper">
                <SunEditor
                  setContents={form.bio_en}
                  onChange={(content) =>
                    setForm((prev) => ({ ...prev, bio_en: content }))
                  }
                  setOptions={{
                    height: 200,
                    buttonList: [
                      ["undo", "redo"],
                      ["bold", "italic", "underline"],
                      ["fontSize", "formatBlock"],
                      ["align", "list"],
                      ["link"],
                      ["codeView"],
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="team-form-section">
          <h3 className="team-section-title">
            {t("cms.team.sections.experience")}
          </h3>
          <div className="team-form-grid">
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.experience_ar")}
              </label>
              <div className="team-editor-wrapper">
                <SunEditor
                  setContents={form.experience_ar}
                  onChange={(content) =>
                    setForm((prev) => ({ ...prev, experience_ar: content }))
                  }
                  setOptions={{
                    height: 180,
                    buttonList: [
                      ["bold", "italic", "underline"],
                      ["list"],
                      ["link"],
                      ["codeView"],
                    ],
                  }}
                />
              </div>
            </div>
            <div className="team-form-group">
              <label className="team-label">
                {t("cms.team.fields.experience_en")}
              </label>
              <div className="team-editor-wrapper">
                <SunEditor
                  setContents={form.experience_en}
                  onChange={(content) =>
                    setForm((prev) => ({ ...prev, experience_en: content }))
                  }
                  setOptions={{
                    height: 180,
                    buttonList: [
                      ["bold", "italic", "underline"],
                      ["list"],
                      ["link"],
                      ["codeView"],
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="team-form-section">
          <h3 className="team-section-title">
            {t("cms.team.sections.settings")}
          </h3>
          <div className="team-checkbox-group">
            <label className="team-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              <span className="team-checkbox-text">
                {t("cms.team.fields.active")}
              </span>
            </label>
          </div>
        </div>

        <div className="team-form-actions">
          <button className="team-btn-primary" onClick={handleSave}>
            {editing
              ? t("cms.team.actions.update")
              : t("cms.team.actions.create")}
          </button>
          {editing && (
            <button
              className="team-btn-cancel"
              onClick={() => {
                setEditing(null);
                setForm({
                  name_ar: "",
                  name_en: "",
                  job_title_ar: "",
                  job_title_en: "",
                  role: "lawyer",
                  bio_ar: "",
                  bio_en: "",
                  experience_ar: "",
                  experience_en: "",
                  linkedin_url: "",
                  order: 0,
                  is_active: true,
                  profile_image: null,
                });
              }}
            >
              {t("cms.team.actions.cancel")}
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="team-list-card">
        <h2 className="team-list-title">{t("cms.team.list_title")}</h2>
        <div className="team-table-wrapper">
          <table className="team-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("cms.team.table.name")}</th>
                <th>{t("cms.team.table.role")}</th>
                <th>{t("cms.team.table.order")}</th>
                <th>{t("cms.team.table.active")}</th>
                <th>{t("cms.team.table.image")}</th>
                <th>{t("cms.team.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="team-table-id">{m.id}</td>
                  <td className="team-table-name">{m.name_ar}</td>
                  <td className="team-table-role">{m.role}</td>
                  <td className="team-table-order">{m.order}</td>
                  <td>{m.is_active ? t("common.yes") : t("common.no")}</td>
                  <td>
                    {m.profile_image_url && (
                      <img
                        className="team-profile-image"
                        src={m.profile_image_url}
                        alt={m.name_ar}
                      />
                    )}
                  </td>
                  <td>
                    <div className="team-table-actions">
                      <button
                        className="team-btn-edit"
                        onClick={() => handleEdit(m)}
                      >
                        {t("cms.team.actions.edit")}
                      </button>
                      <button
                        className="team-btn-delete"
                        onClick={() => handleDelete(m.id)}
                      >
                        {t("cms.team.actions.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="7" className="team-table-empty">
                    {t("cms.team.empty")}
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