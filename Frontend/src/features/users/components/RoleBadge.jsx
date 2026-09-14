import React from "react";
import { StatusDot } from "../../../components/ui";

const ROLE_COLORS = {
  ADMIN: "#00843D",
  USER: "#F4B41A",
};

const RoleBadge = ({ role }) => (
  <StatusDot color={ROLE_COLORS[role] || "#6B7280"} label={role || "USER"} />
);

export default RoleBadge;
