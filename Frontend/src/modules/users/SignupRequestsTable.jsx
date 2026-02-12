import React from "react";
import {
  Box,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const SignupRequestsTable = ({ items, isLoading, onApprove, onReject }) => {
  const formatDate = (value) => {
    if (!value) return "--";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
  };

  return (
    <Box bg="surface.card" borderRadius="xl" borderWidth="1px">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Requested At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={4}>
                  <Text color="text.muted">Loading signup requests...</Text>
                </Td>
              </Tr>
            ) : items.length === 0 ? (
              <Tr>
                <Td colSpan={4}>
                  <Text color="text.muted">No pending signup requests.</Text>
                </Td>
              </Tr>
            ) : (
              items.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.email}</Td>
                  <Td>{item.status || "PENDING"}</Td>
                  <Td>{formatDate(item.createdAt)}</Td>
                  <Td>
                    <Tooltip label="Approve" aria-label="Approve">
                      <IconButton
                        icon={<CheckIcon />}
                        colorScheme="green"
                        size="sm"
                        mr={2}
                        onClick={() => onApprove(item)}
                      />
                    </Tooltip>
                    <Tooltip label="Reject" aria-label="Reject">
                      <IconButton
                        icon={<CloseIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => onReject(item)}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SignupRequestsTable;
