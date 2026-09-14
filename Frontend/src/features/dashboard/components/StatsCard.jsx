import React from "react";
import { StatCard } from "../../../components/ui";

const StatsCard = ({
  label,
  value,
  delta,
  trend,
  icon,
  iconBg,
  iconColor,
  hint,
}) => {
  return (
    <StatCard
      label={label}
      value={value}
      delta={delta}
      trend={trend}
      icon={icon}
      iconBg={iconBg}
      iconColor={iconColor}
      hint={hint}
    />
  );
};

export default StatsCard;
