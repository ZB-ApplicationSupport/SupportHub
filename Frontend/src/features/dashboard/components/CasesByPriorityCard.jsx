import React from "react";
import { Box, Heading } from "@chakra-ui/react";

import CasePriorityChart from "../../../components/charts/CasePriorityChart";
import { SurfaceCard } from "../../../components/ui";

const CasesByPriorityCard = ({ data = [] }) => {
  return (
    <SurfaceCard
      p={5}
      minH="280px"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Heading
        fontSize="14px"
        fontWeight="600"
        mb={3}
        color="text.primary"
        flexShrink={0}
      >
        Cases by Priority
      </Heading>
      <Box
        flex="1"
        minH={0}
        w="100%"
        display="flex"
        flexDirection="column"
      >
        <CasePriorityChart data={data} />
      </Box>
    </SurfaceCard>
  );
};

export default CasesByPriorityCard;
