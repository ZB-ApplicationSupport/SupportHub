import React, { useMemo, useState } from "react";
import {
  Button,
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
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  DataTableShell,
  StatusDot,
  TableSearch,
} from "../../../components/ui";
import { formatCaseOpenedAt } from "../../cases/case.utils";

const headerProps = {
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.02em",
  color: "text.muted",
};

const SignupRequestsTable = ({
  items = [],
  isLoading,
  onApprove,
  onReject,
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
    return items.filter((item) =>
      [item.email, item.status]
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
            placeholder="Search requests..."
          />
        </HStack>
      )}

      <TableContainer w="100%" overflowX="auto">
        <Table variant="simple" size="sm" w="100%">
          <Thead bg="surface.card">
            <Tr>
              <Th {...headerProps}>Email</Th>
              <Th {...headerProps}>Status</Th>
              <Th {...headerProps}>Requested at</Th>
              <Th {...headerProps} textAlign="right">
                Actions
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={4} py={12} textAlign="center">
                  <Text fontSize="sm" color="text.muted">
                    Loading signup requests...
                  </Text>
                </Td>
              </Tr>
            ) : filtered.length === 0 ? (
              <Tr>
                <Td colSpan={4} py={12} textAlign="center">
                  <Text fontSize="sm" color="text.muted">
                    {items.length === 0
                      ? "New registration requests will appear here."
                      : "No requests match this search."}
                  </Text>
                </Td>
              </Tr>
            ) : (
              filtered.map((item) => (
                <Tr
                  key={item.id}
                  _hover={{ bg: "surface.subtle" }}
                  transition="background 0.15s ease"
                >
                  <Td>
                    <Text fontSize="sm" fontWeight="600">
                      {item.email}
                    </Text>
                  </Td>
                  <Td>
                    <StatusDot
                      color="#F2994A"
                      label={item.status || "PENDING"}
                    />
                  </Td>
                  <Td whiteSpace="nowrap">
                    <Text fontSize="sm" color="text.muted">
                      {formatCaseOpenedAt(item.createdAt)}
                    </Text>
                  </Td>
                  <Td>
                    <HStack justify="flex-end" spacing={2}>
                      <Button
                        variant="unstyled"
                        h="36px"
                        px={4}
                        display="inline-flex"
                        alignItems="center"
                        leftIcon={<CheckIcon />}
                        bg="brand.wash"
                        color="brand.onWash"
                        fontSize="13px"
                        fontWeight="600"
                        borderRadius="10px"
                        onClick={() => onApprove(item)}
                        _hover={{ bg: "brand.wash", opacity: 0.88 }}
                      >
                        Approve
                      </Button>
                      {onReject ? (
                        <Button
                          variant="unstyled"
                          h="36px"
                          px={4}
                          display="inline-flex"
                          alignItems="center"
                          leftIcon={<CloseIcon boxSize={2.5} />}
                          bg="surface.input"
                          color="danger.onWash"
                          border="1px solid"
                          borderColor="rgba(214, 69, 69, 0.35)"
                          fontSize="13px"
                          fontWeight="600"
                          borderRadius="10px"
                          onClick={() => onReject(item)}
                          _hover={{ bg: "danger.wash" }}
                        >
                          Reject
                        </Button>
                      ) : null}
                    </HStack>
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

export default SignupRequestsTable;
