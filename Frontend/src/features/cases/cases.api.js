import api from "../../services/axios";
import { displayUsername } from "../../utils/displayUsername";

const JOBS_PATH = "/case-tracker/jobs";

const statusToDisplay = (s) => {
  const key = String(s || "").toUpperCase();
  if (["CLOSED", "CLOSE", "RESOLVED"].includes(key)) {
    return "Closed";
  }
  return "Open";
};

const priorityToDisplay = (p) => {
  if (!p) return "Medium";

  const map = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
  };

  const key = String(p).toUpperCase();
  return map[key] || p;
};

const priorityToApi = (p) =>
  String(p || "MEDIUM")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  return [];
};

const unwrapItem = (data) => {
  if (!data) return null;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
};

const jobId = (id) => {
  if (id == null) return id;
  const raw = String(id);
  return raw.startsWith("CT-") ? raw.replace("CT-", "") : raw;
};

const assigneeName = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    return value.username || value.name || value.email || "";
  }
  return String(value);
};

export const mapCaseFromApi = (c) => {
  if (!c) return null;

  const openedAt = c.createdAt || c.openedAt || "";
  const status = statusToDisplay(c.status);
  const assignedTo = assigneeName(c.assignedTo) || "Unassigned";
  const sourceSystem = c.sourceSystem || "";

  return {
    id: c.id != null ? String(c.id) : "",
    caseId: c.reference || c.caseId || c.id,
    reference: c.reference || "",
    supportSystemId:
      c.supportSystemId != null ? Number(c.supportSystemId) : null,
    system: sourceSystem || "Unspecified",
    sourceSystem,
    assignedToId: c.assignedToId != null ? Number(c.assignedToId) : null,
    assignedTo,
    status,
    priority: priorityToDisplay(c.priority),
    openedAt,
    summary: c.title || c.summary || "",
    title: c.title || c.summary || "",
    description: c.description || "",
    createdAt: c.createdAt,
    lastUpdatedAt: c.lastUpdatedAt || c.updatedAt,
    createdByEmail: displayUsername(c.createdByEmail),
    createdBy: displayUsername(
      c.createdByUsername,
      c.createdByName,
      c.createdByUser,
      c.createdBy,
      c.openedBy,
      c.createdByEmail
    ),
    closedAt: c.closedAt || "",
    closed: status === "Closed",
  };
};

const mapJobWrite = (c = {}) => ({
  title: c.title || c.summary || "",
  description: c.description || "",
  priority: priorityToApi(c.priority),
});

export const getCases = async (filters = {}) => {
  const res = await api.get(JOBS_PATH, {
    params: Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value != null && value !== "")
    ),
  });
  return unwrapList(res.data).map(mapCaseFromApi);
};

export const getOpenCases = async () => {
  const res = await api.get(`${JOBS_PATH}/open`);
  return unwrapList(res.data).map(mapCaseFromApi);
};

export const getCaseById = async (id) => {
  const res = await api.get(`${JOBS_PATH}/${jobId(id)}`);
  return mapCaseFromApi(unwrapItem(res.data));
};

export const createCase = async (payload) => {
  const body = {
    ...mapJobWrite(payload),
  };

  const assignedTo = assigneeName(payload.assignedTo);
  if (assignedTo) {
    body.assignedTo = assignedTo;
  }

  const res = await api.post(JOBS_PATH, body);
  return mapCaseFromApi(unwrapItem(res.data));
};

export const assignCase = async (id, assignedTo) => {
  const username = assigneeName(assignedTo);
  if (!username) {
    return null;
  }

  const res = await api.patch(
    `${JOBS_PATH}/${jobId(id)}/assign`,
    null,
    { params: { assignedTo: username } }
  );
  return mapCaseFromApi(unwrapItem(res.data));
};

export const closeCase = async (id) => {
  const res = await api.patch(`${JOBS_PATH}/${jobId(id)}/close`);
  return mapCaseFromApi(unwrapItem(res.data));
};

export const deleteCase = async (id) => {
  await api.delete(`${JOBS_PATH}/${jobId(id)}`);
};

export const ingestJiraJobs = async (jql) => {
  const res = await api.post(`${JOBS_PATH}/ingest-jira`, null, {
    params: { jql },
  });
  return unwrapList(res.data).map(mapCaseFromApi);
};

export const updateCase = async (id, payload) => {
  const numericId = jobId(id);
  await api.put(`${JOBS_PATH}/${numericId}`, mapJobWrite(payload));

  const assignedTo = assigneeName(payload.assignedTo);
  if (assignedTo && assignedTo !== "Unassigned") {
    await assignCase(numericId, assignedTo);
  }

  const nextStatus = String(payload.status || "").toLowerCase();
  if (nextStatus === "closed" || nextStatus === "resolved") {
    await closeCase(numericId);
  }

  return getCaseById(numericId);
};
