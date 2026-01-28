import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <Box
      bg="surface.card"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border.default"
      p={{ base: 6, md: 8 }}
      boxShadow="lg"
    >
      <Heading size="lg" mb={2}>
        {title}
      </Heading>
      <Text color="text.muted" mb={6}>
        {subtitle}
      </Text>
      {children}
    </Box>
  );
};

export default AuthCard;
