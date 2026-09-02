import React from "react";
import {
  Box,
  Button,
  SimpleGrid,
  HStack,
  Heading,
  Icon,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  FiArrowRight,
  FiBriefcase,
  FiExternalLink,
  FiPlusCircle,
  FiUsers,
  FiActivity,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import StatsCard from "./StatsCard";
import CaseStatusChart from "../../../components/charts/CaseStatusChart";
import CasesBySystemChart from "../../../components/charts/CasesBySystemChart";

/* ============================================================
   BUILD CASES BY SYSTEM DATA
============================================================ */

const buildCasesBySystem = (items) => {
  const map = (items || []).reduce((acc, item) => {
    const system =
        item.system?.name ||
        item.systemName ||
        item.system ||
        "Other";

    acc[system] = (acc[system] || 0) + 1;

    return acc;
  }, {});

  return Object.keys(map).map((key) => ({
    system: key,
    cases: map[key],
  }));
};

/* ============================================================
   BUILD CASE STATUS DATA
============================================================ */

const buildStatusDistribution = (items) => {
  const map = (items || []).reduce((acc, item) => {
    const status = item.status || "Unknown";

    acc[status] = (acc[status] || 0) + 1;

    return acc;
  }, {});

  return Object.keys(map).map((key) => ({
    status: key,
    value: map[key],
  }));
};

/* ============================================================
   BUILD RECENT ACTIVITY
   Latest 3 cases
============================================================ */

const buildRecentActivity = (items) => {
  return [...(items || [])]
      .sort(
          (a, b) =>
              new Date(
                  b.lastUpdatedAt ||
                  b.updatedAt ||
                  b.createdAt ||
                  0
              ) -
              new Date(
                  a.lastUpdatedAt ||
                  a.updatedAt ||
                  a.createdAt ||
                  0
              )
      )
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        caseId: item.caseId ?? item.id,

        summary:
            item.summary ||
            item.title ||
            "Case updated",

        updatedBy:
            item.updatedByEmail ||
            item.createdByEmail ||
            "Unknown",

        updatedAt:
            item.lastUpdatedAt ||
            item.updatedAt ||
            item.createdAt ||
            null,
      }));
};

/* ============================================================
   FORMAT ACTIVITY TIME
============================================================ */

const formatActivityTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${
        minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  if (hours < 24) {
    return `${hours} ${
        hours === 1 ? "hour" : "hours"
    } ago`;
  }

  if (days < 7) {
    return `${days} ${
        days === 1 ? "day" : "days"
    } ago`;
  }

  return date.toLocaleDateString();
};

/* ============================================================
   DASHBOARD OVERVIEW
============================================================ */

