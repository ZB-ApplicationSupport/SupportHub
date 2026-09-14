const HARARE = "Africa/Harare";
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All jobs" },
];

export const AGE_BUCKETS = [
  { label: "Under 1 day", maxHours: 24, color: "#00843D" },
  { label: "1–3 days", maxHours: 72, color: "#57BB78" },
  { label: "3–7 days", maxHours: 168, color: "#F4B41A" },
  { label: "7+ days", maxHours: Infinity, color: "#D64545" },
];

export const parseJobDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const harareDateKey = (date) =>
  date.toLocaleDateString("en-CA", { timeZone: HARARE });

export const harareDayLabel = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: HARARE,
  });

const assigneeOf = (item) => {
  const value = item?.assignedTo;
  if (!value || value === "Unassigned") return "Unassigned";
  if (typeof value === "object") {
    return value.username || value.name || value.email || "Unassigned";
  }
  return String(value);
};

export const isOpenJob = (item) => item?.status === "Open" && !item?.closedAt;

export const isEscalated = (item) =>
  item?.priority === "Critical" || item?.priority === "High";

export const jobAgeHours = (item, now = Date.now()) => {
  const opened = parseJobDate(item?.createdAt || item?.openedAt);
  if (!opened) return null;
  return Math.max(0, (now - opened.getTime()) / HOUR_MS);
};

export const formatAge = (hours) => {
  if (!Number.isFinite(hours)) return "—";
  if (hours < 1) return "<1h";
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = hours / 24;
  if (days < 10) return `${days.toFixed(1)}d`;
  return `${Math.round(days)}d`;
};

export const rangeStartMs = (rangeDays, now = Date.now()) => {
  if (rangeDays === "all" || rangeDays == null) return null;
  const days = Number(rangeDays);
  if (!Number.isFinite(days) || days <= 0) return null;
  return now - days * DAY_MS;
};

export const openedInRange = (item, startMs) => {
  if (startMs == null) return true;
  const opened = parseJobDate(item?.createdAt || item?.openedAt);
  return Boolean(opened && opened.getTime() >= startMs);
};

export const closedInRange = (item, startMs) => {
  const closed = parseJobDate(item?.closedAt);
  if (!closed) return false;
  if (startMs == null) return true;
  return closed.getTime() >= startMs;
};

export const buildKpis = (jobs = [], rangeDays = "30") => {
  const now = Date.now();
  const startMs = rangeStartMs(rangeDays, now);
  const openJobs = jobs.filter(isOpenJob);
  const opened = jobs.filter((item) => openedInRange(item, startMs));
  const closed = jobs.filter((item) => closedInRange(item, startMs));
  const unassigned = openJobs.filter((item) => assigneeOf(item) === "Unassigned");
  const escalatedOpen = openJobs.filter(isEscalated);
  const ages = openJobs
    .map((item) => jobAgeHours(item, now))
    .filter((hours) => Number.isFinite(hours));
  const oldestHours = ages.length ? Math.max(...ages) : null;

  return {
    openedInRange: opened.length,
    closedInRange: closed.length,
    currentlyOpen: openJobs.length,
    unassignedOpen: unassigned.length,
    escalatedOpen: escalatedOpen.length,
    oldestOpenAge: formatAge(oldestHours),
  };
};

export const buildWorkload = (jobs = [], rangeDays = "30") => {
  const startMs = rangeStartMs(rangeDays);
  const rows = new Map();

  const ensure = (name) => {
    if (!rows.has(name)) {
      rows.set(name, {
        assignee: name,
        open: 0,
        closedInRange: 0,
        escalatedOpen: 0,
      });
    }
    return rows.get(name);
  };

  jobs.forEach((item) => {
    const name = assigneeOf(item);
    const row = ensure(name);
    if (isOpenJob(item)) {
      row.open += 1;
      if (isEscalated(item)) row.escalatedOpen += 1;
    }
    if (closedInRange(item, startMs)) {
      row.closedInRange += 1;
    }
  });

  return Array.from(rows.values()).sort((a, b) => {
    if (b.open !== a.open) return b.open - a.open;
    if (b.escalatedOpen !== a.escalatedOpen) return b.escalatedOpen - a.escalatedOpen;
    return a.assignee.localeCompare(b.assignee);
  });
};

