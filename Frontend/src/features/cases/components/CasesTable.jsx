import React from "react";

import {
    Box,
    Button,
    HStack,
    Icon,
    IconButton,
    chakra,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Spinner,
    Table,
    TableContainer,
    Tag,
    TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";

import {
    FaChevronLeft,
    FaChevronRight,
    FaRotate,
} from "react-icons/fa6";
import { FiChevronDown, FiChevronUp, FiFilter, FiSearch } from "react-icons/fi";
import { DataTableShell, DropdownSelect } from "../../../components/ui";
import { formatCaseOpenedAt } from "../case.utils";
import { useCompactDesktop } from "../../../utils/compactDesktop";

// ============================================================
// CASES TABLE
// ============================================================

const CasesTable = ({
                        items = [],
                        isLoading = false,

                        onOpenCase,
                        onRefresh,
                        onEdit,

                        query,
                        status,
                        priority,
                        system,
                        assignee,

                        assignees = [],
                        systems = [],
                        isLoadingAssignees = false,

                        onQueryChange,
                        onStatusChange,
                        onPriorityChange,
                        onSystemChange,
                        onAssigneeChange,

                        sortKey,
                        direction,
                        onSortChange,
                        onDirectionChange,

                        currentPage = 1,
                        pageSize = 10,
                        totalItems = 0,
                        onPageChange,
                        onPageSizeChange,
                    }) => {
    const compact = useCompactDesktop({ desktopOnly: true });

    // =========================================================
    // SORTING
    // =========================================================

    const handleSort = (nextKey) => {

        if (
            !onSortChange ||
            !onDirectionChange
        ) {
            return;
        }

        if (sortKey === nextKey) {

            onDirectionChange(
                direction === "asc"
                    ? "desc"
                    : "asc"
            );

            return;
        }

        onSortChange(nextKey);
        onDirectionChange("asc");
    };


    const SortHeader = ({ label, columnKey }) => {
        const active = sortKey === columnKey;

        return (
            <HStack spacing={1} userSelect="none">
                <Text as="span">{label}</Text>
                <Icon
                    as={active && direction === "asc" ? FiChevronUp : FiChevronDown}
                    boxSize={3}
                    color={active ? "brand.500" : "text.muted"}
                    opacity={active ? 1 : 0.4}
                />
            </HStack>
        );
    };

    const statusOptions = [
        { value: "", label: "All status" },
        { value: "Open", label: "Open" },
        { value: "Closed", label: "Closed" },
    ];

    const priorityOptions = [
        { value: "", label: "All priority" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
        { value: "Critical", label: "Critical" },
    ];

    const systemOptions = [
        { value: "", label: "All sources" },
        ...systems.map((name) => ({ value: name, label: name })),
    ];

    const extraFilterCount = [system, assignee].filter(Boolean).length;
    const goldInk = useColorModeValue("#92400E", "#F4B41A");
    const greenInk = useColorModeValue("#0C5F2C", "#7BC995");
    const amberInk = useColorModeValue("#B45309", "#F2994A");


    // =========================================================
    // STATUS STYLES
    // =========================================================

    const getStatusStyles = (
        value
    ) => {

        const normalized =
            String(value || "")
                .toLowerCase()
                .trim();

        switch (normalized) {

            case "resolved":
            case "closed":

                return {
                    bg: "rgba(0, 132, 61, 0.12)",
                    color: "#00843D",
                    dot: "#00843D",
                    borderColor: "transparent",
                };

            case "open":
            case "in progress":
            case "in-progress":

                return {
                    bg: "rgba(244, 180, 26, 0.20)",
                    color: goldInk,
                    dot: "#F4B41A",
                    borderColor: "transparent",
                };

            case "in uat":
            case "uat":

                return {
                    bg: "rgba(123, 201, 149, 0.28)",
                    color: greenInk,
                    dot: "#7BC995",
                    borderColor: "transparent",
                };

            case "awaiting vendor":
            case "pending vendor":

                return {
                    bg: "rgba(242, 153, 74, 0.20)",
                    color: amberInk,
                    dot: "#F2994A",
                    borderColor: "transparent",
                };

            case "new":

                return {
                    bg: "surface.subtle",
                    color: "text.primary",
                    dot: "#6B7280",
                    borderColor: "transparent",
                };

            default:

                return {
                    bg: "surface.subtle",
                    color: "text.primary",
                    dot: "#6B7280",
                    borderColor: "transparent",
                };
        }
    };


    // =========================================================
    // PRIORITY STYLES
    // =========================================================

    const getPriorityStyles = (
        value
    ) => {

        const normalized =
            String(value || "")
                .toLowerCase()
                .trim();

        switch (normalized) {

            case "critical":

                return {
                    bg: "rgba(214, 69, 69, 0.12)",
                    color: "#D64545",
                    borderColor: "transparent",
                };

            case "high":

                return {
                    bg: "rgba(242, 153, 74, 0.20)",
                    color: amberInk,
                    borderColor: "transparent",
                };

            case "medium":

                return {
                    bg: "rgba(244, 180, 26, 0.20)",
                    color: goldInk,
                    borderColor: "transparent",
                };

            case "low":

                return {
                    bg: "rgba(0, 132, 61, 0.12)",
                    color: "#00843D",
                    borderColor: "transparent",
                };

            default:

                return {
                    bg: "surface.subtle",
                    color: "text.muted",
                    borderColor: "transparent",
                };
        }
    };


    // =========================================================
    // DATA HELPERS
    // =========================================================

    const getCaseId = (item) =>
        item.caseId ||
        item.id ||
        item.caseNumber ||
        "—";


    const getCaseSummary = (item) =>
        item.summary ||
        item.caseSummary ||
        item.title ||
        item.description ||
        "No summary provided";


    const getSystem = (item) =>
        item.system ||
        item.systemName ||
        "—";


    const getStatus = (item) =>
        item.status ||
        "—";


    const getPriority = (item) =>
        item.priority ||
        "—";


    const getAssignedTo = (item) => {
        if (!item.assignedTo) {
            return { name: "Unassigned", email: "", initials: "—" };
        }

        if (typeof item.assignedTo === "object") {
            const name =
                item.assignedTo.fullName ||
                item.assignedTo.name ||
                item.assignedTo.username ||
                item.assignedTo.email ||
                "Unassigned";
            const email = item.assignedTo.email || item.assignedTo.username || "";
            const initials = name
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase();

            return { name, email, initials };
        }

        const name = String(item.assignedTo);
        return {
            name,
            email: "",
            initials: name.slice(0, 2).toUpperCase(),
        };
    };


    const formatDate = (value) => formatCaseOpenedAt(value);


    // =========================================================
    // ASSIGNEE HELPERS
    // =========================================================

    const getAssigneeValue = (
        person
    ) => {

        if (
            typeof person ===
            "object" &&
            person !== null
        ) {

            return (
                person.username ||
                person.email ||
                person.id ||
                ""
            );
        }

        return person || "";
    };


    const getAssigneeLabel = (
        person
    ) => {

        if (
            typeof person ===
            "object" &&
            person !== null
        ) {

            return (
                person.fullName ||
                person.name ||
                person.username ||
                person.email ||
                "Unknown user"
            );
        }

        return person || "Unknown user";
    };

    const assigneeOptions = [
        { value: "", label: "All assignees" },
        ...assignees
            .map((person) => {
                const value = getAssigneeValue(person);
                const optionLabel = getAssigneeLabel(person);
                if (!value) return null;
                return { value, label: optionLabel };
            })
            .filter(Boolean),
    ];


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalItems / pageSize
        )
    );


    const firstItem =
        totalItems === 0
            ? 0
            : (
            (currentPage - 1) *
            pageSize
        ) + 1;


    const lastItem = Math.min(
        currentPage * pageSize,
        totalItems
    );


    const handlePrevious = () => {

        if (
            currentPage > 1 &&
            onPageChange
        ) {

            onPageChange(
                currentPage - 1
            );
        }
    };


    const handleNext = () => {

        if (
            currentPage < totalPages &&
            onPageChange
        ) {

            onPageChange(
                currentPage + 1
            );
        }
    };


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <DataTableShell>

            {/* =================================================
          TABLE TOOLBAR
      ================================================= */}

            <HStack
                w="100%"
                justify="space-between"
                align="center"
                px={5}
                py={4}
                borderBottomWidth="1px"
                borderColor="border.default"
                bg="surface.card"
                spacing={3}
            >
                <Box
                    position="relative"
                    flex="1"
                    maxW="360px"
                    minW="200px"
                    h="40px"
                >
                    <Icon
                        as={FiSearch}
                        position="absolute"
                        left="12px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="text.muted"
                        boxSize={4}
                        pointerEvents="none"
                        zIndex={1}
                    />
                    <chakra.input
                        h="40px"
                        w="100%"
                        pl="40px"
                        pr="12px"
                        fontSize="13px"
                        fontWeight="500"
                        color="text.primary"
                        bg="surface.input"
                        border="1px solid"
                        borderColor="border.default"
                        borderRadius="10px"
                        outline="none"
                        boxShadow="none"
                                        placeholder="Search jobs..."
                        value={query || ""}
                        onChange={(event) => onQueryChange(event.target.value)}
                        _placeholder={{ color: "text.muted" }}
                        _hover={{ borderColor: "brand.200" }}
                        _focus={{
                            borderColor: "brand.300",
                            boxShadow: "0 0 0 3px rgba(20, 143, 65, 0.16)",
                        }}
                    />
                </Box>

                <HStack spacing={2} flexShrink={0}>
                    <Popover placement="bottom-end" isLazy>
                        <PopoverTrigger>
                            <Button
                                h="40px"
                                px={3.5}
                                variant="unstyled"
                                display="inline-flex"
                                alignItems="center"
                                leftIcon={<Icon as={FiFilter} boxSize={3.5} />}
                                border="1px solid"
                                borderColor={extraFilterCount ? "brand.200" : "border.default"}
                                borderRadius="10px"
                                bg={extraFilterCount ? "brand.wash" : "surface.input"}
                                color={extraFilterCount ? "brand.onWash" : "text.primary"}
                                fontSize="13px"
                                fontWeight="500"
                                _hover={{
                                    bg: extraFilterCount ? "brand.wash" : "surface.subtle",
                                    borderColor: "brand.200",
                                }}
                            >
                                Filter
                                {extraFilterCount > 0 && (
                                    <Box
                                        as="span"
                                        ml={2}
                                        px={1.5}
                                        minW="18px"
                                        h="18px"
                                        borderRadius="full"
                                        bg="#00843D"
                                        color="white"
                                        fontSize="10px"
                                        lineHeight="18px"
                                        textAlign="center"
                                    >
                                        {extraFilterCount}
                                    </Box>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            w="280px"
                            bg="transparent"
                            border="0"
                            boxShadow="none"
                            zIndex={3000}
                            overflow="visible"
                            sx={{
                                "--popper-bg": "var(--chakra-colors-surface-card)",
                            }}
                        >
                            <Box
                                bg="surface.card"
                                _dark={{ bg: "#1A211D" }}
                                border="1px solid"
                                borderColor="border.default"
                                borderRadius="16px"
                                boxShadow="cardHover"
                                overflow="hidden"
                                transform={compact ? "scale(0.8)" : "none"}
                                transformOrigin="top right"
                            >
                            <PopoverHeader
                                bg="surface.card"
                                border="0"
                                px={4}
                                pt={4}
                                pb={1}
                                fontWeight="600"
                                fontSize="sm"
                            >
                                More filters
                            </PopoverHeader>
                            <PopoverBody bg="surface.card" px={4} pb={4}>
                                <VStack align="stretch" spacing={3}>
                                    <Box>
                                        <Text
                                            fontSize="12px"
                                            fontWeight="500"
                                            color="text.muted"
                                            mb={1.5}
                                        >
                                            Source
                                        </Text>
                                        <DropdownSelect
                                            size="sm"
                                            variant="outline"
                                            w="100%"
                                            minW="100%"
                                            label="Source"
                                            value={system || ""}
                                            onChange={(event) =>
                                                onSystemChange(event.target.value)
                                            }
                                            options={systemOptions}
                                        />
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize="12px"
                                            fontWeight="500"
                                            color="text.muted"
                                            mb={1.5}
                                        >
                                            Assignee
                                        </Text>
                                        <DropdownSelect
                                            size="sm"
                                            variant="outline"
                                            w="100%"
                                            minW="100%"
                                            label="Assignee"
                                            value={assignee || ""}
                                            onChange={(event) =>
                                                onAssigneeChange(event.target.value)
                                            }
                                            options={assigneeOptions}
                                            isDisabled={isLoadingAssignees}
                                        />
                                    </Box>
                                </VStack>
                            </PopoverBody>
                            </Box>
                        </PopoverContent>
                    </Popover>

                    <DropdownSelect
                        size="sm"
                        variant="outline"
                        w="150px"
                        minW="150px"
                        label="Status"
                        value={status || ""}
                        onChange={(event) => onStatusChange(event.target.value)}
                        options={statusOptions}
                    />

                    <DropdownSelect
                        size="sm"
                        variant="outline"
                        w="150px"
                        minW="150px"
                        label="Priority"
                        value={priority || ""}
                        onChange={(event) => onPriorityChange(event.target.value)}
                        options={priorityOptions}
                    />

                    <IconButton
                        size="sm"
                        h="40px"
                        w="40px"
                        variant="ghost"
                        borderRadius="10px"
                        aria-label="Refresh cases"
                        icon={<FaRotate />}
                        onClick={onRefresh}
                        isDisabled={!onRefresh}
                    />
                </HStack>
            </HStack>


            {/* =================================================
          TABLE
      ================================================= */}

            <TableContainer w="100%" overflowX="auto">

                <Table
                    variant="simple"
                    size="sm"
                    w="100%"
                >

                    {/* =================================================
              HEADER
          ================================================= */}

                    <Thead
                        bg="surface.card"
                        borderBottomWidth="1px"
                        borderColor="border.default"
                    >

                        <Tr>

                            {/* CASE ID */}

                            <Th
                                whiteSpace="nowrap"
                                cursor="pointer"
                                onClick={() => handleSort("id")}
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.02em"
                                color="text.muted"
                            >
                                <SortHeader label="Case ID" columnKey="id" />
                            </Th>


                            {/* CASE SUMMARY */}

                            <Th
                                minW="220px"
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.02em"
                                color="text.muted"
                            >
                                Case Summary
                            </Th>


                            {/* SYSTEM */}

                            <Th
                                whiteSpace="nowrap"
                                cursor="pointer"
                                onClick={() => handleSort("system")}
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.02em"
                                color="text.muted"
                            >
                                <SortHeader label="Source" columnKey="system" />
                            </Th>


                            {/* STATUS */}

                            <Th
                                whiteSpace="nowrap"
                                cursor="pointer"
                                onClick={() => handleSort("status")}
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.02em"
                                color="text.muted"
                            >
                                <SortHeader label="Status" columnKey="status" />
                            </Th>


                            {/* PRIORITY */}

                            <Th
                                whiteSpace="nowrap"
                                cursor="pointer"
                                onClick={() => handleSort("priority")}
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.02em"
                                color="text.muted"
                            >
                                <SortHeader label="Priority" columnKey="priority" />
                            </Th>


                            {/* ASSIGNED TO */}

                            <Th
                                whiteSpace="nowrap"
                                cursor="pointer"
                                onClick={() => handleSort("assignedTo")}
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.02em"
                                color="text.muted"
                            >
                                <SortHeader label="Assigned To" columnKey="assignedTo" />
                            </Th>


                            {/* DATE OPENED */}

                            <Th
                                whiteSpace="nowrap"
                                cursor="pointer"
                                onClick={() => handleSort("openedAt")}
                                fontSize="xs"
                                fontWeight="700"
                                letterSpacing="0.02em"
                                color="text.muted"
                            >
                                <SortHeader label="Date Opened" columnKey="openedAt" />
                            </Th>

                        </Tr>

                    </Thead>


                    {/* =================================================
              BODY
          ================================================= */}

                    <Tbody>

                        {isLoading ? (

                            <Tr>

                                <Td
                                    colSpan={7}
                                    py={12}
                                    textAlign="center"
                                >

                                    <VStack spacing={3}>

                                        <Spinner
                                            size="md"
                                            color="brand.500"
                                        />

                                        <Text
                                            fontSize="sm"
                                            color="text.muted"
                                        >
                                            Loading cases...
                                        </Text>

                                    </VStack>

                                </Td>

                            </Tr>

                        ) : items.length === 0 ? (

                            <Tr>

                                <Td
                                    colSpan={7}
                                    py={12}
                                    textAlign="center"
                                >

                                    <Text
                                        fontSize="sm"
                                        color="text.muted"
                                    >
                                        No jobs match this filter.
                                    </Text>

                                </Td>

                            </Tr>

                        ) : (

                            items.map((item) => {

                                const caseId =
                                    getCaseId(item);

                                const summary =
                                    getCaseSummary(item);

                                const caseSystem =
                                    getSystem(item);

                                const caseStatus =
                                    getStatus(item);

                                const casePriority =
                                    getPriority(item);

                                const assignedTo =
                                    getAssignedTo(item);

                                const statusStyles =
                                    getStatusStyles(
                                        caseStatus
                                    );

                                const priorityStyles =
                                    getPriorityStyles(
                                        casePriority
                                    );

                                return (

                                    <Tr
                                        key={
                                            item.id ||
                                            caseId
                                        }
                                        cursor="pointer"
                                        transition="background 0.15s ease"
                                        _hover={{
                                            bg: "surface.subtle",
                                        }}
                                        onClick={() =>
                                            onOpenCase(item)
                                        }
                                        borderBottomWidth="1px"
                                        borderColor="border.default"
                                    >

                                        {/* CASE ID */}

                                        <Td whiteSpace="nowrap">
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="text.brand"
                                            >
                                                {caseId}
                                            </Text>
                                        </Td>


                                        {/* CASE SUMMARY */}

                                        <Td>
                                            <Text
                                                fontSize="sm"
                                                color="text.primary"
                                                noOfLines={1}
                                            >
                                                {summary}
                                            </Text>
                                        </Td>


                                        {/* SYSTEM */}

                                        <Td whiteSpace="nowrap">
                                            <Text
                                                fontSize="sm"
                                                color="text.primary"
                                                noOfLines={1}
                                            >
                                                {caseSystem}
                                            </Text>
                                        </Td>


                                        {/* STATUS */}

                                        <Td whiteSpace="nowrap">
                                            <HStack
                                                spacing={2}
                                                px={2.5}
                                                py={1}
                                                w="fit-content"
                                                borderRadius="full"
                                                bg={statusStyles.bg}
                                                color={statusStyles.color}
                                            >
                                                <Box
                                                    w="7px"
                                                    h="7px"
                                                    borderRadius="full"
                                                    bg={statusStyles.dot}
                                                />
                                                <Text fontSize="xs" fontWeight="600">
                                                    {caseStatus}
                                                </Text>
                                            </HStack>
                                        </Td>


                                        {/* PRIORITY */}

                                        <Td whiteSpace="nowrap">
                                            <Tag
                                                size="sm"
                                                borderRadius="full"
                                                fontWeight="600"
                                                fontSize="xs"
                                                px={3}
                                                bg={priorityStyles.bg}
                                                color={priorityStyles.color}
                                                borderWidth="0"
                                            >
                                                <TagLabel>
                                                    {casePriority}
                                                </TagLabel>
                                            </Tag>
                                        </Td>


                                        {/* ASSIGNED TO */}

                                        <Td whiteSpace="nowrap">
                                            <HStack spacing={2}>
                                                <Box
                                                    w="28px"
                                                    h="28px"
                                                    borderRadius="full"
                                                    bg="rgba(0, 132, 61, 0.14)"
                                                    color="#00843D"
                                                    fontSize="11px"
                                                    fontWeight="700"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexShrink={0}
                                                >
                                                    {assignedTo.initials}
                                                </Box>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="500"
                                                    noOfLines={1}
                                                >
                                                    {assignedTo.name}
                                                </Text>
                                            </HStack>
                                        </Td>


                                        {/* DATE OPENED */}

                                        <Td whiteSpace="nowrap">
                                            <Text
                                                fontSize="sm"
                                                color="text.muted"
                                            >
                                                {formatDate(
                                                    item.openedAt ||
                                                    item.createdAt
                                                )}
                                            </Text>
                                        </Td>

                                    </Tr>

                                );
                            })

                        )}

                    </Tbody>

                </Table>

            </TableContainer>


            {/* =======================================================
          PAGINATION
      ======================================================== */}

            <Box
                px={4}
                py={3}
                borderTopWidth="1px"
                borderColor="border.default"
                bg="surface.subtle"
            >

                <HStack
                    justify="space-between"
                    align="center"
                    flexWrap="wrap"
                    spacing={4}
                >

                    {/* ROWS PER PAGE */}

                    <HStack spacing={2}>

                        <Text
                            fontSize="sm"
                            color="text.muted"
                        >
                            Rows per page:
                        </Text>

                        <DropdownSelect
                            size="sm"
                            w="88px"
                            minW="88px"
                            label="Rows per page"
                            value={String(pageSize)}
                            onChange={(event) =>
                                onPageSizeChange(Number(event.target.value))
                            }
                            options={[
                                { value: "10", label: "10" },
                                { value: "20", label: "20" },
                                { value: "50", label: "50" },
                                { value: "100", label: "100" },
                            ]}
                        />

                    </HStack>


                    {/* RESULT COUNT */}

                    <Text
                        fontSize="sm"
                        color="text.muted"
                    >
                        {firstItem}-{lastItem} of{" "}
                        {totalItems}
                    </Text>


                    {/* PAGE NAVIGATION */}

                    <HStack spacing={1}>

                        <IconButton
                            size="sm"
                            variant="ghost"
                            icon={
                                <FaChevronLeft
                                    size={14}
                                />
                            }
                            aria-label="Previous page"
                            onClick={
                                handlePrevious
                            }
                            isDisabled={
                                currentPage === 1 ||
                                totalItems === 0
                            }
                        />


                        <Text
                            fontSize="sm"
                            minW="80px"
                            textAlign="center"
                            fontWeight="500"
                            color="text.muted"
                        >
                            Page {currentPage} of{" "}
                            {totalPages}
                        </Text>


                        <IconButton
                            size="sm"
                            variant="ghost"
                            icon={
                                <FaChevronRight
                                    size={14}
                                />
                            }
                            aria-label="Next page"
                            onClick={handleNext}
                            isDisabled={
                                currentPage ===
                                totalPages ||
                                totalItems === 0
                            }
                        />

                    </HStack>

                </HStack>

            </Box>

        </DataTableShell>
    );
};

export default CasesTable;