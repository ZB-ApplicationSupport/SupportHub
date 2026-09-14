import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import { SurfaceCard } from "../../../components/ui";
import { severityForCount } from "../automations.data";

const formatCount = (value) =>
  value == null ? "—" : Number(value).toLocaleString("en-GB");

const StageChip = ({ stage, onOpen }) => {
  const severity = severityForCount(stage.count, stage.unavailable);
  const clickable = typeof onOpen === "function" && stage.stat;

  return (
    <Box
      as={clickable ? "button" : undefined}
      type={clickable ? "button" : undefined}
      onClick={
        clickable
          ? (event) => {
              event.stopPropagation();
              onOpen(stage.stat, stage.classificationId);
            }
          : undefined
      }
      px={2}
      py={2}
      minW="0"
      borderRadius="12px"
      border="1px solid"
      borderColor={severity.chipBorder}
      bg={severity.chipBg}
      color={severity.color}
      textAlign="center"
      cursor={clickable ? "pointer" : "default"}
    >
      <Flex align="center" justify="center" gap={1} mb={1}>
        <Box w="6px" h="6px" borderRadius="full" bg={severity.accent} />
        <Text fontSize="11px" fontWeight="700" noOfLines={1}>
          {stage.label}
        </Text>
      </Flex>
      <Text fontSize="16px" fontWeight="700" letterSpacing="-0.03em">
        {formatCount(stage.count)}
      </Text>
    </Box>
  );
};

const PipelineCard = ({ pipeline, loading, onOpen }) => {
  const status = pipeline.status;
  const activeStages = pipeline.stages.filter(
    (stage) => !stage.unavailable && Number(stage.count) > 0
  ).length;
  const defaultStage =
    pipeline.stages.find(
      (stage) => !stage.unavailable && Number(stage.count) > 0
    ) || pipeline.stages[0];
  const openDefault = () => {
    if (defaultStage?.stat) onOpen(defaultStage.stat, defaultStage.classificationId);
  };

  return (
    <SurfaceCard p={5} h="100%">
      <Flex align="flex-start" justify="space-between" gap={3} mb={2}>
        <Box
          as={defaultStage?.stat ? "button" : undefined}
          type={defaultStage?.stat ? "button" : undefined}
          onClick={defaultStage?.stat ? openDefault : undefined}
          minW={0}
          textAlign="left"
          cursor={defaultStage?.stat ? "pointer" : "default"}
        >
          <Text fontSize="15px" fontWeight="700" noOfLines={1}>
            {pipeline.title}
          </Text>
          <Text fontSize="12px" color="text.muted" mt={0.5}>
            {loading
              ? "Loading live counts…"
              : pipeline.unavailable
                ? "Waiting for this count"
                : `${formatCount(pipeline.count)} records`}
          </Text>
        </Box>
        <Text
          fontSize="11px"
          fontWeight="700"
          color={status.color}
          bg={status.bg}
          px={2.5}
          py={0.5}
          borderRadius="full"
          flexShrink={0}
        >
          {loading ? "Loading" : status.label}
        </Text>
      </Flex>

      <Flex align="center" gap={1} mt={4} mb={4}>
        {pipeline.stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            {index ? (
              <Icon
                as={FiChevronRight}
                boxSize={3.5}
                color="text.muted"
                flexShrink={0}
              />
            ) : null}
            <Box flex="1" minW={0}>
              <StageChip stage={stage} onOpen={onOpen} />
            </Box>
          </React.Fragment>
        ))}
      </Flex>

      <Flex align="center" justify="space-between" color="text.muted">
        <Flex align="center" gap={2}>
          <Box w="8px" h="8px" borderRadius="full" bg={status.accent} />
          <Text fontSize="12px">
            {loading ? "Fetching monitors" : `${activeStages} with records now`}
          </Text>
        </Flex>
        {defaultStage?.stat ? (
          <Box
            as="button"
            type="button"
            fontSize="12px"
            fontWeight="600"
            color="brand.500"
            onClick={openDefault}
          >
            View extract →
          </Box>
        ) : null}
      </Flex>
    </SurfaceCard>
  );
};

export default PipelineCard;
