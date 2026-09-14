import api from "../../services/axios";
import { normalizeLink } from "./links.data";

const QUICK_LINKS_PATH = "/quick-links";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.links)) return data.links;
  return [];
};

const unwrapItem = (data) => {
  if (!data) return null;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
};

const mapQuickLinkWrite = (payload = {}) => ({
  title: payload.title || payload.name || "",
  name: payload.name || payload.title || "",
  url: payload.url || payload.href || "",
  href: payload.href || payload.url || "",
  short: payload.short || "",
  logo: payload.logo || "",
});

const toQuickLinkFormData = (payload = {}, logoFile) => {
  const formData = new FormData();
  Object.entries(mapQuickLinkWrite(payload)).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });
  if (logoFile) {
    formData.append("logo", logoFile, logoFile.name);
  }
  return formData;
};

export const getQuickLinkLogoUrl = (id) =>
  `${api.defaults.baseURL}${QUICK_LINKS_PATH}/${id}/logo`;

export const getQuickLinks = async () => {
  const res = await api.get(QUICK_LINKS_PATH);
  return unwrapList(res.data).map((item, index) => ({
    ...normalizeLink(item, index),
    logoUrl: item.logoUrl || item.logoURL || item.iconUrl || getQuickLinkLogoUrl(item.id),
  }));
};

export const getQuickLinkById = async (id) => {
  const res = await api.get(`${QUICK_LINKS_PATH}/${id}`);
  const data = unwrapItem(res.data);
  return data ? normalizeLink(data) : null;
};

export const createQuickLink = async (payload, logoFile) => {
  const res = await api.post(
    QUICK_LINKS_PATH,
    logoFile ? toQuickLinkFormData(payload, logoFile) : mapQuickLinkWrite(payload)
  );
  return normalizeLink(unwrapItem(res.data));
};

export const updateQuickLink = async (id, payload, logoFile) => {
  const res = await api.put(
    `${QUICK_LINKS_PATH}/${id}`,
    logoFile ? toQuickLinkFormData(payload, logoFile) : mapQuickLinkWrite(payload)
  );
  return normalizeLink(unwrapItem(res.data));
};

export const deleteQuickLink = async (id) => {
  await api.delete(`${QUICK_LINKS_PATH}/${id}`);
};
