import React from "react";
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
import { useToast } from "@chakra-ui/react";
import { DataTableShell, TableSearch } from "../../../components/ui";
import { formatCaseOpenedAt } from "../../cases/case.utils";

const headerProps = {
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.02em",
  color: "text.muted",
};

const PasswordsTable = ({
  items = [],
  query = "",
  onQueryChange,
  revealed = {},
  onReveal,
  onHide,
  onCopy,
  onHistory,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const toast = useToast();

  const copyValue = async (value) => {
    if (!value) {
      toast({
        title: "Nothing to copy",
        description: "Reveal the password first.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast({
        title: "Password copied",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onCopy?.(value);
    } catch (error) {
      toast({
        title: "Copy failed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <DataTableShell>
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
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by system or username..."
        />
      </HStack>

      <TableContainer w="100%" overflowX="auto">
        <Table variant="simple" size="sm" w="100%">
          <Thead bg="surface.card">
            <Tr>
              <Th {...headerProps}>System</Th>
              <Th {...headerProps}>Username</Th>
              <Th {...headerProps}>Description</Th>
              <Th {...headerProps}>Password</Th>
              <Th {...headerProps}>Updated</Th>
              <Th {...headerProps}>Created by</Th>
              <Th {...headerProps}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.length === 0 ? (
              <Tr>
                <Td colSpan={7} py={12} textAlign="center">
                  <Text fontSize="sm" color="text.muted">
                    No credentials match this search.
                  </Text>
                </Td>
              </Tr>
            ) : (
              items.map((item) => {
                const secret = revealed[item.id];
                return (
                  <Tr
                    key={item.id}
                    _hover={{ bg: "surface.subtle" }}
                    transition="background 0.15s ease"
                  >
                    <Td>
                      <Text fontSize="sm" fontWeight="600">
                        {item.systemName || "—"}
                      </Text>
                    </Td>
                    <Td whiteSpace="nowrap">
                      <Text fontSize="sm">{item.username || "—"}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm" noOfLines={1}>
                        {item.description || "—"}
                      </Text>
                    </Td>
                    <Td whiteSpace="nowrap">
                      {secret ? (
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="text.brand"
                          cursor="pointer"
                          onClick={() => copyValue(secret)}
                        >
                          {secret}
                        </Text>
                      ) : (
                        <Text fontSize="sm" color="text.muted">
                          ••••••••
                        </Text>
                      )}
                    </Td>
                    <Td whiteSpace="nowrap">
                      <Text fontSize="sm" color="text.muted">
                        {formatCaseOpenedAt(item.updatedAt || item.createdAt)}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{item.createdBy || "—"}</Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        {secret ? (
                          <Button size="xs" variant="ghost" onClick={() => onHide?.(item)}>
                            Hide
                          </Button>
                        ) : (
                          <Button size="xs" variant="ghost" onClick={() => onReveal?.(item)}>
                            Reveal
                          </Button>
                        )}
                        <Button size="xs" variant="ghost" onClick={() => onHistory?.(item)}>
                          History
                        </Button>
                        {isAdmin && (
                          <>
                            <Button size="xs" variant="ghost" onClick={() => onEdit?.(item)}>
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="danger.onWash"
                              onClick={() => onDelete?.(item)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </DataTableShell>
  );
};

export default PasswordsTable;
