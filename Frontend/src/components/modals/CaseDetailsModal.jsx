import React, {
  useEffect,
  useState,
} from "react";

import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import {
  STATUS_COLORS,
} from "../../utils/constants";

import {
  updateCase,
} from "../../API/cases.api";

const STATUS_OPTIONS = [
  "In progress",
  "In UAT",
  "Resolved",
  "Awaiting vendor",
];

const PRIORITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const CaseDetailsModal = ({
                            isOpen,
                            onClose,
                            item,
                            assignees = [],
                            isLoadingAssignees = false,
                            onRefreshAssignees,
                            onSuccess,
                          }) => {
  const toast = useToast();

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedToId, setAssignedToId] =
      useState("");

  const [isSaving, setIsSaving] =
      useState(false);

  /*
   * =========================================================
   * LOAD / REFRESH ASSIGNEES
   * =========================================================
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (
        typeof onRefreshAssignees === "function"
    ) {
      onRefreshAssignees();
    }
  }, [
    isOpen,
    onRefreshAssignees,
  ]);

  /*
   * =========================================================
   * POPULATE CASE DATA
   * =========================================================
   */

  useEffect(() => {
    if (!item) {
      return;
    }

    console.log(
        "================================"
    );

    console.log(
        "=== CASE DETAILS ITEM ==="
    );

    console.log(
        "ITEM:",
        item
    );

    console.log(
        "CASE ID:",
        item.id
    );

    console.log(
        "ASSIGNED TO ID:",
        item.assignedToId
    );

    console.log(
        "ASSIGNED TO:",
        item.assignedTo
    );

    console.log(
        "STATUS:",
        item.status
    );

    console.log(
        "PRIORITY:",
        item.priority
    );

    console.log(
        "================================"
    );

    setStatus(
        item.status || "In progress"
    );

    setPriority(
        item.priority || "Medium"
    );

    setAssignedToId(
        item.assignedToId != null
            ? String(item.assignedToId)
            : ""
    );
  }, [item]);

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const handleSave = async () => {
    if (!item) {
      return;
    }

    setIsSaving(true);

    try {
      /*
       * IMPORTANT:
       * Send assignedToId, NOT assignedTo username.
       */

      const payload = {
        status,
        priority,

        assignedToId:
            assignedToId !== ""
                ? Number(assignedToId)
                : null,
      };

      console.log(
          "================================"
      );

      console.log(
          "=== CASE DETAILS SAVE ==="
      );

      console.log(
          "CASE ID:",
          item.id
      );

      console.log(
          "PAYLOAD:",
          payload
      );

      console.log(
          "STATUS:",
          payload.status
      );

      console.log(
          "PRIORITY:",
          payload.priority
      );

      console.log(
          "ASSIGNED TO ID:",
          payload.assignedToId
      );

      console.log(
          "================================"
      );

      await updateCase(
          item.id,
          payload
      );

      toast({
        title: "Case updated",
        description:
            `Case ${item.id} was updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onSuccess) {
        await onSuccess();
      }

      onClose();

    } catch (err) {
      console.error(
          "Failed to update case:",
          err
      );

      toast({
        title: "Failed to update case",
        description:
            err.response?.data?.message ||
            "Unable to update the case. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });

    } finally {
      setIsSaving(false);
    }
  };

  /*
   * =========================================================
   * SAFETY
   * =========================================================
   */

  if (!item) {
    return null;
  }

  /*
   * =========================================================
   * REFERENCES
   * =========================================================
   */

  const hasJiraRefs =
      Array.isArray(item.jiraRefs) &&
      item.jiraRefs.length > 0;

  const hasVendorRefs =
      Array.isArray(item.vendorRefs) &&
      item.vendorRefs.length > 0;

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="2xl"
          isCentered
          scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.600" />

        <ModalContent
            borderRadius="xl"
            overflow="hidden"
        >

          {/* HEADER */}

          <ModalHeader
              px={6}
              py={5}
              borderBottomWidth="1px"
          >
            <Stack spacing={1}>

              <HStack spacing={3}>

                <Heading size="md">
                  {item.summary}
                </Heading>

                <Badge
                    colorScheme={
                        STATUS_COLORS[item.status] ||
                        "gray"
                    }
                >
                  {item.status}
                </Badge>

              </HStack>

              <Text
                  fontSize="xs"
                  color="gray.500"
              >
                Case ID: {item.id}
              </Text>

            </Stack>
          </ModalHeader>

          <ModalCloseButton />

          {/* BODY */}

          <ModalBody
              px={6}
              py={6}
          >
            <Stack spacing={6}>

              {/* CASE INFORMATION */}

              <Box>

                <Text
                    fontSize="sm"
                    fontWeight="600"
                    mb={3}
                >
                  Case Information
                </Text>

                <Stack spacing={3}>

                  <Box>

                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="text.muted"
                        mb={1}
                    >
                      Description
                    </Text>

                    <Text fontSize="sm">
                      {item.description ||
                          "No description provided."}
                    </Text>

                  </Box>

                  <SimpleGrid
                      columns={{
                        base: 1,
                        md: 3,
                      }}
                      spacing={4}
                  >

                    <Box>

                      <Text
                          fontSize="xs"
                          fontWeight="600"
                          color="text.muted"
                          mb={1}
                      >
                        Case ID
                      </Text>

                      <Text fontSize="sm">
                        {item.id}
                      </Text>

                    </Box>

                    <Box>

                      <Text
                          fontSize="xs"
                          fontWeight="600"
                          color="text.muted"
                          mb={1}
                      >
                        System
                      </Text>

                      <Text fontSize="sm">
                        {item.system || "—"}
                      </Text>

                    </Box>

                    <Box>

                      <Text
                          fontSize="xs"
                          fontWeight="600"
                          color="text.muted"
                          mb={1}
                      >
                        Date Opened
                      </Text>

                      <Text fontSize="sm">
                        {item.openedAt || "—"}
                      </Text>

                    </Box>

                  </SimpleGrid>

                </Stack>

              </Box>

              <Divider />

              {/* UPDATE CASE */}

              <Box>

                <Text
                    fontSize="sm"
                    fontWeight="600"
                    mb={4}
                >
                  Update Case
                </Text>

                <SimpleGrid
                    columns={{
                      base: 1,
                      md: 3,
                    }}
                    spacing={4}
                >

                  {/* STATUS */}

                  <FormControl>

                    <FormLabel fontSize="sm">
                      Status
                    </FormLabel>

                    <Select
                        size="sm"
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value
                            )
                        }
                    >

                      {STATUS_OPTIONS.map(
                          (option) => (
                              <option
                                  key={option}
                                  value={option}
                              >
                                {option}
                              </option>
                          )
                      )}

                    </Select>

                  </FormControl>

                  {/* PRIORITY */}

                  <FormControl>

                    <FormLabel fontSize="sm">
                      Priority
                    </FormLabel>

                    <Select
                        size="sm"
                        value={priority}
                        onChange={(event) =>
                            setPriority(
                                event.target.value
                            )
                        }
                    >

                      {PRIORITY_OPTIONS.map(
                          (option) => (
                              <option
                                  key={option}
                                  value={option}
                              >
                                {option}
                              </option>
                          )
                      )}

                    </Select>

                  </FormControl>

                  {/* ASSIGNEE */}

                  <FormControl>

                    <FormLabel fontSize="sm">
                      Assignee
                    </FormLabel>

                    {isLoadingAssignees ? (

                        <HStack
                            borderWidth="1px"
                            borderRadius="md"
                            px={3}
                            py={2}
                        >

                          <Spinner size="sm" />

                          <Text fontSize="sm">
                            Loading users...
                          </Text>

                        </HStack>

                    ) : (

                        <Select
                            size="sm"
                            value={assignedToId}
                            onChange={(event) =>
                                setAssignedToId(
                                    event.target.value
                                )
                            }
                        >

                          <option value="">
                            Unassigned
                          </option>

                          {assignees.map(
                              (user) => {

                                const userId =
                                    user.id ??
                                    user.userId;

                                if (
                                    userId === null ||
                                    userId === undefined
                                ) {
                                  return null;
                                }

                                return (
                                    <option
                                        key={userId}
                                        value={String(userId)}
                                    >
                                      {user.username ||
                                          user.fullName ||
                                          user.name ||
                                          user.email}
                                      {" — "}
                                      {user.email || ""}
                                    </option>
                                );
                              }
                          )}

                        </Select>

                    )}

                    {!isLoadingAssignees && (
                        <Text
                            fontSize="xs"
                            color="gray.500"
                            mt={1}
                        >
                          Current assignee:{" "}
                          {item.assignedTo ||
                              "Unassigned"}
                        </Text>
                    )}

                  </FormControl>

                </SimpleGrid>

              </Box>

              {/* REFERENCES */}

              {(hasJiraRefs ||
                  hasVendorRefs) && (

                  <>
                    <Divider />

                    <Box>

                      <Text
                          fontSize="sm"
                          fontWeight="600"
                          mb={3}
                      >
                        References
                      </Text>

                      <HStack
                          spacing={2}
                          flexWrap="wrap"
                      >

                        {hasJiraRefs && (
                            <Badge
                                variant="outline"
                                colorScheme="purple"
                            >
                              Jira{" "}
                              {item.jiraRefs.join(", ")}
                            </Badge>
                        )}

                        {hasVendorRefs && (
                            <Badge
                                variant="outline"
                                colorScheme="orange"
                            >
                              Vendor{" "}
                              {item.vendorRefs.join(", ")}
                            </Badge>
                        )}

                      </HStack>

                    </Box>

                  </>
              )}

            </Stack>
          </ModalBody>

          {/* FOOTER */}

          <ModalFooter
              px={6}
              py={4}
              borderTopWidth="1px"
          >

            <HStack spacing={3}>

              <Button
                  variant="ghost"
                  onClick={onClose}
                  isDisabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                  colorScheme="brand"
                  onClick={handleSave}
                  isLoading={isSaving}
                  loadingText="Saving..."
              >
                Save Changes
              </Button>

            </HStack>

          </ModalFooter>

        </ModalContent>
      </Modal>
  );
};

export default CaseDetailsModal;