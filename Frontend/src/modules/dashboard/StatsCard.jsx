import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const StatsCard = ({ label, value, helper }) => {
  return (
    <Box bg="surface.card" p={5} borderRadius="xl" borderWidth="1px">
      <Text fontSize="sm" color="text.muted">
        {label}
      </Text>
      <Heading size="lg" mt={2}>
        {value}
      </Heading>
      {helper && (
        <Text fontSize="xs" color="text.muted" mt={1}>
          {helper}
        </Text>
      )}
    </Box>
  );
};

export default StatsCard;
