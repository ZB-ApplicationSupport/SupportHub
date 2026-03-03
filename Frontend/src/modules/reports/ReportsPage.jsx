import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { getCases } from "../../API/cases.api";
import CasesBySystemChart from "../../components/charts/CasesBySystemChart";
import CaseStatusChart from "../../components/charts/CaseStatusChart";

const buildCasesBySystem = (items) => {
  const map = (items || []).reduce((acc, item) => {
    const sys = item.system || "Other";
    acc[sys] = (acc[sys] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(map).map((key) => ({ system: key, cases: map[key] }));
};

const buildStatusDistribution = (items) => {
  const map = (items || []).reduce((acc, item) => {
    const st = item.status || "Open";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(map).map((key) => ({ status: key, value: map[key] }));
};

const ReportsPage = () => {
  const [cases, setCases] = useState([]);
  useEffect(() => {
    getCases().then(setCases).catch(() => setCases([]));
  }, []);
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
