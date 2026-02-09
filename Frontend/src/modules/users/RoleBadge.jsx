import React from "react";
import { Badge } from "@chakra-ui/react";

const roleColors = {
  Admin: "purple",
  User: "blue",
};

const RoleBadge = ({ role }) => {
  return <Badge colorScheme={roleColors[role] || "gray"}>{role}</Badge>;
};

export default RoleBadge;
