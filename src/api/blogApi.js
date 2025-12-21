// src/api/blogApi.js
import api from "./axiosClient";

// ================================
// Categories
// ================================
export const getCategories = () => api.get("blog/admin/categories/");
export const createCategory = (data) => api.post("blog/admin/categories/", data);
export const updateCategory = (id, data) =>
  api.patch(`blog/admin/categories/${id}/`, data);
export const deleteCategory = (id) =>
  api.delete(`blog/admin/categories/${id}/`);

// ================================
// Tags
// ================================
export const getTags = () => api.get("blog/admin/tags/");
export const createTag = (data) => api.post("blog/admin/tags/", data);
export const updateTag = (id, data) =>
  api.patch(`blog/admin/tags/${id}/`, data);
export const deleteTag = (id) => api.delete(`blog/admin/tags/${id}/`);

// ================================
// Blog Posts
// ================================
export const getPosts = () => api.get("blog/admin/posts/");

export const createPost = (formData) =>
  api.post("blog/admin/posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updatePost = (id, formData) =>
  api.patch(`blog/admin/posts/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePost = (id) =>
  api.delete(`blog/admin/posts/${id}/`);

