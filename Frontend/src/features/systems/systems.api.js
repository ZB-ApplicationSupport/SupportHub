import api from "../../services/axios";
import { displayUsername } from "../../utils/displayUsername";

const SYSTEMS_PATH = "/case-tracker/systems";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.systems)) return data.systems;
  return [];
};

const unwrapItem = (data) => {
  if (!data) return null;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
};

export const mapSystemFromApi = (s) => {
  if (!s) return null;
  return {
    id: s.id != null ? `SYS-${String(s.id).padStart(3, "0")}` : "",
    numericId: s.id,
    name: s.name || "",
    description: s.description || "",
    status: s.status || "Active",
    addedAt: s.createdAt || s.addedAt || s.updatedAt || "",
    addedBy: displayUsername(
      s.addedBy,
      s.createdByUsername,
      s.createdBy,
      s.owner
    ),
  };
};

export const mapSystemToApi = (s) => ({
  name: s.name,
  description: s.description,
  status: s.status || "Active",
});

export const getSystems = async () => {
  const res = await api.get(SYSTEMS_PATH);
  return unwrapList(res.data).map(mapSystemFromApi);
};

export const getSystemById = async (id) => {
  const numId = typeof id === "string" && id.startsWith("SYS-") ? id.replace("SYS-", "") : id;
  const res = await api.get(`${SYSTEMS_PATH}/${numId}`);
  return mapSystemFromApi(unwrapItem(res.data));
};

export const createSystem = async (payload) => {
  const res = await api.post(SYSTEMS_PATH, mapSystemToApi(payload));
  return mapSystemFromApi(unwrapItem(res.data));
};

export const updateSystem = async (id, payload) => {
  const numId = typeof id === "string" && id.startsWith("SYS-") ? id.replace("SYS-", "") : id;
  const res = await api.put(`${SYSTEMS_PATH}/${numId}`, mapSystemToApi(payload));
  return mapSystemFromApi(unwrapItem(res.data));
};

export const deleteSystem = async (id) => {
  const numId = typeof id === "string" && id.startsWith("SYS-") ? id.replace("SYS-", "") : id;
  await api.delete(`${SYSTEMS_PATH}/${numId}`);
};
