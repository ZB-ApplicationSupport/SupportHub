import React from "react";
import { Box, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

const ArticleEditor = () => {
  return (
    <Box bg="surface.card" borderWidth="1px" borderRadius="xl" p={6}>
      <FormControl>
        <FormLabel>Article content (Markdown)</FormLabel>
        <Textarea
          minH="220px"
          placeholder="Write or paste article content..."
        />
      </FormControl>
    </Box>
  );
};

export default ArticleEditor;
