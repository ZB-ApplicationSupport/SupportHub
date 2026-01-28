import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";

const ArticleForm = ({ categories, systems }) => {
  return (
    <Box bg="surface.card" borderWidth="1px" borderRadius="xl" p={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input placeholder="Article title" />
        </FormControl>
        <FormControl>
          <FormLabel>System</FormLabel>
          <Select placeholder="Select system">
            {systems.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select placeholder="Select category">
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Tags</FormLabel>
          <Input placeholder="Add tags (comma separated)" />
        </FormControl>
        <FormControl>
          <FormLabel>Read time</FormLabel>
          <Input placeholder="e.g. 5 min read" />
        </FormControl>
        <FormControl>
          <FormLabel>Summary</FormLabel>
          <Input placeholder="Short summary" />
        </FormControl>
      </SimpleGrid>
    </Box>
  );
};

export default ArticleForm;
