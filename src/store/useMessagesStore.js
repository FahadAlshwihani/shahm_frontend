import { create } from "zustand";
import {
  adminGetMessages,
  adminGetSingleMessage,
  adminUpdateMessage,
  adminGetSubscribers,
  adminBroadcast,
} from "../api/messagesApi";

export const useMessagesStore = create((set) => ({
  messages: [],
  subscribers: [],
  selectedMessage: null,

  // تحميل جميع الرسائل
  loadMessages: async () => {
    const res = await adminGetMessages();
    set({ messages: res.data });
  },

  // تحميل مشتركين النشرة
  loadSubscribers: async () => {
    const res = await adminGetSubscribers();
    set({ subscribers: res.data });
  },

  // إرسال بريد جماعي
  sendBroadcast: async (data) => {
    const res = await adminBroadcast(data);
    return res.data;
  },

  // تحميل رسالة واحدة
  loadSingle: async (id) => {
    const res = await adminGetSingleMessage(id);
    set({ selectedMessage: res.data });
  },

  // تحديث الرسالة
  updateMessage: async (id, data) => {
    const res = await adminUpdateMessage(id, data);
    return res.data;
  },
}));
