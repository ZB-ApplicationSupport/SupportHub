import React from "react";
import { Switch } from "@chakra-ui/react";

const UserStatusToggle = ({
  active,
  onChange,
  isLoading,
}) => {
  return (
    <Switch
      isChecked={active}
      onChange={onChange}
      isDisabled={isLoading}
      colorScheme="green"
      size="md"
    />
  );
};

export default UserStatusToggle;