// src/pages/dashboard/Blog_Manage.jsx
import React, { useEffect, useState } from "react";
import { useBlogStore } from "../../store/useBlogStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "../../styles/CMS_BLOG.css";

export default function Blog_Manage() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("settings");

  const {
    categories,
    tags,
    posts,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    fetchBlogSettings,
    updateBlogSettings,
  } = useBlogStore();

  const [settingsForm, setSettingsForm] = useState({
    page_title_ar: "",
    page_title_en: "",
    last_update_title_ar: "",
    last_update_title_en: "",
    last_update_description_ar: "",
    last_update_description_en: "",
  });

  const [catForm, setCatForm] = useState({ name_ar: "", name_en: "", slug: "" });
  const [editingCat, setEditingCat] = useState(null);

  const [tagForm, setTagForm] = useState({ name_ar: "", name_en: "", slug: "" });
  const [editingTag, setEditingTag] = useState(null);

  const [postForm, setPostForm] = useState({
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    category: "",
    tags: [],
    cover_image: null,
    image: null,
    clauses: [],
    related_people: [],
  });
  const [editPost, setEditPost] = useState(null);
  const [postType, setPostType] = useState("news");

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchPosts();
    loadSettings();
  }, []);

  useEffect(() => {
    fetchPosts(postType);
  }, [postType]);

  const loadSettings = async () => {
    const data = await fetchBlogSettings();
    if (data) setSettingsForm(data);
  };

  const saveSettings = async () => {
    const result = await updateBlogSettings(settingsForm);
    if (result.success) {
      toast.success(t("cms.blog.success.settings_saved"));
    } else {
      toast.error(t("cms.blog.errors.settings_failed"));
    }
  };

  const saveCategory = async () => {
    if (!catForm.name_ar.trim()) {
      return toast.error(t("cms.blog.errors.category_required"));
    }
    const payload = {
      name_ar: catForm.name_ar,
      name_en: catForm.name_en,
      ...(catForm.slug.trim() && { slug: catForm.slug }),
    };
    const result = editingCat
      ? await updateCategory(editingCat.id, payload)
      : await createCategory(payload);
    if (result.success) {
      toast.success(t("cms.blog.success.category_saved"));
      setCatForm({ name_ar: "", name_en: "", slug: "" });
      setEditingCat(null);
    } else {
      toast.error(t("cms.blog.errors.category_failed"));
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: t("cms.blog.confirm_delete_category_title"),
      text: t("cms.blog.confirm_delete_category"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.blog.actions.delete"),
      cancelButtonText: t("cms.blog.actions.cancel"),
      reverseButtons: i18n.language === "ar",
    });
    if (result.isConfirmed) {
      await deleteCategory(id);
      Swal.fire({
        title: t("cms.blog.deleted_title"),
        text: t("cms.blog.success.category_deleted"),
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const saveTag = async () => {
    if (!tagForm.name_ar.trim()) {
      return toast.error(t("cms.blog.errors.tag_required"));
    }
    const payload = {
      name_ar: tagForm.name_ar,
      name_en: tagForm.name_en,
      ...(tagForm.slug.trim() && { slug: tagForm.slug }),
    };
    const result = editingTag
      ? await updateTag(editingTag.id, payload)
      : await createTag(payload);
    if (result.success) {
      toast.success(t("cms.blog.success.tag_saved"));
      setTagForm({ name_ar: "", name_en: "", slug: "" });
      setEditingTag(null);
    } else {
      toast.error(t("cms.blog.errors.tag_failed"));
    }
  };

  const handleDeleteTag = async (id) => {
    const result = await Swal.fire({
      title: t("cms.blog.confirm_delete_tag_title"),
      text: t("cms.blog.confirm_delete_tag"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.blog.actions.delete"),
      cancelButtonText: t("cms.blog.actions.cancel"),
      reverseButtons: i18n.language === "ar",
    });
    if (result.isConfirmed) {
      await deleteTag(id);
      Swal.fire({
        title: t("cms.blog.deleted_title"),
        text: t("cms.blog.success.tag_deleted"),
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    setPostForm({ ...postForm, [name]: files ? files[0] : value });
  };

  const toggleTag = (id) => {
    setPostForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(id) ? prev.tags.filter((t) => t !== id) : [...prev.tags, id],
    }));
  };

  const addClause = () => {
    setPostForm((prev) => ({
      ...prev,
      clauses: [
        ...prev.clauses,
        { title_ar: "", title_en: "", content_ar: "", content_en: "", order: prev.clauses.length + 1 },
      ],
    }));
  };

  const updateClause = (index, field, value) => {
    const updated = [...postForm.clauses];
    updated[index][field] = value;
    setPostForm({ ...postForm, clauses: updated });
  };

  const removeClause = (index) => {
    const updated = postForm.clauses.filter((_, i) => i !== index);
    setPostForm({ ...postForm, clauses: updated });
  };

  const addPerson = () => {
    setPostForm((prev) => ({
      ...prev,
      related_people: [
        ...prev.related_people,
        { name_ar: "", name_en: "", description_ar: "", description_en: "", order: prev.related_people.length + 1 },
      ],
    }));
  };

  const updatePerson = (index, field, value) => {
    const updated = [...postForm.related_people];
    updated[index][field] = value;
    setPostForm({ ...postForm, related_people: updated });
  };

  const removePerson = (index) => {
    const updated = postForm.related_people.filter((_, i) => i !== index);
    setPostForm({ ...postForm, related_people: updated });
  };

  const loadPostIntoForm = (post) => {
    setPostForm({
      title_ar: post.title_ar,
      title_en: post.title_en,
      content_ar: post.content_ar,
      content_en: post.content_en,
      category: post.category || post.category_data?.id || "",
      tags: post.tags ? post.tags.map((t) => t.id) : [],
      cover_image: null,
      image: null,
      clauses: post.clauses || [],
      related_people: post.related_people || [],
    });
    setEditPost(post);
    setActiveTab("posts");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const savePost = async () => {
    const fd = new FormData();
    Object.entries(postForm).forEach(([key, value]) => {
      if (key === "tags") {
        value.forEach((tagId) => fd.append("tag_ids", tagId));
      } else if (value && key !== "clauses" && key !== "related_people") {
        fd.append(key, value);
      }
    });
    fd.append("clauses_data", JSON.stringify(postForm.clauses));
    postForm.related_people.forEach((person, index) => {
      fd.append(`related_people_data[${index}][name_ar]`, person.name_ar);
      fd.append(`related_people_data[${index}][name_en]`, person.name_en);
      fd.append(`related_people_data[${index}][description_ar]`, person.description_ar);
      fd.append(`related_people_data[${index}][description_en]`, person.description_en);
      fd.append(`related_people_data[${index}][order]`, person.order);
      if (person.image) {
        fd.append(`related_people_data[${index}][image]`, person.image);
      }
    });
    fd.append("post_type", postType);
    fd.append("status", "published");

    const result = editPost ? await updatePost(editPost.id, fd) : await createPost(fd);
    if (result.success) {
      toast.success(editPost ? t("cms.blog.success.post_updated") : t("cms.blog.success.post_created"));
      setEditPost(null);
      setPostForm({
        title_ar: "",
        title_en: "",
        content_ar: "",
        content_en: "",
        category: "",
        tags: [],
        cover_image: null,
        image: null,
        clauses: [],
        related_people: [],
      });
    } else {
      toast.error(t("cms.blog.errors.post_failed"));
    }
  };

  const handleDeletePost = async (id) => {
    const result = await Swal.fire({
      title: t("cms.blog.confirm_delete_post_title"),
      text: t("cms.blog.confirm_delete_post"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.blog.actions.delete"),
      cancelButtonText: t("cms.blog.actions.cancel"),
      reverseButtons: i18n.language === "ar",
    });
    if (result.isConfirmed) {
      await deletePost(id);
      Swal.fire({
        title: t("cms.blog.deleted_title"),
        text: t("cms.blog.success.post_deleted"),
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const tabs = [
    { id: "settings", label: t("cms.blog.tabs.settings") },
    { id: "categories", label: t("cms.blog.tabs.categories") },
    { id: "tags", label: t("cms.blog.tabs.tags") },
    { id: "posts", label: t("cms.blog.tabs.posts") },
  ];

  return (
    <div className="dashboard-blog-container">
      <div className="dashboard-blog-header">
        <div className="dashboard-blog-header-content">
          <h1 className="dashboard-blog-title">{t("cms.blog.title")}</h1>
          <p className="dashboard-blog-subtitle">{t("cms.blog.subtitle")}</p>
        </div>
      </div>

      <div className="dashboard-blog-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dashboard-blog-tab ${activeTab === tab.id ? "dashboard-blog-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {tab.id === "settings" && (
                <path d="M15.19 10C15.19 10.12 15.18 10.24 15.17 10.36L16.82 11.63C16.96 11.74 17 11.93 16.92 12.09L15.35 14.91C15.27 15.07 15.09 15.13 14.92 15.07L13.01 14.34C12.62 14.65 12.2 14.92 11.74 15.13L11.46 17.18C11.44 17.36 11.29 17.5 11.11 17.5H7.97C7.79 17.5 7.64 17.36 7.62 17.18L7.34 15.13C6.88 14.92 6.46 14.65 6.07 14.34L4.16 15.07C3.99 15.13 3.81 15.07 3.73 14.91L2.16 12.09C2.08 11.93 2.12 11.74 2.26 11.63L3.91 10.36C3.9 10.24 3.89 10.12 3.89 10C3.89 9.88 3.9 9.76 3.91 9.64L2.26 8.37C2.12 8.26 2.08 8.07 2.16 7.91L3.73 5.09C3.81 4.93 3.99 4.87 4.16 4.93L6.07 5.66C6.46 5.35 6.88 5.08 7.34 4.87L7.62 2.82C7.64 2.64 7.79 2.5 7.97 2.5H11.11C11.29 2.5 11.44 2.64 11.46 2.82L11.74 4.87C12.2 5.08 12.62 5.35 13.01 5.66L14.92 4.93C15.09 4.87 15.27 4.93 15.35 5.09L16.92 7.91C17 8.07 16.96 8.26 16.82 8.37L15.17 9.64C15.18 9.76 15.19 9.88 15.19 10ZM9.54 6.5C7.84 6.5 6.46 7.88 6.46 9.58C6.46 11.28 7.84 12.66 9.54 12.66C11.24 12.66 12.62 11.28 12.62 9.58C12.62 7.88 11.24 6.5 9.54 6.5Z" fill="currentColor"/>
              )}
              {tab.id === "categories" && (
                <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="currentColor"/>
              )}
              {tab.id === "tags" && (
                <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z" fill="currentColor"/>
              )}
              {tab.id === "posts" && (
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              )}
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-blog-tab-content">
        {activeTab === "settings" && (
          <div className="dashboard-blog-content">
            <div className="dashboard-blog-content-header">
              <div className="dashboard-blog-content-header-left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
                </svg>
                <h2>{t("cms.blog.settings.title")}</h2>
              </div>
              <p className="dashboard-blog-content-subtitle">{t("cms.blog.settings.subtitle")}</p>
            </div>

            <div className="dashboard-blog-form-card">
              <div className="dashboard-blog-form-section">
                <h3 className="dashboard-blog-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5Z" fill="currentColor"/>
                  </svg>
                  {t("cms.blog.settings.section_page")}
                </h3>

                <div className="dashboard-blog-form-grid-row">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.settings.page_title_ar")}</label>
                    <input
                      className="dashboard-blog-input"
                      value={settingsForm.page_title_ar}
                      onChange={(e) => setSettingsForm({ ...settingsForm, page_title_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.settings.page_title_en")}</label>
                    <input
                      className="dashboard-blog-input"
                      value={settingsForm.page_title_en}
                      onChange={(e) => setSettingsForm({ ...settingsForm, page_title_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-blog-form-grid-row">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.settings.update_title_ar")}</label>
                    <input
                      className="dashboard-blog-input"
                      value={settingsForm.last_update_title_ar}
                      onChange={(e) => setSettingsForm({ ...settingsForm, last_update_title_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.settings.update_title_en")}</label>
                    <input
                      className="dashboard-blog-input"
                      value={settingsForm.last_update_title_en}
                      onChange={(e) => setSettingsForm({ ...settingsForm, last_update_title_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-blog-form-grid-row">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.settings.update_desc_ar")}</label>
                    <textarea
                      className="dashboard-blog-textarea"
                      value={settingsForm.last_update_description_ar}
                      onChange={(e) => setSettingsForm({ ...settingsForm, last_update_description_ar: e.target.value })}
                      rows="4"
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.settings.update_desc_en")}</label>
                    <textarea
                      className="dashboard-blog-textarea"
                      value={settingsForm.last_update_description_en}
                      onChange={(e) => setSettingsForm({ ...settingsForm, last_update_description_en: e.target.value })}
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              <div className="dashboard-blog-form-actions">
                <button className="dashboard-blog-btn-primary" onClick={saveSettings}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {t("cms.blog.actions.save")}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="dashboard-blog-content">
            <div className="dashboard-blog-content-header">
              <div className="dashboard-blog-content-header-left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="currentColor"/>
                </svg>
                <h2>{t("cms.blog.categories.title")}</h2>
              </div>
              <p className="dashboard-blog-content-subtitle">{t("cms.blog.categories.subtitle")}</p>
            </div>

            <div className="dashboard-blog-form-card">
              <div className="dashboard-blog-form-section">
                <div className="dashboard-blog-form-grid-row">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.category_ar")}</label>
                    <input
                      className="dashboard-blog-input"
                      placeholder={t("cms.blog.fields.category_ar_placeholder")}
                      value={catForm.name_ar}
                      onChange={(e) => setCatForm({ ...catForm, name_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.category_en")}</label>
                    <input
                      className="dashboard-blog-input"
                      placeholder={t("cms.blog.fields.category_en_placeholder")}
                      value={catForm.name_en}
                      onChange={(e) => setCatForm({ ...catForm, name_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="dashboard-blog-form-group">
                  <label className="dashboard-blog-label">{t("cms.blog.fields.slug_optional")}</label>
                  <input
                    className="dashboard-blog-input"
                    placeholder="auto-generated-slug"
                    value={catForm.slug}
                    onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  />
                </div>
              </div>
              <div className="dashboard-blog-form-actions">
                <button className="dashboard-blog-btn-primary" onClick={saveCategory}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {editingCat ? t("cms.blog.actions.update_category") : t("cms.blog.actions.create_category")}
                </button>
                {editingCat && (
                  <button className="dashboard-blog-btn-secondary" onClick={() => { setEditingCat(null); setCatForm({ name_ar: "", name_en: "", slug: "" }); }}>
                    {t("cms.blog.actions.cancel")}
                  </button>
                )}
              </div>
            </div>

            <div className="dashboard-blog-list-card">
              <div className="dashboard-blog-list-header">
                <div className="dashboard-blog-list-title-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
                  </svg>
                  <h3>{t("cms.blog.categories_list")}</h3>
                </div>
                <span className="dashboard-blog-count-badge">{categories.length}</span>
              </div>
              {categories.length > 0 ? (
                <div className="dashboard-blog-table-wrapper">
                  <table className="dashboard-blog-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{t("cms.blog.fields.category_ar")}</th>
                        <th>{t("cms.blog.fields.category_en")}</th>
                        <th>{t("cms.blog.fields.slug")}</th>
                        <th>{t("cms.blog.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id}>
                          <td className="dashboard-blog-table-id">{c.id}</td>
                          <td className="dashboard-blog-table-name">{c.name_ar}</td>
                          <td className="dashboard-blog-table-name">{c.name_en}</td>
                          <td className="dashboard-blog-table-slug">{c.slug}</td>
                          <td>
                            <div className="dashboard-blog-table-actions">
                              <button className="dashboard-blog-btn-edit" onClick={() => { setEditingCat(c); setCatForm({ name_ar: c.name_ar, name_en: c.name_en, slug: c.slug }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                                </svg>
                                {t("cms.blog.actions.edit")}
                              </button>
                              <button className="dashboard-blog-btn-delete" onClick={() => handleDeleteCategory(c.id)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                                </svg>
                                {t("cms.blog.actions.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="dashboard-blog-empty">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M38 8H28V6H20V8H10C8.9 8 8 8.9 8 10V12H40V10C40 8.9 39.1 8 38 8Z" fill="currentColor"/>
                    <path d="M10 14V38C10 39.1 10.9 40 12 40H36C37.1 40 38 39.1 38 38V14H10Z" fill="currentColor"/>
                  </svg>
                  <p>{t("cms.blog.no_categories")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "tags" && (
          <div className="dashboard-blog-content">
            <div className="dashboard-blog-content-header">
              <div className="dashboard-blog-content-header-left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z" fill="currentColor"/>
                </svg>
                <h2>{t("cms.blog.tags.title")}</h2>
              </div>
              <p className="dashboard-blog-content-subtitle">{t("cms.blog.tags.subtitle")}</p>
            </div>

            <div className="dashboard-blog-form-card">
              <div className="dashboard-blog-form-section">
                <div className="dashboard-blog-form-grid-row">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.tag_ar")}</label>
                    <input
                      className="dashboard-blog-input"
                      placeholder={t("cms.blog.fields.tag_ar_placeholder")}
                      value={tagForm.name_ar}
                      onChange={(e) => setTagForm({ ...tagForm, name_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.tag_en")}</label>
                    <input
                      className="dashboard-blog-input"
                      placeholder={t("cms.blog.fields.tag_en_placeholder")}
                      value={tagForm.name_en}
                      onChange={(e) => setTagForm({ ...tagForm, name_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="dashboard-blog-form-group">
                  <label className="dashboard-blog-label">{t("cms.blog.fields.slug_optional")}</label>
                  <input
                    className="dashboard-blog-input"
                    placeholder="auto-generated-slug"
                    value={tagForm.slug}
                    onChange={(e) => setTagForm({ ...tagForm, slug: e.target.value })}
                  />
                </div>
              </div>
              <div className="dashboard-blog-form-actions">
                <button className="dashboard-blog-btn-primary" onClick={saveTag}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {editingTag ? t("cms.blog.actions.update_tag") : t("cms.blog.actions.create_tag")}
                </button>
                {editingTag && (
                  <button className="dashboard-blog-btn-secondary" onClick={() => { setEditingTag(null); setTagForm({ name_ar: "", name_en: "", slug: "" }); }}>
                    {t("cms.blog.actions.cancel")}
                  </button>
                )}
              </div>
            </div>

            <div className="dashboard-blog-list-card">
              <div className="dashboard-blog-list-header">
                <div className="dashboard-blog-list-title-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
                  </svg>
                  <h3>{t("cms.blog.tags_list")}</h3>
                </div>
                <span className="dashboard-blog-count-badge">{tags.length}</span>
              </div>
              {tags.length > 0 ? (
                <div className="dashboard-blog-table-wrapper">
                  <table className="dashboard-blog-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{t("cms.blog.fields.tag_ar")}</th>
                        <th>{t("cms.blog.fields.tag_en")}</th>
                        <th>{t("cms.blog.fields.slug")}</th>
                        <th>{t("cms.blog.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.map((tItem) => (
                        <tr key={tItem.id}>
                          <td className="dashboard-blog-table-id">{tItem.id}</td>
                          <td className="dashboard-blog-table-name">{tItem.name_ar}</td>
                          <td className="dashboard-blog-table-name">{tItem.name_en}</td>
                          <td className="dashboard-blog-table-slug">{tItem.slug}</td>
                          <td>
                            <div className="dashboard-blog-table-actions">
                              <button className="dashboard-blog-btn-edit" onClick={() => { setEditingTag(tItem); setTagForm({ name_ar: tItem.name_ar, name_en: tItem.name_en, slug: tItem.slug }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                                </svg>
                                {t("cms.blog.actions.edit")}
                              </button>
                              <button className="dashboard-blog-btn-delete" onClick={() => handleDeleteTag(tItem.id)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                                </svg>
                                {t("cms.blog.actions.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="dashboard-blog-empty">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M38 8H28V6H20V8H10C8.9 8 8 8.9 8 10V12H40V10C40 8.9 39.1 8 38 8Z" fill="currentColor"/>
                  </svg>
                  <p>{t("cms.blog.no_tags")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="dashboard-blog-content">
            <div className="dashboard-blog-content-header">
              <div className="dashboard-blog-content-header-left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                </svg>
                <h2>{t("cms.blog.posts.title")}</h2>
              </div>
              <p className="dashboard-blog-content-subtitle">{t("cms.blog.posts.subtitle")}</p>
            </div>

            <div className="dashboard-blog-post-type-selector">
              <button
                className={`dashboard-blog-post-type-btn ${postType === "news" ? "dashboard-blog-post-type-btn-active" : ""}`}
                onClick={() => setPostType("news")}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17 2H3C2.45 2 2 2.45 2 3V17C2 17.55 2.45 18 3 18H17C17.55 18 18 17.55 18 17V3C18 2.45 17.55 2 17 2ZM16 16H4V4H16V16ZM14 8H6V6H14V8ZM14 12H6V10H14V12ZM10 14H6V14H10V14Z" fill="currentColor"/>
                </svg>
                {t("cms.blog.post_types.news")}
              </button>
              <button
                className={`dashboard-blog-post-type-btn ${postType === "article" ? "dashboard-blog-post-type-btn-active" : ""}`}
                onClick={() => setPostType("article")}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V4C16 2.9 15.1 2 14 2ZM14 16H6V4H14V16Z" fill="currentColor"/>
                </svg>
                {t("cms.blog.post_types.article")}
              </button>
            </div>

            <div className="dashboard-blog-form-card">
              <div className="dashboard-blog-form-section">
                <h3 className="dashboard-blog-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5Z" fill="currentColor"/>
                  </svg>
                  {t("cms.blog.posts.basic_info")}
                </h3>

                <div className="dashboard-blog-form-grid-row">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.title_ar")}</label>
                    <input
                      className="dashboard-blog-input"
                      name="title_ar"
                      placeholder={t("cms.blog.fields.title_ar_placeholder")}
                      value={postForm.title_ar}
                      onChange={handlePostChange}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.title_en")}</label>
                    <input
                      className="dashboard-blog-input"
                      name="title_en"
                      placeholder={t("cms.blog.fields.title_en_placeholder")}
                      value={postForm.title_en}
                      onChange={handlePostChange}
                    />
                  </div>
                </div>

                <div className="dashboard-blog-form-grid-row">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.content_ar")}</label>
                    <textarea
                      className="dashboard-blog-textarea"
                      name="content_ar"
                      placeholder={t("cms.blog.fields.content_ar_placeholder")}
                      value={postForm.content_ar}
                      onChange={handlePostChange}
                      rows="6"
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.content_en")}</label>
                    <textarea
                      className="dashboard-blog-textarea"
                      name="content_en"
                      placeholder={t("cms.blog.fields.content_en_placeholder")}
                      value={postForm.content_en}
                      onChange={handlePostChange}
                      rows="6"
                    />
                  </div>
                </div>

                <div className="dashboard-blog-form-grid">
                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.select_category")}</label>
                    <select
                      className="dashboard-blog-select"
                      name="category"
                      value={postForm.category}
                      onChange={handlePostChange}
                    >
                      <option value="">{t("cms.blog.fields.select_category")}</option>
                      {categories.map((c) => (
                        <option value={c.id} key={c.id}>{c.name_ar}</option>
                      ))}
                    </select>
                  </div>

                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.cover_image")}</label>
                    <input
                      className="dashboard-blog-input"
                      type="file"
                      name="cover_image"
                      onChange={handlePostChange}
                    />
                  </div>

                  <div className="dashboard-blog-form-group">
                    <label className="dashboard-blog-label">{t("cms.blog.fields.internal_image")}</label>
                    <input
                      className="dashboard-blog-input"
                      type="file"
                      name="image"
                      onChange={handlePostChange}
                    />
                  </div>
                </div>

                <div className="dashboard-blog-form-group">
                  <label className="dashboard-blog-label">{t("cms.blog.fields.tags")}</label>
                  <div className="dashboard-blog-tags-selector">
                    {tags.map((tItem) => (
                      <label
                        key={tItem.id}
                        className={`dashboard-blog-tag-checkbox ${postForm.tags.includes(tItem.id) ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={postForm.tags.includes(tItem.id)}
                          onChange={() => toggleTag(tItem.id)}
                        />
                        <span className="dashboard-blog-tag-label">{tItem.name_ar}</span>
                      </label>
                    ))}
                    {tags.length === 0 && (
                      <span className="dashboard-blog-no-tags">{t("cms.blog.no_tags_available")}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="dashboard-blog-form-section">
                <h3 className="dashboard-blog-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M14 2H4C2.9 2 2 2.9 2 4V14C2 15.1 2.9 16 4 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2Z" fill="currentColor"/>
                  </svg>
                  {t("cms.blog.fields.clauses")}
                </h3>

                {postForm.clauses?.map((clause, index) => (
                  <div key={index} className="dashboard-blog-dynamic-item">
                    <div className="dashboard-blog-form-grid-row">
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.clause_title_ar")}</label>
                        <input
                          className="dashboard-blog-input"
                          placeholder={t("cms.blog.fields.clause_title_ar")}
                          value={clause.title_ar}
                          onChange={(e) => updateClause(index, "title_ar", e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.clause_title_en")}</label>
                        <input
                          className="dashboard-blog-input"
                          placeholder={t("cms.blog.fields.clause_title_en")}
                          value={clause.title_en}
                          onChange={(e) => updateClause(index, "title_en", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="dashboard-blog-form-grid-row">
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.clause_content_ar")}</label>
                        <textarea
                          className="dashboard-blog-textarea"
                          placeholder={t("cms.blog.fields.clause_content_ar")}
                          value={clause.content_ar || ""}
                          onChange={(e) => updateClause(index, "content_ar", e.target.value)}
                          rows="3"
                          dir="rtl"
                        />
                      </div>
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.clause_content_en")}</label>
                        <textarea
                          className="dashboard-blog-textarea"
                          placeholder={t("cms.blog.fields.clause_content_en")}
                          value={clause.content_en || ""}
                          onChange={(e) => updateClause(index, "content_en", e.target.value)}
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="dashboard-blog-dynamic-item-actions">
                      <input
                        className="dashboard-blog-input dashboard-blog-input-small"
                        type="number"
                        placeholder={t("cms.blog.fields.order")}
                        value={clause.order}
                        onChange={(e) => updateClause(index, "order", e.target.value)}
                      />
                      <button
                        type="button"
                        className="dashboard-blog-btn-delete"
                        onClick={() => removeClause(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                        </svg>
                        {t("cms.blog.actions.remove")}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="dashboard-blog-btn-add"
                  onClick={addClause}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {t("cms.blog.actions.add_clause")}
                </button>
              </div>

              <div className="dashboard-blog-form-section">
                <h3 className="dashboard-blog-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2C6.79 2 5 3.79 5 6C5 8.21 6.79 10 9 10C11.21 10 13 8.21 13 6C13 3.79 11.21 2 9 2ZM9 12C5.67 12 3 13.34 3 15V16H15V15C15 13.34 12.33 12 9 12Z" fill="currentColor"/>
                  </svg>
                  {t("cms.blog.fields.related_people")}
                </h3>

                {postForm.related_people?.map((person, index) => (
                  <div key={index} className="dashboard-blog-dynamic-item">
                    <div className="dashboard-blog-form-grid-row">
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.person_name_ar")}</label>
                        <input
                          className="dashboard-blog-input"
                          placeholder={t("cms.blog.fields.person_name_ar")}
                          value={person.name_ar}
                          onChange={(e) => updatePerson(index, "name_ar", e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.person_name_en")}</label>
                        <input
                          className="dashboard-blog-input"
                          placeholder={t("cms.blog.fields.person_name_en")}
                          value={person.name_en}
                          onChange={(e) => updatePerson(index, "name_en", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="dashboard-blog-form-grid-row">
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.person_desc_ar")}</label>
                        <textarea
                          className="dashboard-blog-textarea"
                          placeholder={t("cms.blog.fields.person_desc_ar")}
                          value={person.description_ar}
                          onChange={(e) => updatePerson(index, "description_ar", e.target.value)}
                          rows="3"
                          dir="rtl"
                        />
                      </div>
                      <div className="dashboard-blog-form-group">
                        <label className="dashboard-blog-label">{t("cms.blog.fields.person_desc_en")}</label>
                        <textarea
                          className="dashboard-blog-textarea"
                          placeholder={t("cms.blog.fields.person_desc_en")}
                          value={person.description_en}
                          onChange={(e) => updatePerson(index, "description_en", e.target.value)}
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="dashboard-blog-dynamic-item-actions">
                      <input
                        type="file"
                        className="dashboard-blog-input"
                        onChange={(e) => updatePerson(index, "image", e.target.files[0])}
                      />
                      <button
                        type="button"
                        className="dashboard-blog-btn-delete"
                        onClick={() => removePerson(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                        </svg>
                        {t("cms.blog.actions.remove")}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="dashboard-blog-btn-add"
                  onClick={addPerson}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {t("cms.blog.actions.add_person")}
                </button>
              </div>

              <div className="dashboard-blog-form-actions">
                <button className="dashboard-blog-btn-primary" onClick={savePost}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {editPost ? t("cms.blog.actions.update_post") : t("cms.blog.actions.create_post")}
                </button>
                {editPost && (
                  <button
                    className="dashboard-blog-btn-secondary"
                    onClick={() => {
                      setEditPost(null);
                      setPostForm({
                        title_ar: "",
                        title_en: "",
                        content_ar: "",
                        content_en: "",
                        category: "",
                        tags: [],
                        cover_image: null,
                        image: null,
                        clauses: [],
                        related_people: [],
                      });
                    }}
                  >
                    {t("cms.blog.actions.cancel")}
                  </button>
                )}
              </div>
            </div>

            <div className="dashboard-blog-list-card">
              <div className="dashboard-blog-list-header">
                <div className="dashboard-blog-list-title-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
                  </svg>
                  <h3>{t("cms.blog.posts_list")}</h3>
                </div>
                <span className="dashboard-blog-count-badge">{posts.length}</span>
              </div>
              {posts.length > 0 ? (
                <div className="dashboard-blog-table-wrapper">
                  <table className="dashboard-blog-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{t("cms.blog.table.title_ar")}</th>
                        <th>{t("cms.blog.table.category")}</th>
                        <th>{t("cms.blog.table.cover")}</th>
                        <th>{t("cms.blog.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((p) => (
                        <tr key={p.id}>
                          <td className="dashboard-blog-table-id">{p.id}</td>
                          <td className="dashboard-blog-table-name">{p.title_ar}</td>
                          <td className="dashboard-blog-table-category">{p.category_data?.name_ar || "—"}</td>
                          <td>
                            {p.cover_image && (
                              <img
                                className="dashboard-blog-cover-image"
                                src={p.cover_image}
                                alt={p.title_ar}
                              />
                            )}
                          </td>
                          <td>
                            <div className="dashboard-blog-table-actions">
                              <button
                                className="dashboard-blog-btn-edit"
                                onClick={() => loadPostIntoForm(p)}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                                </svg>
                                {t("cms.blog.actions.edit")}
                              </button>
                              <button
                                className="dashboard-blog-btn-delete"
                                onClick={() => handleDeletePost(p.id)}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                                </svg>
                                {t("cms.blog.actions.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="dashboard-blog-empty">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M28 4H12C9.8 4 8 5.8 8 8V40C8 42.2 9.8 44 12 44H36C38.2 44 40 42.2 40 40V16L28 4Z" fill="currentColor"/>
                  </svg>
                  <p>{t("cms.blog.no_posts")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}