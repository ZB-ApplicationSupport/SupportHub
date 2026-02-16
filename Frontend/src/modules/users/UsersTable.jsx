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
import UserRow from "./UserRow";

const UsersTable = ({ items, canEditRole, onRoleChange, onToggleStatus }) => {
  return (
    <Box bg="surface.card" borderRadius="xl" borderWidth="1px">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Toggle</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((user, index) => (
              <UserRow
                key={user.id ?? index} // fallback to index if id is missing
                user={user}
                canEditRole={canEditRole}
                onRoleChange={onRoleChange}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersTable;
