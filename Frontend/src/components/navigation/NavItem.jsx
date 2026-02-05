import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

const NavItem = ({ item }) => {

  return (
    <Box
      as={NavLink}
      to={item.path}
      aria-label={item.label}
      color="white"
      _activeLink={{
        bg: "white",
        color: "brand.600",
        pointerEvents: "none",
        _dark: { bg: "white", color: "slate.900" },
      }}
      _hover={{
        bgColor: "brand.500",
        color: "white",
        _dark: { bg: "slate.800", color: "white" },
      }}
      px={4}
      py={3}
      borderRadius="lg"
    >
      <Flex align="center" justify="space-between">
        <Text fontWeight="600">{item.label}</Text>
      </Flex>
    </Box>
  );
};

export default NavItem;

