export const ROLES = ["ADMIN", "USER"];

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["ADMIN", "USER"],
    icon: "dashboard",
  },

  {
    label: "Server Monitoring",
    path: "/server-dashboard",
    roles: ["ADMIN"],
    icon: "server",
  },

  {
    label: "Cases",
    path: "/cases",
    roles: ["ADMIN", "USER"],
    icon: "cases",
  },

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
    icon: "systems",
  },

  {
    label: "Users",
    path: "/users",
    roles: ["ADMIN"],
    icon: "users",
  },

  {
    label: "Reports",
    path: "/reports",
    roles: ["ADMIN", "USER"],
  },
];

export const STATUS_COLORS = {
  "In progress": "blue",
  "In UAT": "purple",
  "Resolved": "green",
  "Awaiting vendor": "orange",
};

export const PRIORITY_COLORS = {
  Low: "green",
  Medium: "yellow",
  High: "orange",
  Critical: "red",
};