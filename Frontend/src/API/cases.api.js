import api from "./axios";

// Map backend enum values to display labels
const statusToDisplay = (s) => {
  if (!s) return "";
  const map = {
    OPEN: "Open",
    PENDING: "Pending",
    ESCALATED: "Escalated",
    CLOSED: "Closed",
    WAITING_FOR_VENDOR: "Waiting for vendor",
    WAITING_FOR_BANK: "Waiting for bank",
    IN_PROGRESS: "In progress",
  };
  return map[s] || s;
};

// Map display labels / loose input back to backend enum values
const statusToApi = (s) => {
  if (!s) return "";
  const map = {
    Open: "OPEN",
    Pending: "PENDING",
    Escalated: "ESCALATED",
    Closed: "CLOSED",
    "Waiting for vendor": "WAITING_FOR_VENDOR",
    "Waiting for bank": "WAITING_FOR_BANK",
    "In progress": "IN_PROGRESS",
  };
  return map[s] || s.toString().toUpperCase().replace(" ", "_");
};

/** Map backend case to frontend shape (id as string for table, status display, dates, refs) */
export const mapCaseFromApi = (c) => {
  if (!c) return null;
  const openedAt = c.openedAt
    ? new Date(c.openedAt).toISOString().slice(0, 10)
    : (c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : "");

  const jiraRefs = Array.isArray(c.jiraRefs) ? c.jiraRefs : [];
  const vendorRefs = Array.isArray(c.vendorRefs) ? c.vendorRefs : [];

  return {
    id: c.id != null ? String(c.id) : "",
    caseId: c.id,
    system: c.systemName || c.system || "",
    status: statusToDisplay(c.status) || "Open",
    priority: c.priority || "Medium",
    assignedTo: c.assignedTo || "Unassigned",
    openedAt,
    summary: c.summary || c.title || "",
    description: c.description || "",
    jiraRefs,
    vendorRefs,
    createdAt: c.createdAt,
    lastUpdatedAt: c.lastUpdatedAt,
    createdByEmail: c.createdByEmail,
  };
};

/** Map frontend case form/table to API payload */
export const mapCaseToApi = (c) => {
  const jiraRefs = typeof c.jiraRefs === "string"
    ? c.jiraRefs.split(",").map((x) => x.trim()).filter(Boolean)
    : (Array.isArray(c.jiraRefs) ? c.jiraRefs : []);

  const vendorRefs = typeof c.vendorRefs === "string"
    ? c.vendorRefs.split(",").map((x) => x.trim()).filter(Boolean)
    : (Array.isArray(c.vendorRefs) ? c.vendorRefs : []);

  return {
    title: c.summary || c.title || "",
    summary: c.summary || c.title || "",
    description: c.description || "",
    systemName: c.system || "",
    priority: c.priority || "Medium",
    assignedTo: c.assignedTo || "Unassigned",
    status: statusToApi(c.status) || "OPEN",
    jiraRefs,
    vendorRefs,
    openedAt: c.openedAt ? new Date(c.openedAt).toISOString() : null,
  };
};

export const getCases = async () => {
  const res = await api.get("/cases/get");
  const list = res.data || [];
  return list.map(mapCaseFromApi);
};

export const getCaseById = async (id) => {
  const numId = typeof id === "string" && id.startsWith("CT-") ? id.replace("CT-", "") : id;
  const res = await api.get(`/cases/get/${numId}`);
  return mapCaseFromApi(res.data);
};

export const createCase = async (payload) => {
  const res = await api.post("/cases/add", mapCaseToApi(payload));
  return mapCaseFromApi(res.data);
};

export const updateCase = async (id, payload) => {
  const numId = typeof id === "string" && id.startsWith("CT-") ? id.replace("CT-", "") : id;
  const res = await api.put(`/cases/update/${numId}`, mapCaseToApi(payload));
  return mapCaseFromApi(res.data);
};
