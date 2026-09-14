import React from "react";
import { StatCard } from "../../../components/ui";

const formatCount = (value) =>
  value == null ? "—" : Number(value).toLocaleString("en-GB");

const MonitorStatCard = ({ stat, loading, onOpen }) => {
  const clickable = typeof onOpen === "function" && !stat.unavailable && !loading;

  let hint = stat.hint;
  if (loading) hint = "Loading live count";
  else if (stat.unavailable) hint = "Could not load this count";
  else if (clickable) hint = `View ${formatCount(stat.count)} records`;

  return (
    <StatCard
      label={stat.label}
      value={loading ? "…" : formatCount(stat.count)}
      hint={hint}
      labelNoOfLines={1}
      labelFontSize="11px"
      compact
      onClick={clickable ? onOpen : undefined}
    />
  );
};

export default MonitorStatCard;