const DashboardOverview = ({ cases = [] }) => {
  const navigate = useNavigate();

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const totalCases = cases.length;

  // Open = In progress + In UAT
  const openCases = cases.filter(
      (item) =>
          item.status === "In progress" ||
          item.status === "In UAT"
  ).length;

  // Resolved
  const resolvedCases = cases.filter(
      (item) => item.status === "Resolved"
  ).length;

  // Awaiting vendor
  const awaitingVendorCases = cases.filter(
      (item) => item.status === "Awaiting vendor"
  ).length;

  /* ==========================================================
     DASHBOARD DATA
  ========================================================== */

  const systemData = buildCasesBySystem(cases);

  const statusData = buildStatusDistribution(cases);

  const recentActivity = buildRecentActivity(cases);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
      <Box mb={6}>

        {/* ======================================================
          FIRST ROW

          Stats = 1/3
          Status Graph = 2/3
      ====================================================== */}

        <SimpleGrid
            columns={{
              base: 1,
              lg: 3,
            }}
            spacing={4}
            mb={6}
            alignItems="stretch"
        >

          {/* ==================================================
            STAT CARDS - 1/3 WIDTH
        ================================================== */}

          <SimpleGrid
              columns={2}
              spacing={4}
              h="280px"
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


          {/* ==================================================
            CASES BY STATUS - 2/3 WIDTH
        ================================================== */}

          <Box
              gridColumn={{
                base: "span 1",
                lg: "span 2",
              }}
              bg="surface.card"
              p={5}
              borderRadius="xl"
              borderWidth="1px"
              h="280px"
              overflow="hidden"
          >

            <Heading
                size="sm"
                mb={3}
            >
              Cases by Status
            </Heading>

            <Box
                h="230px"
                w="100%"
            >
              <CaseStatusChart
                  data={statusData}
              />
            </Box>

          </Box>

        </SimpleGrid>


        {/* ======================================================
          SECOND ROW

          Cases by System | Recent Activity | Quick Links
      ====================================================== */}

        <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              xl: 3,
            }}
            spacing={4}
            alignItems="stretch"
        >

          {/* ==================================================
            CASES BY SYSTEM
        ================================================== */}

          <Box
              bg="surface.card"
              borderRadius="xl"
              borderWidth="1px"
              overflow="hidden"
              h="355px"
          >
            <CasesBySystemChart
                data={systemData}
            />
          </Box>


          {/* ==================================================
            RECENT ACTIVITY
        ================================================== */}

          <Box
              bg="surface.card"
              p={5}
              borderRadius="xl"
              borderWidth="1px"
              h="355px"
              overflow="hidden"
              display="flex"
              flexDirection="column"
          >

            {/* ==================================================
              HEADER
          ================================================== */}

            <HStack
                justify="space-between"
                align="flex-start"
                mb={4}
            >

              {/* TITLE */}

              <Box>
                <Heading
                    size="sm"
                    mb={1}
                >
                  Live Activity
                </Heading>

                <Text
                    fontSize="xs"
                    color="text.muted"
                >
                  Real-time case updates
                </Text>
              </Box>


              {/* RIGHT SIDE */}

              <HStack
                  spacing={2}
                  align="center"
              >

                {/* LIVE */}

                <HStack
                    spacing={1.5}
                >
                  <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bg="green.500"
                  />

                  <Text
                      fontSize="xs"
                      color="green.500"
                      fontWeight="600"
                  >
                    Live
                  </Text>
                </HStack>


                {/* VIEW ALL ACTIVITY */}

                <IconButton
                    aria-label="View all activities"
                    icon={
                      <FiExternalLink />
                    }
                    variant="ghost"
                    size="sm"
                    color="gray.400"
                    _hover={{
                      color: "blue.600",
                      bg: "blue.50",
                    }}
                    onClick={() =>
                        navigate("/cases")
                    }
                />

              </HStack>

            </HStack>


            {/* ==================================================
              ACTIVITY LIST
          ================================================== */}

            <Stack
                spacing={0}
                flex="1"
            >

              {recentActivity.length === 0 ? (

                  <Box
                      py={8}
                      textAlign="center"
                  >
                    <Text
                        fontSize="sm"
                        color="text.muted"
                    >
                      No recent activity
                    </Text>
                  </Box>

              ) : (

                  recentActivity.map(
                      (item, index) => (

                          <Box
                              key={item.id}
                              py={3}
                              borderBottomWidth={
                                index <
                                recentActivity.length - 1
                                    ? "1px"
                                    : "0"
                              }
                              borderColor="gray.100"
                          >

                            <HStack
                                spacing={3}
                                align="flex-start"
                            >

                              {/* ACTIVITY ICON */}

                              <Box
                                  flexShrink={0}
                                  w="30px"
                                  h="30px"
                                  borderRadius="md"
                                  bg="blue.50"
                                  color="blue.600"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                              >
                                <Icon
                                    as={FiActivity}
                                    boxSize={4}
                                />
                              </Box>


                              {/* ACTIVITY DETAILS */}

                              <Box
                                  minW={0}
                                  flex="1"
                              >

                                {/* CASE ID */}

                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    lineHeight="1.2"
                                >
                                  {item.caseId}
                                </Text>


                                {/* SUMMARY + USER */}

                                <Text
                                    fontSize="xs"
                                    color="text.muted"
                                    mt={1}
                                    noOfLines={1}
                                >
                                  {item.summary},{" "}
                                  Updated by{" "}
                                  {item.updatedBy}
                                </Text>


                                {/* TIME */}

                                {item.updatedAt && (
                                    <Text
                                        fontSize="10px"
                                        color="gray.400"
                                        mt={1}
                                    >
                                      {formatActivityTime(
                                          item.updatedAt
                                      )}
                                    </Text>
                                )}

                              </Box>

                            </HStack>

                          </Box>

                      )
                  )

              )}

            </Stack>

          </Box>


          {/* ==================================================
    QUICK LINKS
================================================== */}

          <Box
              bg="surface.card"
              p={5}
              borderRadius="xl"
              borderWidth="1px"
              h="355px"
              overflow="hidden"
              display="flex"
              flexDirection="column"
          >

            {/* HEADER */}

            <HStack
                justify="space-between"
                align="flex-start"
                mb={4}
            >

              <Box>
                <Heading
                    size="sm"
                    mb={1}
                >
                  Quick Links
                </Heading>

                <Text
                    fontSize="xs"
                    color="text.muted"
                >
                  Frequently used actions
                </Text>
              </Box>

              {/* VIEW ALL LINKS */}

              <IconButton
                  aria-label="View all links"
                  icon={<FiExternalLink />}
                  variant="ghost"
                  size="sm"
                  color="gray.400"
                  _hover={{
                    color: "blue.600",
                    bg: "blue.50",
                  }}
                  onClick={() =>
                      navigate("/users")
                  }
              />

            </HStack>


            {/* ==================================================
      LINKS
  ================================================== */}

            <Stack
                spacing={0}
                flex="1"
            >

              {/* ==================================================
        FUSION ESSENCE
    ================================================== */}

              <Button
                  variant="ghost"
                  h="auto"
                  py={3}
                  px={1}
                  justifyContent="space-between"
                  textAlign="left"
                  borderRadius="md"
                  _hover={{
                    bg: "gray.50",
                  }}
                  onClick={() =>
                      navigate("/cases")
                  }
              >

                <HStack spacing={3}>

                  <Box
                      w="32px"
                      h="32px"
                      borderRadius="md"
                      bg="blue.50"
                      color="blue.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                  >
                    <Icon
                        as={FiBriefcase}
                        boxSize={4}
                    />
                  </Box>

                  <Box>

                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        lineHeight="1.3"
                    >
                      Fusion Essence
                    </Text>

                    <Text
                        fontSize="xs"
                        color="text.muted"
                        mt={0.5}
                    >
                      Load Balancer
                    </Text>

                  </Box>

                </HStack>

                <Icon
                    as={FiArrowRight}
                    color="gray.400"
                />

              </Button>


              {/* ==================================================
        TREASURY DEALING SYSTEM
    ================================================== */}

              <Button
                  variant="ghost"
                  h="auto"
                  py={3}
                  px={1}
                  justifyContent="space-between"
                  textAlign="left"
                  borderRadius="md"
                  _hover={{
                    bg: "gray.50",
                  }}
                  onClick={() =>
                      navigate("/cases/create")
                  }
              >

                <HStack spacing={3}>

                  <Box
                      w="32px"
                      h="32px"
                      borderRadius="md"
                      bg="green.50"
                      color="green.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                  >
                    <Icon
                        as={FiPlusCircle}
                        boxSize={4}
                    />
                  </Box>

                  <Box>

                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        lineHeight="1.3"
                    >
                      Treasury Dealing System
                    </Text>

                    <Text
                        fontSize="xs"
                        color="text.muted"
                        mt={0.5}
                    >
                      Live Environment
                    </Text>

                  </Box>

                </HStack>

                <Icon
                    as={FiArrowRight}
                    color="gray.400"
                />

              </Button>


              {/* ==================================================
        FINASTRA
    ================================================== */}

              <Button
                  variant="ghost"
                  h="auto"
                  py={3}
                  px={1}
                  justifyContent="space-between"
                  textAlign="left"
                  borderRadius="md"
                  _hover={{
                    bg: "gray.50",
                  }}
                  onClick={() =>
                      navigate("/cases/create")
                  }
              >

                <HStack spacing={3}>

                  <Box
                      w="32px"
                      h="32px"
                      borderRadius="md"
                      bg="orange.50"
                      color="orange.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                  >
                    <Icon
                        as={FiUsers}
                        boxSize={4}
                    />
                  </Box>

                  <Box>

                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        lineHeight="1.3"
                    >
                      Finastra
                    </Text>

                    <Text
                        fontSize="xs"
                        color="text.muted"
                        mt={0.5}
                    >
                      Case Portal
                    </Text>

                  </Box>

                </HStack>

                <Icon
                    as={FiArrowRight}
                    color="gray.400"
                />

              </Button>


              {/* ==================================================
        VIEW ALL LINKS
    ================================================== */}

              <Button
                  variant="ghost"
                  h="auto"
                  py={3}
                  px={1}
                  justifyContent="space-between"
                  textAlign="left"
                  borderRadius="md"
                  _hover={{
                    bg: "gray.50",
                  }}
                  onClick={() =>
                      navigate("/users")
                  }
              >

                <HStack spacing={3}>

                  <Box
                      w="32px"
                      h="32px"
                      borderRadius="md"
                      bg="purple.50"
                      color="purple.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                  >
                    <Icon
                        as={FiExternalLink}
                        boxSize={4}
                    />
                  </Box>

                  <Box>

                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        lineHeight="1.3"
                    >
                      View All Links
                    </Text>

                    <Text
                        fontSize="xs"
                        color="text.muted"
                        mt={0.5}
                    >
                      Manage all quick links
                    </Text>

                  </Box>

                </HStack>

                <Icon
                    as={FiArrowRight}
                    color="gray.400"
                />

              </Button>

            </Stack>

          </Box>

        </SimpleGrid>

      </Box>
  );
};

export default DashboardOverview;