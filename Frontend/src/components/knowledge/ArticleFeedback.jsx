import React from "react";
import { Button, ButtonGroup, Box, Text } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const ArticleFeedback = () => {
  return (
    <Box bg="surface.card" borderWidth="1px" borderRadius="xl" p={4}>
      <Text fontWeight="600" mb={2}>
        Was this article helpful?
      </Text>
      <ButtonGroup size="sm">
        <Button leftIcon={<CheckIcon />} colorScheme="green" variant="outline">
          Helpful
        </Button>
        <Button leftIcon={<CloseIcon />} colorScheme="red" variant="outline">
          Not helpful
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ArticleFeedback;
