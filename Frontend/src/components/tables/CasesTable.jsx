import React from "react";
import {
  Box,
  HStack,
  Icon,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import CaseRow from "./CaseRow";

const FilterFunnelIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M4 5c0-.55.45-1 1-1h14a1 1 0 0 1 .8 1.6l-5.8 7.73v4.42a1 1 0 0 1-1.45.9l-2.5-1.25a1 1 0 0 1-.55-.9v-3.17L4.2 5.6A1 1 0 0 1 4 5z"
    />
  </Icon>
);

const CasesTable = ({
  items = [],
  isLoading = false,
  onOpenCase,
  onEditCase,
  query,
  status,
  priority,
  system,
  onQueryChange,
  onStatusChange,
  onPriorityChange,
  onSystemChange,
  sortKey,
  direction,
  onSortChange,
  onDirectionChange,
}) => {
  const handleSort = (nextKey) => {
    if (!onSortChange || !onDirectionChange) return;
    if (sortKey === nextKey) {
      onDirectionChange(direction === "asc" ? "desc" : "asc");
      return;
    }
    onSortChange(nextKey);
    onDirectionChange("asc");
  };

  const renderSortLabel = (label, key) => {
    const isActive = sortKey === key;
    if (!isActive) return label;
    const suffix = direction === "asc" ? " (asc)" : " (desc)";
    return `${label}${suffix}`;
  };

  const getFilterColor = (value) => (value ? "brand.500" : "gray.400");

  return (
    <Box bg="surface.card" borderRadius="xl" borderWidth="1px">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort("id")}>
                <HStack spacing={2}>
                  <Text as="span">{renderSortLabel("Case ID", "id")}</Text>
                  <Popover placement="bottom-start">
                    <PopoverTrigger>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={<FilterFunnelIcon boxSize={3.5} />}
                        aria-label="Filter by case ID or summary"
                        color={getFilterColor(query)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </PopoverTrigger>
                    <PopoverContent onClick={(event) => event.stopPropagation()}>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Case ID or Summary</PopoverHeader>
                      <PopoverBody>
                        <Input
                          size="sm"
                          placeholder="Search ID or summary"
                          value={query}
                          onChange={(event) => onQueryChange(event.target.value)}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("system")}>
                <HStack spacing={2}>
                  <Text as="span">{renderSortLabel("System", "system")}</Text>
                  <Popover placement="bottom-start">
                    <PopoverTrigger>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={<FilterFunnelIcon boxSize={3.5} />}
                        aria-label="Filter by system"
                        color={getFilterColor(system)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </PopoverTrigger>
                    <PopoverContent onClick={(event) => event.stopPropagation()}>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>System</PopoverHeader>
                      <PopoverBody>
                        <Select
                          size="sm"
                          value={system}
                          onChange={(event) => onSystemChange(event.target.value)}
                        >
                          <option value="">All</option>
                          <option value="Core Banking">Core Banking</option>
                          <option value="Payments Hub">Payments Hub</option>
                          <option value="Digital Channels">Digital Channels</option>
                          <option value="Treasury">Treasury</option>
                          <option value="ATM Switch">ATM Switch</option>
                        </Select>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("status")}>
                <HStack spacing={2}>
                  <Text as="span">{renderSortLabel("Status", "status")}</Text>
                  <Popover placement="bottom-start">
                    <PopoverTrigger>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={<FilterFunnelIcon boxSize={3.5} />}
                        aria-label="Filter by status"
                        color={getFilterColor(status)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </PopoverTrigger>
                    <PopoverContent onClick={(event) => event.stopPropagation()}>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Status</PopoverHeader>
                      <PopoverBody>
                        <Select
                          size="sm"
                          value={status}
                          onChange={(event) => onStatusChange(event.target.value)}
                        >
                          <option value="">All</option>
                          <option value="Open">Open</option>
                          <option value="Pending">Pending</option>
                          <option value="Escalated">Escalated</option>
                          <option value="Closed">Closed</option>
                        </Select>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("priority")}>
                <HStack spacing={2}>
                  <Text as="span">
                    {renderSortLabel("Priority", "priority")}
                  </Text>
                  <Popover placement="bottom-start">
                    <PopoverTrigger>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={<FilterFunnelIcon boxSize={3.5} />}
                        aria-label="Filter by priority"
                        color={getFilterColor(priority)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </PopoverTrigger>
                    <PopoverContent onClick={(event) => event.stopPropagation()}>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Priority</PopoverHeader>
                      <PopoverBody>
                        <Select
                          size="sm"
                          value={priority}
                          onChange={(event) =>
                            onPriorityChange(event.target.value)
                          }
                        >
                          <option value="">All</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </Select>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("assignedTo")}>
                {renderSortLabel("Assigned To", "assignedTo")}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("openedAt")}>
                {renderSortLabel("Date Opened", "openedAt")}
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={7} py={8} textAlign="center">
                  <Spinner size="lg" />
                  <Text mt={2} color="text.muted">Loading cases...</Text>
                </Td>
              </Tr>
            ) : items.length === 0 ? (
              <Tr>
                <Td colSpan={7} py={6}>
                  <Text color="text.muted">No cases match this filter.</Text>
                </Td>
              </Tr>
            ) : (
              items.map((item) => (
                <CaseRow
                  key={item.id}
                  item={item}
                  onOpen={() => onOpenCase(item)}
                  onEdit={() => onEditCase(item)}
                />
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CasesTable;
