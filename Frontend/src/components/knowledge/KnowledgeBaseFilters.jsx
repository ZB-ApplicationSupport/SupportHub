import React from "react";
import { Select } from "@chakra-ui/react";

const KnowledgeBaseFilters = ({ system, systems, onSystemChange }) => {
    return (
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
    );
};

export default KnowledgeBaseFilters;