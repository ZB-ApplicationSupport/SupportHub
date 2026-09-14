import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import lightLogo from "../../assets/logos/logoLight.png";
import whiteLogo from "../../assets/logos/logoWhite.png";

const DARK_LOGO_SCALE = 1.22;

const scaleSize = (value, factor) => {
  if (typeof value === "number") return Math.round(value * factor);
  if (typeof value === "string" && value.endsWith("px")) {
    return `${Math.round(parseFloat(value) * factor)}px`;
  }
  return value;
};

const addPx = (value, px) => {
  if (typeof value === "number") return value + px;
  if (typeof value === "string" && value.endsWith("px")) {
    return `${parseFloat(value) + px}px`;
  }
  return value;
};

const BrandLogo = ({
  height = "64px",
  maxW = "220px",
  alt = "ZB for you",
  onDark = false,
  ...props
}) => {
  const { colorMode } = useColorMode();
  const useWhite = onDark || colorMode === "dark";

  return (
    <Box
      as="img"
      src={useWhite ? whiteLogo : lightLogo}
      alt={alt}
      h={useWhite ? scaleSize(height, DARK_LOGO_SCALE) : addPx(height, 2)}
      w="auto"
      maxW={maxW}
      objectFit="contain"
      objectPosition="center"
      display="block"
      mx="auto"
      {...props}
    />
  );
};

export default BrandLogo;
