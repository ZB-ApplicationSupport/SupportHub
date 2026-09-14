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
    label: "Automations",
    path: "/automations",
    roles: ["ADMIN", "USER"],
    icon: "automations",
  },

  // {
  //   label: "Cases",
  //   path: "/cases",
  //   roles: ["ADMIN", "USER"],
  //   icon: "cases",
  // },

  {
    label: "Knowledge Base",
    path: "/knowledge",
    roles: ["ADMIN", "USER"],
    icon: "knowledge",
  },

  {
    label: "Passwords",
    path: "/passwords",
    roles: ["ADMIN", "USER"],
    icon: "passwords",
  },

  {
    label: "Reports",
    path: "/reports",
    roles: ["ADMIN", "USER"],
    icon: "reports",
  },

  {
    label: "Settings",
    path: "/settings",
    roles: ["ADMIN", "USER"],
    icon: "settings",
  },
];

export const STATUS_COLORS = {
  Open: "yellow",
  Closed: "green",
  "In progress": "yellow",
  "In UAT": "orange",
  Resolved: "green",
  "Awaiting vendor": "red",
};

export const PRIORITY_COLORS = {
  Low: "green",
  Medium: "yellow",
  High: "orange",
  Critical: "red",
};