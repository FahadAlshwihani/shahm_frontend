import React, { useEffect, useState } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import toast from "react-hot-toast";

export default function CMS_Heroes() {
  const {
    heroes,
    loadingHeroes,
    fetchAdminHeroes,
    createHero,
    updateHero,
    deleteHero,

    heroMedia,
    fetchAdminHeroMedia,
    createHeroMedia,
    deleteHeroMedia,

    // صفحات الـ CMS لاختيار روابط الأزرار
    pages,
    fetchAdminPages,
  } = useCmsStore();

  // ─────────────────────────────
  // Hero Form
  // ─────────────────────────────
  const emptyForm = {
    slug: "",
    is_active: true,
    order: 0,

    hover_text_ar: "",
    hover_text_en: "",

    left_title_ar: "",
    left_title_en: "",
    left_button_text_ar: "",
    left_button_text_en: "",
    left_button_url: "",
    left_button_page: "",

    right_title_ar: "",
    right_title_en: "",
    right_button_text_ar: "",
    right_button_text_en: "",
    right_button_url: "",
    right_button_page: "",

    center_button_text_ar: "",
    center_button_text_en: "",
    center_button_url: "",
    center_button_page: "",

    show_header: false,
  };

  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);

  // ─────────────────────────────
  // Media Form
  // ─────────────────────────────
  const [mediaForm, setMediaForm] = useState({
    media_type: "image",
    file: null,
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchAdminHeroes();
    fetchAdminPages();
  }, []);

  // ─────────────────────────────
  // Handle Hero Input
  // ─────────────────────────────
  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (type === "checkbox") value = checked;
    if (name === "order") value = parseInt(value || 0, 10);

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditHero = (h) => {
    setEdit(h);
    setForm({
      slug: h.slug || "",
      is_active: h.is_active,
      order: h.order || 0,

      hover_text_ar: h.hover_text_ar || "",
      hover_text_en: h.hover_text_en || "",

      left_title_ar: h.left_title_ar || "",
      left_title_en: h.left_title_en || "",
      left_button_text_ar: h.left_button_text_ar || "",
      left_button_text_en: h.left_button_text_en || "",
      left_button_url: h.left_button_url || "",
      left_button_page: h.left_button_page || "",

      right_title_ar: h.right_title_ar || "",
      right_title_en: h.right_title_en || "",
      right_button_text_ar: h.right_button_text_ar || "",
      right_button_text_en: h.right_button_text_en || "",
      right_button_url: h.right_button_url || "",
      right_button_page: h.right_button_page || "",

      center_button_text_ar: h.center_button_text_ar || "",
      center_button_text_en: h.center_button_text_en || "",
      center_button_url: h.center_button_url || "",
      center_button_page: h.center_button_page || "",

      show_header: h.show_header ?? false,
    });
  };

  // ─────────────────────────────
  // Submit Hero
  // ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      slug: form.slug,
      is_active: form.is_active,
      order: form.order,

      hover_text_ar: form.hover_text_ar,
      hover_text_en: form.hover_text_en,

      left_title_ar: form.left_title_ar,
      left_title_en: form.left_title_en,
      left_button_text_ar: form.left_button_text_ar,
      left_button_text_en: form.left_button_text_en,
      left_button_url: form.left_button_url,

      right_title_ar: form.right_title_ar,
      right_title_en: form.right_title_en,
      right_button_text_ar: form.right_button_text_ar,
      right_button_text_en: form.right_button_text_en,
      right_button_url: form.right_button_url,

      center_button_text_ar: form.center_button_text_ar,
      center_button_text_en: form.center_button_text_en,
      center_button_url: form.center_button_url,

      show_header: form.show_header,
    };

    // صفحات الأزرار (ID أو null)
    payload.left_button_page = form.left_button_page
      ? parseInt(form.left_button_page, 10)
      : null;
    payload.right_button_page = form.right_button_page
      ? parseInt(form.right_button_page, 10)
      : null;
    payload.center_button_page = form.center_button_page
      ? parseInt(form.center_button_page, 10)
      : null;

    let result = edit
      ? await updateHero(edit.id, payload)
      : await createHero(payload);

    if (result.success) {
      toast.success("Saved successfully");
      resetForm();
    } else {
      toast.error("Failed to save");
    }
  };

  const resetForm = () => {
    setEdit(null);
    setForm(emptyForm);
  };

  const openMediaForHero = (hero) => {
    setSelectedHero(hero);
    fetchAdminHeroMedia(hero.id);
  };

  // ─────────────────────────────
  // Handle Media Change
  // ─────────────────────────────
  const handleMediaChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    setMediaForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  // ─────────────────────────────
  // Submit Media
  // ─────────────────────────────
  const handleMediaSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(mediaForm).forEach(([k, v]) => {
      fd.append(k, v);
    });

    const result = await createHeroMedia(selectedHero.id, fd);

    if (result.success) {
      toast.success("Media added");
      fetchAdminHeroMedia(selectedHero.id);
    } else {
      toast.error("Failed to add media");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CMS – Hero Sections</h1>

      {/* ─────────────────────────── Hero Form ─────────────────────────── */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
        <h3>{edit ? "Edit Hero" : "Create Hero"}</h3>

        <input
          name="slug"
          placeholder="Hero Slug (e.g., home)"
          value={form.slug}
          onChange={handleChange}
        />
        <br />

        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            name="show_header"
            checked={form.show_header}
            onChange={handleChange}
          />
          Show Header
        </label>
        <br />

        <input
          name="order"
          type="number"
          placeholder="Order"
          value={form.order}
          onChange={handleChange}
        />
        <br />

        {/* Hover Texts */}
        <h4>Hover Text</h4>
        <input
          name="hover_text_ar"
          placeholder="Hover Text AR"
          value={form.hover_text_ar}
          onChange={handleChange}
        />
        <br />
        <input
          name="hover_text_en"
          placeholder="Hover Text EN"
          value={form.hover_text_en}
          onChange={handleChange}
        />
        <br />

        {/* LEFT SIDE */}
        <h4>Left Side</h4>
        <input
          name="left_title_ar"
          placeholder="Left Title AR"
          value={form.left_title_ar}
          onChange={handleChange}
        />
        <br />
        <input
          name="left_title_en"
          placeholder="Left Title EN"
          value={form.left_title_en}
          onChange={handleChange}
        />
        <br />
        <input
          name="left_button_text_ar"
          placeholder="Left Button Text AR"
          value={form.left_button_text_ar}
          onChange={handleChange}
        />
        <br />
        <input
          name="left_button_text_en"
          placeholder="Left Button Text EN"
          value={form.left_button_text_en}
          onChange={handleChange}
        />
        <br />
        <input
          name="left_button_url"
          placeholder="Left Button URL (اختياري)"
          value={form.left_button_url}
          onChange={handleChange}
        />
        <br />
        <label>
          Left Button Page (CMS)
          <select
            name="left_button_page"
            value={form.left_button_page}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title_ar} ({p.slug})
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* RIGHT SIDE */}
        <h4>Right Side</h4>
        <input
          name="right_title_ar"
          placeholder="Right Title AR"
          value={form.right_title_ar}
          onChange={handleChange}
        />
        <br />
        <input
          name="right_title_en"
          placeholder="Right Title EN"
          value={form.right_title_en}
          onChange={handleChange}
        />
        <br />
        <input
          name="right_button_text_ar"
          placeholder="Right Button Text AR"
          value={form.right_button_text_ar}
          onChange={handleChange}
        />
        <br />
        <input
          name="right_button_text_en"
          placeholder="Right Button Text EN"
          value={form.right_button_text_en}
          onChange={handleChange}
        />
        <br />
        <input
          name="right_button_url"
          placeholder="Right Button URL (اختياري)"
          value={form.right_button_url}
          onChange={handleChange}
        />
        <br />
        <label>
          Right Button Page (CMS)
          <select
            name="right_button_page"
            value={form.right_button_page}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title_ar} ({p.slug})
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* CENTER / LOGO */}
        <h4>Center (Logo / Plus)</h4>
        <input
          name="center_button_text_ar"
          placeholder="Center Button Text AR (مثلاً: استكشف)"
          value={form.center_button_text_ar}
          onChange={handleChange}
        />
        <br />
        <input
          name="center_button_text_en"
          placeholder="Center Button Text EN"
          value={form.center_button_text_en}
          onChange={handleChange}
        />
        <br />
        <input
          name="center_button_url"
          placeholder="Center Button URL (اختياري)"
          value={form.center_button_url}
          onChange={handleChange}
        />
        <br />
        <label>
          Center Button Page (CMS)
          <select
            name="center_button_page"
            value={form.center_button_page}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title_ar} ({p.slug})
              </option>
            ))}
          </select>
        </label>
        <br />

        <button type="submit">
          {loadingHeroes ? "Saving…" : edit ? "Update" : "Create"}
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

      {/* ─────────────────────────── Heroes Table ─────────────────────────── */}
      <h3>All Heroes</h3>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Slug</th>
            <th>Active</th>
            <th>Order</th>
            <th>Media</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {heroes.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.slug}</td>
              <td>{h.is_active ? "Yes" : "No"}</td>
              <td>{h.order}</td>

              <td>
                <button onClick={() => openMediaForHero(h)}>Media</button>
              </td>

              <td>
                <button onClick={() => handleEditHero(h)}>Edit</button>

                <button
                  onClick={() =>
                    window.confirm("Delete?") && deleteHero(h.id)
                  }
                  style={{ marginLeft: 10 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─────────────────────────── Media Manager ─────────────────────────── */}
      {selectedHero && (
        <div style={{ marginTop: 40 }}>
          <h2>Media for: {selectedHero.slug}</h2>

          {/* Add media */}
          <form onSubmit={handleMediaSubmit}>
            <select
              name="media_type"
              value={mediaForm.media_type}
              onChange={handleMediaChange}
            >
              <option value="logo">Logo</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>

            <input
              type="number"
              name="order"
              value={mediaForm.order}
              onChange={handleMediaChange}
              placeholder="Order"
            />

            <input type="file" name="file" onChange={handleMediaChange} />

            <label style={{ marginLeft: 10 }}>
              <input
                type="checkbox"
                name="is_active"
                checked={mediaForm.is_active}
                onChange={handleMediaChange}
              />
              Active
            </label>

            <button type="submit" style={{ marginLeft: 10 }}>
              Add Media
            </button>
          </form>

          <h3>Current Media</h3>

          <table border="1" width="100%" cellPadding="10">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Preview</th>
                <th>Order</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {heroMedia.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.media_type}</td>

                  <td>
                    {m.media_type === "image" || m.media_type === "logo" ? (
                      <img src={m.file_url} width="80" alt="" />
                    ) : (
                      <video src={m.file_url} width="150" controls />
                    )}
                  </td>

                  <td>{m.order}</td>

                  <td>{m.is_active ? "Yes" : "No"}</td>

                  <td>
                    <button
                      onClick={() =>
                        deleteHeroMedia(m.id, selectedHero.id)
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
      )}
    </div>
  );
}
