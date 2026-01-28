import React from "react";
import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { cases } from "../../data/cases";
import CasesBySystemChart from "../../components/charts/CasesBySystemChart";
import CaseStatusChart from "../../components/charts/CaseStatusChart";

const buildCasesBySystem = (items) => {
  const map = items.reduce((acc, item) => {
    acc[item.system] = (acc[item.system] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(map).map((key) => ({ system: key, cases: map[key] }));
};

const buildStatusDistribution = (items) => {
  const map = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(map).map((key) => ({ status: key, value: map[key] }));
};

const ReportsPage = () => {
  const systemData = buildCasesBySystem(cases);
  const statusData = buildStatusDistribution(cases);

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg">Reports</Heading>
        <Text color="text.muted">
          Visual analytics for executive and operational reporting.
        </Text>
      </Box>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        <CasesBySystemChart data={systemData} />
        <CaseStatusChart data={statusData} />
      </SimpleGrid>
    </Stack>
  );
};

export default ReportsPage;
