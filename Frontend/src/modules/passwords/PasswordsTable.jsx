import React from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useToast,
} from "@chakra-ui/react";

const PasswordsTable = ({ items }) => {
  const toast = useToast();

  const copyPassword = async (value) => {
    if (!value) {
      toast({
        title: "Nothing to copy",
        description: "This password field is empty.",
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
        description: "Copied to clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the password.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="surface.card" borderRadius="xl" borderWidth="1px">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Hostname</Th>
              <Th>Server IP</Th>
              <Th>Username</Th>
              <Th>Password</Th>
              <Th>Date Added</Th>
              <Th>Last Modified</Th>
              <Th>Created By</Th>
              <Th>Last Modified By</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.length === 0 ? (
              <Tr>
                <Td colSpan={8}>
                  <Text color="text.muted">No passwords saved yet.</Text>
                </Td>
              </Tr>
            ) : (
              items.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.hostname}</Td>
                  <Td>{item.server}</Td>
                  <Td>{item.username}</Td>
                  <Td
                    cursor="pointer"
                    color="brand.500"
                    fontWeight="600"
                    onClick={() => copyPassword(item.password)}
                    _hover={{ textDecoration: "underline" }}
                  >
                    {item.password}
                  </Td>
                  <Td>{item.createdAt}</Td>
                  <Td>{item.updatedAt}</Td>
                  <Td>{item.createdBy}</Td>
                  <Td>{item.updatedBy}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PasswordsTable;
