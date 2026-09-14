import React from "react";
import { Box, Heading } from "@chakra-ui/react";

import CasesBySystemChart from "../../../components/charts/CasesBySystemChart";
import { SurfaceCard } from "../../../components/ui";

const CasesBySystemCard = ({ data = [] }) => {
  return (
    <SurfaceCard
      p={0}
      overflow="hidden"
      minH="280px"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Heading
        fontSize="14px"
        fontWeight="500"
        color="text.primary"
        px={5}
        pt={5}
        pb={2}
      >
        Cases by System
      </Heading>
      <Box flex="1" minH="160px" w="100%">
        <CasesBySystemChart data={data} />
      </Box>
    </SurfaceCard>
  );
};

export default CasesBySystemCard;
