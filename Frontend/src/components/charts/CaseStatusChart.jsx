import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useChartStatsPopup } from "../ui";
import { CHART_GREEN } from "../../theme/chartColors";

const STATUS_BAR_COLOR = {
  Open: CHART_GREEN[400],
  Closed: CHART_GREEN[600],
  Resolved: CHART_GREEN[700],
  "In progress": CHART_GREEN[500],
  "In UAT": CHART_GREEN[300],
  "Awaiting vendor": CHART_GREEN[800],
};

const STATUS_ORDER = [
  "Open",
  "In progress",
  "In UAT",
  "Awaiting vendor",
  "Closed",
  "Resolved",
];

const CaseStatusChart = ({ data = [] }) => {
  const rows = (data || [])
    .filter((item) => item && item.status)
    .map((item) => ({
      status: item.status,
      value: Number(item.value) || 0,
    }))
    .sort((a, b) => {
      const aIndex = STATUS_ORDER.indexOf(a.status);
      const bIndex = STATUS_ORDER.indexOf(b.status);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });

  const max = Math.max(...rows.map((row) => row.value), 1);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const { showPopup, hidePopup, popupNode } = useChartStatsPopup();

  if (rows.length === 0) {
    return (
      <Flex w="100%" minH="160px" align="center" justify="center">
        <Text fontSize="13px" color="text.muted">
          No case data available
        </Text>
      </Flex>
    );
  }

  return (
    <Box w="100%" minH="160px">
      {rows.map((row) => {
        const width = `${Math.max((row.value / max) * 100, row.value > 0 ? 6 : 0)}%`;
        const color = STATUS_BAR_COLOR[row.status] || "#64748B";
        const share = total > 0 ? Math.round((row.value / total) * 100) : 0;
        const popupStats = {
          title: row.status,
          items: [
            { label: "Cases", value: row.value, color },
            { label: "Share", value: `${share}%` },
          ],
        };

        return (
          <Flex
            key={row.status}
            align="center"
            gap={3}
            py={2.5}
            onMouseEnter={(event) => showPopup(event, popupStats)}
            onMouseMove={(event) => showPopup(event, popupStats)}
            onMouseLeave={hidePopup}
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
              {row.status}
            </Text>
            <Box
              flex="1"
              h="10px"
              bg="surface.subtle"
              borderRadius="6px"
              overflow="hidden"
              minW={0}
            >
              <Box
                h="100%"
                w={width}
                bg={color}
                borderRadius="6px"
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
      {popupNode}
    </Box>
  );
};

export default CaseStatusChart;
