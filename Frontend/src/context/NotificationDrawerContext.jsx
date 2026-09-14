import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  acknowledgeNotification,
  getNotifications,
} from "../features/monitoring/observability.api";

export const DUMMY_NOTIFICATIONS = [
  {
    id: "dummy-1",
    title: "Application server 2 is down",
    message: "The UAT application server is currently offline.",
    source: "UAT",
    severity: "critical",
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "dummy-2",
    title: "/opt disk usage above 70%",
    message: "Disk usage on the UAT host has crossed the watch threshold.",
    source: "UAT",
    severity: "warning",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "dummy-3",
    title: "Case updated",
    message: "A tracked job status changed to Closed.",
    source: "Cases",
    severity: "ok",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "dummy-4",
    title: "Memory utilization returned to normal",
    message: "FE DEV memory is back within the expected range.",
    source: "UAT",
    severity: "ok",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
];

const isDummyId = (id) => String(id || "").startsWith("dummy-");

const NotificationDrawerContext = createContext(null);

export const NotificationDrawerProvider = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [ackedIds, setAckedIds] = useState(() => new Set());

  useEffect(() => {
    getNotifications({ skipAuthRedirect: true })
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, []);

  const source = notifications.length > 0 ? notifications : DUMMY_NOTIFICATIONS;
  const items = source.map((item) =>
    ackedIds.has(item.id) ? { ...item, acknowledged: true } : item
  );
  const unreadCount = items.filter((item) => !item.acknowledged).length;
  const open = Boolean(anchorEl);

  const toggle = useCallback((event) => {
    const target = event?.currentTarget;
    setAnchorEl((current) => (current ? null : target || null));
  }, []);

  const close = useCallback(() => setAnchorEl(null), []);

  const markAllRead = useCallback(() => {
    const unread = items.filter((item) => !item.acknowledged);
    if (!unread.length) return;

    setAckedIds((prev) => {
      const next = new Set(prev);
      unread.forEach((item) => next.add(item.id));
      return next;
    });

    unread.forEach((item) => {
      if (isDummyId(item.id)) return;
      acknowledgeNotification(item.id, { skipAuthRedirect: true }).catch(
        () => {}
      );
    });
  }, [items]);

  const value = useMemo(
    () => ({
      open,
      anchorEl,
      toggle,
      close,
      items,
      unreadCount,
      markAllRead,
    }),
    [open, anchorEl, toggle, close, items, unreadCount, markAllRead]
  );

  return (
    <NotificationDrawerContext.Provider value={value}>
      {children}
    </NotificationDrawerContext.Provider>
  );
};

export const useNotificationDrawer = () => {
  const context = useContext(NotificationDrawerContext);
  if (!context) {
    throw new Error(
      "useNotificationDrawer must be used within NotificationDrawerProvider"
    );
  }
  return context;
};
