import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Box,
    Flex,
    Icon,
    Text,
} from "@chakra-ui/react";
import { FaRotate } from "react-icons/fa6";

import {
    CompactDesktopScale,
    DropdownSelect,
    PageHeader,
} from "../../../components/ui";

import {
    getAppServerUptime,
    getAppServerUptimeSeconds,
    getServerAppStatus,
    getServerAppStatusHistory,
    getServerCPUCores,
    getServerCpuUsage,
    getServerDiskUsageBreakdown,
    getServerRamTotal,
    getServerRAMUsage,
    getServerRootFSTotal,
    getServerRootFSUsage,
    getServerSystemLoad,
} from "../monitoring.api";

import { getApplicationProcessesForHost } from "../prometheus.api";

import MonitoringStatCard, {
    interpretUtilization,
} from "../components/MonitoringStatCard";
import MonitoringStatCard2 from "../components/MonitoringStatCard2";
import ServerStatusPanel from "../components/ServerStatusPanel";
import MemoryPanel from "../components/MemoryPanel";
import DiskSpacePanel from "../components/DiskSpacePanel";
import ServerHealthPanel from "../components/ServerHealthPanel";


const SERVER_OPTIONS = [
    {
        value: "prod-uat-a-fbe-profile1",
        label: "FE UAT SERVER",
    },
    {
        value: "dev-fbe-profile1",
        label: "FE DEV SERVER",
    },
];


const TIME_RANGE_OPTIONS = [
    {
        value: "5m",
        label: "Last 5 minutes",
    },
    {
        value: "15m",
        label: "Last 15 minutes",
    },
    {
        value: "30m",
        label: "Last 30 minutes",
    },
    {
        value: "1h",
        label: "Last 1 hour",
    },
    {
        value: "24h",
        label: "24 hours",
    },
];

const REFRESH_INTERVAL_MS = 30 * 1000;

const ROOT_FS_CAPTION = "/opt";

const getApplicationProcesses = (host) =>
    getApplicationProcessesForHost(host);

const formatGiBCaption = (used, total) => {
    if (!Number.isFinite(used) || !Number.isFinite(total)) {
        return undefined;
    }

    const format = (value) =>
        Math.abs(value - Math.round(value)) < 0.05
            ? String(Math.round(value))
            : value.toFixed(1);

    return `${format(used)} / ${format(total)} GiB`;
};

const formatLastUpdated = (value) => {
    if (!value) {
        return "—";
    }

    return value.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Africa/Harare",
    });
};


const SegmentedFilterControl = ({
                                    selectedServer,
                                    onServerChange,
                                    autoRefresh,
                                    onAutoRefreshChange,
                                    onRefresh,
                                    refreshing,
                                }) => {
    return (
        <Flex
            gap={3}
            align="center"
            flexWrap="wrap"
            w={{
                base: "100%",
                md: "auto",
            }}
        >
            
            <DropdownSelect
                label="Server"
                value={selectedServer}
                onChange={onServerChange}
                options={SERVER_OPTIONS}
                minW={{
                    base: "100%",
                    md: "178px",
                }}
            />

            <Flex
                as="button"
                type="button"
                align="center"
                gap={2}
                h="48px"
                px={3}
                borderRadius="10px"
                border="1px solid"
                borderColor="border.default"
                bg="surface.card"
                cursor="pointer"
                onClick={() => onAutoRefreshChange(!autoRefresh)}
            >
                <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={autoRefresh ? "#00843D" : "#94A3B8"}
                    flexShrink={0}
                />
                <Text fontSize="13px" fontWeight="500" color="text.primary">
                    Auto-refresh
                </Text>
            </Flex>

            <Flex
                as="button"
                type="button"
                align="center"
                gap={2}
                h="48px"
                px={3}
                borderRadius="10px"
                border="1px solid"
                borderColor="border.default"
                bg="surface.card"
                cursor={refreshing ? "default" : "pointer"}
                opacity={refreshing ? 0.7 : 1}
                aria-label="Refresh monitoring data"
                onClick={() => {
                    if (!refreshing) {
                        onRefresh();
                    }
                }}
                _hover={{
                    borderColor: refreshing ? "border.default" : "#00843D",
                }}
            >
                <Icon
                    as={FaRotate}
                    boxSize="13px"
                    color="text.primary"
                    animation={
                        refreshing
                            ? "monitoringRefreshSpin 0.8s linear infinite"
                            : undefined
                    }
                    sx={{
                        "@keyframes monitoringRefreshSpin": {
                            from: { transform: "rotate(0deg)" },
                            to: { transform: "rotate(360deg)" },
                        },
                    }}
                />
                <Text fontSize="13px" fontWeight="500" color="text.primary">
                    Refresh
                </Text>
            </Flex>
        </Flex>
    );
};


