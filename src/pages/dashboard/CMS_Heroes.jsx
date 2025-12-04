// src/pages/dashboard/CMS_Heroes.jsx
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
  } = useCmsStore();

  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    subtitle_ar: "",
    subtitle_en: "",
    slug: "",
    image: null,
  });

  const [edit, setEdit] = useState(null);

  useEffect(() => {
    fetchAdminHeroes();
  }, []);

  // --------------------------------------
  // Handle Input Change
  // --------------------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  // --------------------------------------
  // Submit (Create / Update)
  // --------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") fd.append(key, value);
    });

    let result;
    if (edit) {
      result = await updateHero(edit.id, fd);
    } else {
      result = await createHero(fd);
    }

    if (result.success) {
      toast.success("Saved successfully");
      resetForm();
    } else {
      toast.error("Failed to save");
      console.error(result);
    }
  };

  // --------------------------------------
  // Reset form
  // --------------------------------------
  const resetForm = () => {
    setEdit(null);
    setForm({
      title_ar: "",
      title_en: "",
      subtitle_ar: "",
      subtitle_en: "",
      slug: "",
      image: null,
    });
  };

  // --------------------------------------
  // Fill form for editing
  // --------------------------------------
  const handleEdit = (hero) => {
    setEdit(hero);
    setForm({
      title_ar: hero.title_ar || "",
      title_en: hero.title_en || "",
      subtitle_ar: hero.subtitle_ar || "",
      subtitle_en: hero.subtitle_en || "",
      slug: hero.slug || "",
      image: null,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CMS – Hero Sections</h1>

      {/* ------------------------ FORM ------------------------ */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
        <h3>{edit ? "Edit Hero" : "Create New Hero"}</h3>

        <input name="title_ar" placeholder="Title AR"
          value={form.title_ar} onChange={handleChange} /><br />

        <input name="title_en" placeholder="Title EN"
          value={form.title_en} onChange={handleChange} /><br />

        <input name="subtitle_ar" placeholder="Subtitle AR"
          value={form.subtitle_ar} onChange={handleChange} /><br />

        <input name="subtitle_en" placeholder="Subtitle EN"
          value={form.subtitle_en} onChange={handleChange} /><br />

        <input name="slug" placeholder="Slug"
          value={form.slug} onChange={handleChange} /><br />

        <input type="file" name="image" onChange={handleChange} /><br />

        <button type="submit">
          {loadingHeroes ? "Saving..." : edit ? "Update" : "Create"}
        </button>

        {edit && (
          <button type="button" onClick={resetForm} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        )}
      </form>

      {/* ------------------------ TABLE ------------------------ */}
      <h3>All Heroes</h3>

      {loadingHeroes && <p>Loading...</p>}

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Slug</th>
            <th>Title AR</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {heroes.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.slug}</td>
              <td>{h.title_ar}</td>

              <td>
                {h.image && (
                  <img src={h.image} alt="" width="90" style={{ borderRadius: 6 }} />
                )}
              </td>

              <td>
                <button onClick={() => handleEdit(h)}>Edit</button>
                <button
                  onClick={() => window.confirm("Delete?") && deleteHero(h.id)}
                  style={{ marginLeft: 10 }}
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
