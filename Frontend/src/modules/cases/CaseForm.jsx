import React from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Textarea,
  Input,
  Spinner,
  Text,
  Box,
} from "@chakra-ui/react";

const CaseForm = ({
                    initialValues,
                    onSubmit,
                    submitLabel = "Save",
                    isSubmitting = false,

                    systems = [],
                    assignees = [],

                    isLoadingSystems = false,
                    isLoadingAssignees = false,
                  }) => {

  const [values, setValues] =
      React.useState(
          initialValues || {}
      );

  React.useEffect(() => {
    setValues(
        initialValues || {}
    );
  }, [initialValues]);

  /*
   * =========================================================
   * HANDLE CHANGE
   * =========================================================
   */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * =========================================================
   * HANDLE SUBMIT
   * =========================================================
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    const submittedValues = {
      ...values,

      assignedToId:
          values.assignedToId !== undefined &&
          values.assignedToId !== null &&
          values.assignedToId !== ""
              ? Number(values.assignedToId)
              : null,

      supportSystemId:
          values.supportSystemId !== undefined &&
          values.supportSystemId !== null &&
          values.supportSystemId !== ""
              ? Number(values.supportSystemId)
              : null,
    };

    console.log(
        "================================"
    );

    console.log(
        "=== CASE FORM SUBMIT ==="
    );

    console.log(
        "FORM VALUES:",
        submittedValues
    );

    console.log(
        "ASSIGNED TO ID:",
        submittedValues.assignedToId
    );

    console.log(
        "SUPPORT SYSTEM ID:",
        submittedValues.supportSystemId
    );

    console.log(
        "================================"
    );

    if (onSubmit) {
      onSubmit(
          submittedValues
      );
    }
  };

  /*
   * =========================================================
   * ASSIGNEE HELPERS
   * =========================================================
   */

  const getAssigneeValue = (person) => {
    if (
        typeof person === "object" &&
        person !== null
    ) {
      return (
          person.id ??
          person.userId ??
          ""
      );
    }

    return person || "";
  };

  const getAssigneeLabel = (person) => {
    if (
        typeof person === "object" &&
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

    return (
        person ||
        "Unknown user"
    );
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
      <form onSubmit={handleSubmit}>

        <Stack spacing={5}>

          {/* SUMMARY */}

          <FormControl isRequired>

            <FormLabel>
              Case Summary
            </FormLabel>

            <Input
                name="summary"
                value={
                    values.summary || ""
                }
                onChange={handleChange}
                placeholder="Provide a concise summary"
            />

          </FormControl>

          {/* DESCRIPTION */}

          <FormControl isRequired>

            <FormLabel>
              Description
            </FormLabel>

            <Textarea
                name="description"
                value={
                    values.description || ""
                }
                onChange={handleChange}
                placeholder="Provide a detailed description of the issue"
                minH="140px"
                resize="vertical"
            />

          </FormControl>

          {/* SYSTEM */}

          <FormControl isRequired>

            <FormLabel>
              System
            </FormLabel>

            {isLoadingSystems ? (

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    borderWidth="1px"
                    borderRadius="md"
                    px={3}
                    py={2}
                >

                  <Spinner size="sm" />

                  <Text
                      fontSize="sm"
                      color="gray.500"
                  >
                    Loading systems...
                  </Text>

                </Box>

            ) : (

                <Select
                    name="supportSystemId"
                    value={
                      values.supportSystemId != null
                          ? String(
                              values.supportSystemId
                          )
                          : ""
                    }
                    onChange={handleChange}
                    placeholder="Select a system"
                >

                  {systems.map(
                      (system) => (
                          <option
                              key={system.id}
                              value={system.id}
                          >
                            {system.name}
                          </option>
                      )
                  )}

                </Select>

            )}

          </FormControl>

          {/* PRIORITY */}

          <FormControl isRequired>

            <FormLabel>
              Priority
            </FormLabel>

            <Select
                name="priority"
                value={
                    values.priority || ""
                }
                onChange={handleChange}
            >

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

          </FormControl>

          {/* STATUS */}

          <FormControl isRequired>

            <FormLabel>
              Status
            </FormLabel>

            <Select
                name="status"
                value={
                    values.status || ""
                }
                onChange={handleChange}
            >

              <option value="In progress">
                In progress
              </option>

              <option value="In UAT">
                In UAT
              </option>

              <option value="Awaiting vendor">
                Awaiting vendor
              </option>

              <option value="Resolved">
                Resolved
              </option>

            </Select>

          </FormControl>

          {/* ASSIGNEE */}

          <FormControl>

            <FormLabel>
              Assignee
            </FormLabel>

            {isLoadingAssignees ? (

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    borderWidth="1px"
                    borderRadius="md"
                    px={3}
                    py={2}
                >

                  <Spinner size="sm" />

                  <Text
                      fontSize="sm"
                      color="gray.500"
                  >
                    Loading assignees...
                  </Text>

                </Box>

            ) : (

                <Select
                    name="assignedToId"
                    value={
                      values.assignedToId != null
                          ? String(
                              values.assignedToId
                          )
                          : ""
                    }
                    onChange={handleChange}
                >

                  <option value="">
                    Unassigned
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

                        if (
                            value === "" ||
                            value === null ||
                            value === undefined
                        ) {
                          return null;
                        }

                        return (
                            <option
                                key={value}
                                value={String(value)}
                            >
                              {label}
                              {person?.email
                                  ? ` — ${person.email}`
                                  : ""}
                            </option>
                        );
                      }
                  )}

                </Select>

            )}

          </FormControl>

          {/* SUBMIT */}

          <Button
              type="submit"
              size="lg"
              colorScheme="brand"
              isLoading={isSubmitting}
              loadingText="Saving..."
              isDisabled={
                  isLoadingSystems ||
                  isLoadingAssignees
              }
          >
            {submitLabel}
          </Button>

        </Stack>

      </form>
  );
};

export default CaseForm;