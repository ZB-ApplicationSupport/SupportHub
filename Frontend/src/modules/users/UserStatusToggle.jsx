import React from "react";
import { Switch } from "@chakra-ui/react";

const UserStatusToggle = ({ active }) => {
  return (
    <Switch
      isChecked={active}
      colorScheme="brand"
      aria-label={active ? "User enabled" : "User disabled"}
    />
  );
};

export default UserStatusToggle;
