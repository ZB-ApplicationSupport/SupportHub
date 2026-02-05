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
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

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
          Role: {user.role}
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
