import api from "../../services/axios";
import { displayUsername } from "../../utils/displayUsername";

const PASSWORDS_PATH = "/passwords";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const unwrapItem = (data) => {
  if (!data) return null;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
};

export const mapPasswordFromApi = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    displayId: p.id != null ? `PWD-${String(p.id).padStart(3, "0")}` : "",
    numericId: p.id,
    systemName: p.systemName || p.server || "",
    server: p.systemName || p.server || "",
    username: p.username || "",
    password: p.password || "",
    description: p.description || p.hostname || "",
    hostname: p.description || p.hostname || "",
    active: p.active !== false,
    createdAt: p.createdAt || "",
    updatedAt: p.updatedAt || "",
    createdBy: displayUsername(
      p.createdByUsername,
      p.createdBy,
      p.updatedBy
    ),
    updatedBy: displayUsername(p.updatedByUsername, p.updatedBy, p.createdBy),
  };
};

const mapPasswordWrite = (payload = {}) => ({
  systemName: payload.systemName || payload.server || "",
  username: payload.username || "",
  password: payload.password || "",
  description: payload.description || payload.hostname || "",
});

export const getPasswords = async (activeOnly = false) => {
  const res = await api.get(activeOnly ? `${PASSWORDS_PATH}/active` : PASSWORDS_PATH);
  return unwrapList(res.data).map(mapPasswordFromApi);
};

export const getPasswordsBySystem = async (systemName) => {
  const res = await api.get(`${PASSWORDS_PATH}/system/${encodeURIComponent(systemName)}`);
  return unwrapList(res.data).map(mapPasswordFromApi);
};

export const getPasswordById = async (id) => {
  const res = await api.get(`${PASSWORDS_PATH}/${id}`);
  return mapPasswordFromApi(unwrapItem(res.data));
};

export const decryptPassword = async (id) => {
  const res = await api.get(`${PASSWORDS_PATH}/${id}/decrypt`);
  const data = unwrapItem(res.data);
  if (typeof data === "string") {
    return data;
  }
  return data?.password || data?.decryptedPassword || "";
};

export const createPassword = async (payload) => {
  const res = await api.post(PASSWORDS_PATH, mapPasswordWrite(payload));
  return mapPasswordFromApi(unwrapItem(res.data));
};

export const updatePassword = async (id, payload) => {
  const res = await api.put(`${PASSWORDS_PATH}/${id}`, mapPasswordWrite(payload));
  return mapPasswordFromApi(unwrapItem(res.data));
};

export const deletePassword = async (id) => {
  await api.delete(`${PASSWORDS_PATH}/${id}`);
};

export const permanentlyDeletePassword = async (id) => {
  await api.delete(`${PASSWORDS_PATH}/${id}/permanent`);
};

export const getPasswordHistory = async (id) => {
  const res = await api.get(`${PASSWORDS_PATH}/${id}/history`);
  return unwrapList(res.data).map((row) => ({
    ...row,
    createdBy: displayUsername(
      row.createdByUsername,
      row.createdBy,
      row.changedBy,
      row.updatedBy
    ),
    updatedBy: displayUsername(
      row.updatedByUsername,
      row.updatedBy,
      row.changedBy,
      row.createdBy
    ),
  }));
};

export const decryptHistoricalPassword = async (passwordId, historyId) => {
  const res = await api.get(
    `${PASSWORDS_PATH}/${passwordId}/history/${historyId}/decrypt`
  );
  const data = unwrapItem(res.data);
  if (typeof data === "string") {
    return data;
  }
  return data?.password || data?.decryptedPassword || "";
};
