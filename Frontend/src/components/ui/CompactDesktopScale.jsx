import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

const DESKTOP_MIN_WIDTH = 1024;
const BELOW_FULL_HD_QUERY = "(max-width: 1919px), (max-height: 1079px)";

const isBelowFullHd = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(BELOW_FULL_HD_QUERY).matches;
};

const isCompactScreen = (allScreens) => {
  if (typeof window === "undefined") {
    return false;
  }

  if (allScreens) {
    return isBelowFullHd();
  }

  const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
  const isSmallerThanFullHd =
    window.screen.width < 1920 || window.screen.height < 1080;

  return isDesktop && isSmallerThanFullHd;
};

const CompactDesktopScale = ({ children, allScreens = false }) => {
  const innerRef = useRef(null);
  const [compact, setCompact] = useState(() => isCompactScreen(allScreens));
  const [scaledHeight, setScaledHeight] = useState(null);

  useEffect(() => {
    const sync = () => setCompact(isCompactScreen(allScreens));
    sync();
    window.addEventListener("resize", sync);
    const media = window.matchMedia(BELOW_FULL_HD_QUERY);
    if (media.addEventListener) {
      media.addEventListener("change", sync);
    } else {
      media.addListener(sync);
    }
    return () => {
      window.removeEventListener("resize", sync);
      if (media.removeEventListener) {
        media.removeEventListener("change", sync);
      } else {
        media.removeListener(sync);
      }
    };
  }, [allScreens]);

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!compact || !node) {
      setScaledHeight(null);
      return undefined;
    }

    const updateHeight = () => {
      setScaledHeight(node.getBoundingClientRect().height);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [compact]);

  return (
    <Box w="100%" overflowX="hidden" h={scaledHeight || undefined}>
      <Box
        ref={innerRef}
        w={compact ? "125%" : "100%"}
        display="flex"
        flexDirection="column"
        transform={compact ? "scale(0.8)" : "none"}
        transformOrigin="top left"
      >
        {children}
      </Box>
    </Box>
  );
};

export default CompactDesktopScale;
