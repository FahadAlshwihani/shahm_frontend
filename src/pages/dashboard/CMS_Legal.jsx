import React, { useEffect, useState } from "react";
import {
  adminLegalList,
  adminLegalCreate,
  adminLegalEdit,
  adminLegalDelete
} from "../../api/legalApi";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function CMS_Legal() {

  const [pages, setPages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    slug: "",
    title_ar: "",
    title_en: "",
    sections: []
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      const res = await adminLegalList();
      setPages(res.data);
    } catch (err) {
      console.error("Legal load error", err);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function addSection() {

    setForm(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title_ar: "",
          title_en: "",
          content_ar: "",
          content_en: "",
          order: prev.sections.length + 1
        }
      ]
    }));
  }

  function updateSection(index, field, value) {

    const updated = [...form.sections];
    updated[index][field] = value;

    setForm({
      ...form,
      sections: updated
    });
  }

  function removeSection(index) {

    const updated = [...form.sections];
    updated.splice(index, 1);

    setForm({
      ...form,
      sections: updated
    });
  }

  function moveSectionUp(index) {

    if (index === 0) return;

    const updated = [...form.sections];

    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    setForm({
      ...form,
      sections: updated
    });
  }

  function moveSectionDown(index) {

    if (index === form.sections.length - 1) return;

    const updated = [...form.sections];

    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    setForm({
      ...form,
      sections: updated
    });
  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      const payload = {
        ...form,
        sections_data: form.sections
      };

      if (editingId) {

        await adminLegalEdit(editingId, payload);

      } else {

        await adminLegalCreate(payload);

      }

      setForm(emptyForm);
      setEditingId(null);

      loadPages();

    } catch (err) {

      console.error("Save error", err);

    }
  }

  function handleEdit(page) {

    setEditingId(page.id);

    setForm({
      slug: page.slug,
      title_ar: page.title_ar,
      title_en: page.title_en,
      sections: page.sections || []
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleDelete(id) {

    if (!window.confirm("Delete page?")) return;

    try {

      await adminLegalDelete(id);

      loadPages();

    } catch (err) {

      console.error("Delete error", err);

    }
  }

  function cancelEdit() {

    setEditingId(null);
    setForm(emptyForm);

  }

  return (

    <div style={{ padding: 30 }}>

      <h1>
        {editingId ? "Edit Legal Page" : "Create Legal Page"}
      </h1>

      <form onSubmit={handleSubmit}>

        <input
          name="slug"
          placeholder="slug"
          value={form.slug}
          onChange={handleChange}
        />

        <input
          name="title_ar"
          placeholder="title_ar"
          value={form.title_ar}
          onChange={handleChange}
        />

        <input
          name="title_en"
          placeholder="title_en"
          value={form.title_en}
          onChange={handleChange}
        />

        <hr />

        <h3>Sections</h3>

        {form.sections.map((section, index) => (

          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: 20,
              marginBottom: 20
            }}
          >

            <strong>
              Section {index + 1}
            </strong>

            <br /><br />

            <input
              placeholder="title_ar"
              value={section.title_ar}
              onChange={(e) =>
                updateSection(index, "title_ar", e.target.value)
              }
            />

            <input
              placeholder="title_en"
              value={section.title_en}
              onChange={(e) =>
                updateSection(index, "title_en", e.target.value)
              }
            />

            <p>Arabic Content</p>

            <SunEditor
              setContents={section.content_ar}
              onChange={(content) =>
                updateSection(index, "content_ar", content)
              }
            />

            <p>English Content</p>

            <SunEditor
              setContents={section.content_en}
              onChange={(content) =>
                updateSection(index, "content_en", content)
              }
            />

            <br />

            <button
              type="button"
              onClick={() => moveSectionUp(index)}
            >
              ↑
            </button>

            <button
              type="button"
              onClick={() => moveSectionDown(index)}
            >
              ↓
            </button>

            <button
              type="button"
              onClick={() => removeSection(index)}
            >
              Remove
            </button>

          </div>

        ))}

        <button
          type="button"
          onClick={addSection}
        >
          Add Section
        </button>

        <br /><br />

        <button type="submit">
          {editingId ? "Update Page" : "Create Page"}
        </button>

        {editingId && (

          <button
            type="button"
            onClick={cancelEdit}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>

        )}

      </form>

      <hr />

      <h2>Existing Pages</h2>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Slug</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {pages.map(page => (

            <tr key={page.id}>

              <td>{page.id}</td>

              <td>{page.slug}</td>

              <td>{page.title_en}</td>

              <td>

                <button
                  onClick={() => handleEdit(page)}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(page.id)}
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