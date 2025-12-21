// src/pages/dashboard/CMS_Footer.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_FOOTER.css";

export default function CMS_Footer() {
  const { t } = useTranslation();

  const [columns, setColumns] = useState([]);
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);

const PROTECTED_COLUMNS = [
  "أرغب في تلقّي كل جديد من أخبار شهم",
  "تابعنا"
];

  /* ================= Column Form ================= */
  const [colForm, setColForm] = useState({
    title_ar: "",
    title_en: "",
    order: 0,
    is_active: true,
  });
  const [editColumnId, setEditColumnId] = useState(null);

  /* ================= Link Form ================= */
  const [linkForm, setLinkForm] = useState({
    column: "",
    parent: "",
    label_ar: "",
    label_en: "",
    url: "",
    page: "",
    order: 0,
    is_active: true,
  });

  const [editLinkId, setEditLinkId] = useState(null);

  /* ================= Load Data ================= */
  const loadData = async () => {
    try {
      const colRes = await api.get("cms/admin/columns/");
      setColumns(colRes.data);

      const pagesRes = await api.get("cms/admin/pages/");
      setPages(pagesRes.data);

      const settingsRes = await api.get("public/settings/");
      setSettings(settingsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= Submit Column ================= */
  const submitColumn = async (e) => {
    e.preventDefault();

    if (PROTECTED_COLUMNS.includes(colForm.title_ar)) {
      return toast.error(t("cms.footer.protected_column"));
    }

    try {
      if (editColumnId) {
        await api.patch(`cms/admin/columns/${editColumnId}/`, colForm);
        toast.success(t("cms.footer.column_updated"));
      } else {
        await api.post("cms/admin/columns/", colForm);
        toast.success(t("cms.footer.column_created"));
      }

      resetColumnForm();
      loadData();
    } catch {
      toast.error(t("cms.footer.column_save_failed"));
    }
  };

  const resetColumnForm = () => {
    setColForm({
      title_ar: "",
      title_en: "",
      order: 0,
      is_active: true,
    });
    setEditColumnId(null);
  };

  /* ================= Submit Link ================= */
  const submitLink = async (e) => {
    e.preventDefault();

    const columnObj = columns.find((c) => c.id == linkForm.column);
    if (!columnObj) return toast.error(t("cms.footer.select_column"));

    if (
      columnObj.title_ar === "عن شهم" &&
      ["فريق العمل", "المجالات والقطاعات"].includes(linkForm.label_ar) &&
      !linkForm.parent
    ) {
      return toast.error(t("cms.footer.parent_required"));
    }

    if (PROTECTED_COLUMNS.includes(columnObj.title_ar)) {
      return toast.error(t("cms.footer.protected_column"));
    }

    if (linkForm.url && linkForm.page) {
      return toast.error(t("cms.footer.link_conflict"));
    }

    try {
      if (editLinkId) {
        await api.patch(`cms/admin/footer-links/${editLinkId}/`, linkForm);
        toast.success(t("cms.footer.link_updated"));
      } else {
        await api.post("cms/admin/footer-links/", {
          ...linkForm,
          parent: linkForm.parent || null,
        });
        toast.success(t("cms.footer.link_created"));
      }

      resetLinkForm();
      loadData();
    } catch {
      toast.error(t("cms.footer.link_save_failed"));
    }
  };

  const resetLinkForm = () => {
    setLinkForm({
      column: "",
      parent: "",
      label_ar: "",
      label_en: "",
      url: "",
      page: "",
      order: 0,
      is_active: true,
    });
    setEditLinkId(null);
  };

  function TreeItem({ item }) {
    return (
      <li className="footer-link-item">
        <span className="footer-link-icon">🔗</span>
        <span className="footer-link-label">{item.label_ar}</span>
        <input
          type="number"
          className="footer-input-number"
          value={item.order}
          onChange={async (e) => {
            await api.patch(`cms/admin/footer-links/${item.id}/`, {
              order: e.target.value,
            });
            loadData();
          }}
        />

        <button
          className="footer-btn-delete"
          onClick={async () => {
            if (!window.confirm(t("cms.footer.confirm_delete_link"))) return;
            await api.delete(`cms/admin/footer-links/${item.id}/`);
            toast.success(t("cms.footer.link_deleted"));
            loadData();
          }}
        >
          🗑 {t("cms.footer.delete")}
        </button>

        {item.children?.length > 0 && (
          <ul className="footer-links-list">
            {item.children.map((c) => (
              <TreeItem key={c.id} item={c} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  /* ================= Render ================= */
  return (
    <div className="footer-cms-container">
      <div className="footer-cms-header">
        <h1 className="footer-cms-title">{t("cms.footer.title")}</h1>
        <p className="footer-cms-subtitle">{t("cms.footer.subtitle")}</p>
      </div>

      {/* ================= Column Form ================= */}
      <div className="footer-form-card">
        <div className="footer-form-header">
          <h3>
            {editColumnId
              ? t("cms.footer.edit_column")
              : t("cms.footer.create_column")}
          </h3>
        </div>

        <form onSubmit={submitColumn}>
          <div className="footer-form-grid">
            <div className="footer-form-group">
              <label className="footer-label">
                {t("cms.footer.title_ar")}
              </label>
              <input
                className="footer-input"
                placeholder={t("cms.footer.title_ar_placeholder")}
                value={colForm.title_ar}
                onChange={(e) =>
                  setColForm({ ...colForm, title_ar: e.target.value })
                }
              />
            </div>

            <div className="footer-form-group">
              <label className="footer-label">
                {t("cms.footer.title_en")}
              </label>
              <input
                className="footer-input"
                placeholder={t("cms.footer.title_en_placeholder")}
                value={colForm.title_en}
                onChange={(e) =>
                  setColForm({ ...colForm, title_en: e.target.value })
                }
              />
            </div>

            <div className="footer-form-group">
              <label className="footer-label">{t("cms.footer.order")}</label>
              <input
                className="footer-input"
                type="number"
                placeholder="0"
                value={colForm.order}
                onChange={(e) =>
                  setColForm({ ...colForm, order: e.target.value })
                }
              />
            </div>

            <div className="footer-form-group">
              <label className="footer-checkbox-label">
                <input
                  type="checkbox"
                  checked={colForm.is_active}
                  onChange={(e) =>
                    setColForm({ ...colForm, is_active: e.target.checked })
                  }
                />
                {t("cms.footer.active")}
              </label>
            </div>
          </div>

          <button type="submit" className="footer-btn-primary">
            {editColumnId ? t("cms.footer.update") : t("cms.footer.create")}
          </button>
        </form>
      </div>

      {/* ================= Columns ================= */}
      {columns.map((col) => (
        <div key={col.id} className="footer-column-card">
          <div className="footer-column-header">
            <h3 className="footer-column-title">{col.title_ar}</h3>

            <div className="footer-column-actions">
              <input
                type="number"
                className="footer-input-number"
                value={col.order}
                onChange={async (e) => {
                  await api.patch(`cms/admin/columns/${col.id}/`, {
                    order: e.target.value,
                  });
                  loadData();
                }}
              />

              {!PROTECTED_COLUMNS.includes(col.title_ar) && (
                <>
                  <button
                    className="footer-btn-edit"
                    onClick={() => {
                      setEditColumnId(col.id);
                      setColForm({
                        title_ar: col.title_ar,
                        title_en: col.title_en,
                        order: col.order,
                        is_active: col.is_active,
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    ✏️ {t("cms.footer.edit")}
                  </button>

                  <button
                    className="footer-btn-delete"
                    onClick={async () => {
                      if (!window.confirm(t("cms.footer.confirm_delete_column")))
                        return;
                      await api.delete(`cms/admin/columns/${col.id}/`);
                      toast.success(t("cms.footer.column_deleted"));
                      loadData();
                    }}
                  >
                    🗑 {t("cms.footer.delete")}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ================= Column Links ================= */}
          {col.title_ar === "تابعنا" ? (
            <ul className="footer-links-list">
              {settings?.linkedin_url && (
                <li className="footer-link-item">
                  <span className="footer-link-icon">🔗</span>
                  <span className="footer-link-label">LinkedIn</span>
                  <span className="footer-link-auto">
                    {t("cms.footer.auto_from_settings")}
                  </span>
                </li>
              )}
              {settings?.x_url && (
                <li className="footer-link-item">
                  <span className="footer-link-icon">🔗</span>
                  <span className="footer-link-label">X</span>
                  <span className="footer-link-auto">
                    {t("cms.footer.auto_from_settings")}
                  </span>
                </li>
              )}
              {settings?.instagram_url && (
                <li className="footer-link-item">
                  <span className="footer-link-icon">🔗</span>
                  <span className="footer-link-label">Instagram</span>
                  <span className="footer-link-auto">
                    {t("cms.footer.auto_from_settings")}
                  </span>
                </li>
              )}

              <div className="footer-info-box protected">
                ⚙️ {t("cms.footer.edit_in_settings")}
              </div>
            </ul>
          ) : col.title_ar === "خريطة الموقع" ? (
            <ul className="footer-links-list">
              {pages
                .filter(
                  (p) =>
                    p.status === "published" ||
                    p.is_active === true ||
                    p.is_published === true
                )
                .map((p) => (
                  <li key={p.id} className="footer-link-item">
                    <span className="footer-link-icon">📄</span>
                    <span className="footer-link-label">{p.title_ar}</span>
                    <span className="footer-link-auto">
                      {t("cms.footer.automatic")}
                    </span>
                    <a
                      href={`/page/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="footer-link-url"
                    >
                      {t("cms.footer.open")}
                    </a>
                  </li>
                ))}
            </ul>
          ) : (
            <ul className="footer-links-list">
              {col.links?.map((l) => (
                <TreeItem key={l.id} item={l} />
              ))}
            </ul>
          )}

          {/* ================= Add Link ================= */}
          {!PROTECTED_COLUMNS.includes(col.title_ar) && (
            <div className="footer-add-link-section">
              <h4 className="footer-add-link-title">
                {t("cms.footer.add_link")}
              </h4>

              <form onSubmit={submitLink}>
                <div className="footer-form-grid">
                  <div className="footer-form-group">
                    <label className="footer-label">
                      {t("cms.footer.parent_link")}
                    </label>
                    <select
                      className="footer-select"
                      value={linkForm.parent}
                      onChange={(e) =>
                        setLinkForm({ ...linkForm, parent: e.target.value })
                      }
                    >
                      <option value="">{t("cms.footer.no_parent")}</option>
                      {col.links
                        ?.filter((l) => !l.parent)
                        .map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.label_ar}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="footer-form-group">
                    <label className="footer-label">
                      {t("cms.footer.link_label_ar")}
                    </label>
                    <input
                      className="footer-input"
                      placeholder={t("cms.footer.link_label_ar_placeholder")}
                      value={linkForm.label_ar}
                      onChange={(e) =>
                        setLinkForm({ ...linkForm, label_ar: e.target.value })
                      }
                    />
                  </div>

                  <div className="footer-form-group">
                    <label className="footer-label">
                      {t("cms.footer.link_label_en")}
                    </label>
                    <input
                      className="footer-input"
                      placeholder={t("cms.footer.link_label_en_placeholder")}
                      value={linkForm.label_en}
                      onChange={(e) =>
                        setLinkForm({ ...linkForm, label_en: e.target.value })
                      }
                    />
                  </div>

                  <div className="footer-form-group">
                    <label className="footer-label">
                      {t("cms.footer.select_page")}
                    </label>
                    <select
                      className="footer-select"
                      value={linkForm.page}
                      onChange={(e) =>
                        setLinkForm({
                          ...linkForm,
                          page: e.target.value,
                          url: "",
                        })
                      }
                    >
                      <option value="">
                        {t("cms.footer.select_page_option")}
                      </option>
                      {pages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title_ar}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="footer-btn-primary"
                  onClick={() => setLinkForm({ ...linkForm, column: col.id })}
                >
                  {t("cms.footer.save_link")}
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}