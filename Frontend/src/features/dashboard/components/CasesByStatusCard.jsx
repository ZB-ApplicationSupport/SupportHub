import React from "react";
import { Box, Heading } from "@chakra-ui/react";

import CaseStatusChart from "../../../components/charts/CaseStatusChart";
import { SurfaceCard } from "../../../components/ui";

const CasesByStatusCard = ({ data = [] }) => {
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
        fontWeight="500"
        mb={4}
        color="text.primary"
      >
        Cases by Status
      </Heading>
      <Box flex="1" w="100%" minH="160px">
        <CaseStatusChart data={data} />
      </Box>
    </SurfaceCard>
  );
};

export default CasesByStatusCard;
