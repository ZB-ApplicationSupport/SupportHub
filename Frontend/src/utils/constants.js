export const ROLES = ["Admin", "User"];

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", roles: ["Admin", "User"] },
  { label: "Cases", path: "/cases", roles: ["Admin", "User"] },
  {
    label: "Knowledge Base",
    path: "/knowledge",
    roles: ["Admin", "User"],
  },
  {
    label: "Passwords",
    path: "/passwords",
    roles: ["Admin", "User"],
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
