import React from "react";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const CasesBySystemChart = ({ data }) => {
  const barColor = useColorModeValue("#005ce6", "#4d94ff");
  const tooltipBg = useColorModeValue("white", "#1a202c");

  return (
    <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px">
      <Heading size="sm" mb={4}>
        Cases per System
      </Heading>
      <Box h="260px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="system" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: tooltipBg,
                borderRadius: "8px",
                borderColor: "transparent",
              }}
            />
            <Line dataKey="cases" stroke={barColor} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CasesBySystemChart;
