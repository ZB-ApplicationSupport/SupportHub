import React from "react";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { NAV_ITEMS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import NavItem from "./NavItem";
import logo from "../../Assets/logoWhite.png";

const SidebarContent = ({ onClose }) => {
  const { user } = useAppContext();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const bg = useColorModeValue("brand.600", "slate.900");
  const borderColor = useColorModeValue("brand.700", "slate.700");

  return (
    <Box
      bg={bg}
      w={{ base: "full", lg: 64 }}
      borderRightWidth={{ base: 0, lg: "1px" }}
      borderColor={borderColor}
      h="100dvh"
      px={6}
      py={6}
      overflowY="auto"
      position="sticky"
      top={0}
    >
      <Flex align="center" justify="space-between" mb={8}>
        <img
          src={logo}
          alt="ZB Logo"
          style={{ height: "100px" }}
        />

        {onClose && (
          <IconButton
            aria-label="Close navigation"
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            display={{ base: "inline-flex", lg: "none" }}
            onClick={onClose}
          />
        )}
      </Flex>

      <Stack spacing={2} flex="1">
        {items.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </Stack>

      <Box mt={6}>
      </Box>
    </Box>
  );
};



const Sidebar = ({ isOpen, onClose }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  if (isDesktop) {
    return <SidebarContent />;
  }

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay />
      <DrawerContent>
        <SidebarContent onClose={onClose} />
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
