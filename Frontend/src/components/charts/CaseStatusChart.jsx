import React from "react";
import { Box, Heading, useColorModeValue, SimpleGrid } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const defaultPalette = ["#ff7a45", "#2f855a", "#e53e3e", "#d69e2e"];

const CaseStatusChart = ({ data, palette = defaultPalette }) => {
  const tooltipBg = useColorModeValue("white", "#1a202c");

  return (
  <Box bg="surface.card" p={4} borderRadius="xl" borderWidth="1px">
  <Heading size="sm" mb={3}>
    Case Status Distribution
  </Heading>

  <SimpleGrid columns={1}>
    <Box display="flex" gap={4} height="100%">
      <Box flex="2">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={data}
              nameKey="status"
              innerRadius={35}
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.status}
                  fill={palette[index % palette.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: tooltipBg,
                borderRadius: "8px",
                borderColor: "transparent",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend (1/3 width) */}
      <Box flex="1" display="flex" alignItems="center" justifyContent="flex-start">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {data.map((entry, index) => (
            <li
              key={entry.status}
              style={{
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: palette[index % palette.length],
                  display: "inline-block",
                  borderRadius: 4,
                  marginRight: 6,
                }}
              />
              {entry.status}
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  </SimpleGrid>
</Box>

  );
};

export default CaseStatusChart;
