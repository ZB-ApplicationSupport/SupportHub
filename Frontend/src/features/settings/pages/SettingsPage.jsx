import React, { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";

import { useAppContext } from "../../../context/AppContext";
import { CompactDesktopScale, SurfaceCard } from "../../../components/ui";
import RoleBadge from "../../users/components/RoleBadge";
import UsersManagementPanel from "../../users/components/UsersManagementPanel";
import SupportedSystemsPanel from "../../systems/components/SupportedSystemsPanel";
import ObservabilityPage from "../../monitoring/pages/ObservabilityPage";
import LinksPanel from "../../links/LinksPanel";
import AuditEventsPanel from "../components/AuditEventsPanel";
import {
  DarkPillButton,
  SettingsSearch,
  SettingsSectionHeader,
  UnderlineNav,
} from "../components/settingsUi";

const InfoRow = ({ label, value, extra }) => (
  <Flex
    align={{ base: "flex-start", sm: "center" }}
    justify="space-between"
    direction={{ base: "column", sm: "row" }}
    gap={2}
    py={3}
    borderBottom="1px solid"
    borderColor="border.default"
    _last={{ borderBottom: "none", pb: 0 }}
    _first={{ pt: 0 }}
  >
    <Text
      fontSize="11px"
      fontWeight="600"
      letterSpacing="0.06em"
      textTransform="uppercase"
      color="text.muted"
    >
      {label}
    </Text>
    {extra || (
      <Text fontSize="14px" fontWeight="500" color="text.primary">
        {value || "—"}
      </Text>
    )}
  </Flex>
);

const AccountSection = ({ searchQuery }) => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const { colorMode, setColorMode } = useColorMode();

  const displayName = user?.name || user?.username || "User";
  const username = user?.username || "";
  const email = user?.email || "";
  const role = user?.role || "USER";
  const department = user?.department || "";

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const term = searchQuery.trim().toLowerCase();
  const showProfile =
    !term ||
    [displayName, username, email, department, role, "profile", "account"]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  const showAppearance =
    !term ||
    ["appearance", "theme", "light", "dark"].some((value) =>
      value.includes(term)
    );
  const showSession =
    !term ||
    ["session", "sign out", "logout"].some((value) => value.includes(term));

  return (
    <Stack spacing={6}>
      <SettingsSectionHeader
        title="Account details"
        description="Profile, appearance, and session for this SupportHub login."
      />

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
        {showProfile && (
          <SurfaceCard p={5}>
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Flex align="center" gap={3} minW={0}>
                <Flex
                  align="center"
                  justify="center"
                  w="44px"
                  h="44px"
                  borderRadius="12px"
                  bg="brand.500"
                  color="white"
                  fontSize="18px"
                  fontWeight="700"
                  flexShrink={0}
                >
                  {displayName.charAt(0).toUpperCase()}
                </Flex>
                <Box minW={0}>
                  <Text fontSize="15px" fontWeight="700" noOfLines={1}>
                    {displayName}
                  </Text>
                  <Text fontSize="12px" color="text.muted" noOfLines={1}>
                    Signed in with Keycloak
                  </Text>
                </Box>
              </Flex>
            </Flex>
            <Box>
              <InfoRow label="Full name" value={displayName} />
              <InfoRow label="Username" value={username} />
              <InfoRow label="Email" value={email} />
              <InfoRow label="Department" value={department} />
              <InfoRow label="Role" extra={<RoleBadge role={role} />} />
            </Box>
          </SurfaceCard>
        )}

        {showAppearance && (
          <SurfaceCard p={5}>
            <Flex justify="space-between" align="flex-start" mb={3}>
              <Flex align="center" gap={3}>
                <Flex
                  align="center"
                  justify="center"
                  w="44px"
                  h="44px"
                  borderRadius="12px"
                  bg="surface.subtle"
                  color="text.primary"
                  flexShrink={0}
                >
                  {colorMode === "dark" ? (
                    <FiMoon size={20} />
                  ) : (
                    <FiSun size={20} />
                  )}
                </Flex>
                <Box>
                  <Text fontSize="15px" fontWeight="700">
                    Appearance
                  </Text>
                  <Text fontSize="12px" color="text.muted">
                    Light or dark on this device
                  </Text>
                </Box>
              </Flex>
              <Switch
                isChecked={colorMode === "dark"}
                onChange={(event) =>
                  setColorMode(event.target.checked ? "dark" : "light")
                }
                colorScheme="green"
                size="md"
                mt={1}
                sx={{
                  "& .chakra-switch__track[data-checked]": { bg: "#00843D" },
                }}
              />
            </Flex>
            <Text fontSize="13px" color="text.muted">
              Dark mode uses a low-glare canvas for monitoring and late shifts.
            </Text>
          </SurfaceCard>
        )}

        {showSession && (
          <SurfaceCard p={5}>
            <Flex justify="space-between" align="flex-start" mb={3}>
              <Box>
                <Text fontSize="15px" fontWeight="700">
                  Session
                </Text>
                <Text fontSize="12px" color="text.muted">
                  This browser only
                </Text>
              </Box>
            </Flex>
            <Text fontSize="13px" color="text.muted" mb={5}>
              Sign out of Banking Systems Support on this browser.
            </Text>
            <Flex gap={2} wrap="wrap">
              <DarkPillButton onClick={() => navigate("/dashboard")}>
                Back to dashboard
              </DarkPillButton>
              <DarkPillButton
                onClick={handleSignOut}
                bg="#D64545"
                color="white"
                _hover={{ bg: "#B83A3A", opacity: 1 }}
              >
                Sign out
              </DarkPillButton>
            </Flex>
          </SurfaceCard>
        )}
      </SimpleGrid>
    </Stack>
  );
};

