// src/store/useUsersStore.js
import { create } from "zustand";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/authApi";

import toast from "react-hot-toast";

export const useUsersStore = create((set, get) => ({
  users: [],
  loading: false,

  // Fetch all users
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await getUsers();
      set({ users: res.data });
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      set({ loading: false });
    }
  },

  // Create user
  addUser: async (data) => {
    try {
      const res = await createUser(data);
      set({ users: [...get().users, res.data] });
      toast.success("User created");
      return true;
    } catch (err) {
      toast.error("Create failed");
      return false;
    }
  },

  // Update user
  editUser: async (id, data) => {
    try {
      const res = await updateUser(id, data);

      set({
        users: get().users.map((u) => (u.id === id ? res.data : u)),
      });

      toast.success("User updated");
      return true;
    } catch (err) {
      toast.error("Update failed");
      return false;
    }
  },

  // Delete user
  removeUser: async (id) => {
    try {
      await deleteUser(id);

      set({
        users: get().users.filter((u) => u.id !== id),
      });

      toast.success("User deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  },
}));
