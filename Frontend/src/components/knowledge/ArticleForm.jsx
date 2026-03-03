import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";

const ArticleForm = ({ systems, values = {}, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange?.(name, value);
  };

  return (
    <Box bg="surface.card" borderWidth="1px" borderRadius="xl" p={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            placeholder="Article title"
            value={values.title || ""}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>System</FormLabel>
          <Select
            name="system"
            placeholder="Select system"
            value={values.system || ""}
            onChange={handleChange}
          >
            {(systems || []).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Tags</FormLabel>
          <Input
            name="tags"
            placeholder="Add tags (comma separated)"
            value={Array.isArray(values.tags) ? values.tags.join(", ") : (values.tags || "")}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Read time</FormLabel>
          <Input
            name="readTime"
            placeholder="e.g. 5 min read"
            value={values.readTime || ""}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Summary</FormLabel>
          <Input
            name="summary"
            placeholder="Short summary"
            value={values.summary || ""}
            onChange={handleChange}
          />
        </FormControl>
      </SimpleGrid>
    </Box>
  );
};

export default ArticleForm;
