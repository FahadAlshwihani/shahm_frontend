import { create } from "zustand";
import {
  getCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,

  getTags,
  createTag as apiCreateTag,
  updateTag as apiUpdateTag,
  deleteTag as apiDeleteTag,

  getPosts,
  createPost as apiCreatePost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost
} from "../api/blogApi";

export const useBlogStore = create((set, get) => ({

  // ==========================
  // CATEGORIES
  // ==========================
  categories: [],

  fetchCategories: async () => {
    const res = await getCategories();
    set({ categories: res.data });
  },

  createCategory: async (data) => {
    try {
      await apiCreateCategory(data);
      await get().fetchCategories();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  updateCategory: async (id, data) => {
    try {
      await apiUpdateCategory(id, data);
      await get().fetchCategories();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  deleteCategory: async (id) => {
    try {
      await apiDeleteCategory(id);
      await get().fetchCategories();
      return { success: true };
    } catch {
      return { success: false };
    }
  },


  // ==========================
  // TAGS
  // ==========================
  tags: [],

  fetchTags: async () => {
    const res = await getTags();
    set({ tags: res.data });
  },

  createTag: async (data) => {
    try {
      await apiCreateTag(data);
      await get().fetchTags();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  updateTag: async (id, data) => {
    try {
      await apiUpdateTag(id, data);
      await get().fetchTags();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  deleteTag: async (id) => {
    try {
      await apiDeleteTag(id);
      await get().fetchTags();
      return { success: true };
    } catch {
      return { success: false };
    }
  },


  // ==========================
  // POSTS
  // ==========================
  posts: [],

  fetchPosts: async () => {
    const res = await getPosts();
    set({ posts: res.data });
  },

  createPost: async (formData) => {
    try {
      await apiCreatePost(formData);
      await get().fetchPosts();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  updatePost: async (id, formData) => {
    try {
      await apiUpdatePost(id, formData);
      await get().fetchPosts();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  deletePost: async (id) => {
    try {
      await apiDeletePost(id);
      await get().fetchPosts();
      return { success: true };
    } catch {
      return { success: false };
    }
  }

}));
