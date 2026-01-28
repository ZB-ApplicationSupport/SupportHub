import React from "react";
import {
  Box,
  Heading,
  Stack,
  Text,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { STATUS_COLORS } from "../../utils/constants";

const RecentCasesList = ({ items }) => {
  return (
    <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px">
      <Heading size="sm" mb={4}>
        Recently Updated Cases
      </Heading>
      <Stack spacing={4}>
        {items.map((item) => (
          <Flex key={item.id} justify="space-between" align="center">
            <Box>
              <Text fontWeight="600">{item.summary}</Text>
              <Text fontSize="xs" color="text.muted">
                {item.id} · {item.system}
              </Text>
            </Box>
            <Badge colorScheme={STATUS_COLORS[item.status] || "gray"}>
              {item.status}
            </Badge>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default RecentCasesList;
