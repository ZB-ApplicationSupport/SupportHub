import api from "../services/axios";

const AUDIT_PATH = "/audit-events";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.events)) return data.events;
  return [];
};

export const getAuditEvents = async () => {
  const res = await api.get(AUDIT_PATH);
  return unwrapList(res.data);
};
