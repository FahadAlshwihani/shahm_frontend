// src/pages/dashboard/Users.jsx
import React, { useEffect, useState } from "react";
import { useUsersStore } from "../../store/useUsersStore";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "../../styles/CMS_USERS.css";

export default function Users() {
  const { t, i18n } = useTranslation();

  const { users, fetchUsers, addUser, editUser, removeUser, loading } = useUsersStore();

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

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: t("cms.users.confirm_delete_title"),
      text: t("cms.users.confirm_delete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.users.actions.delete"),
      cancelButtonText: t("cms.users.actions.cancel"),
      reverseButtons: i18n.language === "ar",
    });

    if (result.isConfirmed) {
      const success = await removeUser(user.id);
      if (success) {
        Swal.fire({
          title: t("cms.users.deleted_title"),
          text: t("cms.users.success.user_deleted"),
          icon: "success",
          confirmButtonColor: "#22c55e",
        });
      }
    }
  };

  return (
    <div className="dashboard-users-container">
      <div className="dashboard-users-header">
        <div className="dashboard-users-header-content">
          <h1 className="dashboard-users-title">{t("cms.users.title")}</h1>
          <p className="dashboard-users-subtitle">{t("cms.users.subtitle")}</p>
        </div>
        <button className="dashboard-users-btn-add" onClick={() => setShowAdd(true)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {t("cms.users.actions.add")}
        </button>
      </div>

      {/* ==================== USERS TABLE ==================== */}
      <div className="dashboard-users-list-card">
        <div className="dashboard-users-list-header">
          <div className="dashboard-users-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10ZM10 12C6.67 12 0 13.67 0 17V18H20V17C20 13.67 13.33 12 10 12Z" fill="currentColor"/>
            </svg>
            <h3>{t("cms.users.users_list")}</h3>
          </div>
          <span className="dashboard-users-count-badge">{users.length}</span>
        </div>

        {loading ? (
          <div className="dashboard-users-loading">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="dashboard-users-loading-icon">
              <path d="M24 4V12M24 36V44M44 24H36M12 24H4M37.66 37.66L32.24 32.24M15.76 15.76L10.34 10.34M37.66 10.34L32.24 15.76M15.76 32.24L10.34 37.66" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p>{t("cms.users.loading")}</p>
          </div>
        ) : (
          <>
            {users.length > 0 ? (
              <div className="dashboard-users-table-wrapper">
                <table className="dashboard-users-table">
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
                        <td className="dashboard-users-table-id">{u.id}</td>
                        <td className="dashboard-users-table-email">{u.email}</td>
                        <td className="dashboard-users-table-name">{u.name}</td>
                        <td>
                          <span className={`dashboard-users-role-badge dashboard-users-role-${u.role}`}>
                            {t(`cms.users.roles.${u.role}`)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`dashboard-users-status-badge ${
                              u.is_active ? "dashboard-users-status-active" : "dashboard-users-status-inactive"
                            }`}
                          >
                            {u.is_active ? t("common.yes") : t("common.no")}
                          </span>
                        </td>
                        <td>
                          <div className="dashboard-users-table-actions">
                            <button
                              className="dashboard-users-btn-edit"
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
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                              </svg>
                              {t("cms.users.actions.edit")}
                            </button>
                            <button
                              className="dashboard-users-btn-delete"
                              onClick={() => handleDelete(u)}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                              </svg>
                              {t("cms.users.actions.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="dashboard-users-empty">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4C16.83 4 11 9.83 11 17C11 24.17 16.83 30 24 30C31.17 30 37 24.17 37 17C37 9.83 31.17 4 24 4ZM24 34C16.67 34 2 37.67 2 45V48H46V45C46 37.67 31.33 34 24 34Z" fill="currentColor"/>
                </svg>
                <p>{t("cms.users.empty")}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ==================== ADD USER FORM ==================== */}
      {showAdd && (
        <div className="dashboard-users-form-card">
          <div className="dashboard-users-form-header">
            <div className="dashboard-users-form-header-left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14ZM6 10V7H4V10H1V12H4V15H6V12H9V10H6Z" fill="currentColor"/>
              </svg>
              <h3>{t("cms.users.actions.create_title")}</h3>
            </div>
          </div>

          <div className="dashboard-users-form-section">
            <div className="dashboard-users-form-grid">
              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.email")}</label>
                <input
                  className="dashboard-users-input"
                  type="email"
                  placeholder={t("cms.users.fields.email_placeholder")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.name")}</label>
                <input
                  className="dashboard-users-input"
                  type="text"
                  placeholder={t("cms.users.fields.name_placeholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.password")}</label>
                <input
                  className="dashboard-users-input"
                  type="password"
                  placeholder={t("cms.users.fields.password_placeholder")}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.role")}</label>
                <select
                  className="dashboard-users-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="super_admin">{t("cms.users.roles.super_admin")}</option>
                  <option value="admin">{t("cms.users.roles.admin")}</option>
                  <option value="editor">{t("cms.users.roles.editor")}</option>
                  <option value="viewer">{t("cms.users.roles.viewer")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-users-form-actions">
            <button className="dashboard-users-btn-primary" onClick={handleCreate}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {t("cms.users.actions.save")}
            </button>
            <button
              className="dashboard-users-btn-cancel"
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
        <div className="dashboard-users-form-card">
          <div className="dashboard-users-form-header">
            <div className="dashboard-users-form-header-left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
              <h3>{t("cms.users.actions.edit_title")}</h3>
            </div>
          </div>

          <div className="dashboard-users-form-section">
            <div className="dashboard-users-form-grid">
              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.email")}</label>
                <input
                  className="dashboard-users-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.name")}</label>
                <input
                  className="dashboard-users-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.new_password")}</label>
                <input
                  className="dashboard-users-input"
                  type="password"
                  placeholder={t("cms.users.fields.new_password_placeholder")}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="dashboard-users-form-group">
                <label className="dashboard-users-label">{t("cms.users.fields.role")}</label>
                <select
                  className="dashboard-users-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="super_admin">{t("cms.users.roles.super_admin")}</option>
                  <option value="admin">{t("cms.users.roles.admin")}</option>
                  <option value="editor">{t("cms.users.roles.editor")}</option>
                  <option value="viewer">{t("cms.users.roles.viewer")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-users-form-actions">
            <button className="dashboard-users-btn-primary" onClick={handleUpdate}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {t("cms.users.actions.save_changes")}
            </button>
            <button
              className="dashboard-users-btn-cancel"
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