const ServerDashboard = () => {

    /*
     * ---------------------------------------------------------
     * SERVER / REFRESH STATE
     * ---------------------------------------------------------
     */

    const [
        selectedServer,
        setSelectedServer,
    ] = useState(
        "prod-uat-a-fbe-profile1"
    );


    const [
        timeRange,
        setTimeRange,
    ] = useState("24h");

    const [
        autoRefresh,
        setAutoRefresh,
    ] = useState(true);

    const [
        lastUpdated,
        setLastUpdated,
    ] = useState(null);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);


    /*
     * ---------------------------------------------------------
     * MAIN SERVER STATE
     * ---------------------------------------------------------
     */

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState(null);


    const [
        server,
        setServer,
    ] = useState({
        cpuBusy: null,
        systemLoad: null,
        cpuCores: null,

        ramTotal: null,
        ramUsage: null,
        ramUsedGiB: null,
        ramFreeGiB: null,

        rootFsTotal: null,
        rootFsUsage: null,
        rootFsUsedGiB: null,
        rootFsFreeGiB: null,
        diskUsageBreakdown: [],

        uptime: null,
        uptimeSeconds: null,

        applicationStatus: null,
        applicationStatuses: [],
        appStatusHistory: [],
    });


    /*
     * ---------------------------------------------------------
     * RAM-SPECIFIC STATE
     *
     * Kept separately because you said the RAM card/panel
     * should use these states.
     * ---------------------------------------------------------
     */

    const [
        RAMUsage,
        setRAMUsage,
    ] = useState(null);


    const [
        RAMLoading,
        setRAMLoading,
    ] = useState(true);


    const [
        RAMError,
        setRAMError,
    ] = useState(null);


    /*
     * ---------------------------------------------------------
     * UPTIME HISTORY
     *
     * Each point contains:
     *
     * {
     *   timestamp: "10:15:32",
     *   uptimeSeconds: 123456,
     *   uptime: "1d 10h"
     * }
     * ---------------------------------------------------------
     */

    const [
        uptimeHistory,
        setUptimeHistory,
    ] = useState([]);


    /*
     * ---------------------------------------------------------
     * LOAD ALL SERVER METRICS
     * ---------------------------------------------------------
     */

    const loadServerMetrics = useCallback(
        async ({ initialLoad = false } = {}) => {

            if (initialLoad) {
                setLoading(true);
                setRAMLoading(true);
            }

            setRefreshing(true);
            setError(null);

            try {
                const applicationProcesses =
                    await getApplicationProcesses(selectedServer);

                /*
                 * We deliberately load RAM separately as well.
                 *
                 * This allows RAMLoading / RAMError / RAMUsage
                 * to be used independently by the RAM UI.
                 */

                setRAMError(null);


                const [
                    ramTotalResult,
                    rootFsTotalResult,
                    cpuCoresResult,
                    uptimeResult,
                    uptimeSecondsResult,
                    cpuBusyResult,
                    systemLoadResult,
                    ramUsageResult,
                    rootFsUsageResult,
                    diskUsageBreakdownResult,
                    applicationStatusesResult,
                    appStatusHistoryResult,
                ] = await Promise.allSettled([

                    getServerRamTotal(
                        selectedServer
                    ),

                    getServerRootFSTotal(
                        selectedServer
                    ),

                    getServerCPUCores(
                        selectedServer
                    ),

                    getAppServerUptime(
                        selectedServer
                    ),

                    getAppServerUptimeSeconds(
                        selectedServer
                    ),

                    getServerCpuUsage(
                        selectedServer
                    ),

                    getServerSystemLoad(
                        selectedServer
                    ),

                    getServerRAMUsage(
                        selectedServer
                    ),

                    getServerRootFSUsage(
                        selectedServer
                    ),

                    getServerDiskUsageBreakdown(
                        selectedServer
                    ),

                    Promise.all(
                        applicationProcesses.map(
                            async (process) => ({
                                process,
                                status:
                                    await getServerAppStatus(
                                        selectedServer,
                                        process
                                    ),
                            })
                        )
                    ),

                    Promise.all(
                        applicationProcesses.map(
                            async (process) => ({
                                process,
                                history:
                                    await getServerAppStatusHistory(
                                        selectedServer,
                                        process,
                                        timeRange
                                    ),
                            })
                        )
                    ),
                ]);

                const settledValue = (result, fallback = null) =>
                    result.status === "fulfilled" ? result.value : fallback;

                const ramTotal = settledValue(ramTotalResult);
                const rootFsTotal = settledValue(rootFsTotalResult);
                const cpuCores = settledValue(cpuCoresResult);
                const uptime = settledValue(uptimeResult, "Unavailable");
                const uptimeSeconds = settledValue(uptimeSecondsResult);
                const cpuBusy = settledValue(cpuBusyResult);
                const systemLoad = settledValue(systemLoadResult);
                const ramUsage = settledValue(ramUsageResult);
                const rootFsUsage = settledValue(rootFsUsageResult);
                const diskUsageBreakdown = settledValue(
                    diskUsageBreakdownResult,
                    []
                );
                const applicationStatuses = settledValue(
                    applicationStatusesResult,
                    []
                );
                const appStatusHistory = settledValue(
                    appStatusHistoryResult,
                    []
                );

                const failedMetrics = [
                    ramTotalResult,
                    rootFsTotalResult,
                    cpuCoresResult,
                    uptimeResult,
                    cpuBusyResult,
                    systemLoadResult,
                    ramUsageResult,
                    rootFsUsageResult,
                    diskUsageBreakdownResult,
                    applicationStatusesResult,
                    appStatusHistoryResult,
                ].filter((result) => result.status === "rejected");



                /*
                 * -------------------------------------------------
                 * RAM CALCULATIONS
                 * -------------------------------------------------
                 */

                const ramUsedGiB =
                    Number.isFinite(ramTotal) && Number.isFinite(ramUsage)
                        ? ramTotal * (ramUsage / 100)
                        : null;

                const ramFreeGiB =
                    Number.isFinite(ramTotal) && Number.isFinite(ramUsedGiB)
                        ? ramTotal - ramUsedGiB
                        : null;


                /*
                 * -------------------------------------------------
                 * ROOT FS CALCULATIONS
                 *
                 * rootFsUsage is a percentage.
                 * The panel needs GiB.
                 * -------------------------------------------------
                 */

                const rootFsUsedGiB =
                    Number.isFinite(rootFsTotal) && Number.isFinite(rootFsUsage)
                        ? rootFsTotal * (rootFsUsage / 100)
                        : null;

                const rootFsFreeGiB =
                    Number.isFinite(rootFsTotal) && Number.isFinite(rootFsUsedGiB)
                        ? rootFsTotal - rootFsUsedGiB
                        : null;


                /*
                 * -------------------------------------------------
                 * UPDATE MAIN SERVER STATE
                 * -------------------------------------------------
                 */

                setServer({
                    cpuBusy,
                    systemLoad,
                    cpuCores,

                    ramTotal,
                    ramUsage,
                    ramUsedGiB,
                    ramFreeGiB,

                    rootFsTotal,
                    rootFsUsage,
                    rootFsUsedGiB,
                    rootFsFreeGiB,
                    diskUsageBreakdown,

                    uptime,
                    uptimeSeconds,

                    applicationStatus:
                        applicationStatuses.length > 0 &&
                        applicationStatuses.every(
                            (item) =>
                                Number(item.status) === 1
                        )
                            ? 1
                            : 0,
                    applicationStatuses,
                    appStatusHistory,
                });

                setLastUpdated(new Date());


                /*
                 * -------------------------------------------------
                 * UPDATE RAM STATE
                 * -------------------------------------------------
                 */

                setRAMUsage(Number.isFinite(ramUsage) ? ramUsage : null);
                setRAMLoading(false);
                setRAMError(
                    Number.isFinite(ramTotal)
                        ? null
                        : "Node exporter is down for this server, so RAM totals are unavailable."
                );

                const hasAnyMetric =
                    Number.isFinite(ramTotal) ||
                    Number.isFinite(cpuBusy) ||
                    Number.isFinite(uptimeSeconds) ||
                    applicationStatuses.length > 0;

                setError(
                    hasAnyMetric
                        ? null
                        : failedMetrics[0]?.reason?.message ||
                          "Failed to load server metrics"
                );


                /*
                 * -------------------------------------------------
                 * UPTIME GRAPH POINT
                 * -------------------------------------------------
                 */

                const now = new Date();

                const timestamp =
                    now.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    });


                setUptimeHistory(
                    (previousHistory) => {

                        const newPoint = {
                            timestamp,
                            uptimeSeconds,
                            uptime: uptime,
                            status:
                                applicationStatuses.length > 0 &&
                                applicationStatuses.every(
                                    (item) =>
                                        Number(item.status) === 1
                                )
                                    ? 1
                                    : 0,
                            statusValue:
                                applicationStatuses.length > 0 &&
                                applicationStatuses.every(
                                    (item) =>
                                        Number(item.status) === 1
                                )
                                    ? 1
                                    : 0,
                        };


                        /*
                         * Keep all observations during the
                         * current browser session.
                         *
                         * This means the graph can show the
                         * actual progression over time.
                         */

                        return [
                            ...previousHistory,
                            newPoint,
                        ];
                    }
                );

            } catch (err) {

                console.error(
                    "Failed to load server metrics:",
                    err
                );


                const message =
                    err?.message ||
                    "Failed to load server metrics";


                setError(message);


                /*
                 * RAM has its own error state.
                 */
                setRAMError(message);

            } finally {

                setLoading(false);
                setRAMLoading(false);
                setRefreshing(false);
            }
        },
        [selectedServer, timeRange]
    );


    /*
     * ---------------------------------------------------------
     * INITIAL LOAD + REFRESH
     *
         * timeRange controls the history window shown in the
         * application status timeline.
     * ---------------------------------------------------------
     */

    useEffect(() => {

        let cancelled = false;

        setUptimeHistory([]);

        const initialLoad = async () => {

            if (cancelled) {
                return;
            }

            await loadServerMetrics({
                initialLoad: true,
            });
        };


        initialLoad();

        return () => {
            cancelled = true;
        };

    }, [
        selectedServer,
        timeRange,
        loadServerMetrics,
    ]);

    useEffect(() => {
        if (!autoRefresh) {
            return undefined;
        }

        const intervalId = setInterval(
            () => {
                loadServerMetrics();
            },
            REFRESH_INTERVAL_MS
        );

        return () => {
            clearInterval(intervalId);
        };
    }, [autoRefresh, loadServerMetrics]);


    /*
     * ---------------------------------------------------------
     * RENDER
     * ---------------------------------------------------------
     */

    const appStatuses = server.applicationStatuses || [];
    const displayValue = (value, format) => {
        if (loading && (value == null || value === "Unavailable")) {
            return "Loading...";
        }
        if (value == null || value === "Unavailable") {
            return "Unavailable";
        }
        return format ? format(value) : value;
    };
    const memoryPercentage = Number.isFinite(RAMUsage)
        ? RAMUsage
        : server.ramUsage;
    const utilizationReadings = [
        server.cpuBusy,
        server.systemLoad,
        memoryPercentage,
        server.rootFsUsage,
    ].filter((value) => Number.isFinite(Number(value)));

    let criticalCount = 0;
    utilizationReadings.forEach((value) => {
        const band = interpretUtilization(Number(value));
        if (band?.label === "Critical") {
            criticalCount += 1;
        }
    });

    const allAppsUp =
        appStatuses.length > 0 &&
        appStatuses.every((item) => Number(item.status) === 1);
    const hasHealthData =
        appStatuses.length > 0 || utilizationReadings.length > 0;
    const systemsOperational =
        hasHealthData && allAppsUp && criticalCount === 0;
    const healthLabel = !hasHealthData
        ? "Metrics unavailable"
        : systemsOperational
            ? "All systems operational"
            : "Attention required";
    const healthColor = !hasHealthData
        ? "#94A3B8"
        : systemsOperational
            ? "#00843D"
            : criticalCount > 0 || !allAppsUp
                ? "#D64545"
                : "#F4B41A";

    return (
        <CompactDesktopScale>
        <Box
            w="100%"
            display="flex"
            flexDirection="column"
        >
            <PageHeader
                title="Monitoring"
                subtitle="Infrastructure & Application Health"
                mb={3}
                gap={10}
                filters={
                    <Flex
                        align="center"
                        gap={3}
                        flexWrap="wrap"
                        w={{
                            base: "100%",
                            md: "auto",
                        }}
                        justify={{
                            base: "flex-start",
                            md: "flex-end",
                        }}
                    >
                        <ServerHealthPanel
                            statuses={server.applicationStatuses}
                            cpuBusy={server.cpuBusy}
                            ramUsage={memoryPercentage}
                            diskUsage={server.rootFsUsage}
                            loading={loading}
                        />
                        <SegmentedFilterControl
                            selectedServer={selectedServer}
                            onServerChange={(event) =>
                                setSelectedServer(event.target.value)
                            }
                            autoRefresh={autoRefresh}
                            onAutoRefreshChange={setAutoRefresh}
                            onRefresh={() => loadServerMetrics()}
                            refreshing={refreshing}
                        />
                    </Flex>
                }
            />

            <Flex
                align="center"
                justify="space-between"
                gap={3}
                flexWrap="wrap"
                mb={4}
            >
                <Flex align="center" gap={2} minW={0}>
                    <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={healthColor}
                        flexShrink={0}
                    />
                    <Text fontSize="13px" fontWeight="500" color="text.primary">
                        {healthLabel}
                    </Text>
                </Flex>
                <Text fontSize="13px" color="text.muted">
                    {`Last updated ${formatLastUpdated(lastUpdated)}`}
                </Text>
            </Flex>

            {error && (
                <Box
                    mb={4}
                    p={4}
                    borderRadius="16px"
                    border="1px solid"
                    borderColor="red.200"
                    bg="red.50"
                >
                    <Text fontSize="13px" color="red.600">
                        {error}
                    </Text>
                </Box>
            )}

            <Box
                display="flex"
                flexDirection="column"
                gap={4}
            >
                <Box
                    display="grid"
                    gridTemplateColumns={{
                        base: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        xl: "repeat(5, minmax(0, 1fr))",
                    }}
                    gap={3}
                >
                    <MonitoringStatCard2
                        title="RAM Total"
                        value={displayValue(
                            server.ramTotal,
                            (value) => `${value} GiB`
                        )}
                    />
                    <MonitoringStatCard2
                        title="Application RootFS Total"
                        value={displayValue(
                            server.rootFsTotal,
                            (value) => `${value} GiB`
                        )}
                    />
                    <MonitoringStatCard2
                        title="CPU Cores"
                        value={displayValue(server.cpuCores)}
                    />
                    <MonitoringStatCard2
                        title="Physical Server Uptime"
                        value={displayValue(server.uptime)}
                    />
                    <MonitoringStatCard2
                        title="Application Servers"
                        value={
                            loading && appStatuses.length === 0
                                ? "Loading..."
                                : appStatuses.length
                        }
                        subtitle="monitored servers"
                    />
                </Box>

                <Box
                    display="grid"
                    gridTemplateColumns={{
                        base: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        xl: "repeat(4, minmax(0, 1fr))",
                    }}
                    gap={3}
                >
                    <MonitoringStatCard
                        title="CPU Busy"
                        value={displayValue(
                            server.cpuBusy,
                            (value) => `${Number(value).toFixed(1)}%`
                        )}
                        type="gauge"
                        percentage={server.cpuBusy ?? 0}
                    />
                    <MonitoringStatCard
                        title="Sys Load"
                        value={displayValue(
                            server.systemLoad,
                            (value) => `${Number(value).toFixed(1)}%`
                        )}
                        type="gauge"
                        percentage={server.systemLoad ?? 0}
                    />
                    <MonitoringStatCard
                        title="RAM Used"
                        value={
                            RAMLoading
                                ? "Loading..."
                                : RAMError
                                    ? "Unavailable"
                                    : displayValue(
                                        memoryPercentage,
                                        (value) => `${Number(value).toFixed(1)}%`
                                    )
                        }
                        type="gauge"
                        percentage={memoryPercentage ?? 0}
                        caption={formatGiBCaption(
                            server.ramUsedGiB,
                            server.ramTotal
                        )}
                    />
                    <MonitoringStatCard
                        title="Application RootFS Used"
                        value={displayValue(
                            server.rootFsUsage,
                            (value) => `${Number(value).toFixed(1)}%`
                        )}
                        type="gauge"
                        percentage={server.rootFsUsage ?? 0}
                        caption={ROOT_FS_CAPTION}
                    />
                </Box>

                <Box
                    display="grid"
                    gridTemplateColumns={{
                        base: "1fr",
                        xl: "minmax(0, 1.4fr) minmax(0, 1fr)",
                    }}
                    gap={3}
                    alignItems="start"
                >
                    <ServerStatusPanel
                        status={server.applicationStatus}
                        statuses={server.applicationStatuses}
                        statusHistory={server.appStatusHistory}
                        uptimeHistory={uptimeHistory}
                        loading={loading}
                        timeRange={timeRange}
                        onTimeRangeChange={(event) =>
                            setTimeRange(event.target.value)
                        }
                        timeRangeOptions={TIME_RANGE_OPTIONS}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={3}
                    >
                        <DiskSpacePanel
                            disks={server.diskUsageBreakdown}
                        />
                        <MemoryPanel
                            total={server.ramTotal}
                            used={server.ramUsedGiB}
                            free={server.ramFreeGiB}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
        </CompactDesktopScale>
    );
};


export default ServerDashboard;