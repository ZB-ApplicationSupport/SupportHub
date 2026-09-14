import React, { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useCompactDesktop } from "../../utils/compactDesktop";

const ChartStatsPopup = ({ title, items = [], x, y }) => {
  const bg = useColorModeValue("#FFFFFF", "#1A211D");
  const color = useColorModeValue("#1A202C", "#F3F6F4");
  const border = useColorModeValue("#E2E8F0", "#2F3A35");
  const compact = useCompactDesktop({ desktopOnly: true });

  if (x == null || y == null || typeof document === "undefined") {
    return null;
  }

  const left = Math.min(x + 14, window.innerWidth - 168);
  const top = Math.min(y + 14, window.innerHeight - 96);

  return createPortal(
    <Box
      position="fixed"
      left={`${left}px`}
      top={`${top}px`}
      zIndex="popover"
      pointerEvents="none"
      bg={bg}
      color={color}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      boxShadow="0 8px 24px rgba(15, 23, 42, 0.12)"
      px={3}
      py={2.5}
      minW="132px"
      transform={compact ? "scale(0.8)" : "none"}
      transformOrigin="top left"
    >
      {title && (
        <Text fontSize="12px" fontWeight="600" mb={items.length ? 1.5 : 0}>
          {title}
        </Text>
      )}
      {items.map((item) => (
        <Flex
          key={item.label}
          align="center"
          justify="space-between"
          gap={4}
          py="2px"
        >
          <Flex align="center" gap={2} minW={0}>
            {item.color && (
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={item.color}
                flexShrink={0}
              />
            )}
            <Text fontSize="12px" color="text.muted">
              {item.label}
            </Text>
          </Flex>
          <Text fontSize="12px" fontWeight="600">
            {item.value}
          </Text>
        </Flex>
      ))}
    </Box>,
    document.body
  );
};

export const useChartStatsPopup = () => {
  const [popup, setPopup] = useState(null);

  const showPopup = useCallback((event, next) => {
    if (!event || !next) {
      return;
    }

    setPopup({
      title: next.title,
      items: next.items || [],
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const hidePopup = useCallback(() => setPopup(null), []);

  const popupNode = popup ? (
    <ChartStatsPopup
      title={popup.title}
      items={popup.items}
      x={popup.x}
      y={popup.y}
    />
  ) : null;

  return { showPopup, hidePopup, popupNode };
};

export default ChartStatsPopup;
