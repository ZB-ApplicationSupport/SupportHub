import api from "./axios";

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toISOString().slice(0, 10);
};

export const mapSystemFromApi = (s) => {
  if (!s) return null;
  return {
    id: s.id != null ? `SYS-${String(s.id).padStart(3, "0")}` : "",
    numericId: s.id,
    name: s.name || "",
    category: s.category || "",
    owner: s.owner || "",
    status: s.status || "Active",
    updatedAt: formatDate(s.updatedAt),
  };
};

export const mapSystemToApi = (s) => ({
  name: s.name,
  category: s.category,
  owner: s.owner,
  status: s.status || "Active",
});

export const getSystems = async () => {
  const res = await api.get("/systems");
  return (res.data || []).map(mapSystemFromApi);
};

export const getSystemById = async (id) => {
  const numId = typeof id === "string" && id.startsWith("SYS-") ? id.replace("SYS-", "") : id;
  const res = await api.get(`/systems/${numId}`);
  return mapSystemFromApi(res.data);
};

export const createSystem = async (payload) => {
  const res = await api.post("/systems", mapSystemToApi(payload));
  return mapSystemFromApi(res.data);
};

export const updateSystem = async (id, payload) => {
  const numId = typeof id === "string" && id.startsWith("SYS-") ? id.replace("SYS-", "") : id;
  const res = await api.put(`/systems/${numId}`, mapSystemToApi(payload));
  return mapSystemFromApi(res.data);
};

export const deleteSystem = async (id) => {
  const numId = typeof id === "string" && id.startsWith("SYS-") ? id.replace("SYS-", "") : id;
  await api.delete(`/systems/${numId}`);
};
