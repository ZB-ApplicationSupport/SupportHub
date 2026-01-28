import React from "react";
import { SimpleGrid, Select } from "@chakra-ui/react";

const CaseFilters = ({
  status,
  priority,
  system,
  sortKey,
  direction,
  onStatusChange,
  onPriorityChange,
  onSystemChange,
  onSortChange,
  onDirectionChange,
}) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 5 }} spacing={3}>
      <Select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="Pending">Pending</option>
        <option value="Escalated">Escalated</option>
        <option value="Closed">Closed</option>
      </Select>
      <Select
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </Select>
      <Select
        value={system}
        onChange={(event) => onSystemChange(event.target.value)}
        aria-label="Filter by system"
      >
        <option value="">All Systems</option>
        <option value="Core Banking">Core Banking</option>
        <option value="Payments Hub">Payments Hub</option>
        <option value="Digital Channels">Digital Channels</option>
        <option value="Treasury">Treasury</option>
        <option value="ATM Switch">ATM Switch</option>
      </Select>
      <Select
        value={sortKey}
        onChange={(event) => onSortChange(event.target.value)}
        aria-label="Sort by"
      >
        <option value="openedAt">Date Opened</option>
        <option value="priority">Priority</option>
        <option value="status">Status</option>
        <option value="system">System</option>
      </Select>
      <Select
        value={direction}
        onChange={(event) => onDirectionChange(event.target.value)}
        aria-label="Sort direction"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </Select>
    </SimpleGrid>
  );
};

export default CaseFilters;
