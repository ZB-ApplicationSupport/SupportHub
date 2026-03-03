import React from "react";
import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const KnowledgeBaseCard = ({
  item,
  variant = "card",
  showActions = false,
  onEdit,
}) => {
  const content = (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Text fontWeight="700">
          <Box as={Link} to={`/knowledge/${item.id}`} color="inherit">
            {item.title}
          </Box>
        </Text>
        <Text color="text.muted" fontSize="sm">
          {item.summary}
        </Text>
      </Stack>
      <HStack spacing={2} flexWrap="wrap">
        <Badge colorScheme="secondary">{item.system}</Badge>
        {item.tags.map((tag) => (
          <Badge key={tag} variant="subtle" colorScheme="gray">
            {tag}
          </Badge>
        ))}
      </HStack>
      <HStack spacing={4} color="text.muted" fontSize="xs" flexWrap="wrap">
        <Text>{item.updatedAt}</Text>
      </HStack>
      <HStack spacing={2} flexWrap="wrap">
        <Badge
          as={Link}
          to={`/cases?caseId=${item.caseRef}`}
          variant="outline"
          colorScheme="gray"
        >
          Case {item.caseRef}
        </Badge>
        {item.jiraRefs.length > 0 && (
          <Badge variant="outline" colorScheme="purple">
            Jira {item.jiraRefs.length}
          </Badge>
        )}
        {item.vendorRefs.length > 0 && (
          <Badge variant="outline" colorScheme="orange">
            Vendor {item.vendorRefs.length}
          </Badge>
        )}
      </HStack>
      {showActions && (
        <HStack spacing={2}>
          <Button
            as={Link}
            to={`/knowledge/${item.id}`}
            size="xs"
            variant="outline"
          >
            View
          </Button>
          <Button
            size="xs"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (onEdit) {
                onEdit(item);
              }
            }}
          >
            Edit
          </Button>
        </HStack>
      )}
    </Stack>
  );

  return (
    <Box
      bg="surface.card"
      borderWidth="1px"
      borderRadius="xl"
      p={variant === "list" ? 4 : 6}
      _hover={{ borderColor: "brand.400", shadow: "sm" }}
    >
      {content}
    </Box>
  );
};

export default KnowledgeBaseCard;
