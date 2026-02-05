import React from "react";
import {
  Badge,
  Box,
  Flex,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import ColorModeToggle from "../common/ColorModeToggle";
import UserMenu from "./UserMenu";
import { useAppContext } from "../../context/AppContext";

const TopNav = ({ onOpen }) => {
  const { user } = useAppContext();
  const bg = useColorModeValue("surface.bg", "slate.900");

  return (
    <Flex
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8 }}
      py={4}
      bg={bg}
      position="sticky"
      top={0}                 
      zIndex={10}   
      boxShadow="sm"          
    >
      <Flex align="center" gap={3}>
        <IconButton
          aria-label="Open navigation"
          icon={<HamburgerIcon />}
          variant="ghost"
          display={{ base: "inline-flex", lg: "none" }}
          onClick={onOpen}
        />
        <Box />
      </Flex>

      <Stack direction="row" align="center" spacing={4}>
        <Badge colorScheme="secondary" variant="subtle">
          {user.department}
        </Badge>
        <ColorModeToggle />
        <UserMenu />
      </Stack>
    </Flex>

  );
};

export default TopNav;
