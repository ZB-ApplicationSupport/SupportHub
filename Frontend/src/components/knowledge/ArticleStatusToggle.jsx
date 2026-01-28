import React from "react";
import { HStack, Switch, Text } from "@chakra-ui/react";

const ArticleStatusToggle = ({ isPublished, onToggle }) => {
  return (
    <HStack spacing={2}>
      <Switch
        isChecked={isPublished}
        onChange={(event) => onToggle(event.target.checked)}
        aria-label="Toggle publish status"
      />
      <Text fontSize="sm" color="text.muted">
        {isPublished ? "Published" : "Unpublished"}
      </Text>
    </HStack>
  );
};

export default ArticleStatusToggle;
