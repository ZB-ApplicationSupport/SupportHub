import React from "react";
import { Badge } from "@chakra-ui/react";

const roleColors = {
  ADMIN: "purple",
  USER: "blue",
};

const RoleBadge = ({ role }) => {
  return <Badge colorScheme={roleColors[role] || "gray"}>{role}</Badge>;
};

export default RoleBadge;
