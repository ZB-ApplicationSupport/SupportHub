import React from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const KnowledgeBaseSearch = ({ value, onChange }) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      <Input
        placeholder="Search by title, keyword, or summary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search knowledge base articles"
      />
    </InputGroup>
  );
};

export default KnowledgeBaseSearch;
