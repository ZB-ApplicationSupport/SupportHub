import React from "react";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CaseStatusChart = ({ data = [] }) => {
    const gridColor = useColorModeValue("#E2E8F0", "#4A5568");
    const textColor = useColorModeValue("#4A5568", "#CBD5E0");
    const tooltipBg = useColorModeValue("#FFFFFF", "#1A202C");

    return (
        <Box >

            <Box width="100%" height="210px">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 0,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={gridColor}
                            />

                            <XAxis
                                dataKey="status"
                                tick={{ fill: textColor, fontSize: 12 }}
                                axisLine={{ stroke: gridColor }}
                                tickLine={false}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: textColor, fontSize: 12 }}
                                axisLine={{ stroke: gridColor }}
                                tickLine={false}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    borderRadius: "8px",
                                    border: `1px solid ${gridColor}`,
                                }}
                                formatter={(value) => [
                                    value,
                                    "Cases",
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#00843D"
                                strokeWidth={3}
                                dot={{
                                    r: 5,
                                    strokeWidth: 2,
                                }}
                                activeDot={{
                                    r: 7,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <Box
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        No case data available
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CaseStatusChart;