import React, { useState } from "react";
import {
    Box,
    Flex,
    Heading,
    HStack,
    Select,
    Stack,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";

import MonitoringStatCard from "./MonitoringStatCard";
import ServerStatusPanel from "./ServerStatusPanel";
import MemoryPanel from "./MemoryPanel";
import DiskSpacePanel from "./DiskSpacePanel";

const ServerDashboard = () => {
    const [selectedServer, setSelectedServer] =
        useState("10.132.230.66:9200");

    const [timeRange, setTimeRange] =
        useState("5m");

    /*
     * Temporary monitoring data.
     *
     * This will later come from the backend.
     */
    const server = {
        cpuBusy: 0.3,
        systemLoad: 2.3,
        ramUsed: 64.8,
        cpuCores: 192,

        ramTotal: 60,
        ramUsedGiB: 38.9,
        ramFreeGiB: 21.1,

        rootFsTotal: 930,
        rootFsUsed: 100,

        uptime: "28.8 weeks",
    };

    return (
        <Box
            w="100%"
            px={{ base: 3, md: 5 }}
            py={4}
        >

            {/* =====================================================
          HEADER
      ===================================================== */}

            <Flex
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={4}
                mb={5}
            >

                <Box>
                    <Heading
                        size="md"
                        mb={1}
                    >
                        Server Monitoring
                    </Heading>

                    <Text
                        fontSize="sm"
                        color="text.muted"
                    >
                        Real-time infrastructure and application health
                    </Text>
                </Box>


                {/* ===================================================
            CONTROLS
        =================================================== */}

                <HStack spacing={3}>

                    <Select
                        value={selectedServer}
                        onChange={(e) =>
                            setSelectedServer(e.target.value)
                        }
                        size="sm"
                        w="220px"
                    >
                        <option value="10.132.230.66:9200">
                            10.132.230.66:9200
                        </option>

                        <option value="10.132.230.67:9200">
                            10.132.230.67:9200
                        </option>
                    </Select>

                    <Select
                        value={timeRange}
                        onChange={(e) =>
                            setTimeRange(e.target.value)
                        }
                        size="sm"
                        w="120px"
                    >
                        <option value="5m">
                            Last 5 minutes
                        </option>

                        <option value="15m">
                            Last 15 minutes
                        </option>

                        <option value="30m">
                            Last 30 minutes
                        </option>

                        <option value="1h">
                            Last 1 hour
                        </option>
                    </Select>

                </HStack>

            </Flex>


            {/* =====================================================
          TOP STATISTICS
      ===================================================== */}

            <SimpleGrid
                columns={{
                    base: 1,
                    sm: 2,
                    xl: 4,
                }}
                spacing={4}
                mb={4}
            >

                <MonitoringStatCard
                    title="CPU Busy"
                    value={`${server.cpuBusy}%`}
                    type="gauge"
                    percentage={server.cpuBusy}
                />

                <MonitoringStatCard
                    title="System Load"
                    value={`${server.systemLoad}%`}
                    type="gauge"
                    percentage={server.systemLoad}
                />

                <MonitoringStatCard
                    title="RAM Used"
                    value={`${server.ramUsed}%`}
                    type="gauge"
                    percentage={server.ramUsed}
                />

                <MonitoringStatCard
                    title="CPU Cores"
                    value={server.cpuCores}
                />

            </SimpleGrid>


            {/* =====================================================
          SECOND STATISTICS ROW
      ===================================================== */}

            <SimpleGrid
                columns={{
                    base: 1,
                    sm: 2,
                    xl: 4,
                }}
                spacing={4}
                mb={4}
            >

                <MonitoringStatCard
                    title="RAM Total"
                    value={`${server.ramTotal} GiB`}
                />

                <MonitoringStatCard
                    title="Application RootFS Total"
                    value={`${server.rootFsTotal} GiB`}
                />

                <MonitoringStatCard
                    title="Application RootFS Used"
                    value={`${server.rootFsUsed}%`}
                    type="gauge"
                    percentage={server.rootFsUsed}
                />

                <MonitoringStatCard
                    title="Physical Server Uptime"
                    value={server.uptime}
                />

            </SimpleGrid>


            {/* =====================================================
          APPLICATION STATUS
      ===================================================== */}

            <Box mb={4}>
                <ServerStatusPanel />
            </Box>


            {/* =====================================================
          MEMORY + DISK
      ===================================================== */}

            <SimpleGrid
                columns={{
                    base: 1,
                    xl: 2,
                }}
                spacing={4}
            >

                <MemoryPanel
                    total={server.ramTotal}
                    used={server.ramUsedGiB}
                    free={server.ramFreeGiB}
                />

                <DiskSpacePanel />

            </SimpleGrid>

        </Box>
    );
};

export default ServerDashboard;