import React from "react";
import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";
import { cases } from "../../data/cases";
import { recentActivity } from "../../data/activity";
import DashboardOverview from "./DashboardOverview";
import CasesBySystemChart from "../../components/charts/CasesBySystemChart";

const buildCasesBySystem = (items) => {
  const map = items.reduce((acc, item) => {
    acc[item.system] = (acc[item.system] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(map).map((key) => ({ system: key, cases: map[key] }));
};

const DashboardPage = () => {
  const { user } = useAppContext();

  const stats = {
    total: cases.length,
    assigned: cases.filter((item) => item.assignedTo !== "Unassigned").length,
    unassigned: cases.filter((item) => item.assignedTo === "Unassigned").length,
    open: cases.filter((item) => item.status === "Open").length,
    closed: cases.filter((item) => item.status === "Closed").length,
    escalated: cases.filter((item) => item.status === "Escalated").length,
  };

  const systemData = buildCasesBySystem(cases);


  const roleWidgets = {
    ADMIN: [
      {
        title: "Service Level Health",
        description: "98.2% of cases within SLA thresholds.",
      },
      {
        title: "Escalation Coverage",
        description: "All escalated cases assigned to senior agents.",
      },
    ],
    USER: [
      {
        title: "My Workload",
        description: "4 open cases assigned to you today.",
      },
      {
        title: "Next Shift Handoff",
        description: "Prepare summary for 2 pending cases.",
      },
    ],
  };

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg">
          Welcome back, {user?.name ? user.name.split(" ")[0] : "there"}
        </Heading>
      </Box>

      <DashboardOverview stats={stats} />

      <SimpleGrid
        gridTemplateColumns="3fr 1fr"
        spacing={4}
        mb={6}
      >
        <Box>
          <CasesBySystemChart data={systemData} />
        </Box>

         <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px">
            <Heading size="sm" mb={4}>
              Recent Activity
            </Heading>
            <Stack spacing={3}>
              {recentActivity.map((item) => (
                <Box key={item.id}>
                  <Text fontWeight="500">
                    {item.caseId} 
                  </Text>
                  <Text fontSize="xs" color="text.muted">
                  {item.summary}  · {item.updatedBy}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        
      </SimpleGrid>

     
    </Stack>
  );
};

export default DashboardPage;
