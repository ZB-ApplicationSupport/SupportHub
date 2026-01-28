import React from "react";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";

const ArticleHeader = ({ article }) => {
  return (
    <Box>
      <Breadcrumb fontSize="sm" color="text.muted" mb={3}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/knowledge">
            Knowledge Base
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{article.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading size="lg" mb={2}>
        {article.title}
      </Heading>
      <Text color="text.muted" mb={3}>
        {article.summary}
      </Text>
      <HStack spacing={2} flexWrap="wrap">
        <Badge colorScheme="brand">{article.category}</Badge>
        <Badge colorScheme="secondary">{article.system}</Badge>
        {article.tags.map((tag) => (
          <Badge key={tag} variant="subtle" colorScheme="gray">
            {tag}
          </Badge>
        ))}
      </HStack>
      <HStack spacing={4} color="text.muted" fontSize="sm" mt={3}>
        <Text>Updated {article.updatedAt}</Text>
        <Text>{article.readTime}</Text>
        <HStack spacing={1}>
          <Icon as={StarIcon} color="yellow.400" />
          <Text>
            {article.rating} ({article.ratingCount})
          </Text>
        </HStack>
        <Text>{article.views} views</Text>
      </HStack>
      <Stack spacing={2} mt={4}>
        <HStack spacing={2} flexWrap="wrap">
          <Badge
            as={Link}
            to={`/cases?caseId=${article.caseRef}`}
            variant="outline"
            colorScheme="gray"
          >
            Case {article.caseRef}
          </Badge>
          {article.jiraRefs.length > 0 && (
            <Badge variant="outline" colorScheme="purple">
              Jira {article.jiraRefs.join(", ")}
            </Badge>
          )}
          {article.vendorRefs.length > 0 && (
            <Badge variant="outline" colorScheme="orange">
              Vendor {article.vendorRefs.join(", ")}
            </Badge>
          )}
        </HStack>
      </Stack>
    </Box>
  );
};

export default ArticleHeader;
