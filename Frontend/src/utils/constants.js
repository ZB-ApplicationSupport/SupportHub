export const ROLES = ["Admin", "Agent", "Viewer"];

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", roles: ["Admin", "Agent", "Viewer"] },
  { label: "Cases", path: "/cases", roles: ["Admin", "Agent", "Viewer"] },
  {
    label: "Knowledge Base",
    path: "/knowledge",
    roles: ["Admin", "Agent", "Viewer"],
  },
  {
    label: "Passwords",
    path: "/passwords",
    roles: ["Admin", "Agent", "Viewer"],
  },
  {
    label: "Supported Systems",
    path: "/systems",
    roles: ["Admin"],
  },
  { label: "Users", path: "/users", roles: ["Admin"] },
];

export const STATUS_COLORS = {
  Open: "orange",
  Closed: "green",
  Escalated: "red",
  Pending: "yellow",
};

export const PRIORITY_COLORS = {
  Low: "green",
  Medium: "yellow",
  High: "orange",
  Critical: "red",
};
