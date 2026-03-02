import React from "react";
import { Box, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

const ArticleEditor = ({ value = "", onChange }) => {
  return (
    <Box bg="surface.card" borderWidth="1px" borderRadius="xl" p={6}>
      <FormControl>
        <FormLabel>Article content (Markdown)</FormLabel>
        <Textarea
          name="content"
          minH="220px"
          placeholder="Write or paste article content..."
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </FormControl>
    </Box>
  );
};

export default ArticleEditor;
