import React from "react";
import { Button, Stack } from "@chakra-ui/react";

const CaseActions = () => {
  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={3}>
      <Button variant="outline">Update Status</Button>
      <Button variant="outline">Assign Case</Button>
      <Button colorScheme="red">Close Case</Button>
    </Stack>
  );
};

export default CaseActions;
