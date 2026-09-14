import axios from "axios";
import { appConfig } from "../../config/appConfig";
import { AUTOMATION_STATS } from "./automations.data";

const opsApi = axios.create({
  baseURL: appConfig.opsReportBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

opsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

opsApi.interceptors.response.use((response) => {
  if (typeof response.data === "string") {
    const trimmed = response.data.trim();
    if (trimmed !== "" && Number.isFinite(Number(trimmed))) {
      response.data = Number(trimmed);
      return response;
    }
    return Promise.reject(new Error("Ops Report API is not available"));
  }
  return response;
});

const isoDate = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return isoDate(new Date());
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isoMonth = (value = new Date()) => isoDate(value).slice(0, 7);

export const defaultAutomationDates = (now = new Date()) => {
  const postingDate = isoDate(now);
  const startDate = `${isoMonth(now)}-01`;
  return {
    openDate: postingDate,
    postingDate,
    startDate,
    endDate: postingDate,
    dueMonth: isoMonth(now),
  };
};

export const AUTOMATION_SCRIPTS = AUTOMATION_STATS;

const paramsFromDates = (dateParams = [], dates = {}) => {
  if (!dateParams.length) return undefined;
  return Object.fromEntries(dateParams.map((key) => [key, dates[key]]));
};

export const unwrapRows = (data) => {
  if (Array.isArray(data)) return data;
  if (data == null || typeof data !== "object") return [];
  if (Array.isArray(data.rows)) return data.rows;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.records)) return data.records;
  const nested = Object.values(data).find((value) => Array.isArray(value));
  return Array.isArray(nested) ? nested : [];
};

const asNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
};

export const unwrapCount = (data) => {
  if (Array.isArray(data)) {
    throw new Error("Count APIs must return { count }, not an extract");
  }

  const scalar = asNumber(data);
  if (scalar != null) return scalar;

  if (data && typeof data === "object") {
    const value = asNumber(data.count ?? data.COUNT);
    if (value != null) return value;
  }

  throw new Error("Count API did not return a count");
};

const assertCountPath = (path) => {
  const value = String(path || "");
  if (!value.includes("/count") && !value.includes("/stats")) {
    throw new Error(`Stat counts must use a /count or /stats endpoint: ${path}`);
  }
};

const cacheKey = (path, params) => `${path}::${JSON.stringify(params || {})}`;
const countCache = new Map();
const extractCache = new Map();

export const getAutomationCount = async (path, params, { fresh = false } = {}) => {
  assertCountPath(path);
  const key = cacheKey(path, params);
  if (fresh) {
    countCache.delete(key);
  } else if (countCache.has(key)) {
    return countCache.get(key);
  }

  const request = opsApi
    .get(path, {
      params,
      headers: fresh
        ? { "Cache-Control": "no-cache", Pragma: "no-cache" }
        : undefined,
    })
    .then((res) => unwrapCount(res.data))
    .catch((error) => {
      countCache.delete(key);
      throw error;
    });

  countCache.set(key, request);
  return request;
};

export const getAutomationExtract = async (path, params) => {
  const value = String(path || "");
  if (value.includes("/count") || value.includes("/stats")) {
    throw new Error(`Extracts must not use a /count or /stats endpoint: ${path}`);
  }
  const key = cacheKey(path, params);
  if (extractCache.has(key)) return extractCache.get(key);
  const res = await opsApi.get(path, { params, timeout: 120000 });
  const rows = unwrapRows(res.data);
  extractCache.set(key, rows);
  return rows;
};

export const clearAutomationCache = () => {
  countCache.clear();
  extractCache.clear();
};

const fetchScriptCount = (script, dates, options = {}) =>
  getAutomationCount(
    script.countPath,
    paramsFromDates(script.dateParams, dates),
    options
  );

export const getAutomationClassificationCounts = async (
  classifications = [],
  dates = defaultAutomationDates(),
  options = {}
) => {
  const results = await Promise.allSettled(
    classifications.map((item) => fetchScriptCount(item, dates, options))
  );

  return classifications.map((item, index) => {
    const result = results[index];
    if (result.status !== "fulfilled") {
      return {
        ...item,
        count: null,
        unavailable: true,
      };
    }
    return {
      ...item,
      count: result.value,
      unavailable: false,
    };
  });
};

export const getAutomationStats = async (
  dates = defaultAutomationDates(),
  { fresh = false } = {}
) => {
  if (fresh) clearAutomationCache();

  const enabledStats = AUTOMATION_STATS.filter((script) => script.enabled);
  const countables = [];
  const seen = new Set();

  const addCountable = (item) => {
    if (!item?.countPath || seen.has(item.countPath)) return;
    seen.add(item.countPath);
    countables.push(item);
  };

  AUTOMATION_STATS.forEach((script) => {
    if (!script.enabled) return;
    addCountable(script);
  });

  const results = await Promise.allSettled(
    countables.map((item) => fetchScriptCount(item, dates, { fresh }))
  );

  const byPath = {};
  countables.forEach((item, index) => {
    const result = results[index];
    byPath[item.countPath] =
      result.status === "fulfilled"
        ? { count: result.value, unavailable: false }
        : { count: null, unavailable: true };
  });

  let loaded = 0;
  let failed = 0;

  const stats = AUTOMATION_STATS.map((script) => {
    const base = {
      id: script.id,
      label: script.label,
      hint: script.hint,
      component: script.component,
      acronym: script.acronym,
      group: script.group,
    };

    const classifications = (script.classifications || []).map((item) => {
      const result = byPath[item.countPath] || { count: null, unavailable: true };
      return {
        ...item,
        count: result.count,
        unavailable: result.unavailable,
      };
    });

    if (!script.enabled) {
      return {
        ...base,
        classifications,
        count: null,
        unavailable: true,
      };
    }

    const result = byPath[script.countPath] || { count: null, unavailable: true };
    if (result.unavailable) failed += 1;
    else loaded += 1;

    return {
      ...base,
      classifications,
      count: result.count,
      unavailable: result.unavailable,
    };
  });

  return {
    stats,
    loaded,
    failed,
    totalScripts: enabledStats.length,
    dates,
    fetchedAt: new Date().toISOString(),
    live: loaded > 0,
  };
};

export const getAutomationCatalogue = getAutomationStats;
