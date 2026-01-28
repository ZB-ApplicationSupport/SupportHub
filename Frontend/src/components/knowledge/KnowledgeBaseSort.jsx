import React from "react";
import { Select } from "@chakra-ui/react";

const KnowledgeBaseSort = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Sort knowledge base articles"
      maxW={{ base: "full", md: "240px" }}
    >
      <option value="recent">Most recent</option>
      <option value="views">Most viewed</option>
      <option value="rating">Highest rated</option>
    </Select>
  );
};

export default KnowledgeBaseSort;
