import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import BrandLogo from "../../../components/layout/BrandLogo";
import ColorModeToggle from "../../../components/layout/ColorModeToggle";
import { useCompactDesktop } from "../../../utils/compactDesktop";

const HIGHLIGHTS = [
  {
    quote:
      "Cases, monitoring, and shared credentials sit in one place, so the desk spends less time hunting across tools.",
    name: "Support Operations",
    role: "Banking Systems Support",
  },
  {
    quote:
      "When a host drops, the monitoring view makes it obvious. The team sees status instead of waiting for a call.",
    name: "Infrastructure",
    role: "Server monitoring",
  },
  {
    quote:
      "Job tracking from Case Tracker keeps ownership clear: assign, close, and keep a record the whole desk can follow.",
    name: "Application Support",
    role: "Case Tracker",
  },
];

const AuthSplitLayout = ({
  title,
  subtitle,
  children,
}) => {
  const [slide, setSlide] = useState(0);
  const pageBg = useColorModeValue("#E2E8F0", "#0C100E");
  const formBg = useColorModeValue("#FFFFFF", "#1A211D");
  const headingColor = useColorModeValue("#1A202C", "#F3F6F4");
  const muted = useColorModeValue("#64748B", "#8B968F");
  const panelBg = useColorModeValue("#0C5F2C", "#0F1914");
  const orbA = useColorModeValue(
    "rgba(0, 132, 61, 0.55)",
    "rgba(0, 132, 61, 0.28)"
  );
  const orbB = useColorModeValue(
    "rgba(20, 143, 65, 0.35)",
    "rgba(123, 201, 149, 0.16)"
  );
  const glassBg = useColorModeValue(
    "rgba(12, 95, 44, 0.38)",
    "rgba(26, 33, 29, 0.55)"
  );

  const compact = useCompactDesktop({ desktopOnly: true });
  const highlight = HIGHLIGHTS[slide];
  const prevSlide = () =>
    setSlide((current) => (current === 0 ? HIGHLIGHTS.length - 1 : current - 1));
  const nextSlide = () =>
    setSlide((current) => (current === HIGHLIGHTS.length - 1 ? 0 : current + 1));

  return (
    <Flex minH="100vh" bg={pageBg} align="center" justify="center" p={{ base: 4, md: 8 }}>
      <Flex
        w="100%"
        maxW="1080px"
        minH={{ base: "auto", lg: "640px" }}
        bg={formBg}
        borderRadius="28px"
        overflow="hidden"
        boxShadow="card"
        transform={compact ? "scale(0.8)" : "none"}
        transformOrigin="center center"
      >
        <Box
          flex="1"
          px={{ base: 6, md: 10, lg: 12 }}
          py={{ base: 8, md: 10 }}
          position="relative"
        >
          <Box position="absolute" top={5} right={5}>
            <ColorModeToggle plain compact={false} />
          </Box>

          <HStack spacing={3} mb={10} pr={12}>
            <BrandLogo height="36px" maxW="140px" mx={0} />
            <Text fontSize="lg" fontWeight="700" color={headingColor} letterSpacing="-0.02em">
              Banking Systems Support
            </Text>
          </HStack>

          <Heading
            as="h1"
            fontSize={{ base: "1.75rem", md: "2rem" }}
            fontWeight="800"
            color={headingColor}
            letterSpacing="-0.03em"
            lineHeight="1.2"
            mb={2}
          >
            {title}
          </Heading>
          <Text color={muted} fontSize="sm" mb={8}>
            {subtitle}
          </Text>

          {children}
        </Box>

        <Flex
          display={{ base: "none", lg: "flex" }}
          flex="1.05"
          direction="column"
          justify="space-between"
          color="white"
          px={10}
          py={10}
          position="relative"
          overflow="hidden"
          bg={panelBg}
        >
          <Box
            position="absolute"
            w="420px"
            h="420px"
            borderRadius="full"
            bg={orbA}
            top="-120px"
            right="-80px"
          />
          <Box
            position="absolute"
            w="320px"
            h="320px"
            borderRadius="full"
            bg={orbB}
            bottom="80px"
            left="-120px"
          />
          <Box
            position="absolute"
            w="180px"
            h="180px"
            borderRadius="full"
            border="48px solid"
            borderColor="rgba(255,255,255,0.06)"
            bottom="-40px"
            right="40px"
          />

          <Heading
            position="relative"
            fontSize="2.35rem"
            lineHeight="1.15"
            fontWeight="800"
            letterSpacing="-0.03em"
            maxW="420px"
            zIndex={1}
            color="white"
          >
            Keep banking systems supported, clearly.
          </Heading>

          <Box
            position="relative"
            zIndex={1}
            bg={glassBg}
            border="1px solid"
            borderColor="rgba(255,255,255,0.16)"
            borderRadius="18px"
            p={6}
            backdropFilter="blur(16px)"
          >
            <HStack spacing={1} mb={3}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box
                  key={index}
                  as="span"
                  color="#F4B41A"
                  fontSize="13px"
                  lineHeight="1"
                >
                  ★
                </Box>
              ))}
            </HStack>
            <Text fontSize="sm" lineHeight="1.65" mb={5} color="rgba(255,255,255,0.92)">
              {highlight.quote}
            </Text>
            <HStack justify="space-between" align="flex-end">
              <Box>
                <Text fontWeight="700" fontSize="sm">
                  {highlight.name}
                </Text>
                <Text fontSize="xs" color="rgba(255,255,255,0.7)">
                  {highlight.role}
                </Text>
              </Box>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Previous highlight"
                  icon={<FiChevronLeft />}
                  size="sm"
                  isRound
                  variant="ghost"
                  color="white"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.28)"
                  bg="rgba(255,255,255,0.08)"
                  _hover={{ bg: "rgba(255,255,255,0.18)" }}
                  onClick={prevSlide}
                />
                <IconButton
                  aria-label="Next highlight"
                  icon={<FiChevronRight />}
                  size="sm"
                  isRound
                  variant="ghost"
                  color="white"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.28)"
                  bg="rgba(255,255,255,0.08)"
                  _hover={{ bg: "rgba(255,255,255,0.18)" }}
                  onClick={nextSlide}
                />
              </HStack>
            </HStack>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AuthSplitLayout;
