// src/api/blogApi.js
import api from "./axiosClient";
import { API_PATHS } from "./routes";

export const getBlogSettings = () => api.get(API_PATHS.blog.publicSettings);
export const updateBlogSettings = (data) =>
  api.patch(API_PATHS.blog.adminSettings, data);

// ================================
// Categories
// ================================
export const getCategories = () => api.get(API_PATHS.blog.categories);
export const createCategory = (data) =>
  api.post(API_PATHS.blog.categories, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategory = (id, data) =>
  api.patch(API_PATHS.blog.category(id), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteCategory = (id) =>
  api.delete(API_PATHS.blog.category(id));

// ================================
// Tags
// ================================
export const getTags = () => api.get(API_PATHS.blog.tags);
export const createTag = (data) => api.post(API_PATHS.blog.tags, data);
export const updateTag = (id, data) =>
  api.patch(API_PATHS.blog.tag(id), data);
export const deleteTag = (id) => api.delete(API_PATHS.blog.tag(id));

// ================================
// Blog Posts
// ================================
export const getPosts = () =>
  api.get(API_PATHS.blog.posts);

export const createPost = (formData) =>
  api.post(API_PATHS.blog.posts, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updatePost = (id, formData) =>
  api.patch(API_PATHS.blog.post(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePost = (id) =>
  api.delete(API_PATHS.blog.post(id));
