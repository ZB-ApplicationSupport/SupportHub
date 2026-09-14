import React, { useMemo, useState } from "react";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DropdownSelect, SurfaceCard } from "../../../components/ui";
import { CHART_GREEN, chartFill } from "../../../theme/chartColors";

const HARARE = "Africa/Harare";
const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const harareDateKey = (date) =>
  date.toLocaleDateString("en-CA", { timeZone: HARARE });

const harareDayLabel = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: HARARE,
  });

const harareTooltipLabel = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: HARARE,
  });

const uniqueSystems = (items) => {
  const seen = new Set();
  (items || []).forEach((item) => {
    const system = String(item.system || "").trim();
    if (system) seen.add(system);
  });
  return Array.from(seen).sort((a, b) => a.localeCompare(b));
};

const buildCaseTrends = (items, days) => {
  const points = [];
  const now = Date.now();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now - offset * DAY_MS);
    const dayKey = harareDateKey(date);
    points.push({
      date: dayKey,
      label: harareDayLabel(date),
      tooltipLabel: harareTooltipLabel(date),
      open: 0,
      closed: 0,
    });
  }

  (items || []).forEach((item) => {
    const created = parseDate(item.createdAt || item.openedAt);
    if (!created) return;
    const createdKey = harareDateKey(created);
    const closedAt = parseDate(item.closedAt);

    points.forEach((point) => {
      if (createdKey > point.date) return;
      if (closedAt && harareDateKey(closedAt) <= point.date) {
        point.closed += 1;
      } else {
        point.open += 1;
      }
    });
  });

  return points;
};

const buildYAxis = (points) => {
  const dataMax = (points || []).reduce((max, point) => {
    return Math.max(max, Number(point.open) || 0, Number(point.closed) || 0);
  }, 0);
  const yMax = dataMax + 1;

  if (yMax <= 8) {
    return {
      yMax,
      ticks: Array.from({ length: yMax + 1 }, (_, index) => index),
    };
  }

  const step = yMax <= 20 ? 2 : yMax <= 50 ? 5 : 10;
  const niceMax = Math.ceil(yMax / step) * step;
  const ticks = [];
  for (let value = 0; value <= niceMax; value += step) {
    ticks.push(value);
  }

  return { yMax: niceMax, ticks };
};

const TrendTooltip = ({
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
        {point?.tooltipLabel || point?.label || label}
      </Text>
      {payload.map((entry) => (
        <Flex
          key={entry.dataKey}
          align="center"
          justify="space-between"
          gap={4}
          py="2px"
        >
          <Flex align="center" gap={2} minW={0}>
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg={entry.color}
              flexShrink={0}
            />
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

const CasesByDateCard = ({ cases = [], days = 30 }) => {
  const [system, setSystem] = useState("");
  const gridStroke = useColorModeValue("#E2E8F0", "#2A332E");
  const tickFill = useColorModeValue("#64748B", "#8B968F");
  const tooltipBg = useColorModeValue("#FFFFFF", "#1A211D");
  const tooltipColor = useColorModeValue("#1A202C", "#F3F6F4");
  const tooltipBorder = useColorModeValue("#E2E8F0", "#2F3A35");
  const closedFill = useColorModeValue(
    chartFill(CHART_GREEN[500], 0.20),
    chartFill(CHART_GREEN[500], 0.28)
  );
  const openFill = useColorModeValue(
    chartFill(CHART_GREEN[700], 0.14),
    chartFill(CHART_GREEN[700], 0.22)
  );

  const systemOptions = useMemo(() => {
    const options = uniqueSystems(cases).map((name) => ({
      value: name,
      label: name,
    }));
    return [{ value: "", label: "All systems" }, ...options];
  }, [cases]);

  const data = useMemo(() => {
    const filtered = system
      ? cases.filter((item) => item.system === system)
      : cases;
    return buildCaseTrends(filtered, days);
  }, [cases, days, system]);

  const hasActivity = data.some(
    (point) => Number(point.open) > 0 || Number(point.closed) > 0
  );
  const { yMax, ticks } = buildYAxis(data);

  return (
    <SurfaceCard
      p={5}
      minH="280px"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Flex align="flex-start" justify="space-between" gap={3} mb={4}>
        <Box minW={0}>
          <Heading fontSize="14px" fontWeight="600" color="text.primary">
            Case Trends
          </Heading>
          <Text fontSize="12px" color="text.muted" mt={1}>
            Total cases by status over time
          </Text>
        </Box>
        <DropdownSelect
          label="System"
          value={system}
          onChange={(event) => setSystem(event.target.value)}
          options={systemOptions}
          size="sm"
          minW="148px"
        />
      </Flex>
      <Box flex="1" w="100%" minH="240px" h="240px">
        {!hasActivity ? (
          <Flex h="100%" minH="240px" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              {`No case dates in the last ${days} days`}
            </Text>
          </Flex>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridStroke}
                vertical={false}
              />
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
                type="number"
                domain={[0, yMax]}
                ticks={ticks}
                interval={0}
                allowDecimals={false}
                padding={{ top: 0, bottom: 0 }}
                tick={{ fill: tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                shared
                isAnimationActive={false}
                cursor={{
                  stroke: "#94A3B8",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={
                  <TrendTooltip
                    data={data}
                    tooltipBg={tooltipBg}
                    tooltipColor={tooltipColor}
                    tooltipBorder={tooltipBorder}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="closed"
                name="Closed"
                stroke={CHART_GREEN[500]}
                fill={closedFill}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: CHART_GREEN[500],
                  strokeWidth: 2,
                  fill: tooltipBg,
                }}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="open"
                name="Open"
                stroke={CHART_GREEN[700]}
                fill={openFill}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: CHART_GREEN[700],
                  strokeWidth: 2,
                  fill: tooltipBg,
                }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box>
    </SurfaceCard>
  );
};

export default CasesByDateCard;
