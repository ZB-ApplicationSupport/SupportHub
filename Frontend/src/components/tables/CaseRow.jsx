import React from "react";
import { Badge, Button, Flex, Td, Text, Tr } from "@chakra-ui/react";
import { PRIORITY_COLORS, STATUS_COLORS } from "../../utils/constants";

const CaseRow = ({ item, onOpen, onEdit }) => {
  return (
    <Tr _hover={{ bg: "surface.subtle", cursor: "pointer" }} onClick={onOpen}>
      <Td>
        <Text fontWeight="600">{item.id}</Text>
      </Td>
      <Td>{item.system}</Td>
      <Td>
        <Badge colorScheme={STATUS_COLORS[item.status] || "gray"}>
          {item.status}
        </Badge>
      </Td>
      <Td>
        <Badge colorScheme={PRIORITY_COLORS[item.priority] || "gray"}>
          {item.priority}
        </Badge>
      </Td>
      <Td>{item.assignedTo}</Td>
      <Td>{item.openedAt}</Td>
      <Td>
        <Flex gap={2}>
          <Button
            size="xs"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
          >
            View
          </Button>
          <Button
            size="xs"
            onClick={(event) => {
              event.stopPropagation();
              if (onEdit) {
                onEdit();
              }
            }}
          >
            Edit
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};

export default CaseRow;
