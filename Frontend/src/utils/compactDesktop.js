import { useEffect, useState } from "react";

const DESKTOP_MIN_WIDTH = 1024;

const isBelowFullHd = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.screen.width < 1920 || window.screen.height < 1080;
};

export const isCompactDesktopScreen = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth >= DESKTOP_MIN_WIDTH && isBelowFullHd();
};

export const compactPx = (value, compact) =>
  compact ? Math.round(value * 0.8) : value;

export const useCompactDesktop = ({ desktopOnly = false } = {}) => {
  const measure = desktopOnly ? isCompactDesktopScreen : isBelowFullHd;
  const [compact, setCompact] = useState(measure);

  useEffect(() => {
    const sync = () => setCompact(measure());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [measure]);

  return compact;
};

const COMPACT_CLASS = "compact-desktop";

export const useCompactDesktopClass = () => {
  const compact = useCompactDesktop({ desktopOnly: true });

  useEffect(() => {
    document.body.classList.toggle(COMPACT_CLASS, compact);
    return () => document.body.classList.remove(COMPACT_CLASS);
  }, [compact]);

  return compact;
};
