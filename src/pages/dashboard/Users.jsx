import React, { useEffect, useState } from "react";
import { useUsersStore } from "../../store/useUsersStore";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_USERS.css";

export default function Users() {
  const { t } = useTranslation();

  const { users, fetchUsers, addUser, editUser, removeUser, loading } =
    useUsersStore();

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "viewer",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    const ok = await addUser(form);
    if (ok) {
      setShowAdd(false);
      setForm({ email: "", name: "", password: "", role: "viewer" });
    }
  };

  const handleUpdate = async () => {
    const ok = await editUser(showEdit.id, form);
    if (ok) {
      setShowEdit(null);
      setForm({ email: "", name: "", password: "", role: "viewer" });
    }
  };

  return (
    <div className="users-cms-container">
      <div className="users-cms-header">
        <div>
          <h1 className="users-cms-title">{t("cms.users.title")}</h1>
          <p className="users-cms-subtitle">{t("cms.users.subtitle")}</p>
        </div>
        <button className="users-btn-add" onClick={() => setShowAdd(true)}>
          {t("cms.users.actions.add")}
        </button>
      </div>

      {/* ==================== USERS TABLE ==================== */}
      <div className="users-list-card">
        {loading ? (
          <p className="users-loading">{t("cms.users.loading")}</p>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("cms.users.table.email")}</th>
                  <th>{t("cms.users.table.name")}</th>
                  <th>{t("cms.users.table.role")}</th>
                  <th>{t("cms.users.table.active")}</th>
                  <th>{t("cms.users.table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="users-table-id">{u.id}</td>
                    <td className="users-table-email">{u.email}</td>
                    <td className="users-table-name">{u.name}</td>
                    <td>
                      <span className={`users-role-badge ${u.role}`}>
                        {t(`cms.users.roles.${u.role}`)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`users-status-badge ${
                          u.is_active ? "active" : "inactive"
                        }`}
                      >
                        {u.is_active ? t("common.yes") : t("common.no")}
                      </span>
                    </td>
                    <td>
                      <div className="users-table-actions">
                        <button
                          className="users-btn-edit"
                          onClick={() => {
                            setShowEdit(u);
                            setForm({
                              email: u.email,
                              name: u.name,
                              password: "",
                              role: u.role,
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          {t("cms.users.actions.edit")}
                        </button>

                        <button
                          className="users-btn-delete"
                          onClick={() => {
                            if (window.confirm(t("cms.users.confirm_delete")))
                              removeUser(u.id);
                          }}
                        >
                          {t("cms.users.actions.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="users-table-empty">
                      {t("cms.users.empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== ADD USER FORM ==================== */}
      {showAdd && (
        <div className="users-form-card">
          <div className="users-form-header">
            <h3>{t("cms.users.actions.create_title")}</h3>
          </div>

          <div className="users-form-grid">
            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.email")}
              </label>
              <input
                className="users-input"
                type="email"
                placeholder={t("cms.users.fields.email_placeholder")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.name")}
              </label>
              <input
                className="users-input"
                type="text"
                placeholder={t("cms.users.fields.name_placeholder")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.password")}
              </label>
              <input
                className="users-input"
                type="password"
                placeholder={t("cms.users.fields.password_placeholder")}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.role")}
              </label>
              <select
                className="users-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="super_admin">
                  {t("cms.users.roles.super_admin")}
                </option>
                <option value="admin">{t("cms.users.roles.admin")}</option>
                <option value="editor">{t("cms.users.roles.editor")}</option>
                <option value="viewer">{t("cms.users.roles.viewer")}</option>
              </select>
            </div>
          </div>

          <div className="users-form-actions">
            <button className="users-btn-primary" onClick={handleCreate}>
              {t("cms.users.actions.save")}
            </button>
            <button
              className="users-btn-cancel"
              onClick={() => {
                setShowAdd(false);
                setForm({ email: "", name: "", password: "", role: "viewer" });
              }}
            >
              {t("cms.users.actions.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* ==================== EDIT USER FORM ==================== */}
      {showEdit && (
        <div className="users-form-card">
          <div className="users-form-header">
            <h3>{t("cms.users.actions.edit_title")}</h3>
          </div>

          <div className="users-form-grid">
            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.email")}
              </label>
              <input
                className="users-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.name")}
              </label>
              <input
                className="users-input"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.new_password")}
              </label>
              <input
                className="users-input"
                type="password"
                placeholder={t("cms.users.fields.new_password_placeholder")}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <div className="users-form-group">
              <label className="users-label">
                {t("cms.users.fields.role")}
              </label>
              <select
                className="users-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="super_admin">
                  {t("cms.users.roles.super_admin")}
                </option>
                <option value="admin">{t("cms.users.roles.admin")}</option>
                <option value="editor">{t("cms.users.roles.editor")}</option>
                <option value="viewer">{t("cms.users.roles.viewer")}</option>
              </select>
            </div>
          </div>

          <div className="users-form-actions">
            <button className="users-btn-primary" onClick={handleUpdate}>
              {t("cms.users.actions.save_changes")}
            </button>
            <button
              className="users-btn-cancel"
              onClick={() => {
                setShowEdit(null);
                setForm({ email: "", name: "", password: "", role: "viewer" });
              }}
            >
              {t("cms.users.actions.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}