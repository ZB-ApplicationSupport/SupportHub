import { displayUsername } from "../../utils/displayUsername";
import { appConfig } from "../../config/appConfig";

export const STORAGE_KEY = "supporthub-quick-links-v1";
export const LINKS_CHANGED_EVENT = "supporthub-links-changed";

export const LINK_LOGOS = [
  { id: "finastra", label: "Finastra" },
  { id: "jira", label: "Jira" },
  { id: "powerbi", label: "Power BI" },
  { id: "brand", label: "ZB" },
  { id: "none", label: "None" },
];

export const DEFAULT_LINKS = appConfig.defaultQuickLinks;

const shortFromTitle = (title = "") => {
  const parts = String(title)
    .split(/[\s|/._-]+/)
    .filter(Boolean);
  const letters = parts.map((part) => part[0]).join("").toUpperCase();
  return letters.slice(0, 3) || "LNK";
};

const logoId = (value) =>
  LINK_LOGOS.some((item) => item.id === value) ? value : "none";

export const logoLabel = (value) =>
  LINK_LOGOS.find((item) => item.id === value)?.label || "None";

export const normalizeLink = (item = {}, index = 0) => {
  const title = item.title || item.name || "";
  const logo = logoId(item.logo);
  return {
    id: item.id || `LNK-${String(index + 1).padStart(3, "0")}`,
    title,
    short: (item.short || shortFromTitle(title)).slice(0, 4).toUpperCase(),
    logo: logo === "none" ? "" : logo,
    href: String(item.href || item.url || "").trim(),
    addedAt: item.addedAt || item.createdAt || "",
    addedBy: displayUsername(item.addedBy, item.createdBy),
  };
};

export const nextLinkId = (items = []) => {
  const max = items.reduce((highest, item) => {
    const match = String(item.id || "").match(/(\d+)$/);
    const value = match ? Number(match[1]) : 0;
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);
  return `LNK-${String(max + 1).padStart(3, "0")}`;
};

export const loadLinks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LINKS.map(normalizeLink);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_LINKS.map(normalizeLink);
    }
    return parsed.map(normalizeLink);
  } catch (error) {
    return DEFAULT_LINKS.map(normalizeLink);
  }
};

export const saveLinks = (items = []) => {
  const next = items.map(normalizeLink);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(LINKS_CHANGED_EVENT));
  return next;
};
