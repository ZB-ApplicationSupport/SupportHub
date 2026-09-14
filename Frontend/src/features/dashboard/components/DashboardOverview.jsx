import React from "react";
import { Box, Stack } from "@chakra-ui/react";

import DashboardStats from "./DashboardStats";
import CasesByDateCard from "./CasesByDateCard";
import CasesByPriorityCard from "./CasesByPriorityCard";
import ActivityPanel from "./ActivityPanel";
import OpenCaseAgeCard from "./OpenCaseAgeCard";
import QuickLinksPanel from "./QuickLinksPanel";

const PRIORITY_ORDER = ["Critical", "High", "Medium", "Low"];
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_RANGE_DAYS = 30;

const isOpenCase = (item) => item.status === "Open";

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const AGE_BUCKETS = [
  { label: "Under 24h", maxHours: 24, color: "#00843D" },
  { label: "1–3 days", maxHours: 72, color: "#F4B41A" },
  { label: "3+ days", maxHours: Infinity, color: "#D64545" },
];

const buildPriorityDistribution = (items) => {
  const map = (items || []).reduce((acc, item) => {
    const priority = item.priority || "Medium";
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  return PRIORITY_ORDER.map((key) => ({
    priority: key,
    value: map[key] || 0,
  }));
};

const buildOpenCaseAge = (items) => {
  const counts = AGE_BUCKETS.map((bucket) => ({ ...bucket, value: 0 }));
  const now = Date.now();
  let ageSum = 0;
  let agedCount = 0;

  (items || []).forEach((item) => {
    if (!isOpenCase(item)) return;
    const opened = parseDate(item.createdAt || item.openedAt);
    if (!opened) return;

    const ageHours = Math.max(0, (now - opened.getTime()) / (60 * 60 * 1000));
    const bucket =
      counts.find((entry) => ageHours < entry.maxHours) ||
      counts[counts.length - 1];
    bucket.value += 1;
    ageSum += ageHours;
    agedCount += 1;
  });

  return {
    buckets: counts.map(({ label, value, color }) => ({
      label,
      value,
      color,
      percent: agedCount > 0 ? Math.round((value / agedCount) * 100) : 0,
    })),
    averageHours: agedCount > 0 ? ageSum / agedCount : null,
    total: agedCount,
  };
};

const percentChange = (current, previous) => {
  if (!Number.isFinite(current)) {
    return null;
  }

  if (!Number.isFinite(previous) || previous < 0) {
    return null;
  }

  if (previous === 0) {
    return current > 0
      ? { delta: "New activity", trend: "new" }
      : null;
  }

  const change = ((current - previous) / previous) * 100;
  if (!Number.isFinite(change)) {
    return null;
  }

  const rounded = Math.round(change);
  if (rounded === 0) {
    return { delta: "0%", trend: "flat" };
  }

  return {
    delta: `${Math.abs(rounded)}%`,
    trend: rounded < 0 ? "down" : "up",
  };
};

const existedAt = (item, atMs) => {
  const created = parseDate(item.createdAt || item.openedAt);
  return Boolean(created && created.getTime() <= atMs);
};

const wasOpenAt = (item, atMs) => {
  if (!existedAt(item, atMs)) {
    return false;
  }

  const closed = parseDate(item.closedAt);
  if (closed) {
    return closed.getTime() > atMs;
  }

  return isOpenCase(item);
};

const wasClosedAt = (item, atMs) => {
  if (!existedAt(item, atMs)) {
    return false;
  }

  const closed = parseDate(item.closedAt);
  if (closed) {
    return closed.getTime() <= atMs;
  }

  return item.status === "Closed";
};

const DashboardOverview = ({
  cases = [],
  rangeDays = DEFAULT_RANGE_DAYS,
}) => {
  const windowDays =
    Number.isFinite(Number(rangeDays)) && Number(rangeDays) > 0
      ? Number(rangeDays)
      : DEFAULT_RANGE_DAYS;

  const totalCases = cases.length;
  const openCases = cases.filter(isOpenCase).length;
  const resolvedCases = cases.filter((item) => item.status === "Closed").length;
  const closureRateValue =
    totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;
  const closureRate = `${closureRateValue}%`;
  const closureHint = `${resolvedCases} of ${totalCases} cases closed`;

  const rangeAgo = Date.now() - windowDays * DAY_MS;
  const totalThen = cases.filter((item) => existedAt(item, rangeAgo)).length;
  const openThen = cases.filter((item) => wasOpenAt(item, rangeAgo)).length;
  const closedThen = cases.filter((item) => wasClosedAt(item, rangeAgo)).length;
  const closureThen =
    totalThen > 0 ? Math.round((closedThen / totalThen) * 100) : null;

  const totalTrend = percentChange(totalCases, totalThen);
  const openTrend = percentChange(openCases, openThen);
  const closedTrend = percentChange(resolvedCases, closedThen);
  const closureTrend =
    totalThen > 0 && Number(closureThen) > 0
      ? percentChange(closureRateValue, closureThen)
      : null;

  const priorityData = buildPriorityDistribution(cases);
  const openAgeData = buildOpenCaseAge(cases);

  return (
    <Stack spacing={4} w="100%" pb={4}>
      <DashboardStats
        totalCases={totalCases}
        openCases={openCases}
        resolvedCases={resolvedCases}
        closureRate={closureRate}
        totalTrend={totalTrend}
        openTrend={openTrend}
        closedTrend={closedTrend}
        closureTrend={closureTrend}
        closureHint={closureHint}
        comparisonHint={`vs previous ${windowDays} days`}
      />

      <Box
        display="grid"
        gap={4}
        gridTemplateColumns={{
          base: "1fr",
          lg: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(3, minmax(0, 1fr))",
        }}
      >
        <Box
          minW={0}
          gridColumn={{
            base: "auto",
            lg: "1 / -1",
            xl: "1 / 3",
          }}
        >
          <CasesByDateCard cases={cases} days={windowDays} />
        </Box>
        <Box minW={0}>
          <ActivityPanel cases={cases} />
        </Box>
        <Box minW={0}>
          <CasesByPriorityCard data={priorityData} />
        </Box>
        <Box minW={0}>
          <QuickLinksPanel />
        </Box>
        <Box minW={0}>
          <OpenCaseAgeCard data={openAgeData} />
        </Box>
      </Box>
    </Stack>
  );
};

export default DashboardOverview;
