import { displayUsername } from "../../utils/displayUsername";
import { appConfig } from "../../config/appConfig";

export const STORAGE_KEY = "supporthub-supported-systems-v2";

export const SYSTEM_STATUSES = ["Active", "Degraded", "Down", "Inactive"];

export const SYSTEM_STATUS_COLOR = {
  Active: "#00843D",
  Degraded: "#F4B41A",
  Down: "#D64545",
  Inactive: "#94A3B8",
};

export const DUMMY_SYSTEMS = appConfig.defaultSupportedSystems;

export const normalizeSystem = (item = {}, index = 0) => ({
  id: item.id || `SYS-${String(index + 1).padStart(3, "0")}`,
  name: item.name || "",
  description: item.description || "",
  status: SYSTEM_STATUSES.includes(item.status) ? item.status : "Active",
  addedAt: item.addedAt || item.createdAt || "",
  addedBy: displayUsername(item.addedBy, item.createdBy, item.owner),
});

export const nextSystemId = (items = []) => {
  const max = items.reduce((highest, item) => {
    const match = String(item.id || "").match(/(\d+)$/);
    const value = match ? Number(match[1]) : 0;
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);
  return `SYS-${String(max + 1).padStart(3, "0")}`;
};

export const loadStoredSystems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DUMMY_SYSTEMS.map(normalizeSystem);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DUMMY_SYSTEMS.map(normalizeSystem);
    }
    return parsed.map(normalizeSystem);
  } catch (error) {
    return DUMMY_SYSTEMS.map(normalizeSystem);
  }
};
