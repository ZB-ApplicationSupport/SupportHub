import React, { useMemo, useState } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DataTableShell, TableSearch } from "../../components/ui";
import { formatCaseOpenedAt } from "../cases/case.utils";
import { logoLabel } from "./links.data";

const headerProps = {
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.02em",
  color: "text.muted",
  textAlign: "left",
};

const LinksTable = ({
  items = [],
  onRowClick,
  searchQuery,
  hideSearch = false,
}) => {
  const [query, setQuery] = useState("");
  const term = hideSearch ? searchQuery || "" : query;

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.title, item.href, item.short, logoLabel(item.logo), item.addedBy]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    );
  }, [items, term]);

  return (
    <DataTableShell>
      {!hideSearch && (
        <TableSearch
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search links..."
        />
      )}

      <TableContainer w="100%" overflowX="auto">
        <Table
          variant="simple"
          size="sm"
          w="100%"
          sx={{ th: { textAlign: "left" }, td: { textAlign: "left" } }}
        >
          <Thead bg="surface.card">
            <Tr>
              <Th {...headerProps}>Name</Th>
              <Th {...headerProps}>URL</Th>
              <Th {...headerProps}>Logo</Th>
              <Th {...headerProps}>Date added</Th>
              <Th {...headerProps}>Added by</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr>
                <Td colSpan={5} py={12} textAlign="left">
                  <Text fontSize="sm" color="text.muted">
                    {items.length === 0
                      ? "Dashboard links will appear here once they are added."
                      : "No links match this search."}
                  </Text>
                </Td>
              </Tr>
            ) : (
              filtered.map((item) => (
                <Tr
                  key={item.id}
                  cursor="pointer"
                  _hover={{ bg: "surface.subtle" }}
                  transition="background 0.15s ease"
                  onClick={() => onRowClick?.(item)}
                >
                  <Td>
                    <Text fontSize="13px" fontWeight="600" color="text.primary">
                      {item.title}
                    </Text>
                  </Td>
                  <Td maxW="320px">
                    <Text fontSize="13px" color="text.muted" noOfLines={1}>
                      {item.href || "—"}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="13px" color="text.primary">
                      {logoLabel(item.logo || "none")}
                    </Text>
                  </Td>
                  <Td whiteSpace="nowrap">
                    <Text fontSize="13px" color="text.muted">
                      {item.addedAt ? formatCaseOpenedAt(item.addedAt) : "—"}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="13px" color="text.primary">
                      {item.addedBy || "—"}
                    </Text>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </DataTableShell>
  );
};

export default LinksTable;
