"use client";

import en from "@/locales/en/translation.json";
import vi from "@/locales/vi/translation.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Lấy ngôn ngữ từ localStorage nếu đang ở client, mặc định 'vi'
const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("lang") || "vi" : "vi";

const resources = {
  vi: { translation: vi },
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
