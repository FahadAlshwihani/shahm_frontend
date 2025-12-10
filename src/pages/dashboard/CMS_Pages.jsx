// src/pages/dashboard/CMS_Pages.jsx
import React, { useEffect, useState } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import toast from "react-hot-toast";

export default function CMS_Pages() {
  const {
    pages,
    loadingPages,
    fetchAdminPages,
    createPage,
    updatePage,
    deletePage,
  } = useCmsStore();

  const [edit, setEdit] = useState(null);

  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    slug: "",
    content_ar: "",
    content_en: "",
    page_status: "active",
    is_published: true,
  });

  useEffect(() => {
    fetchAdminPages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setEdit(null);
    setForm({
      title_ar: "",
      title_en: "",
      slug: "",
      content_ar: "",
      content_en: "",
      page_status: "active",
      is_published: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (edit) result = await updatePage(edit.id, form);
    else result = await createPage(form);

    if (result.success) {
      toast.success("Saved");
      resetForm();
    } else toast.error("Failed");
  };

  const handleEdit = (p) => {
    setEdit(p);
    setForm({
      title_ar: p.title_ar,
      title_en: p.title_en,
      slug: p.slug,
      content_ar: p.content_ar,
      content_en: p.content_en,
      page_status: p.page_status || "active",
      is_published: p.is_published,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CMS Pages</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
        <h3>{edit ? "Edit Page" : "Create New Page"}</h3>

        <input
          name="title_ar"
          placeholder="Title AR"
          value={form.title_ar}
          onChange={handleChange}
        />
        <br />

        <input
          name="title_en"
          placeholder="Title EN"
          value={form.title_en}
          onChange={handleChange}
        />
        <br />

        <input
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="content_ar"
          placeholder="Content AR"
          rows="4"
          style={{ width: "100%" }}
          value={form.content_ar}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="content_en"
          placeholder="Content EN"
          rows="4"
          style={{ width: "100%" }}
          value={form.content_en}
          onChange={handleChange}
        />
        <br />

        {/* حالة الصفحة: نشطة أو قيد التطوير */}
        <label>
          Page Status{" "}
          <select
            name="page_status"
            value={form.page_status}
            onChange={handleChange}
          >
            <option value="active">نشطة</option>
            <option value="coming_soon">قيد التطوير</option>
          </select>
        </label>
        <br />

        <label>
          Published{" "}
          <input
            type="checkbox"
            name="is_published"
            checked={form.is_published}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type="submit">
          {loadingPages ? "Saving..." : edit ? "Update" : "Create"}
        </button>

        {edit && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <h3>All Pages</h3>
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Slug</th>
            <th>Title AR</th>
            <th>Status</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {pages.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.slug}</td>
              <td>{p.title_ar}</td>
              <td>
                {p.page_status === "coming_soon" ? "قيد التطوير" : "نشطة"}
              </td>
              <td>{p.is_published ? "Yes" : "No"}</td>

              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() =>
                    window.confirm("Delete page?") && deletePage(p.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
