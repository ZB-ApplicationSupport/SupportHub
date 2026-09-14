import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

import { ChartStatsPopup } from "../ui";
import { CHART_GREEN } from "../../theme/chartColors";

const PRIORITY_BAR_COLOR = {
  Critical: CHART_GREEN[950],
  High: CHART_GREEN[700],
  Medium: CHART_GREEN[500],
  Low: CHART_GREEN[300],
};

const PRIORITY_ORDER = ["Critical", "High", "Medium", "Low"];

const CasePriorityChart = ({ data = [] }) => {
  const [popup, setPopup] = useState(null);

  const rows = (data || [])
    .filter((item) => item && item.priority)
    .map((item) => ({
      priority: item.priority,
      value: Number(item.value) || 0,
    }))
    .sort((a, b) => {
      const aIndex = PRIORITY_ORDER.indexOf(a.priority);
      const bIndex = PRIORITY_ORDER.indexOf(b.priority);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });

  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const max = Math.max(...rows.map((row) => row.value), 1);

  if (rows.length === 0 || total === 0) {
    return (
      <Flex flex="1" w="100%" h="100%" align="center" justify="center">
        <Text fontSize="13px" color="text.muted">
          No case data available
        </Text>
      </Flex>
    );
  }

  const showPopup = (event, row, color) => {
    const share = Math.round((row.value / total) * 100);
    setPopup({
      x: event.clientX,
      y: event.clientY,
      title: row.priority,
      items: [
        { label: "Cases", value: row.value, color },
        { label: "Share", value: `${share}%` },
      ],
    });
  };

  return (
    <Flex
      direction="column"
      w="100%"
      h="100%"
      minH="160px"
      flex="1"
      justify="space-between"
    >
      {rows.map((row) => {
        const width = `${Math.max((row.value / max) * 100, row.value > 0 ? 6 : 0)}%`;
        const color = PRIORITY_BAR_COLOR[row.priority] || "#64748B";

        return (
          <Flex
            key={row.priority}
            role="group"
            align="center"
            gap={3}
            flex="1"
            minH="44px"
            px={1.5}
            mx={-1.5}
            borderRadius="8px"
            cursor="pointer"
            transition="background-color 0.15s ease"
            _hover={{
              bg: "surface.subtle",
            }}
            onMouseEnter={(event) => showPopup(event, row, color)}
            onMouseMove={(event) => showPopup(event, row, color)}
            onMouseLeave={() => setPopup(null)}
          >
            <Text
              w={{ base: "72px", md: "88px" }}
              flexShrink={0}
              fontSize="11px"
              fontWeight="600"
              letterSpacing="0.04em"
              textTransform="uppercase"
              color="text.muted"
              noOfLines={1}
            >
              {row.priority}
            </Text>
            <Box
              flex="1"
              h="14px"
              bg="surface.subtle"
              borderRadius="7px"
              overflow="hidden"
              minW={0}
            >
              <Box
                h="100%"
                w={width}
                bg={color}
                borderRadius="7px"
              />
            </Box>
            <Text
              w="28px"
              flexShrink={0}
              textAlign="right"
              fontSize="13px"
              fontWeight="600"
              color="text.primary"
            >
              {row.value}
            </Text>
          </Flex>
        );
      })}
      {popup && (
        <ChartStatsPopup
          title={popup.title}
          items={popup.items}
          x={popup.x}
          y={popup.y}
        />
      )}
    </Flex>
  );
};

export default CasePriorityChart;
