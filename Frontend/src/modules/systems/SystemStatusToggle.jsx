import React from "react";
import { Switch } from "@chakra-ui/react";

const SystemStatusToggle = ({ active, onToggle }) => {
  return (
    <Switch
      isChecked={active}
      colorScheme="brand"
      aria-label={active ? "System active" : "System inactive"}
      onChange={(event) => onToggle(event.target.checked)}
    />
  );
};

export default SystemStatusToggle;
