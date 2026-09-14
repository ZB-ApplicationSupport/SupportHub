import api from "../../services/axios";

const PROMETHEUS_PATH = "/prometheus/data-sources";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

export const getPrometheusDataSources = async () => {
  const res = await api.get(PROMETHEUS_PATH);
  return unwrapList(res.data);
};

export const queryPrometheusDataSource = async (
  dataSourceId,
  query,
  { start, end, step } = {}
) => {
  const res = await api.get(`${PROMETHEUS_PATH}/${dataSourceId}/query`, {
    params: {
      query,
      ...(start ? { start } : {}),
      ...(end ? { end } : {}),
      ...(step ? { step } : {}),
    },
  });
  return res.data;
};

export const getPrometheusLabelValues = async (dataSourceId, label, match) => {
  const res = await api.get(
    `${PROMETHEUS_PATH}/${dataSourceId}/labels/${encodeURIComponent(label)}/values`,
    { params: match ? { match } : undefined }
  );
  return unwrapList(res.data);
};
