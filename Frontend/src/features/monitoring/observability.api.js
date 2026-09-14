import api from "../../services/axios";

const OBS_PATH = "/observability";
const PREFERRED_PROMETHEUS_NAME = "fe prometheus";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const unwrapItem = (data) => {
  if (!data) return null;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
};

const toBoolean = (value, fallback = true) => {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  if (value === false || value === 0 || value === "0" || value === "false") {
    return false;
  }
  return fallback;
};

export const normalizeSourceUrl = (url) =>
  String(url || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api\/v1\/query_range$/i, "")
    .replace(/\/api\/v1\/query$/i, "");

const isActiveSource = (source) => source?.active !== false;

const isPrometheusSource = (source) => {
  const type = String(source?.type || "").trim().toLowerCase();
  if (type === "prometheus") {
    return true;
  }
  if (type) {
    return false;
  }

  const name = String(source?.name || "").toLowerCase();
  const url = String(source?.url || "").toLowerCase();
  return name.includes("prometheus") || url.includes("prometheus");
};

export const findMonitoringPrometheusSource = (sources = []) => {
  const list = (sources || []).filter(
    (source) =>
      isActiveSource(source) &&
      isPrometheusSource(source) &&
      normalizeSourceUrl(source.url)
  );

  if (!list.length) {
    return null;
  }

  return (
    list.find(
      (source) =>
        String(source.name || "").trim().toLowerCase() ===
        PREFERRED_PROMETHEUS_NAME
    ) || list[0]
  );
};

export const DIRECT_PROMETHEUS_PATH = "/prometheus";

const fallbackPrometheusSource = () => ({
  id: null,
  name: "Prometheus",
  url: DIRECT_PROMETHEUS_PATH,
  type: "prometheus",
  active: true,
});

let cachedMonitoringSource = null;
let monitoringSourceInflight = null;

export const resolveMonitoringPrometheusSource = async ({
  force = false,
} = {}) => {
  if (!force && cachedMonitoringSource) {
    return cachedMonitoringSource;
  }
  if (!force && monitoringSourceInflight) {
    return monitoringSourceInflight;
  }

  monitoringSourceInflight = (async () => {
    try {
      const sources = await getDataSources({ skipAuthRedirect: true });
      const source = findMonitoringPrometheusSource(sources);
      if (source?.id && normalizeSourceUrl(source.url)) {
        cachedMonitoringSource = source;
        return source;
      }
    } catch (error) {
      // BSS observability can 401 while Case Tracker/Keycloak is still valid.
    }

    cachedMonitoringSource = fallbackPrometheusSource();
    return cachedMonitoringSource;
  })();

  try {
    return await monitoringSourceInflight;
  } finally {
    monitoringSourceInflight = null;
  }
};

export const mapDataSourceFromApi = (source) => {
  if (!source) return null;

  const apiKey = source.apiKey ?? source.api_key ?? "";

  return {
    id: source.id,
    name: source.name || "",
    url: source.url || "",
    type: source.type || "",
    active: toBoolean(source.active, true),
    hasApiKey: Boolean(apiKey),
    createdAt: source.createdAt || source.created_at || "",
    updatedAt: source.updatedAt || source.updated_at || "",
  };
};

export const mapDataSourceWrite = (payload = {}, { includeApiKey = true } = {}) => {
  const body = {
    name: String(payload.name || "").trim().slice(0, 100),
    url: String(payload.url || "").trim().slice(0, 500),
    type: String(payload.type || "").trim().slice(0, 50) || null,
    active: toBoolean(payload.active, true),
  };

  if (includeApiKey) {
    const apiKey = String(payload.apiKey || payload.api_key || "").trim();
    if (apiKey) {
      body.apiKey = apiKey.slice(0, 500);
    }
  }

  return body;
};