export const buildAgeing = (jobs = []) => {
  const now = Date.now();
  const buckets = AGE_BUCKETS.map((bucket) => ({ ...bucket, value: 0 }));
  const rows = [];

  jobs.filter(isOpenJob).forEach((item) => {
    const hours = jobAgeHours(item, now);
    if (!Number.isFinite(hours)) return;
    const bucket =
      buckets.find((entry) => hours < entry.maxHours) ||
      buckets[buckets.length - 1];
    bucket.value += 1;
    rows.push({
      id: item.id,
      reference: item.reference || item.caseId || item.id,
      title: item.title || item.summary || "",
      assignee: assigneeOf(item),
      priority: item.priority || "Medium",
      system: item.system || item.sourceSystem || "Unspecified",
      openedAt: item.createdAt || item.openedAt || "",
      ageHours: hours,
      ageLabel: formatAge(hours),
      bucket: bucket.label,
    });
  });

  rows.sort((a, b) => b.ageHours - a.ageHours);
  const agedCount = rows.length;

  return {
    buckets: buckets.map((bucket) => ({
      ...bucket,
      percent: agedCount > 0 ? Math.round((bucket.value / agedCount) * 100) : 0,
    })),
    averageHours:
      agedCount > 0
        ? rows.reduce((sum, row) => sum + row.ageHours, 0) / agedCount
        : null,
    total: agedCount,
    rows,
  };
};

export const buildThroughput = (jobs = [], rangeDays = "30") => {
  const now = Date.now();
  const days =
    rangeDays === "all" ? 90 : Math.max(Number(rangeDays) || 30, 1);
  const points = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now - offset * DAY_MS);
    points.push({
      date: harareDateKey(date),
      label: harareDayLabel(date),
      opened: 0,
      closed: 0,
    });
  }

  const byDay = new Map(points.map((point) => [point.date, point]));

  jobs.forEach((item) => {
    const opened = parseJobDate(item.createdAt || item.openedAt);
    if (opened) {
      const point = byDay.get(harareDateKey(opened));
      if (point) point.opened += 1;
    }
    const closed = parseJobDate(item.closedAt);
    if (closed) {
      const point = byDay.get(harareDateKey(closed));
      if (point) point.closed += 1;
    }
  });

  return points;
};

export const buildSourceMix = (jobs = []) => {
  const map = {};
  jobs.forEach((item) => {
    const system = item.system || item.sourceSystem || "Unspecified";
    map[system] = (map[system] || 0) + 1;
  });
  return Object.keys(map)
    .map((system) => ({ system, cases: map[system] }))
    .sort((a, b) => b.cases - a.cases);
};

export const buildStatusDistribution = (jobs = []) => {
  const map = {};
  jobs.forEach((item) => {
    const status = item.status || "Open";
    map[status] = (map[status] || 0) + 1;
  });
  return Object.keys(map).map((status) => ({ status, value: map[status] }));
};

export const buildPriorityDistribution = (jobs = []) => {
  const order = ["Critical", "High", "Medium", "Low"];
  const map = {};
  jobs.forEach((item) => {
    const priority = item.priority || "Medium";
    map[priority] = (map[priority] || 0) + 1;
  });
  const keys = [
    ...order.filter((key) => map[key] != null),
    ...Object.keys(map).filter((key) => !order.includes(key)),
  ];
  return keys.map((priority) => ({ priority, value: map[priority] }));
};

const csvCell = (value) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

export const jobsToCsv = (jobs = []) => {
  const now = Date.now();
  const header = [
    "Reference",
    "Title",
    "Status",
    "Priority",
    "Source",
    "Assignee",
    "Opened",
    "Closed",
    "Age",
  ];
  const lines = [
    header.join(","),
    ...jobs.map((item) =>
      [
        item.reference || item.caseId || item.id,
        item.title || item.summary || "",
        item.status || "",
        item.priority || "",
        item.system || item.sourceSystem || "",
        assigneeOf(item),
        item.createdAt || item.openedAt || "",
        item.closedAt || "",
        formatAge(jobAgeHours(item, now)),
      ]
        .map(csvCell)
        .join(",")
    ),
  ];
  return `${lines.join("\n")}\n`;
};

export const downloadCsv = (filename, csv) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
