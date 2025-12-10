import React, { useEffect, useState } from "react";
import { useBlogStore } from "../../store/useBlogStore";
import toast from "react-hot-toast";

export default function Blog_Manage() {
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

  /* ======================================================
     CATEGORY STATES
  ====================================================== */
  const [catForm, setCatForm] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
  });
  const [editingCat, setEditingCat] = useState(null);

  /* ======================================================
     TAG STATES
  ====================================================== */
  const [tagForm, setTagForm] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
  });
  const [editingTag, setEditingTag] = useState(null);

  /* ======================================================
     POST STATES
  ====================================================== */
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

  /* ======================================================
     LOAD DATA
  ====================================================== */
  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchPosts();
  }, []);

  /* ======================================================
     CATEGORY HANDLERS
  ====================================================== */
  const saveCategory = async () => {
    if (!catForm.name_ar.trim())
      return toast.error("Category AR is required");

    let payload = {
      name_ar: catForm.name_ar,
      name_en: catForm.name_en,
    };

    if (catForm.slug.trim()) payload.slug = catForm.slug;

    let result = editingCat
      ? await updateCategory(editingCat.id, payload)
      : await createCategory(payload);

    if (result.success) toast.success("Category saved successfully");
    else toast.error("Error while saving");

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
  };

  /* ======================================================
     TAG HANDLERS
  ====================================================== */
  const saveTag = async () => {
    if (!tagForm.name_ar.trim()) return toast.error("Tag AR is required");

    let payload = {
      name_ar: tagForm.name_ar,
      name_en: tagForm.name_en,
    };

    if (tagForm.slug.trim()) payload.slug = tagForm.slug;

    let result = editingTag
      ? await updateTag(editingTag.id, payload)
      : await createTag(payload);

    if (result.success) toast.success("Tag saved successfully");
    else toast.error("Error saving tag");

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
  };

  /* ======================================================
     POST FORM HANDLERS
  ====================================================== */
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
  };

  /* ======================================================
     SAVE POST (CREATE / UPDATE)
  ====================================================== */
  const savePost = async () => {
    const fd = new FormData();

    Object.entries(postForm).forEach(([key, value]) => {
      if (key === "tags") {
        value.forEach((tagId) => fd.append("tag_ids", tagId));
      } else if (value) {
        fd.append(key, value);
      }
    });

    // 🔥 Force publish every post
    fd.append("status", "published");

    let result;

    if (editPost) {
      result = await updatePost(editPost.id, fd);
      if (result.success) toast.success("Post updated successfully");
      else toast.error("Error updating post");
    } else {
      result = await createPost(fd);
      if (result.success) toast.success("Post created successfully");
      else toast.error("Error creating post");
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

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div style={{ padding: 20 }}>
      <h1>Blog Management</h1>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <h2>Categories</h2>

      <input
        placeholder="Category AR"
        value={catForm.name_ar}
        onChange={(e) =>
          setCatForm({ ...catForm, name_ar: e.target.value })
        }
      />
      <input
        placeholder="Category EN"
        value={catForm.name_en}
        onChange={(e) =>
          setCatForm({ ...catForm, name_en: e.target.value })
        }
      />
      <input
        placeholder="Slug (optional)"
        value={catForm.slug}
        onChange={(e) =>
          setCatForm({ ...catForm, slug: e.target.value })
        }
      />

      <button onClick={saveCategory}>
        {editingCat ? "Update Category" : "Create Category"}
      </button>

      <table border={1} width="100%" cellPadding={10} style={{ marginTop: 10 }}>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.name_ar}</td>
              <td>{c.name_en}</td>
              <td>{c.slug}</td>
              <td>
                <button onClick={() => editCategoryHandler(c)}>Edit</button>
                <button onClick={() => deleteCategory(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* =====================================================
          TAGS
      ===================================================== */}
      <h2>Tags</h2>

      <input
        placeholder="Tag AR"
        value={tagForm.name_ar}
        onChange={(e) =>
          setTagForm({ ...tagForm, name_ar: e.target.value })
        }
      />
      <input
        placeholder="Tag EN"
        value={tagForm.name_en}
        onChange={(e) =>
          setTagForm({ ...tagForm, name_en: e.target.value })
        }
      />
      <input
        placeholder="Slug (optional)"
        value={tagForm.slug}
        onChange={(e) =>
          setTagForm({ ...tagForm, slug: e.target.value })
        }
      />

      <button onClick={saveTag}>
        {editingTag ? "Update Tag" : "Create Tag"}
      </button>

      <table border={1} width="100%" cellPadding={10} style={{ marginTop: 10 }}>
        <tbody>
          {tags.map((t) => (
            <tr key={t.id}>
              <td>{t.name_ar}</td>
              <td>{t.name_en}</td>
              <td>{t.slug}</td>
              <td>
                <button onClick={() => editTagHandler(t)}>Edit</button>
                <button onClick={() => deleteTag(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* =====================================================
          POSTS
      ===================================================== */}
      <h2>Blog Posts</h2>

      <input
        placeholder="Title AR"
        name="title_ar"
        value={postForm.title_ar}
        onChange={handlePostChange}
      />

      <input
        placeholder="Title EN"
        name="title_en"
        value={postForm.title_en}
        onChange={handlePostChange}
      />

      <textarea
        placeholder="Content AR"
        name="content_ar"
        value={postForm.content_ar}
        onChange={handlePostChange}
      />

      <textarea
        placeholder="Content EN"
        name="content_en"
        value={postForm.content_en}
        onChange={handlePostChange}
      />

      {/* Category */}
      <select
        name="category"
        value={postForm.category}
        onChange={handlePostChange}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option value={c.id} key={c.id}>
            {c.name_ar}
          </option>
        ))}
      </select>

      {/* Tags */}
      <div style={{ marginTop: 10 }}>
        {tags.map((t) => (
          <label key={t.id} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={postForm.tags.includes(t.id)}
              onChange={() => toggleTag(t.id)}
            />
            {t.name_ar}
          </label>
        ))}
      </div>

      {/* Cover Image */}
      <p style={{ marginTop: 10 }}>Cover Image:</p>
      <input type="file" name="cover_image" onChange={handlePostChange} />

      {/* Article Image */}
      <p>Internal Image:</p>
      <input type="file" name="image" onChange={handlePostChange} />

      <button onClick={savePost} style={{ marginTop: 10 }}>
        {editPost ? "Update Post" : "Create Post"}
      </button>

      {/* TABLE */}
      <table border={1} width="100%" cellPadding={10} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title AR</th>
            <th>Category</th>
            <th>Cover</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title_ar}</td>
              <td>{p.category_data?.name_ar}</td>
              <td>
                {p.cover_image && (
                  <img src={p.cover_image} width="80" alt="" />
                )}
              </td>
              <td>
                <button onClick={() => loadPostIntoForm(p)}>Edit</button>
                <button
                  onClick={() =>
                    window.confirm("Delete this post?") &&
                    deletePost(p.id)
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
