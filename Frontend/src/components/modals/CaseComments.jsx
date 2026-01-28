import React from "react";
import { Box, Stack, Text } from "@chakra-ui/react";

const CaseComments = ({ items }) => {
  return (
    <Stack spacing={4}>
      {items.length === 0 ? (
        <Text fontSize="sm" color="text.muted">
          No comments recorded for this case.
        </Text>
      ) : (
        items.map((item) => (
          <Box key={item.id} p={4} bg="surface.subtle" borderRadius="lg">
            <Text fontWeight="600">{item.author}</Text>
            <Text fontSize="sm" mt={1}>
              {item.message}
            </Text>
            <Text fontSize="xs" color="text.muted" mt={2}>
              {item.at}
            </Text>
          </Box>
        ))
      )}
    </Stack>
  );
};

export default CaseComments;
