import React from "react";
import { Badge, Button, HStack, Td, Text, Tr } from "@chakra-ui/react";
import SystemStatusToggle from "./SystemStatusToggle";

const SystemRow = ({ item, onEdit, onDelete, onToggle }) => {
  return (
    <Tr>
      <Td>
        <Text fontWeight="600">{item.name}</Text>
        <Text fontSize="xs" color="text.muted">
          {item.id}
        </Text>
      </Td>
      <Td>{item.category}</Td>
      <Td>{item.owner}</Td>
      <Td>{item.updatedAt}</Td>
      <Td>
        <Badge colorScheme={item.status === "Active" ? "green" : "red"}>
          {item.status}
        </Badge>
      </Td>
      <Td>
        <SystemStatusToggle
          active={item.status === "Active"}
          onToggle={onToggle}
        />
      </Td>
      <Td>
        <HStack spacing={2}>
          <Button size="xs" variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button size="xs" colorScheme="red" variant="outline" onClick={onDelete}>
            Remove
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
};

export default SystemRow;
