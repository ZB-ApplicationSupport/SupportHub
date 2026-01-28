import React from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { STATUS_COLORS } from "../../utils/constants";

const CaseTimeline = ({ items }) => {
  return (
    <Stack spacing={3}>
      {items.length === 0 ? (
        <Text fontSize="sm" color="text.muted">
          No status history available.
        </Text>
      ) : (
        items.map((item, index) => (
          <Box
            key={`${item.at}-${index}`}
            borderLeftWidth="2px"
            borderColor="border.default"
            pl={4}
          >
            <Text
              fontWeight="600"
              color={`${STATUS_COLORS[item.status] || "gray"}.500`}
            >
              {item.status}
            </Text>
            <Text fontSize="xs" color="text.muted">
              {item.at} · {item.by}
            </Text>
          </Box>
        ))
      )}
    </Stack>
  );
};

export default CaseTimeline;
