import React from "react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { compactPx, useCompactDesktop } from "../../utils/compactDesktop";

const ColorModeToggle = ({ plain = false, compact: compactOverride }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const detectedCompact = useCompactDesktop();
  const compact = compactOverride ?? detectedCompact;
  const size = compactPx(plain ? 42 : 40, compact);

  return (
    <Tooltip
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      hasArrow
      placement="bottom"
      borderRadius="8px"
    >
      <IconButton
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        icon={isDark ? <FiSun /> : <FiMoon />}
        onClick={toggleColorMode}
        variant="ghost"
        w={`${size}px`}
        h={`${size}px`}
        minW={`${size}px`}
        fontSize={`${compactPx(18, compact)}px`}
        borderRadius="full"
        border={plain ? "none" : "1px solid"}
        borderColor={plain ? "transparent" : "border.default"}
        bg={plain ? "transparent" : "surface.subtle"}
        color="text.muted"
        boxShadow="none"
        _hover={{
          bg: "brand.wash",
          color: "brand.onWash",
          borderColor: plain ? "transparent" : "brand.200",
          boxShadow: "none",
        }}
      />
    </Tooltip>
  );
};

export default ColorModeToggle;
