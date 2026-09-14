import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { SurfaceCard } from "../../../components/ui";
import {
  LINKS_CHANGED_EVENT,
  loadLinks,
} from "../../links/links.data";
import { getQuickLinks } from "../../links/links.api";
import finastraLogo from "../../../assets/systems/finastra.png";
import jiraLogo from "../../../assets/systems/jira.png";
import powerBiLogo from "../../../assets/systems/powerbi.svg";
import brandLogoLight from "../../../assets/logos/logoLight.png";
import brandLogoDark from "../../../assets/logos/logoWhite.png";

const ServiceIcon = ({ short, logo, logoUrl, size = "52px" }) => {
  const { colorMode } = useColorMode();
  const brandSrc = colorMode === "dark" ? brandLogoDark : brandLogoLight;
  const src =
    logoUrl ||
    (logo === "finastra"
      ? finastraLogo
      : logo === "jira"
        ? jiraLogo
        : logo === "powerbi"
          ? powerBiLogo
          : logo === "brand"
            ? brandSrc
            : null);
  const isJira = logo === "jira";
  const pad = size === "52px" ? 2 : 1.5;

  return (
    <Flex
      align="center"
      justify="center"
      w={size}
      h={size}
      borderRadius="16px"
      border="1px solid"
      borderColor="border.default"
      bg="surface.card"
      overflow="hidden"
      flexShrink={0}
      p={src && !isJira ? pad : 0}
    >
      {src ? (
        <Box
          as="img"
          src={src}
          alt=""
          maxW="100%"
          maxH="100%"
          objectFit="contain"
        />
      ) : (
        <Text
          fontSize={size === "52px" ? "12px" : "11px"}
          fontWeight="700"
          color="text.primary"
          letterSpacing="0.04em"
        >
          {short}
        </Text>
      )}
    </Flex>
  );
};

const ServiceTile = ({ title, short, logo, logoUrl, href }) => (
  <Link
    href={href}
    isExternal
    color="inherit"
    _hover={{ textDecoration: "none", color: "inherit" }}
  >
    <Flex
      direction="column"
      align="center"
      gap={2}
      minW={0}
      py={1}
      role="group"
    >
      <Box
        borderRadius="16px"
        transition="border-color 0.15s ease"
        _groupHover={{
          "& > div": {
            borderColor: "brand.200",
          },
        }}
      >
        <ServiceIcon short={short} logo={logo} logoUrl={logoUrl} />
      </Box>
      <Text
        fontSize="12px"
        fontWeight="500"
        color="text.muted"
        textAlign="center"
        noOfLines={2}
        lineHeight="1.3"
        _groupHover={{
          color: "text.primary",
        }}
      >
        {title}
      </Text>
    </Flex>
  </Link>
);

const PAGE_SIZE = 8;

const QuickLinksPanel = () => {
  const [page, setPage] = useState(0);
  const [services, setServices] = useState(loadLinks);
  const gridRef = useRef(null);
  const pageCount = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const visible = services.slice(start, start + PAGE_SIZE);

  const goTo = (next) => {
    setPage(Math.min(pageCount - 1, Math.max(0, next)));
  };

  useEffect(() => {
    let isMounted = true;

    const loadRemoteLinks = async () => {
      try {
        const next = await getQuickLinks();
        if (isMounted && next.length) {
          setServices(next);
          setPage(0);
        }
      } catch (error) {
        // Keep local dashboard links when the BSS quick-links API is unavailable.
      }
    };

    const sync = () => {
      const next = loadLinks();
      setServices(next);
      setPage((current) => {
        const count = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
        return Math.min(current, count - 1);
      });
    };

    window.addEventListener("storage", sync);
    window.addEventListener(LINKS_CHANGED_EVENT, sync);
    loadRemoteLinks();

    return () => {
      isMounted = false;
      window.removeEventListener("storage", sync);
      window.removeEventListener(LINKS_CHANGED_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return undefined;

    const blockScroll = (event) => {
      event.preventDefault();
    };

    node.addEventListener("wheel", blockScroll, { passive: false });
    node.addEventListener("touchmove", blockScroll, { passive: false });
    return () => {
      node.removeEventListener("wheel", blockScroll);
      node.removeEventListener("touchmove", blockScroll);
    };
  }, []);

  return (
    <Box
      ref={gridRef}
      h="100%"
      maxH="280px"
      overflow="hidden"
      overscrollBehavior="none"
    >
    <SurfaceCard
      p={0}
      minH="280px"
      maxH="280px"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Flex
        align="center"
        justify="space-between"
        px={5}
        pt={5}
        pb={3}
        flexShrink={0}
      >
        <Heading fontSize="14px" fontWeight="600" color="text.primary">
          Systems & Services
        </Heading>
        <Flex align="center" gap={1}>
          <IconButton
            aria-label="Previous systems"
            icon={<FiChevronLeft />}
            size="xs"
            variant="ghost"
            color="text.muted"
            isDisabled={page === 0}
            onClick={() => goTo(page - 1)}
          />
          <Text
            fontSize="12px"
            fontWeight="500"
            color="text.muted"
            minW="36px"
            textAlign="center"
          >
            {page + 1}/{pageCount}
          </Text>
          <IconButton
            aria-label="Next systems"
            icon={<FiChevronRight />}
            size="xs"
            variant="ghost"
            color="text.muted"
            isDisabled={page >= pageCount - 1}
            onClick={() => goTo(page + 1)}
          />
        </Flex>
      </Flex>

      <Box px={5} pb={4} flex="1" minH={0} overflow="hidden">
        <SimpleGrid columns={4} spacing={4} overflow="hidden">
          {visible.map((service) => (
            <ServiceTile
              key={service.id}
              title={service.title}
              short={service.short}
              logo={service.logo}
              logoUrl={service.logoUrl}
              href={service.href}
            />
          ))}
        </SimpleGrid>
      </Box>
    </SurfaceCard>
    </Box>
  );
};

export default QuickLinksPanel;