const SettingsPage = () => {
  const { user } = useAppContext();
  const isAdmin = user?.role === "ADMIN";
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  const sections = useMemo(
    () =>
      [
        { id: "account", label: "Account" },
        isAdmin ? { id: "users", label: "Users" } : null,
        isAdmin ? { id: "systems", label: "Supported Systems" } : null,
        isAdmin ? { id: "links", label: "Add Links" } : null,
        isAdmin ? { id: "observability", label: "Observability" } : null,
        isAdmin ? { id: "audit", label: "Audit" } : null,
      ].filter(Boolean),
    [isAdmin]
  );

  const requested = searchParams.get("section") || "account";
  const section = sections.some((item) => item.id === requested)
    ? requested
    : "account";

  const setSection = (next) => {
    setQuery("");
    setSearchParams(
      next === "account" ? {} : { section: next },
      { replace: true }
    );
  };

  const searchPlaceholder =
    section === "users"
      ? "Search users"
      : section === "systems"
        ? "Search systems"
        : section === "links"
          ? "Search links"
          : section === "observability"
            ? "Search observability"
            : section === "audit"
              ? "Search audit events"
            : "Search settings";

  return (
    <CompactDesktopScale>
      <Stack spacing={6} pb={6}>
        <Flex
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading
            fontSize={{ base: "26px", md: "28px" }}
            fontWeight="800"
            color="text.primary"
            letterSpacing="-0.04em"
            lineHeight="1.2"
          >
            {isAdmin ? "Admin Settings" : "Settings"}
          </Heading>
          <SettingsSearch
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </Flex>

        <UnderlineNav
          items={sections}
          value={section}
          onChange={setSection}
        />

        {section === "users" && isAdmin ? (
          <UsersManagementPanel searchQuery={query} />
        ) : section === "systems" && isAdmin ? (
          <SupportedSystemsPanel searchQuery={query} />
        ) : section === "links" && isAdmin ? (
          <LinksPanel searchQuery={query} />
        ) : section === "observability" && isAdmin ? (
          <ObservabilityPage initialTab={searchParams.get("tab")} />
        ) : section === "audit" && isAdmin ? (
          <AuditEventsPanel searchQuery={query} />
        ) : (
          <AccountSection searchQuery={query} />
        )}
      </Stack>
    </CompactDesktopScale>
  );
};

export default SettingsPage;
