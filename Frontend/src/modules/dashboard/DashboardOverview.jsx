import React from "react";
import { SimpleGrid, Box } from "@chakra-ui/react";
import StatsCard from "./StatsCard";
import { cases } from "../../data/cases";
import CaseStatusChart from "../../components/charts/CaseStatusChart";

const DashboardOverview = ({ stats }) => {

  const buildStatusDistribution = (items) => {
    const map = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(map).map((key) => ({ status: key, value: map[key] }));
  };

  const statusData = buildStatusDistribution(cases);

  return (
    <Box mb={6}>
      <SimpleGrid columns={2} spacing={4}>
        <Box h="220px">
          <SimpleGrid columns={{ base: 2, md: 2, xl: 2 }} spacing={4} >
            <StatsCard label="Total Cases" value={stats.total} helper="All systems" />
            <StatsCard label="Open Cases" value={stats.open} helper="Active workload" />
            <StatsCard label="Closed Cases" value={stats.closed} helper="Resolved" />
            <StatsCard
              label="Escalated"
              value={stats.escalated}
              helper="High attention"
            />
          </SimpleGrid>
        </Box>
        <Box>
          <CaseStatusChart data={statusData} />
        </Box>
        
      </SimpleGrid>
    </Box>
    
  );
};

export default DashboardOverview;
