import React from "react";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { SurfaceCard, useChartStatsPopup } from "../../../components/ui";
import { CHART_GREEN } from "../../../theme/chartColors";

const BAR_FILL = CHART_GREEN[500];
const SYSTEM_LIMIT = 5;

const formatCount = (value) =>
  Number(value || 0).toLocaleString("en-GB");

const ClassificationRows = ({ rows }) => {
  const max = Math.max(...rows.map((row) => row.value), 1);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const { showPopup, hidePopup, popupNode } = useChartStatsPopup();

  return (
    <Stack spacing={3}>
      {rows.map((row) => {
        const width = `${Math.max((row.value / max) * 100, row.value > 0 ? 6 : 0)}%`;
        const share = total > 0 ? Math.round((row.value / total) * 100) : 0;
        const popupStats = {
          title: row.label,
          items: [
            { label: "Cases", value: formatCount(row.value), color: BAR_FILL },
            { label: "Share", value: `${share}%` },
          ],
        };

        return (
          <Flex
            key={row.label}
            align="center"
            gap={3}
            onMouseEnter={(event) => showPopup(event, popupStats)}
            onMouseMove={(event) => showPopup(event, popupStats)}
            onMouseLeave={hidePopup}
          >
            <Text
              w="118px"
              flexShrink={0}
              fontSize="13px"
              fontWeight="500"
              color="text.primary"
              noOfLines={1}
            >
              {row.label}
            </Text>
            <Box
              flex="1"
              h="8px"
              bg="surface.subtle"
              borderRadius="full"
              overflow="hidden"
              minW={0}
            >
              <Box h="100%" w={width} bg={BAR_FILL} borderRadius="full" />
            </Box>
            <Text
              w="40px"
              flexShrink={0}
              textAlign="right"
              fontSize="13px"
              fontWeight="600"
              color="text.primary"
            >
              {formatCount(row.value)}
            </Text>
          </Flex>
        );
      })}
      {popupNode}
    </Stack>
  );
};

const ClassificationSection = ({ title, rows }) => (
  <Box>
    <Heading
      fontSize="13px"
      fontWeight="600"
      color="text.primary"
      mb={3}
    >
      {title}
    </Heading>
    {rows.length === 0 ? (
      <Text fontSize="13px" color="text.muted">
        No case data available
      </Text>
    ) : (
      <ClassificationRows rows={rows} />
    )}
  </Box>
);

const CaseClassificationCard = ({
  priorityData = [],
  systemData = [],
}) => {
  const navigate = useNavigate();

  const priorityRows = (priorityData || [])
    .filter((item) => item && item.priority)
    .map((item) => ({
      label: item.priority,
      value: Number(item.value) || 0,
    }));

  const systemRows = [...(systemData || [])]
    .filter((item) => item && item.system)
    .sort((a, b) => Number(b.cases) - Number(a.cases))
    .slice(0, SYSTEM_LIMIT)
    .map((item) => ({
      label: item.system,
      value: Number(item.cases) || 0,
    }));

  return (
    <SurfaceCard
      p={0}
      minH="280px"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" justify="space-between" px={5} pt={5} pb={3}>
        <Heading fontSize="14px" fontWeight="600" color="text.primary">
          Case Classification
        </Heading>
        <Text
          fontSize="12px"
          fontWeight="600"
          color="text.brand"
          cursor="pointer"
          onClick={() => navigate("/reports")}
        >
          View all
        </Text>
      </Flex>

      <Stack spacing={5} px={5} pb={5} flex="1">
        <ClassificationSection
          title="Cases by Priority"
          rows={priorityRows}
        />
        <ClassificationSection
          title="Cases by System"
          rows={systemRows}
        />
      </Stack>
    </SurfaceCard>
  );
};

export default CaseClassificationCard;
