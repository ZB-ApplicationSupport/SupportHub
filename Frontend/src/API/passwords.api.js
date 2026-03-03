import api from "./axios";

const formatDateTime = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const mapPasswordFromApi = (p) => {
  if (!p) return null;
  return {
    id: p.id != null ? `PWD-${String(p.id).padStart(3, "0")}` : "",
    numericId: p.id,
    server: p.server || "",
    username: p.username || "",
    password: p.password || "",
    hostname: p.hostname || "",
    createdAt: formatDateTime(p.createdAt),
    updatedAt: formatDateTime(p.updatedAt),
    createdBy: p.createdBy || "",
    updatedBy: p.updatedBy || "",
  };
};

export const getPasswords = async () => {
  const res = await api.get("/passwords");
  return (res.data || []).map(mapPasswordFromApi);
};

export const createPassword = async (payload) => {
  const body = {
    server: payload.server,
    username: payload.username,
    password: payload.password,
    hostname: payload.hostname,
    createdBy: payload.createdBy,
    updatedBy: payload.updatedBy || payload.createdBy,
  };
  const res = await api.post("/passwords", body);
  return mapPasswordFromApi(res.data);
};

export const updatePassword = async (id, payload) => {
  const numId = typeof id === "string" && id.startsWith("PWD-") ? id.replace("PWD-", "") : id;
  const res = await api.put(`/passwords/${numId}`, {
    server: payload.server,
    username: payload.username,
    password: payload.password,
    hostname: payload.hostname,
    updatedBy: payload.updatedBy,
  });
  return mapPasswordFromApi(res.data);
};

export const deletePassword = async (id) => {
  const numId = typeof id === "string" && id.startsWith("PWD-") ? id.replace("PWD-", "") : id;
  await api.delete(`/passwords/${numId}`);
};
