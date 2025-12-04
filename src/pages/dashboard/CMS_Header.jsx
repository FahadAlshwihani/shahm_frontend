// src/pages/dashboard/CMS_Header.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function CMS_Header() {
  const [links, setLinks] = useState([]);
  const [pages, setPages] = useState([]);
  const [parents, setParents] = useState([]);

  const [form, setForm] = useState({
    label_ar: "",
    label_en: "",
    url: "",
    page: "",
    parent: "",
    order: 0,
    is_active: true,
  });

  const [editId, setEditId] = useState(null);

  // -------------------------------------------------------------
  // Load Header Links + Pages
  // -------------------------------------------------------------
  const loadData = async () => {
    try {
      const res = await api.get("cms/admin/header/");
      setLinks(buildTree(res.data));
      setParents(res.data); // كل العناصر يمكن اختيارها Parent

      const p = await api.get("cms/admin/pages/");
      setPages(p.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------------------------------------------
  // Build tree
  // -------------------------------------------------------------
  const buildTree = (flat) => {
    const map = {};
    const roots = [];

    flat.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    flat.forEach((item) => {
      if (item.parent) {
        map[item.parent]?.children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };

  // -------------------------------------------------------------
  // Handle change
  // -------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "url" && form.page) {
      return alert("لا يمكن استخدام URL + صفحة CMS معًا");
    }
    if (name === "page" && form.url) {
      return alert("لا يمكن استخدام صفحة + URL معًا");
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectPage = (e) => {
    const pageId = e.target.value;

    if (!pageId) {
      return setForm({ ...form, page: "", url: "" });
    }

    const page = pages.find((p) => p.id == pageId);

    if (page) {
      setForm({
        ...form,
        page: pageId,
        url: `/page/${page.slug}`,
      });
    }
  };

  // -------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.parent && Number(form.parent) === editId) {
      return alert("لا يمكن تعيين العنصر كأب لنفسه");
    }

    try {
      if (editId) {
        await api.patch(`cms/admin/header/${editId}/`, form);
      } else {
        await api.post("cms/admin/header/", form);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      alert("خطأ في الحفظ");
    }
  };

  const resetForm = () => {
    setForm({
      label_ar: "",
      label_en: "",
      url: "",
      page: "",
      parent: "",
      order: 0,
      is_active: true,
    });
    setEditId(null);
  };

  // -------------------------------------------------------------
  // Edit
  // -------------------------------------------------------------
  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      label_ar: item.label_ar,
      label_en: item.label_en,
      url: item.url || "",
      page: item.page || "",
      parent: item.parent || "",
      order: item.order,
      is_active: item.is_active,
    });
  };

  // -------------------------------------------------------------
  // Delete
  // -------------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد الحذف؟")) return;

    try {
      await api.delete(`cms/admin/header/${id}/`);
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "تعذر حذف العنصر");
    }
  };

  // -------------------------------------------------------------
  // Render Tree
  // -------------------------------------------------------------
  const renderTree = (items, level = 0) =>
    items.map((item) => (
      <div
        key={item.id}
        style={{
          marginLeft: level * 25,
          padding: "6px 0",
          borderLeft: level > 0 ? "2px solid #ddd" : "",
        }}
      >
        <strong>
          {item.label_ar}{" "}
          {!item.is_active && <span style={{ color: "red" }}>(غير مفعل)</span>}
        </strong>{" "}
        — <small>{item.url || (item.page && "CMS Page")}</small>
        <div style={{ marginTop: 4 }}>
          <button onClick={() => handleEdit(item)}>تعديل</button>
          <button onClick={() => handleDelete(item.id)}>حذف</button>
        </div>

        {item.children?.length > 0 && renderTree(item.children, level + 1)}
      </div>
    ));

  return (
    <div>
      <h1>إدارة الهيدر</h1>

      {/* ---------------- Form ---------------- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          name="label_ar"
          placeholder="العنوان عربي"
          value={form.label_ar}
          onChange={handleChange}
        />

        <input
          name="label_en"
          placeholder="العنوان إنجليزي"
          value={form.label_en}
          onChange={handleChange}
        />

        <input
          name="url"
          placeholder="رابط مخصص"
          value={form.url}
          onChange={handleChange}
        />

        {/* CMS Pages */}
        <select value={form.page} onChange={handleSelectPage}>
          <option value="">اختر صفحة CMS</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title_ar}
            </option>
          ))}
        </select>

        {/* Parent */}
        <select name="parent" value={form.parent} onChange={handleChange}>
          <option value="">— عنصر رئيسي —</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label_ar}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="order"
          placeholder="الترتيب"
          value={form.order}
          onChange={handleChange}
        />

        <label>
          Active:
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
        </label>

        <button type="submit">{editId ? "تحديث" : "إضافة"}</button>
        {editId && (
          <button type="button" onClick={resetForm}>
            إلغاء التعديل
          </button>
        )}
      </form>

      {/* ---------------- Tree View ---------------- */}
      <h2>القائمة الحالية</h2>
      {renderTree(links)}
    </div>
  );
}
