import React, { useEffect, useState } from "react";
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
  PRIORITY_COLORS,
  STATUS_COLORS,
} from "../../utils/constants";

import { updateCase } from "../../API/cases.api";
import { getAssignees } from "../../API/users.api";
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
  const [assignedTo, setAssignedTo] =
      useState("Unassigned");

  const [assignees, setAssignees] =
      useState([]);

  const [isLoadingAssignees, setIsLoadingAssignees] =
      useState(false);

  const [isSaving, setIsSaving] =
      useState(false);

  /*
   * =========================================================
   * LOAD ASSIGNEES
   *
   * Fetch enabled users from the database whenever
   * the modal is opened.
   * =========================================================
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadAssignees = async () => {
      setIsLoadingAssignees(true);

      try {
        const users = await getAssignees();

        setAssignees(
            Array.isArray(users)
                ? users
                : []
        );
      } catch (error) {
        console.error(
            "Failed to load assignees:",
            error
        );

        setAssignees([]);

        toast({
          title: "Unable to load assignees",
          description:
              "Could not retrieve users from the database.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsLoadingAssignees(false);
      }
    };

    loadAssignees();
  }, [isOpen, toast]);

  /*
   * =========================================================
   * POPULATE CASE DATA
   *
   * Whenever a different case is opened, populate the
   * editable fields.
   * =========================================================
   */

  useEffect(() => {
    if (!item) {
      return;
    }

    setStatus(
        item.status || ""
    );

    setPriority(
        item.priority || ""
    );

    setAssignedTo(
        item.assignedTo || "Unassigned"
    );
  }, [item]);

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const payload = {
        status,

        priority,

        assignedTo:
            assignedTo === "Unassigned"
                ? null
                : assignedTo,
      };

      await updateCase(
          item.id,
          payload
      );

      toast({
        title: "Case updated",
        description:
            `${item.id} has been updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onSuccess) {
        await onSuccess();
      }

      onClose();

    } catch (err) {

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

          {/* ===================================================
            HEADER
        =================================================== */}

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

            </Stack>
          </ModalHeader>

          <ModalCloseButton />

          {/* ===================================================
            BODY
        =================================================== */}

          <ModalBody
              px={6}
              py={6}
          >
            <Stack spacing={6}>

              {/* =================================================
                CASE INFORMATION
            ================================================= */}

              <Box>

                <Text
                    fontSize="sm"
                    fontWeight="600"
                    mb={3}
                >
                  Case Information
                </Text>

                <Stack spacing={3}>

                  {/* Description */}

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

                  {/* Case metadata */}

                  <SimpleGrid
                      columns={{
                        base: 1,
                        md: 3,
                      }}
                      spacing={4}
                  >

                    {/* Case ID */}

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

                    {/* System */}

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
                        {item.system ||
                            "—"}
                      </Text>

                    </Box>

                    {/* Date */}

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
                        {item.openedAt ||
                            "—"}
                      </Text>

                    </Box>

                  </SimpleGrid>

                </Stack>

              </Box>

              <Divider />

              {/* =================================================
                UPDATE CASE
            ================================================= */}

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

                  {/* =================================================
                    STATUS
                ================================================= */}

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

                  {/* =================================================
                    PRIORITY
                ================================================= */}

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

                  {/* =================================================
                    ASSIGNEE
                ================================================= */}

                  <FormControl>

                    <FormLabel fontSize="sm">
                      Assignee
                    </FormLabel>

                    <Select
                        size="sm"
                        value={assignedTo}
                        onChange={(event) =>
                            setAssignedTo(
                                event.target.value
                            )
                        }
                        isDisabled={
                          isLoadingAssignees
                        }
                    >

                      {/* Unassigned */}

                      <option value="Unassigned">
                        Unassigned
                      </option>

                      {/* Loading */}

                      {isLoadingAssignees ? (
                          <option
                              value=""
                              disabled
                          >
                            Loading users...
                          </option>
                      ) : (

                          /*
                           * Users from database
                           */

                          assignees.map(
                              (user) => (
                                  <option
                                      key={user.id}
                                      value={
                                        user.username
                                      }
                                  >
                                    {user.username}
                                    {" — "}
                                    {user.email}
                                  </option>
                              )
                          )

                      )}

                    </Select>

                    {/* Small loading indicator */}

                    {isLoadingAssignees && (
                        <HStack
                            mt={2}
                            spacing={2}
                        >
                          <Spinner
                              size="xs"
                          />

                          <Text
                              fontSize="xs"
                              color="text.muted"
                          >
                            Loading users...
                          </Text>
                        </HStack>
                    )}

                  </FormControl>

                </SimpleGrid>

              </Box>

              {/* =================================================
                REFERENCES
            ================================================= */}

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
                              {item.jiraRefs.join(
                                  ", "
                              )}
                            </Badge>
                        )}

                        {hasVendorRefs && (
                            <Badge
                                variant="outline"
                                colorScheme="orange"
                            >
                              Vendor{" "}
                              {item.vendorRefs.join(
                                  ", "
                              )}
                            </Badge>
                        )}

                      </HStack>

                    </Box>

                  </>
              )}

            </Stack>
          </ModalBody>

          {/* ===================================================
            FOOTER
        =================================================== */}

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