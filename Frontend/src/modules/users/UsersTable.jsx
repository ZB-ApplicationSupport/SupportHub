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

const UsersTable = ({ items, canEditRole, onRoleChange }) => {
  return (
    <Box bg="surface.card" borderRadius="xl" borderWidth="1px">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Toggle</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                canEditRole={canEditRole}
                onRoleChange={onRoleChange}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersTable;
