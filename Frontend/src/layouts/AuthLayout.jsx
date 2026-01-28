import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import ColorModeToggle from "../components/common/ColorModeToggle";

const AuthLayout = () => {
  return (
    <Flex minH="100vh" bg="surface.bg" direction="column">
      <Flex
        justify="space-between"
        align="center"
        px={{ base: 6, lg: 10 }}
        py={4}
      >
        <Heading size="md" color="brand.600">
          Case Tracker
        </Heading>
        <ColorModeToggle />
      </Flex>
      <Flex flex="1" align="center" justify="center" px={6} py={10}>
        <Box w="full" maxW="md">
          <Outlet />
          <Text
            mt={8}
            fontSize="xs"
            color="text.muted"
            textAlign="center"
          >
            Secure enterprise support experience. UI only, no backend.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default AuthLayout;
