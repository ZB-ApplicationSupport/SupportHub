import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    DropdownSelect,
} from "../../../components/ui";
import { CHART_SERIES } from "../../../theme/chartColors";

const SERIES_COLORS = CHART_SERIES;
const CHART_HEIGHT = 220;

const formatAppServerLabel = (process) => {
    if (!process) return "App server";
    const match = String(process).match(/^server\s*(\d+)$/i);
    if (match) {
        return `Server ${match[1]}`;
    }
    return String(process);
};

const availabilityFromPoint = (point) =>
    Number(point?.statusValue ?? point?.status) === 1 ? 100 : 0;

const formatAxisTime = (value, chartData) => {
    const point = chartData.find((item) => item.sampledAt === value);
    if (!point?.timestamp) {
        return "";
    }
    return String(point.timestamp).replace(/:\d{2}$/, "");
};

const formatTooltipTime = (point) => {
    if (point?.sampledAt) {
        const date = new Date(point.sampledAt);
        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            });
        }
    }
    return point?.timestamp || "";
};

const mergeAvailabilitySeries = (rows) => {
    const byTime = new Map();

    rows.forEach((row) => {
        const key = row.process;
        (row.history || []).forEach((point) => {
            const sampledAt = point.sampledAt || point.timestamp;
            if (!sampledAt) return;

            if (!byTime.has(sampledAt)) {
                byTime.set(sampledAt, {
                    sampledAt,
                    timestamp: point.timestamp,
                    sampleTime: Number(point.sampleTime) || 0,
                });
            }

            byTime.get(sampledAt)[key] = availabilityFromPoint(point);
        });
    });

    return Array.from(byTime.values()).sort((a, b) => {
        const aTime = a.sampleTime || Date.parse(a.sampledAt) || 0;
        const bTime = b.sampleTime || Date.parse(b.sampledAt) || 0;
        return aTime - bTime;
    });
};

const AvailabilityTooltip = ({
    active,
    payload,
    series,
}) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0]?.payload || {};
    const timeLabel = formatTooltipTime(point);

    return (
        <Box
            bg="white"
            _dark={{ bg: "#1A211D" }}
            border="1px solid"
            borderColor="border.default"
            borderRadius="12px"
            px={3.5}
            py={2.5}
            boxShadow="card"
            minW="160px"
        >
            <Text fontSize="12px" color="text.muted" mb={2}>
                {timeLabel}
            </Text>
            {series.map((item) => {
                const entry = payload.find((row) => row.dataKey === item.key);
                const value = entry?.value;
                if (value == null) {
                    return null;
                }

                return (
                    <Box key={item.key} mb={series.length > 1 ? 2 : 0}>
                        <Text
                            fontSize="11px"
                            fontWeight="600"
                            letterSpacing="0.04em"
                            textTransform="uppercase"
                            color="text.primary"
                            mb={0.5}
                        >
                            {item.label}
                        </Text>
                        <Flex
                            align="center"
                            justify="space-between"
                            gap={4}
                        >
                            <Flex align="center" gap={2} minW={0}>
                                <Box
                                    w="8px"
                                    h="8px"
                                    borderRadius="full"
                                    bg={item.color}
                                    flexShrink={0}
                                />
                                <Text
                                    fontSize="12px"
                                    fontWeight="500"
                                    color="text.muted"
                                    noOfLines={1}
                                >
                                    Availability
                                </Text>
                            </Flex>
                            <Text fontSize="12px" fontWeight="600" color="text.primary">
                                {value}%
                            </Text>
                        </Flex>
                    </Box>
                );
            })}
        </Box>
    );
};

