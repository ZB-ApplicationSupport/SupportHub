import React from "react";
import { SimpleGrid, Select } from "@chakra-ui/react";

const KnowledgeBaseFilters = ({
  system,
  category,
  tag,
  systems,
  categories,
  tags,
  onSystemChange,
  onCategoryChange,
  onTagChange,
}) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
      <Select
        value={system}
        onChange={(event) => onSystemChange(event.target.value)}
        aria-label="Filter by system"
      >
        <option value="">All Systems</option>
        {systems.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <Select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <Select
        value={tag}
        onChange={(event) => onTagChange(event.target.value)}
        aria-label="Filter by tag"
      >
        <option value="">All Tags</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </SimpleGrid>
  );
};

export default KnowledgeBaseFilters;
