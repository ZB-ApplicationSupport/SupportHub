import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { SurfaceCard } from "../../../components/ui";

const STATUS_BAR_COLOR = {
  Active: "#00843D",
  Inactive: "#94A3B8",
  Degraded: "#F4B41A",
  Down: "#D64545",
};

const SystemsByStatusCard = ({ data = [] }) => {
  const rows = (data || [])
    .filter((item) => item && item.status)
    .map((item) => ({
      status: item.status,
      value: Number(item.value) || 0,
    }));
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <SurfaceCard
      p={5}
      minH="280px"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Heading fontSize="14px" fontWeight="500" mb={4} color="text.primary">
        Systems by status
      </Heading>
      <Box flex="1" w="100%" minH="160px">
        {rows.length === 0 ? (
          <Flex w="100%" minH="160px" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No supported systems to display
            </Text>
          </Flex>
        ) : (
          rows.map((row) => {
            const width = `${Math.max((row.value / max) * 100, row.value > 0 ? 6 : 0)}%`;
            const color = STATUS_BAR_COLOR[row.status] || "#64748B";

            return (
              <Flex key={row.status} align="center" gap={3} py={2.5}>
                <Text
                  w={{ base: "72px", md: "88px" }}
                  flexShrink={0}
                  fontSize="11px"
                  fontWeight="600"
                  letterSpacing="0.04em"
                  textTransform="uppercase"
                  color="text.muted"
                  noOfLines={1}
                >
                  {row.status}
                </Text>
                <Box
                  flex="1"
                  h="10px"
                  bg="surface.subtle"
                  borderRadius="6px"
                  overflow="hidden"
                  minW={0}
                >
                  <Box h="100%" w={width} bg={color} borderRadius="6px" />
                </Box>
                <Text
                  w="28px"
                  flexShrink={0}
                  textAlign="right"
                  fontSize="13px"
                  fontWeight="600"
                  color="text.primary"
                >
                  {row.value}
                </Text>
              </Flex>
            );
          })
        )}
      </Box>
    </SurfaceCard>
  );
};

export default SystemsByStatusCard;