const ServerStatusPanel = ({
                               status,
                               statuses = [],
                               statusHistory = [],
                               uptimeHistory = [],
                               loading = false,
                               timeRange,
                               onTimeRangeChange,
                               timeRangeOptions = [],
                           }) => {
    const gridStroke = useColorModeValue("#E2E8F0", "#2A332E");
    const tickFill = useColorModeValue("#64748B", "#8B968F");
    const paperFill = useColorModeValue("#FFFFFF", "#1A211D");

    const currentStatuses = statuses.length > 0
        ? statuses
        : [
            {
                process: "server1",
                status,
            },
        ];
    const fallbackHistory = uptimeHistory.map((point) => ({
        ...point,
        sampledAt: point.sampledAt || point.timestamp,
        barValue: 1,
        statusValue:
            Number(point.statusValue ?? point.status) === 1
                ? 1
                : 0,
        statusLabel:
            Number(point.statusValue ?? point.status) === 1
                ? "Up"
                : "Down",
    }));

    const statusRows = statusHistory.length > 0
        ? statusHistory
        : [
            {
                process: "server1",
                history: fallbackHistory,
            },
        ];

    const processOptions = Array.from(
        new Set([
            ...currentStatuses.map((item) => item.process),
            ...statusRows.map((row) => row.process),
        ])
    ).filter(Boolean);

    const [
        selectedProcess,
        setSelectedProcess,
    ] = useState("all");

    useEffect(() => {
        if (
            selectedProcess !== "all" &&
            !processOptions.includes(selectedProcess)
        ) {
            setSelectedProcess("all");
        }
    }, [processOptions, selectedProcess]);

    const visibleStatusRows = selectedProcess === "all"
        ? statusRows
        : statusRows.filter(
            (row) => row.process === selectedProcess
        );

    const chartData = useMemo(
        () => mergeAvailabilitySeries(visibleStatusRows),
        [visibleStatusRows]
    );

    const series = visibleStatusRows.map((row, index) => ({
        key: row.process,
        label: formatAppServerLabel(row.process),
        color: SERIES_COLORS[index % SERIES_COLORS.length],
    }));

    const hasSamples = chartData.length > 0 && series.some((item) =>
        chartData.some((point) => Number.isFinite(point[item.key]))
    );

    return (
        <Box
            bg="surface.card"
            border="1px solid"
            borderColor="border.default"
            borderRadius="16px"
            boxShadow="card"
            overflow="hidden"
            w="100%"
            h="100%"
            minH="280px"
            display="flex"
            flexDirection="column"
        >
            <Flex
                align={{ base: "flex-start", md: "center" }}
                justify="space-between"
                direction={{ base: "column", md: "row" }}
                gap={3}
                px={5}
                pt={5}
                pb={3}
                flexShrink={0}
            >
                <Box>
                    <Text
                        fontSize="14px"
                        fontWeight="500"
                        color="text.primary"
                    >
                        Application Availability
                    </Text>
                </Box>

                <Flex align="center" gap={2} flexWrap="wrap">
                    {timeRangeOptions.length > 0 && (
                        <DropdownSelect
                            label="Time range"
                            size="sm"
                            w="170px"
                            value={timeRange}
                            onChange={onTimeRangeChange}
                            options={timeRangeOptions}
                        />
                    )}
                    {processOptions.length > 1 && (
                        <DropdownSelect
                            label="App server"
                            size="sm"
                            w="170px"
                            value={selectedProcess}
                            onChange={(event) =>
                                setSelectedProcess(event.target.value)
                            }
                            options={[
                                {
                                    value: "all",
                                    label: "All app servers",
                                },
                                ...processOptions.map((process) => ({
                                    value: process,
                                    label: formatAppServerLabel(process),
                                })),
                            ]}
                        />
                    )}
                </Flex>
            </Flex>

            <Box
                px={5}
                pb={4}
                flex="1"
                minH={0}
                display="flex"
                flexDirection="column"
            >
                {loading && !hasSamples ? (
                    <Flex
                        flex="1"
                        minH={`${CHART_HEIGHT}px`}
                        align="center"
                        justify="center"
                    >
                        <Text fontSize="13px" color="text.muted">
                            Loading availability history
                        </Text>
                    </Flex>
                ) : !hasSamples ? (
                    <Flex
                        flex="1"
                        minH={`${CHART_HEIGHT}px`}
                        align="center"
                        justify="center"
                        border="1px dashed"
                        borderColor="border.default"
                        borderRadius="12px"
                        bg="surface.subtle"
                    >
                        <Text fontSize="13px" color="text.muted">
                            No status samples available for this time range
                        </Text>
                    </Flex>
                ) : (
                    <>
                        <Box
                            w="100%"
                            minW={0}
                            h={`${CHART_HEIGHT}px`}
                            position="relative"
                        >
                            <ResponsiveContainer
                                width="100%"
                                height={CHART_HEIGHT}
                                minWidth={1}
                                minHeight={CHART_HEIGHT}
                                debounce={50}
                            >
                                <AreaChart
                                    data={chartData}
                                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        {series.map((item) => (
                                            <linearGradient
                                                key={item.key}
                                                id={`availability-${item.key}`}
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor={item.color}
                                                    stopOpacity={0.22}
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor={item.color}
                                                    stopOpacity={0.02}
                                                />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={gridStroke}
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="sampledAt"
                                        interval="preserveStartEnd"
                                        minTickGap={28}
                                        tickFormatter={(value) =>
                                            formatAxisTime(value, chartData)
                                        }
                                        tick={{
                                            fill: tickFill,
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        type="number"
                                        domain={[0, 100]}
                                        ticks={[0, 25, 50, 75, 100]}
                                        tickFormatter={(value) => `${value}%`}
                                        tick={{
                                            fill: tickFill,
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={44}
                                        padding={{ top: 0, bottom: 0 }}
                                    />
                                    <Tooltip
                                        shared
                                        isAnimationActive={false}
                                        content={<AvailabilityTooltip series={series} />}
                                        cursor={{
                                            stroke: gridStroke,
                                            strokeWidth: 1,
                                        }}
                                    />
                                    {series.map((item) => (
                                        <Area
                                            key={item.key}
                                            type="monotone"
                                            dataKey={item.key}
                                            name={item.label}
                                            stroke={item.color}
                                            fill={`url(#availability-${item.key})`}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{
                                                r: 4,
                                                stroke: item.color,
                                                strokeWidth: 2,
                                                fill: paperFill,
                                            }}
                                            isAnimationActive={false}
                                            connectNulls
                                        />
                                    ))}
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>

                        <Flex
                            mt={3}
                            gap={4}
                            flexWrap="wrap"
                            justify="center"
                            flexShrink={0}
                        >
                            {series.map((item) => (
                                <Flex key={item.key} align="center" gap={2}>
                                    <Box
                                        w="8px"
                                        h="8px"
                                        borderRadius="full"
                                        bg={item.color}
                                    />
                                    <Text fontSize="12px" color="text.muted">
                                        {item.label}
                                    </Text>
                                </Flex>
                            ))}
                        </Flex>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ServerStatusPanel;
