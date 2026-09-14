export const isPlaceholderUser = (user) =>
  Boolean(user?.placeholder) || String(user?.id || "").startsWith("USR-");

export const isPlaceholderRequest = (item) =>
  Boolean(item?.placeholder) || String(item?.id || "").startsWith("REQ-");

export const PLACEHOLDER_USERS = [
  {
    id: "USR-001",
    placeholder: true,
    username: "lnyandoro",
    email: "lnyandoro@zb.co.zw",
    role: "ADMIN",
    enabled: true,
  },
  {
    id: "USR-002",
    placeholder: true,
    name: "Support Desk",
    username: "support.desk",
    email: "support.desk@zb.co.zw",
    role: "USER",
    enabled: true,
  },
  {
    id: "USR-003",
    placeholder: true,
    name: "Channels Admin",
    username: "channels.admin",
    email: "channels.admin@zb.co.zw",
    role: "USER",
    enabled: true,
  },
  {
    id: "USR-004",
    placeholder: true,
    name: "IT Support",
    username: "it.support",
    email: "it.support@zb.co.zw",
    role: "ADMIN",
    enabled: true,
  },
  {
    id: "USR-005",
    placeholder: true,
    name: "BI Team",
    username: "bi.team",
    email: "bi.team@zb.co.zw",
    role: "USER",
    enabled: false,
  },
  {
    id: "USR-006",
    placeholder: true,
    name: "Platform Ops",
    username: "platform",
    email: "platform@zb.co.zw",
    role: "USER",
    enabled: true,
  },
];

export const PLACEHOLDER_SIGNUP_REQUESTS = [
  {
    id: "REQ-001",
    placeholder: true,
    email: "new.analyst@zb.co.zw",
    status: "PENDING",
    createdAt: "2026-09-06T09:18:00",
  },
  {
    id: "REQ-002",
    placeholder: true,
    email: "contractor.uat@zb.co.zw",
    status: "PENDING",
    createdAt: "2026-09-07T14:42:00",
  },
];

export const normalizeUser = (item = {}, index = 0) => {
  const fullName = [item.firstName, item.lastName].filter(Boolean).join(" ");
  return {
    id: item.id ?? item.userId ?? `USR-${String(index + 1).padStart(3, "0")}`,
    placeholder: Boolean(item.placeholder),
    name: item.name || fullName,
    username: item.username || "",
    email: item.email || "",
    role: item.role || item.realmRole || "USER",
    enabled: item.enabled !== false && item.status !== "DISABLED",
  };
};

export const unwrapUserList = (data) => {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.users)
          ? data.users
          : [];

  return list.map(normalizeUser);
};
