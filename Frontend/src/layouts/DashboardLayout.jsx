import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Sidebar from "../components/navigation/Sidebar";
import TopNav from "../components/navigation/TopNav";

const DashboardLayout = () => {
  const mobileNav = useDisclosure();
  return (
    <Flex minH="100vh" bg="surface.subtle">
      <Sidebar isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} />
      <Box flex="1" minW="0">
        <TopNav onOpen={mobileNav.onOpen} />
        <Box as="main" px={{ base: 4, md: 8 }} py={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
