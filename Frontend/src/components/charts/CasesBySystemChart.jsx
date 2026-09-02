import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#00843D",
    "#005CB9",
    "#F4B41A",
    "#D64545",
    "#6B7280",
    "#7A5AF8",
];

const CasesBySystemChart = ({ data = [] }) => {
    const chartData = data.filter(
        (item) => item && item.system && Number(item.cases) > 0
    );

    const totalCases = chartData.reduce(
        (total, item) => total + Number(item.cases),
        0
    );

    return (
        <Box
            bg="surface.card"
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="gray.200"
            height="100%"
        >
            <Heading size="sm">
                Cases by System
            </Heading>

            {chartData.length === 0 ? (
                <Box
                    height="200px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text color="text.muted" fontSize="sm">
                        No case data available
                    </Text>
                </Box>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={4}
                    height="200px"
                >
                    {/* Pie Chart */}
                    <Box flex="1" minW={0} height="200px">
                        <ResponsiveContainer width="100%" >
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="cases"
                                    nameKey="system"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${entry.system}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value} cases`,
                                        name,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>

                    {/* Legend */}
                    <Box
                        width="42%"
                        maxHeight="220px"
                        overflowY="auto"
                        pr={1}
                    >
                        {chartData.map((entry, index) => (
                            <Box
                                key={entry.system}
                                display="flex"
                                alignItems="center"
                                mb={3}
                            >
                                <Box
                                    width="10px"
                                    height="10px"
                                    borderRadius="sm"
                                    bg={COLORS[index % COLORS.length]}
                                    mr={2}
                                    flexShrink={0}
                                />

                                <Box minW={0}>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="500"
                                        noOfLines={1}
                                    >
                                        {entry.system}
                                    </Text>

                                    <Text
                                        fontSize="xs"
                                        color="text.muted"
                                    >
                                        {entry.cases} cases
                                    </Text>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {chartData.length > 0 && (
                <Box
                    mt={2}
                    pt={3}
                    borderTopWidth="1px"
                    borderColor="gray.100"
                >
                    <Text fontSize="xs" color="text.muted">
                        Total cases across systems:{" "}
                        <Text as="span" fontWeight="600" color="text.primary">
                            {totalCases}
                        </Text>
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default CasesBySystemChart;