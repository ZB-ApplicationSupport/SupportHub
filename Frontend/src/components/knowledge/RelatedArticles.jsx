import React from "react";
import { Stack, Heading } from "@chakra-ui/react";
import KnowledgeBaseCard from "./KnowledgeBaseCard";

const RelatedArticles = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Heading size="sm">Related articles</Heading>
      {items.map((item) => (
        <KnowledgeBaseCard key={item.id} item={item} variant="list" />
      ))}
    </Stack>
  );
};

export default RelatedArticles;
