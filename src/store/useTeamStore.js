// src/store/useTeamStore.js
import { create } from "zustand";
import {
  adminTeamList,
  adminAddMember,
  adminUpdateMember,
  adminDeleteMember,
} from "../api/teamApi";

export const useTeamStore = create((set, get) => ({
  members: [],

  fetchMembers: async () => {
    const res = await adminTeamList();
    set({ members: res.data });
  },

  createMember: async (formData) => {
    try {
      await adminAddMember(formData);
      await get().fetchMembers();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  updateMember: async (id, formData) => {
    try {
      await adminUpdateMember(id, formData);
      await get().fetchMembers();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  deleteMember: async (id) => {
    try {
      await adminDeleteMember(id);
      await get().fetchMembers();
      return { success: true };
    } catch {
      return { success: false };
    }
  },
}));
