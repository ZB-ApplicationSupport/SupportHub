import React from "react";

import {
    Box,
    Button,
    HStack,
    Icon,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Select,
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
} from "@chakra-ui/react";

import {
    FaChevronLeft,
    FaChevronRight,
    FaRotate,
} from "react-icons/fa6";


// ============================================================
// FILTER FUNNEL ICON
// ============================================================

const FilterFunnelIcon = (props) => (
    <Icon
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fill="currentColor"
            d="M4 5c0-.55.45-1 1-1h14a1 1 0 0 1 .8 1.6l-5.8 7.73v4.42a1 1 0 0 1-1.45.9l-2.5-1.25a1 1 0 0 1-.55-.9v-3.17L4.2 5.6A1 1 0 0 1 4 5z"
        />
    </Icon>
);


// ============================================================
// CASES TABLE
// ============================================================

const CasesTable = ({
                        items = [],
                        isLoading = false,

                        onOpenCase,
                        onRefresh,

                        query,
                        status,
                        priority,
                        system,
                        assignee,

                        assignees = [],
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


    const renderSortLabel = (
        label,
        key
    ) => {

        if (sortKey !== key) {
            return label;
        }

        return `${label} ${
            direction === "asc"
                ? "↑"
                : "↓"
        }`;
    };


    // =========================================================
    // FILTER ICON
    // =========================================================

    const getFilterColor = (value) =>
        value
            ? "brand.500"
            : "gray.400";


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
                    bg: "green.50",
                    color: "green.700",
                    borderColor: "green.200",
                };

            case "in progress":
            case "in-progress":

                return {
                    bg: "blue.50",
                    color: "blue.700",
                    borderColor: "blue.200",
                };

            case "in uat":
            case "uat":

                return {
                    bg: "purple.50",
                    color: "purple.700",
                    borderColor: "purple.200",
                };

            case "awaiting vendor":
            case "pending vendor":

                return {
                    bg: "orange.50",
                    color: "orange.700",
                    borderColor: "orange.200",
                };

            case "open":
            case "new":

                return {
                    bg: "gray.100",
                    color: "gray.700",
                    borderColor: "gray.200",
                };

            default:

                return {
                    bg: "gray.100",
                    color: "gray.700",
                    borderColor: "gray.200",
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
                    bg: "red.50",
                    color: "red.700",
                    borderColor: "red.200",
                };

            case "high":

                return {
                    bg: "orange.50",
                    color: "orange.700",
                    borderColor: "orange.200",
                };

            case "medium":

                return {
                    bg: "yellow.50",
                    color: "yellow.700",
                    borderColor: "yellow.200",
                };

            case "low":

                return {
                    bg: "green.50",
                    color: "green.700",
                    borderColor: "green.200",
                };

            default:

                return {
                    bg: "gray.50",
                    color: "gray.600",
                    borderColor: "gray.200",
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
            return "Unassigned";
        }

        if (
            typeof item.assignedTo ===
            "object"
        ) {

            return (
                item.assignedTo.fullName ||
                item.assignedTo.name ||
                item.assignedTo.username ||
                item.assignedTo.email ||
                "Unassigned"
            );
        }

        return item.assignedTo;
    };


    const formatDate = (value) => {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


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
    // FILTER BUTTON
    // =========================================================

    const FilterButton = ({
                              active,
                              label,
                              children,
                          }) => (

        <Popover placement="bottom-start">

            <PopoverTrigger>

                <IconButton
                    size="xs"
                    variant="ghost"
                    icon={
                        <FilterFunnelIcon
                            boxSize={3.5}
                        />
                    }
                    aria-label={
                        `Filter by ${label}`
                    }
                    color={
                        getFilterColor(active)
                    }
                    minW="24px"
                    h="24px"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    _hover={{
                        bg: "gray.100",
                    }}
                />

            </PopoverTrigger>


            <PopoverContent
                zIndex={20}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <PopoverArrow />

                <PopoverCloseButton />

                <PopoverHeader
                    fontWeight="600"
                >
                    {label}
                </PopoverHeader>

                <PopoverBody>
                    {children}
                </PopoverBody>

            </PopoverContent>

        </Popover>
    );


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <Box
            bg="surface.card"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
        >

            {/* =================================================
          TABLE TOOLBAR
      ================================================= */}

            <HStack
                justify="flex-end"
                px={4}
                py={3}
                borderBottomWidth="1px"
                borderColor="gray.200"
                bg="white"
            >

                <Button
                    size="sm"
                    variant="outline"
                    leftIcon={
                        <FaRotate />
                    }
                    onClick={onRefresh}
                    isLoading={isLoading}
                    loadingText="Refreshing..."
                    isDisabled={!onRefresh}
                >
                    Refresh Cases
                </Button>

            </HStack>


            {/* =================================================
          TABLE
      ================================================= */}

            <TableContainer>

                <Table
                    variant="simple"
                    size="sm"
                    sx={{
                        tableLayout: "fixed",
                    }}
                >

                    {/* =================================================
              HEADER
          ================================================= */}

                    <Thead
                        bg="gray.50"
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                    >

                        <Tr>

                            {/* CASE ID */}

                            <Th
                                width="13%"
                                py={3}
                                px={4}
                                cursor="pointer"
                                onClick={() =>
                                    handleSort("id")
                                }
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.04em"
                                color="gray.600"
                            >

                                <HStack spacing={1}>

                                    <Text>
                                        {renderSortLabel(
                                            "Case ID",
                                            "id"
                                        )}
                                    </Text>

                                    <FilterButton
                                        active={query}
                                        label="Case ID or Summary"
                                    >

                                        <Input
                                            size="sm"
                                            placeholder="Search ID or summary"
                                            value={
                                                query || ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                onQueryChange(
                                                    event.target.value
                                                )
                                            }
                                        />

                                    </FilterButton>

                                </HStack>

                            </Th>


                            {/* CASE SUMMARY */}

                            <Th
                                width="25%"
                                py={3}
                                px={3}
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.04em"
                                color="gray.600"
                            >
                                Case Summary
                            </Th>


                            {/* SYSTEM */}

                            <Th
                                width="15%"
                                py={3}
                                px={3}
                                cursor="pointer"
                                onClick={() =>
                                    handleSort("system")
                                }
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.04em"
                                color="gray.600"
                            >

                                <HStack spacing={1}>

                                    <Text>
                                        {renderSortLabel(
                                            "System",
                                            "system"
                                        )}
                                    </Text>

                                    <FilterButton
                                        active={system}
                                        label="System"
                                    >

                                        <Select
                                            size="sm"
                                            value={
                                                system || ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                onSystemChange(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                All
                                            </option>

                                            <option value="Core Banking">
                                                Core Banking
                                            </option>

                                            <option value="Payments Hub">
                                                Payments Hub
                                            </option>

                                            <option value="Digital Channels">
                                                Digital Channels
                                            </option>

                                            <option value="Treasury">
                                                Treasury
                                            </option>

                                            <option value="ATM Switch">
                                                ATM Switch
                                            </option>

                                        </Select>

                                    </FilterButton>

                                </HStack>

                            </Th>


                            {/* STATUS */}

                            <Th
                                width="14%"
                                py={3}
                                px={3}
                                cursor="pointer"
                                onClick={() =>
                                    handleSort("status")
                                }
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.04em"
                                color="gray.600"
                            >

                                <HStack spacing={1}>

                                    <Text>
                                        {renderSortLabel(
                                            "Status",
                                            "status"
                                        )}
                                    </Text>

                                    <FilterButton
                                        active={status}
                                        label="Status"
                                    >

                                        <Select
                                            size="sm"
                                            value={
                                                status || ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                onStatusChange(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                All Statuses
                                            </option>

                                            <option value="In progress">
                                                In Progress
                                            </option>

                                            <option value="In UAT">
                                                In UAT
                                            </option>

                                            <option value="Resolved">
                                                Resolved
                                            </option>

                                            <option value="Awaiting vendor">
                                                Awaiting Vendor
                                            </option>

                                        </Select>

                                    </FilterButton>

                                </HStack>

                            </Th>


                            {/* PRIORITY */}

                            <Th
                                width="11%"
                                py={3}
                                px={3}
                                cursor="pointer"
                                onClick={() =>
                                    handleSort("priority")
                                }
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.04em"
                                color="gray.600"
                            >

                                <HStack spacing={1}>

                                    <Text>
                                        {renderSortLabel(
                                            "Priority",
                                            "priority"
                                        )}
                                    </Text>

                                    <FilterButton
                                        active={priority}
                                        label="Priority"
                                    >

                                        <Select
                                            size="sm"
                                            value={
                                                priority || ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                onPriorityChange(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                All
                                            </option>

                                            <option value="Low">
                                                Low
                                            </option>

                                            <option value="Medium">
                                                Medium
                                            </option>

                                            <option value="High">
                                                High
                                            </option>

                                            <option value="Critical">
                                                Critical
                                            </option>

                                        </Select>

                                    </FilterButton>

                                </HStack>

                            </Th>


                            {/* ASSIGNED TO */}

                            <Th
                                width="11%"
                                py={3}
                                px={3}
                                cursor="pointer"
                                onClick={() =>
                                    handleSort(
                                        "assignedTo"
                                    )
                                }
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.04em"
                                color="gray.600"
                            >

                                <HStack spacing={1}>

                                    <Text>
                                        {renderSortLabel(
                                            "Assigned To",
                                            "assignedTo"
                                        )}
                                    </Text>

                                    <FilterButton
                                        active={assignee}
                                        label="Assigned To"
                                    >

                                        <Select
                                            size="sm"
                                            value={
                                                assignee || ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                onAssigneeChange(
                                                    event.target.value
                                                )
                                            }
                                            isDisabled={
                                                isLoadingAssignees
                                            }
                                        >

                                            <option value="">
                                                All Assignees
                                            </option>

                                            {assignees.map(
                                                (person) => {

                                                    const value =
                                                        getAssigneeValue(
                                                            person
                                                        );

                                                    const label =
                                                        getAssigneeLabel(
                                                            person
                                                        );

                                                    if (!value) {
                                                        return null;
                                                    }

                                                    return (
                                                        <option
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </option>
                                                    );
                                                }
                                            )}

                                        </Select>

                                    </FilterButton>

                                </HStack>

                            </Th>


                            {/* DATE OPENED */}

                            <Th
                                width="11%"
                                py={3}
                                px={3}
                                cursor="pointer"
                                onClick={() =>
                                    handleSort(
                                        "openedAt"
                                    )
                                }
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.04em"
                                color="gray.600"
                            >

                                {renderSortLabel(
                                    "Date Opened",
                                    "openedAt"
                                )}

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
                                        No cases match this
                                        filter.
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
                                            bg: "gray.50",
                                        }}
                                        onClick={() =>
                                            onOpenCase(item)
                                        }
                                        borderBottomWidth="1px"
                                        borderColor="gray.100"
                                    >

                                        {/* CASE ID */}

                                        <Td
                                            py={3}
                                            px={4}
                                        >

                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="brand.600"
                                                whiteSpace="nowrap"
                                            >
                                                {caseId}
                                            </Text>

                                        </Td>


                                        {/* CASE SUMMARY */}

                                        <Td
                                            py={3}
                                            px={3}
                                        >

                                            <Text
                                                fontSize="sm"
                                                color="gray.700"
                                                noOfLines={2}
                                                lineHeight="1.4"
                                            >
                                                {summary}
                                            </Text>

                                        </Td>


                                        {/* SYSTEM */}

                                        <Td
                                            py={3}
                                            px={3}
                                        >

                                            <Text
                                                fontSize="sm"
                                                color="gray.700"
                                                noOfLines={2}
                                            >
                                                {caseSystem}
                                            </Text>

                                        </Td>


                                        {/* STATUS */}

                                        <Td
                                            py={3}
                                            px={3}
                                        >

                                            <Tag
                                                size="sm"
                                                borderRadius="full"
                                                fontWeight="600"
                                                fontSize="xs"
                                                px={3}
                                                bg={
                                                    statusStyles.bg
                                                }
                                                color={
                                                    statusStyles.color
                                                }
                                                borderWidth="1px"
                                                borderColor={
                                                    statusStyles.borderColor
                                                }
                                            >

                                                <TagLabel>
                                                    {caseStatus}
                                                </TagLabel>

                                            </Tag>

                                        </Td>


                                        {/* PRIORITY */}

                                        <Td
                                            py={3}
                                            px={3}
                                        >

                                            <Tag
                                                size="sm"
                                                borderRadius="full"
                                                fontWeight="600"
                                                fontSize="xs"
                                                px={3}
                                                bg={
                                                    priorityStyles.bg
                                                }
                                                color={
                                                    priorityStyles.color
                                                }
                                                borderWidth="1px"
                                                borderColor={
                                                    priorityStyles.borderColor
                                                }
                                            >

                                                <TagLabel>
                                                    {casePriority}
                                                </TagLabel>

                                            </Tag>

                                        </Td>


                                        {/* ASSIGNED TO */}

                                        <Td
                                            py={3}
                                            px={3}
                                        >

                                            <Text
                                                fontSize="sm"
                                                color="gray.700"
                                                noOfLines={1}
                                            >
                                                {assignedTo}
                                            </Text>

                                        </Td>


                                        {/* DATE OPENED */}

                                        <Td
                                            py={3}
                                            px={3}
                                        >

                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                                whiteSpace="nowrap"
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
                borderColor="gray.200"
                bg="gray.50"
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

                        <Select
                            size="sm"
                            width="80px"
                            bg="white"
                            value={pageSize}
                            onChange={(event) =>
                                onPageSizeChange(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                        >

                            <option value={10}>
                                10
                            </option>

                            <option value={20}>
                                20
                            </option>

                            <option value={50}>
                                50
                            </option>

                            <option value={100}>
                                100
                            </option>

                        </Select>

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
                            color="gray.600"
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

        </Box>
    );
};

export default CasesTable;