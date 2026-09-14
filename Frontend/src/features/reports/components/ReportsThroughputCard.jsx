import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SurfaceCard } from "../../../components/ui";
import { CHART_GREEN } from "../../../theme/chartColors";

const ThroughputTooltip = ({
  active,
  payload,
  label,
  data,
  tooltipBg,
  tooltipColor,
  tooltipBorder,
}) => {
  if (!active || !payload?.length) return null;
  const point = data.find((item) => item.date === label);

  return (
    <Box
      bg={tooltipBg}
      color={tooltipColor}
      border="1px solid"
      borderColor={tooltipBorder}
      borderRadius="12px"
      boxShadow="0 8px 24px rgba(15, 23, 42, 0.12)"
      px={3}
      py={2.5}
      minW="132px"
    >
      <Text fontSize="12px" fontWeight="600" mb={1.5}>
        {point?.label || label}
      </Text>
      {payload.map((entry) => (
        <Flex
          key={entry.dataKey}
          align="center"
          justify="space-between"
          gap={4}
          py="2px"
        >
          <Flex align="center" gap={2}>
            <Box w="8px" h="8px" borderRadius="full" bg={entry.fill} />
            <Text fontSize="12px" color="text.muted">
              {entry.name}
            </Text>
          </Flex>
          <Text fontSize="12px" fontWeight="600">
            {entry.value}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

const ReportsThroughputCard = ({ data = [] }) => {
  const gridStroke = useColorModeValue("#E2E8F0", "#2A332E");
  const tickFill = useColorModeValue("#64748B", "#8B968F");
  const tooltipBg = useColorModeValue("#FFFFFF", "#1A211D");
  const tooltipColor = useColorModeValue("#1A202C", "#F3F6F4");
  const tooltipBorder = useColorModeValue("#E2E8F0", "#2F3A35");
  const hasActivity = data.some(
    (point) => Number(point.opened) > 0 || Number(point.closed) > 0
  );

  return (
    <SurfaceCard p={5} minH="280px" h="100%" display="flex" flexDirection="column">
      <Heading fontSize="14px" fontWeight="500" color="text.primary">
        Opened vs closed
      </Heading>
      <Text fontSize="12px" color="text.muted" mt={1} mb={4}>
        Jobs opened or closed each day in Africa/Harare. Closed uses closedAt when the API sends it.
      </Text>
      <Box flex="1" minH="220px" h="220px">
        {!hasActivity ? (
          <Flex h="100%" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No opened or closed dates in this range
            </Text>
          </Flex>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="date"
                interval="preserveStartEnd"
                minTickGap={28}
                tickFormatter={(value) => {
                  const point = data.find((item) => item.date === value);
                  return point?.label || "";
                }}
                tick={{ fill: tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                isAnimationActive={false}
                cursor={{ fill: "rgba(0, 132, 61, 0.06)" }}
                content={
                  <ThroughputTooltip
                    data={data}
                    tooltipBg={tooltipBg}
                    tooltipColor={tooltipColor}
                    tooltipBorder={tooltipBorder}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
              <Bar
                dataKey="opened"
                name="Opened"
                fill={CHART_GREEN[700]}
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
                isAnimationActive={false}
              />
              <Bar
                dataKey="closed"
                name="Closed"
                fill={CHART_GREEN[400]}
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </SurfaceCard>
  );
};

export default ReportsThroughputCard;
