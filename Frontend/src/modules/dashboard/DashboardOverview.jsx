import React from "react";
import { SimpleGrid, Box } from "@chakra-ui/react";
import StatsCard from "./StatsCard";
import CaseStatusChart from "../../components/charts/CaseStatusChart";

const DashboardOverview = ({ cases = [] }) => {

  const buildStatusDistribution = (items) => {
    const map = items.reduce((acc, item) => {
      const status = item.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(map).map((key) => ({
      status: key,
      value: map[key],
    }));
  };

  // Total number of cases
  const totalCases = cases.length;

  // Open = In progress + In UAT
  const openCases = cases.filter(
      (item) =>
          item.status === "In progress" ||
          item.status === "In UAT"
  ).length;

  // Resolved cases
  const resolvedCases = cases.filter(
      (item) => item.status === "Resolved"
  ).length;

  // Awaiting vendor cases
  const awaitingVendorCases = cases.filter(
      (item) => item.status === "Awaiting vendor"
  ).length;

  const statusData = buildStatusDistribution(cases);

  return (
      <Box mb={6}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>

          {/* Statistics */}
          <Box>
            <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing={4}
            >
              <StatsCard
                  label="Total Cases"
                  value={totalCases}
              />

              <StatsCard
                  label="Open Cases"
                  value={openCases}
              />

              <StatsCard
                  label="Resolved Cases"
                  value={resolvedCases}
              />

              <StatsCard
                  label="Awaiting Vendor"
                  value={awaitingVendorCases}
              />
            </SimpleGrid>
          </Box>

          {/* Status Chart */}
          <Box h="300px" minW={0}>
            <CaseStatusChart data={statusData} />
          </Box>

        </SimpleGrid>
      </Box>
  );
};

export default DashboardOverview;