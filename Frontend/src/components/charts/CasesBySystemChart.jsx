import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useChartStatsPopup } from "../ui";
import { CHART_GREEN } from "../../theme/chartColors";

const CasesBySystemChart = ({ data = [] }) => {
  const chartData = (data || [])
    .filter((item) => item && item.system && Number(item.cases) > 0)
    .sort((a, b) => Number(b.cases) - Number(a.cases));

  const totalCases = chartData.reduce(
    (total, item) => total + Number(item.cases),
    0
  );
  const { showPopup, hidePopup, popupNode } = useChartStatsPopup();

  if (chartData.length === 0) {
    return (
      <Flex w="100%" minH="160px" align="center" justify="center" px={5} py={4}>
        <Text color="text.muted" fontSize="13px">
          No case data available
        </Text>
      </Flex>
    );
  }

  return (
    <Box w="100%" px={5} py={1} pb={4}>
      {chartData.map((entry) => {
        const count = Number(entry.cases);
        const pct = totalCases > 0 ? Math.round((count / totalCases) * 100) : 0;
        const popupStats = {
          title: entry.system,
          items: [
            { label: "Cases", value: count, color: CHART_GREEN[500] },
            { label: "Share", value: `${pct}%` },
          ],
        };

        return (
          <Box
            key={entry.system}
            py={2.5}
            cursor="default"
            onMouseEnter={(event) => showPopup(event, popupStats)}
            onMouseMove={(event) => showPopup(event, popupStats)}
            onMouseLeave={hidePopup}
          >
            <Flex align="center" justify="space-between" gap={3} mb={1.5}>
              <Text
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.04em"
                textTransform="uppercase"
                color="text.muted"
                noOfLines={1}
              >
                {entry.system}
              </Text>
              <Text fontSize="13px" fontWeight="600" color="text.primary" flexShrink={0}>
                {count}
              </Text>
            </Flex>
            <Flex align="center" gap={3}>
              <Box
                flex="1"
                h="8px"
                bg="surface.subtle"
                borderRadius="6px"
                overflow="hidden"
                minW={0}
              >
                <Box
                  h="100%"
                  w={`${Math.max(pct, 4)}%`}
                  bg={CHART_GREEN[500]}
                  borderRadius="6px"
                />
              </Box>
              <Text
                w="40px"
                flexShrink={0}
                fontSize="12px"
                color="text.muted"
                textAlign="right"
              >
                {pct}%
              </Text>
            </Flex>
          </Box>
        );
      })}
      {popupNode}
    </Box>
  );
};

export default CasesBySystemChart;
