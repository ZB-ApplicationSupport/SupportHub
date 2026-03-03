export const ROLES = ["ADMIN", "USER"];

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", roles: ["ADMIN", "USER"] },
  { label: "Cases", path: "/cases", roles: ["ADMIN", "USER"] },
  {
    label: "Knowledge Base",
    path: "/knowledge",
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Passwords",
    path: "/passwords",
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Supported Systems",
    path: "/systems",
    roles: ["ADMIN"],
  },
  { label: "Users", path: "/users", roles: ["ADMIN"] },
  { label: "Reports", path: "/reports", roles: ["ADMIN", "USER"] },
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
