import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";

const TREND_COLOR = {
  up: "#00843D",
  down: "#D64545",
  flat: "#64748B",
  new: "#00843D",
};

const trendPrefix = (trend) => {
  if (trend === "down") return "↓ ";
  if (trend === "flat") return "→ ";
  if (trend === "up") return "↑ ";
  return "";
};

const StatCard = ({
  label,
  value,
  delta,
  trend,
  icon,
  iconBg = "#EDF2F7",
  iconColor = "#1A202C",
  hint,
  onClick,
  selected = false,
  labelNoOfLines = 1,
  labelFontSize = "13px",
  compact = false,
}) => {
  const hasDelta = delta != null && delta !== "";
  const comparisonColor = TREND_COLOR[trend] || TREND_COLOR.up;
  const clickable = typeof onClick === "function";
  const hasHint = Boolean(hint);

  return (
    <Box
      as={clickable ? "button" : undefined}
      type={clickable ? "button" : undefined}
      onClick={onClick}
      bg="surface.card"
      borderRadius="16px"
      border="1px solid"
      borderColor={selected ? "brand.500" : "border.default"}
      boxShadow={selected ? "cardHover" : "card"}
      px={compact ? 4 : 5}
      py={compact ? 3 : 4}
      h={compact ? "auto" : "100%"}
      minH={compact ? undefined : labelNoOfLines > 1 ? "140px" : "124px"}
      w="100%"
      display="flex"
      flexDirection="column"
      textAlign="left"
      cursor={clickable ? "pointer" : undefined}
      transition="border-color 0.15s ease, box-shadow 0.15s ease"
      _hover={
        clickable
          ? {
              boxShadow: "cardHover",
              borderColor: selected ? "brand.500" : "brand.200",
            }
          : undefined
      }
    >
      <Flex align="flex-start" justify="space-between" gap={3}>
        <Text
          fontSize={labelFontSize}
          fontWeight="500"
          color="text.muted"
          noOfLines={labelNoOfLines}
          pt={compact ? 0 : "2px"}
        >
          {label}
        </Text>

        {icon && (
          <Flex
            align="center"
            justify="center"
            w="40px"
            h="40px"
            borderRadius="12px"
            bg={iconBg}
            color={iconColor}
            flexShrink={0}
          >
            <Icon as={icon} boxSize={5} />
          </Flex>
        )}
      </Flex>

      <Flex align="baseline" gap={2} mt={1} minH={compact ? undefined : "32px"} minW={0}>
        <Text
          fontSize={compact ? "24px" : "28px"}
          fontWeight="600"
          color="text.primary"
          lineHeight="1.1"
          letterSpacing="-0.03em"
        >
          {value}
        </Text>

        {hasDelta && (
          <Text
            fontSize="12px"
            fontWeight="500"
            color={comparisonColor}
            flexShrink={0}
          >
            {trendPrefix(trend)}
            {delta}
          </Text>
        )}
      </Flex>

      {hasHint ? (
        <Text
          fontSize="12px"
          fontWeight="400"
          color="text.muted"
          mt={compact ? 1 : "auto"}
          pt={compact ? 0 : 2}
          minH={compact ? undefined : "18px"}
          noOfLines={1}
        >
          {hint}
        </Text>
      ) : compact ? null : (
        <Text
          fontSize="12px"
          fontWeight="400"
          color="text.muted"
          mt="auto"
          pt={2}
          minH="18px"
          noOfLines={1}
        >
          {"\u00A0"}
        </Text>
      )}
    </Box>
  );
};

export default StatCard;
