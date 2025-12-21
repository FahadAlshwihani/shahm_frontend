import React, { useEffect, useState } from "react";
import { useBlogStore } from "../../store/useBlogStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_BLOG.css";

export default function Blog_Manage() {
  const { t } = useTranslation();

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
  } = useBlogStore();

  /* ====================================================== CATEGORY STATES */
  const [catForm, setCatForm] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
  });
  const [editingCat, setEditingCat] = useState(null);

  /* ====================================================== TAG STATES */
  const [tagForm, setTagForm] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
  });
  const [editingTag, setEditingTag] = useState(null);

  /* ====================================================== POST STATES */
  const [postForm, setPostForm] = useState({
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    category: "",
    tags: [],
    cover_image: null,
    image: null,
  });
  const [editPost, setEditPost] = useState(null);

  /* ====================================================== LOAD DATA */
  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchPosts();
  }, []);

  /* ====================================================== CATEGORY HANDLERS */
  const saveCategory = async () => {
    if (!catForm.name_ar.trim())
      return toast.error(t("cms.blog.errors.category_required"));

    let payload = {
      name_ar: catForm.name_ar,
      name_en: catForm.name_en,
    };

    if (catForm.slug.trim()) payload.slug = catForm.slug;

    let result = editingCat
      ? await updateCategory(editingCat.id, payload)
      : await createCategory(payload);

    if (result.success) toast.success(t("cms.blog.success.category_saved"));
    else toast.error(t("cms.blog.errors.category_failed"));

    setEditingCat(null);
    setCatForm({ name_ar: "", name_en: "", slug: "" });
  };

  const editCategoryHandler = (cat) => {
    setEditingCat(cat);
    setCatForm({
      name_ar: cat.name_ar,
      name_en: cat.name_en,
      slug: cat.slug,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ====================================================== TAG HANDLERS */
  const saveTag = async () => {
    if (!tagForm.name_ar.trim())
      return toast.error(t("cms.blog.errors.tag_required"));

    let payload = {
      name_ar: tagForm.name_ar,
      name_en: tagForm.name_en,
    };

    if (tagForm.slug.trim()) payload.slug = tagForm.slug;

    let result = editingTag
      ? await updateTag(editingTag.id, payload)
      : await createTag(payload);

    if (result.success) toast.success(t("cms.blog.success.tag_saved"));
    else toast.error(t("cms.blog.errors.tag_failed"));

    setEditingTag(null);
    setTagForm({ name_ar: "", name_en: "", slug: "" });
  };

  const editTagHandler = (tag) => {
    setEditingTag(tag);
    setTagForm({
      name_ar: tag.name_ar,
      name_en: tag.name_en,
      slug: tag.slug,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ====================================================== POST HANDLERS */
  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    setPostForm({
      ...postForm,
      [name]: files ? files[0] : value,
    });
  };

  const toggleTag = (id) => {
    setPostForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(id)
        ? prev.tags.filter((t) => t !== id)
        : [...prev.tags, id],
    }));
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
    });
    setEditPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ====================================================== SAVE POST */
  const savePost = async () => {
    const fd = new FormData();

    Object.entries(postForm).forEach(([key, value]) => {
      if (key === "tags") {
        value.forEach((tagId) => fd.append("tag_ids", tagId));
      } else if (value) {
        fd.append(key, value);
      }
    });

    fd.append("status", "published");

    let result;

    if (editPost) {
      result = await updatePost(editPost.id, fd);
      result.success
        ? toast.success(t("cms.blog.success.post_updated"))
        : toast.error(t("cms.blog.errors.post_failed"));
    } else {
      result = await createPost(fd);
      result.success
        ? toast.success(t("cms.blog.success.post_created"))
        : toast.error(t("cms.blog.errors.post_failed"));
    }

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
    });
  };

  /* ====================================================== UI */
  return (
    <div className="blog-cms-container">
      <div className="blog-cms-header">
        <h1 className="blog-cms-title">{t("cms.blog.title")}</h1>
        <p className="blog-cms-subtitle">{t("cms.blog.subtitle")}</p>
      </div>

      {/* ==================== CATEGORIES ==================== */}
      <div className="blog-form-card">
        <div className="blog-form-header">
          <h2>
            {editingCat
              ? t("cms.blog.actions.update_category")
              : t("cms.blog.actions.create_category")}
          </h2>
        </div>

        <div className="blog-form-section">
          <h4 className="blog-section-title">{t("cms.blog.category_info")}</h4>
          <div className="blog-form-grid">
            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.category_ar")}
              </label>
              <input
                className="blog-input"
                placeholder={t("cms.blog.fields.category_ar_placeholder")}
                value={catForm.name_ar}
                onChange={(e) =>
                  setCatForm({ ...catForm, name_ar: e.target.value })
                }
              />
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.category_en")}
              </label>
              <input
                className="blog-input"
                placeholder={t("cms.blog.fields.category_en_placeholder")}
                value={catForm.name_en}
                onChange={(e) =>
                  setCatForm({ ...catForm, name_en: e.target.value })
                }
              />
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.slug_optional")}
              </label>
              <input
                className="blog-input"
                placeholder="auto-generated-slug"
                value={catForm.slug}
                onChange={(e) =>
                  setCatForm({ ...catForm, slug: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="blog-form-actions">
          <button className="blog-btn-primary" onClick={saveCategory}>
            {editingCat
              ? t("cms.blog.actions.update_category")
              : t("cms.blog.actions.create_category")}
          </button>
          {editingCat && (
            <button
              className="blog-btn-cancel"
              onClick={() => {
                setEditingCat(null);
                setCatForm({ name_ar: "", name_en: "", slug: "" });
              }}
            >
              {t("cms.blog.actions.cancel")}
            </button>
          )}
        </div>
      </div>

      {/* ==================== CATEGORIES LIST ==================== */}
      <div className="blog-list-card">
        <h2 className="blog-list-title">{t("cms.blog.categories_list")}</h2>
        <div className="blog-table-wrapper">
          <table className="blog-table">
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
                  <td className="blog-table-id">{c.id}</td>
                  <td className="blog-table-title">{c.name_ar}</td>
                  <td className="blog-table-title">{c.name_en}</td>
                  <td className="blog-table-slug">{c.slug}</td>
                  <td>
                    <div className="blog-table-actions">
                      <button
                        className="blog-btn-edit"
                        onClick={() => editCategoryHandler(c)}
                      >
                        {t("cms.blog.actions.edit")}
                      </button>
                      <button
                        className="blog-btn-delete"
                        onClick={() => {
                          if (
                            window.confirm(
                              t("cms.blog.confirm_delete_category")
                            )
                          )
                            deleteCategory(c.id);
                        }}
                      >
                        {t("cms.blog.actions.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="blog-table-empty">
                    {t("cms.blog.no_categories")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="blog-divider"></div>

      {/* ==================== TAGS ==================== */}
      <div className="blog-form-card">
        <div className="blog-form-header">
          <h2>
            {editingTag
              ? t("cms.blog.actions.update_tag")
              : t("cms.blog.actions.create_tag")}
          </h2>
        </div>

        <div className="blog-form-section">
          <h4 className="blog-section-title">{t("cms.blog.tag_info")}</h4>
          <div className="blog-form-grid">
            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.tag_ar")}
              </label>
              <input
                className="blog-input"
                placeholder={t("cms.blog.fields.tag_ar_placeholder")}
                value={tagForm.name_ar}
                onChange={(e) =>
                  setTagForm({ ...tagForm, name_ar: e.target.value })
                }
              />
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.tag_en")}
              </label>
              <input
                className="blog-input"
                placeholder={t("cms.blog.fields.tag_en_placeholder")}
                value={tagForm.name_en}
                onChange={(e) =>
                  setTagForm({ ...tagForm, name_en: e.target.value })
                }
              />
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.slug_optional")}
              </label>
              <input
                className="blog-input"
                placeholder="auto-generated-slug"
                value={tagForm.slug}
                onChange={(e) =>
                  setTagForm({ ...tagForm, slug: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="blog-form-actions">
          <button className="blog-btn-primary" onClick={saveTag}>
            {editingTag
              ? t("cms.blog.actions.update_tag")
              : t("cms.blog.actions.create_tag")}
          </button>
          {editingTag && (
            <button
              className="blog-btn-cancel"
              onClick={() => {
                setEditingTag(null);
                setTagForm({ name_ar: "", name_en: "", slug: "" });
              }}
            >
              {t("cms.blog.actions.cancel")}
            </button>
          )}
        </div>
      </div>

      {/* ==================== TAGS LIST ==================== */}
      <div className="blog-list-card">
        <h2 className="blog-list-title">{t("cms.blog.tags_list")}</h2>
        <div className="blog-table-wrapper">
          <table className="blog-table">
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
                  <td className="blog-table-id">{tItem.id}</td>
                  <td className="blog-table-title">{tItem.name_ar}</td>
                  <td className="blog-table-title">{tItem.name_en}</td>
                  <td className="blog-table-slug">{tItem.slug}</td>
                  <td>
                    <div className="blog-table-actions">
                      <button
                        className="blog-btn-edit"
                        onClick={() => editTagHandler(tItem)}
                      >
                        {t("cms.blog.actions.edit")}
                      </button>
                      <button
                        className="blog-btn-delete"
                        onClick={() => {
                          if (window.confirm(t("cms.blog.confirm_delete_tag")))
                            deleteTag(tItem.id);
                        }}
                      >
                        {t("cms.blog.actions.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tags.length === 0 && (
                <tr>
                  <td colSpan="5" className="blog-table-empty">
                    {t("cms.blog.no_tags")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="blog-divider"></div>

      {/* ==================== POSTS ==================== */}
      <div className="blog-form-card">
        <div className="blog-form-header">
          <h2>
            {editPost
              ? t("cms.blog.actions.update_post")
              : t("cms.blog.actions.create_post")}
          </h2>
        </div>

        <div className="blog-form-section">
          <h4 className="blog-section-title">{t("cms.blog.post_info")}</h4>
          <div className="blog-form-grid">
            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.title_ar")}
              </label>
              <input
                className="blog-input"
                name="title_ar"
                placeholder={t("cms.blog.fields.title_ar_placeholder")}
                value={postForm.title_ar}
                onChange={handlePostChange}
              />
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.title_en")}
              </label>
              <input
                className="blog-input"
                name="title_en"
                placeholder={t("cms.blog.fields.title_en_placeholder")}
                value={postForm.title_en}
                onChange={handlePostChange}
              />
            </div>

            <div className="blog-form-group full-width">
              <label className="blog-label">
                {t("cms.blog.fields.content_ar")}
              </label>
              <textarea
                className="blog-textarea"
                name="content_ar"
                placeholder={t("cms.blog.fields.content_ar_placeholder")}
                value={postForm.content_ar}
                onChange={handlePostChange}
              />
            </div>

            <div className="blog-form-group full-width">
              <label className="blog-label">
                {t("cms.blog.fields.content_en")}
              </label>
              <textarea
                className="blog-textarea"
                name="content_en"
                placeholder={t("cms.blog.fields.content_en_placeholder")}
                value={postForm.content_en}
                onChange={handlePostChange}
              />
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.select_category")}
              </label>
              <select
                className="blog-select"
                name="category"
                value={postForm.category}
                onChange={handlePostChange}
              >
                <option value="">
                  {t("cms.blog.fields.select_category")}
                </option>
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.cover_image")}
              </label>
              <input
                className="blog-input-file"
                type="file"
                name="cover_image"
                onChange={handlePostChange}
              />
            </div>

            <div className="blog-form-group">
              <label className="blog-label">
                {t("cms.blog.fields.internal_image")}
              </label>
              <input
                className="blog-input-file"
                type="file"
                name="image"
                onChange={handlePostChange}
              />
            </div>

            <div className="blog-form-group full-width">
              <label className="blog-label">{t("cms.blog.fields.tags")}</label>
              <div className="blog-tags-selector">
                {tags.map((tItem) => (
                  <label
                    key={tItem.id}
                    className={`blog-tag-checkbox ${
                      postForm.tags.includes(tItem.id) ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={postForm.tags.includes(tItem.id)}
                      onChange={() => toggleTag(tItem.id)}
                    />
                    <span className="blog-tag-label">{tItem.name_ar}</span>
                  </label>
                ))}
                {tags.length === 0 && (
                  <span style={{ color: "#666666", fontSize: "13px" }}>
                    {t("cms.blog.no_tags_available")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="blog-form-actions">
          <button className="blog-btn-primary" onClick={savePost}>
            {editPost
              ? t("cms.blog.actions.update_post")
              : t("cms.blog.actions.create_post")}
          </button>
          {editPost && (
            <button
              className="blog-btn-cancel"
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
                });
              }}
            >
              {t("cms.blog.actions.cancel")}
            </button>
          )}
        </div>
      </div>

      {/* ==================== POSTS LIST ==================== */}
      <div className="blog-list-card">
        <h2 className="blog-list-title">{t("cms.blog.posts_list")}</h2>
        <div className="blog-table-wrapper">
          <table className="blog-table">
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
                  <td className="blog-table-id">{p.id}</td>
                  <td className="blog-table-title">{p.title_ar}</td>
                  <td className="blog-table-category">
                    {p.category_data?.name_ar || "—"}
                  </td>
                  <td>
                    {p.cover_image && (
                      <img
                        className="blog-cover-image"
                        src={p.cover_image}
                        alt={p.title_ar}
                      />
                    )}
                  </td>
                  <td>
                    <div className="blog-table-actions">
                      <button
                        className="blog-btn-edit"
                        onClick={() => loadPostIntoForm(p)}
                      >
                        {t("cms.blog.actions.edit")}
                      </button>
                      <button
                        className="blog-btn-delete"
                        onClick={() => {
                          if (
                            window.confirm(t("cms.blog.confirm_delete_post"))
                          )
                            deletePost(p.id);
                        }}
                      >
                        {t("cms.blog.actions.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="5" className="blog-table-empty">
                    {t("cms.blog.no_posts")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}