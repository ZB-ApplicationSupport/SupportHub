import api from "../../services/axios";

const LOKI_PATH = "/loki/data-sources";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

export const getLokiDataSources = async () => {
  const res = await api.get(LOKI_PATH);
  return unwrapList(res.data);
};

export const queryLoki = async (
  dataSourceId,
  query,
  { start = "now-1h", end = "now", limit = 1000, direction = "backward" } = {}
) => {
  const res = await api.get(`${LOKI_PATH}/${dataSourceId}/query`, {
    params: { query, start, end, limit, direction },
  });
  return res.data;
};

export const getLokiLabelValues = async (dataSourceId, label, query) => {
  const res = await api.get(
    `${LOKI_PATH}/${dataSourceId}/labels/${encodeURIComponent(label)}/values`,
    { params: query ? { query } : undefined }
  );
  return unwrapList(res.data);
};
