/* FULL FILE — SEO_Settings.jsx */
import React, { useEffect, useState } from "react";
import {
  getDefaultSEO,
  adminSEOList,
  adminCreateSEO,
  adminUpdateSEO,
  adminDeleteSEO,
  adminAllPages,
} from "../../api/seoApi";

import toast from "react-hot-toast";

export default function SEO_Settings() {

  const [defaultSEO, setDefaultSEO] = useState(null);

  const [allPages, setAllPages] = useState([]);
  const [seoPages, setSEOPages] = useState([]);

  const [selectedSlug, setSelectedSlug] = useState("");
  const [editingSEO, setEditingSEO] = useState(null);

  const [form, setForm] = useState({
    slug: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: null,
    canonical_url: "",
  });


  useEffect(() => {
    loadDefaultSEO();
    loadAllPages();
    loadSEOPages();
  }, []);

  const loadDefaultSEO = async () => {
    const res = await getDefaultSEO();
    setDefaultSEO(res.data);
  };

  const loadAllPages = async () => {
    const res = await adminAllPages();
    setAllPages(res.data);
  };

  const loadSEOPages = async () => {
    const res = await adminSEOList();
    setSEOPages(res.data);
  };


  const handleDefaultChange = (e) => {
    const { name, value } = e.target;
    setDefaultSEO((prev) => ({ ...prev, [name]: value }));
  };

  const handleDefaultSave = async () => {
    const res = await fetch("/api/seo/admin/default/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(defaultSEO),
    });

    if (res.ok) toast.success("Default SEO updated");
    else toast.error("Error updating default SEO");
  };


  const handleSelectPage = (slug) => {
    setSelectedSlug(slug);

    const found = seoPages.find((p) => p.slug === slug);

    if (found) {
      setEditingSEO(found);
      setForm({
        slug: found.slug,
        meta_title: found.meta_title || "",
        meta_description: found.meta_description || "",
        keywords: found.keywords || "",
        og_title: found.og_title || "",
        og_description: found.og_description || "",
        og_image: null,
        canonical_url: found.canonical_url || "",
      });
    } else {
      setEditingSEO(null);
      setForm({
        slug,
        meta_title: "",
        meta_description: "",
        keywords: "",
        og_title: "",
        og_description: "",
        og_image: null,
        canonical_url: "",
      });
    }
  };


  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


  const handlePageSEOSave = async () => {
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    let res;

    if (editingSEO) {
      res = await adminUpdateSEO(editingSEO.id, fd);
    } else {
      res = await adminCreateSEO(fd);
    }

    if (res.success !== false) {
      toast.success(editingSEO ? "SEO updated" : "SEO created");
      loadSEOPages();
    } else {
      toast.error("Error saving SEO");
    }
  };


  const handleDeletePageSEO = async () => {
    if (!editingSEO) return;

    if (!window.confirm("Delete SEO settings for this page?")) return;

    await adminDeleteSEO(editingSEO.id);

    toast.success("SEO deleted");
    loadSEOPages();
    setEditingSEO(null);
  };


  return (
    <div style={{ padding: 25 }}>
      <h1>SEO Settings</h1>

      {defaultSEO && (
        <>
          <h2>Default SEO</h2>

          <input
            name="site_title"
            value={defaultSEO.site_title}
            onChange={handleDefaultChange}
            placeholder="Site Title"
            style={{ width: "100%", marginBottom: 12 }}
          />

          <textarea
            name="site_description"
            value={defaultSEO.site_description}
            onChange={handleDefaultChange}
            placeholder="Description"
            style={{ width: "100%", height: 70, marginBottom: 12 }}
          />

          <input
            name="keywords"
            value={defaultSEO.keywords}
            onChange={handleDefaultChange}
            placeholder="Keywords"
            style={{ width: "100%", marginBottom: 12 }}
          />

          <button onClick={handleDefaultSave}>Save Default SEO</button>

          <hr style={{ margin: "40px 0" }} />
        </>
      )}

      <h2>Page SEO</h2>

      <select
        value={selectedSlug}
        onChange={(e) => handleSelectPage(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 25 }}
      >
        <option value="">اختر صفحة…</option>
        {allPages.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.title} {p.has_seo ? "✔" : ""}
          </option>
        ))}
      </select>

      {!selectedSlug && <p>اختر صفحة لبدء التحرير</p>}

      {selectedSlug && (
        <>
          <input
            name="meta_title"
            value={form.meta_title}
            onChange={handleFormChange}
            placeholder="Meta Title"
            style={{ width: "100%", marginBottom: 12 }}
          />

          <textarea
            name="meta_description"
            value={form.meta_description}
            onChange={handleFormChange}
            placeholder="Meta Description"
            style={{ width: "100%", height: 70, marginBottom: 12 }}
          />

          <input
            name="keywords"
            value={form.keywords}
            onChange={handleFormChange}
            placeholder="Keywords"
            style={{ width: "100%", marginBottom: 12 }}
          />

          <input
            name="og_title"
            value={form.og_title}
            onChange={handleFormChange}
            placeholder="OG Title"
            style={{ width: "100%", marginBottom: 12 }}
          />

          <input
            name="og_description"
            value={form.og_description}
            onChange={handleFormChange}
            placeholder="OG Description"
            style={{ width: "100%", marginBottom: 12 }}
          />

          <input
            type="file"
            name="og_image"
            onChange={handleFormChange}
            style={{ marginBottom: 12 }}
          />

          <input
            name="canonical_url"
            value={form.canonical_url}
            onChange={handleFormChange}
            placeholder="Canonical URL"
            style={{ width: "100%", marginBottom: 12 }}
          />

          <button onClick={handlePageSEOSave}>
            {editingSEO ? "Update SEO" : "Create SEO"}
          </button>

          {editingSEO && (
            <button
              style={{ marginLeft: 20, color: "red" }}
              onClick={handleDeletePageSEO}
            >
              Delete
            </button>
          )}
        </>
      )}
    </div>
  );
}
