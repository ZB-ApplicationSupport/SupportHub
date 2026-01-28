import React from "react";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const CaseSearch = ({ value, onChange }) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      <Input
        placeholder="Search by case ID or summary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search cases"
      />
    </InputGroup>
  );
};

export default CaseSearch;
