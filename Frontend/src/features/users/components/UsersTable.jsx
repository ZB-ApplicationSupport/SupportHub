import React, { useMemo, useState } from "react";
import {
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import UserRow from "./UserRow";
import { DataTableShell, TableSearch } from "../../../components/ui";

const headerProps = {
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.02em",
  color: "text.muted",
};

const UsersTable = ({
  items = [],
  canEditRole,
  onRoleChange,
  onToggleStatus,
  togglingUserId,
  searchQuery,
  hideSearch = false,
}) => {
  const [query, setQuery] = useState("");
  const term = hideSearch ? searchQuery || "" : query;

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) {
      return items;
    }
    return items.filter((user) =>
      [user.name, user.username, user.email, user.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    );
  }, [items, term]);

  return (
    <DataTableShell>
      {!hideSearch && (
      <HStack
        w="100%"
        justify="space-between"
        align="center"
        px={5}
        py={4}
        borderBottomWidth="1px"
        borderColor="border.default"
      >
        <TableSearch
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users..."
        />
      </HStack>
      )}

      <TableContainer w="100%" overflowX="auto">
        <Table variant="simple" size="sm" w="100%">
          <Thead bg="surface.card">
            <Tr>
              <Th {...headerProps}>User</Th>
              <Th {...headerProps}>Role</Th>
              <Th {...headerProps}>Status</Th>
              <Th {...headerProps} textAlign="center">
                Access
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {filtered.length === 0 ? (
              <Tr>
                <Td colSpan={4} py={12} textAlign="center">
                  <Text fontSize="sm" color="text.muted">
                    {items.length === 0
                      ? "Users will appear here once they are added."
                      : "No users match this search."}
                  </Text>
                </Td>
              </Tr>
            ) : (
              filtered.map((user, index) => (
                <UserRow
                  key={user.id ?? index}
                  user={user}
                  canEditRole={canEditRole}
                  onRoleChange={onRoleChange}
                  onToggleStatus={onToggleStatus}
                  isToggling={togglingUserId === user.id}
                />
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </DataTableShell>
  );
};

export default UsersTable;
