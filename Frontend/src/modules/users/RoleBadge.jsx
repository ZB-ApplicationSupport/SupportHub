import React from "react";
import { Badge } from "@chakra-ui/react";

const roleColors = {
  Admin: "purple",
  Agent: "blue",
  Viewer: "gray",
};

const RoleBadge = ({ role }) => {
  return <Badge colorScheme={roleColors[role] || "gray"}>{role}</Badge>;
};

export default RoleBadge;
