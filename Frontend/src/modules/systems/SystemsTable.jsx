import React from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import SystemRow from "./SystemRow";

const SystemsTable = ({ items, onEdit, onDelete, onToggle }) => {
  return (
    <Box bg="surface.card" borderRadius="xl" borderWidth="1px">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>System</Th>
              <Th>Category</Th>
              <Th>Owner</Th>
              <Th>Last Updated</Th>
              <Th>Status</Th>
              <Th>Toggle</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <SystemRow
                key={item.id}
                item={item}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                onToggle={(nextValue) => onToggle(item, nextValue)}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SystemsTable;
