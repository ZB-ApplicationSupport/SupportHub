import React from "react";
import { SimpleGrid, Stack } from "@chakra-ui/react";
import KnowledgeBaseCard from "./KnowledgeBaseCard";

const KnowledgeBaseList = ({ items, view, onEdit }) => {
  if (view === "list") {
    return (
      <Stack spacing={3}>
        {items.map((item) => (
          <KnowledgeBaseCard
            key={item.id}
            item={item}
            variant="list"
            showActions
            onEdit={onEdit}
          />
        ))}
      </Stack>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
      {items.map((item) => (
        <KnowledgeBaseCard
          key={item.id}
          item={item}
          showActions
          onEdit={onEdit}
        />
      ))}
    </SimpleGrid>
  );
};

export default KnowledgeBaseList;
