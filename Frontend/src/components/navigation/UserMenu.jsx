import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Button,
  Text,
  Stack,
} from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";
import { ROLES } from "../../utils/constants";

const UserMenu = () => {
  const { user, setRole } = useAppContext();

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" px={2}>
        <Stack direction="row" align="center" spacing={3}>
          <Avatar name={user.name} size="sm" />
          <Stack spacing={0} textAlign="left">
            <Text fontSize="sm" fontWeight="600">
              {user.name}
            </Text>
            <Text fontSize="xs" color="text.muted">
              {user.role}
            </Text>
          </Stack>
        </Stack>
      </MenuButton>
      <MenuList>
        <MenuItem isDisabled fontWeight="600">
          Switch Role
        </MenuItem>
        {ROLES.map((role) => (
          <MenuItem key={role} onClick={() => setRole(role)}>
            {role}
          </MenuItem>
        ))}
        <MenuItem isDisabled>Logout (UI only)</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