export const getDataSources = async ({
  type,
  activeOnly,
  skipAuthRedirect = false,
} = {}) => {
  const res = await api.get(`${OBS_PATH}/data-sources`, {
    params: {
      ...(type ? { type } : {}),
      ...(activeOnly == null ? {} : { activeOnly }),
    },
    skipAuthRedirect,
  });
  return unwrapList(res.data).map(mapDataSourceFromApi).filter(Boolean);
};

export const getPrometheusDataSources = (options = {}) =>
  getDataSources({ ...options, type: "prometheus", activeOnly: true });

export const createDataSource = async (payload) => {
  const res = await api.post(
    `${OBS_PATH}/data-sources`,
    mapDataSourceWrite(payload)
  );
  return mapDataSourceFromApi(unwrapItem(res.data));
};

export const updateDataSource = async (id, payload) => {
  const apiKey = String(payload.apiKey || payload.api_key || "").trim();
  const res = await api.put(
    `${OBS_PATH}/data-sources/${id}`,
    mapDataSourceWrite(payload, { includeApiKey: Boolean(apiKey) })
  );
  return mapDataSourceFromApi(unwrapItem(res.data));
};

export const deleteDataSource = async (id) => {
  await api.delete(`${OBS_PATH}/data-sources/${id}`);
};

export const refreshDataSourceLabels = async (id) => {
  const res = await api.post(`${OBS_PATH}/data-sources/${id}/refresh-labels`);
  return unwrapItem(res.data);
};

export const importGrafanaDataSources = async () => {
  const res = await api.post(`${OBS_PATH}/data-sources/import-grafana`);
  return unwrapList(res.data).map(mapDataSourceFromApi).filter(Boolean);
};

export const queryDataSource = async (
  id,
  query,
  timeRange = "1h",
  { skipAuthRedirect = false } = {}
) => {
  const res = await api.get(`${OBS_PATH}/data-sources/${id}/query`, {
    params: { query, timeRange },
    skipAuthRedirect,
  });
  return res.data;
};

export const getThresholds = async () => {
  const res = await api.get(`${OBS_PATH}/thresholds`);
  return unwrapList(res.data);
};

export const createThreshold = async (payload) => {
  const res = await api.post(`${OBS_PATH}/thresholds`, payload);
  return unwrapItem(res.data);
};

export const updateThreshold = async (id, payload) => {
  const res = await api.put(`${OBS_PATH}/thresholds/${id}`, payload);
  return unwrapItem(res.data);
};

export const deleteThreshold = async (id) => {
  await api.delete(`${OBS_PATH}/thresholds/${id}`);
};

export const checkThresholds = async () => {
  const res = await api.post(`${OBS_PATH}/thresholds/check`);
  return res.data;
};

export const getContactPoints = async () => {
  const res = await api.get(`${OBS_PATH}/contact-points`);
  return unwrapList(res.data);
};

export const createContactPoint = async (payload) => {
  const res = await api.post(`${OBS_PATH}/contact-points`, payload);
  return unwrapItem(res.data);
};

export const updateContactPoint = async (id, payload) => {
  const res = await api.put(`${OBS_PATH}/contact-points/${id}`, payload);
  return unwrapItem(res.data);
};

export const deleteContactPoint = async (id) => {
  await api.delete(`${OBS_PATH}/contact-points/${id}`);
};

export const getNotifications = async ({ skipAuthRedirect = false } = {}) => {
  const res = await api.get(`${OBS_PATH}/notifications`, { skipAuthRedirect });
  return unwrapList(res.data);
};

export const getUnacknowledgedNotifications = async ({
  skipAuthRedirect = false,
} = {}) => {
  const res = await api.get(`${OBS_PATH}/notifications/unacknowledged`, {
    skipAuthRedirect,
  });
  return unwrapList(res.data);
};

export const acknowledgeNotification = async (
  id,
  { skipAuthRedirect = false } = {}
) => {
  const res = await api.patch(
    `${OBS_PATH}/notifications/${id}/acknowledge`,
    {},
    { skipAuthRedirect }
  );
  return unwrapItem(res.data);
};
