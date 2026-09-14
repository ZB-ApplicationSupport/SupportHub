import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiCircle,
  FiFolder,
  FiTrendingUp,
} from "react-icons/fi";

import StatsCard from "./StatsCard";

const DashboardStats = ({
  totalCases,
  openCases,
  resolvedCases,
  closureRate,
  totalTrend,
  openTrend,
  closedTrend,
  closureTrend,
  closureHint,
  comparisonHint = "vs previous 30 days",
}) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} alignItems="stretch">
      <StatsCard
        label="Total Cases"
        value={totalCases}
        delta={totalTrend?.delta}
        trend={totalTrend?.trend}
        hint={totalTrend ? comparisonHint : undefined}
        icon={FiFolder}
      />
      <StatsCard
        label="Open Cases"
        value={openCases}
        delta={openTrend?.delta}
        trend={openTrend?.trend}
        hint={openTrend ? comparisonHint : undefined}
        icon={FiCircle}
      />
      <StatsCard
        label="Closed Cases"
        value={resolvedCases}
        delta={closedTrend?.delta}
        trend={closedTrend?.trend}
        hint={closedTrend ? comparisonHint : undefined}
        icon={FiCheckCircle}
      />
      <StatsCard
        label="Case Closure Rate"
        value={closureRate}
        delta={closureTrend?.delta}
        trend={closureTrend?.trend}
        hint={closureHint}
        icon={FiTrendingUp}
      />
    </SimpleGrid>
  );
};

export default DashboardStats;
