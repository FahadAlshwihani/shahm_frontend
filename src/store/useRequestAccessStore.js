import { create } from "zustand";

export const useRequestAccessStore =
  create((set) => ({
    accessToken: null,
    snapshot: null,

    setAccessToken: (token) =>
      set({
        accessToken: token,
      }),

    setSnapshot: (snapshot) =>
      set({
        snapshot,
      }),

    reset: () =>
      set({
        accessToken: null,
        snapshot: null,
      }),
  }));