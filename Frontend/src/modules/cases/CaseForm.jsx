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
                    submitLabel,
                    isSubmitting,

                    systems = [],
                    assignees = [],

                    isLoadingSystems = false,
                    isLoadingAssignees = false,
                  }) => {

  const [values, setValues] =
      React.useState(initialValues);


  // =========================================================
  // HANDLE INPUT CHANGES
  // =========================================================

  const handleChange = (event) => {

    setValues((prev) => ({
      ...prev,
      [event.target.name]:
      event.target.value,
    }));
  };


  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = (event) => {

    event.preventDefault();

    onSubmit(values);
  };


  return (

      <form onSubmit={handleSubmit}>

        <Stack spacing={5}>

          {/* ===================================================
            CASE SUMMARY
        ==================================================== */}

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


          {/* ===================================================
            DESCRIPTION
        ==================================================== */}

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


          {/* ===================================================
            SYSTEM
        ==================================================== */}

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
                    name="system"
                    value={
                        values.system || ""
                    }
                    onChange={handleChange}
                    placeholder="Select a system"
                >

                  {systems.map((system) => (

                      <option
                          key={system.id}
                          value={system.name}
                      >
                        {system.name}
                      </option>

                  ))}

                </Select>

            )}

          </FormControl>


          {/* ===================================================
            PRIORITY
        ==================================================== */}

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


          {/* ===================================================
            STATUS
        ==================================================== */}

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

              <option value="Open">
                Open
              </option>

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


          {/* ===================================================
            ASSIGNEE
        ==================================================== */}

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
                    name="assignedTo"
                    value={
                        values.assignedTo || ""
                    }
                    onChange={handleChange}
                    placeholder="Select an assignee"
                >

                  <option value="Unassigned">
                    Unassigned
                  </option>

                  {assignees.map((user) => {

                    const value =
                        user.username ||
                        user.email ||
                        user.name;

                    const label =
                        user.fullName ||
                        user.name ||
                        user.username ||
                        user.email;

                    return (

                        <option
                            key={
                                user.id ||
                                value
                            }
                            value={value}
                        >
                          {label}
                        </option>

                    );

                  })}

                </Select>

            )}

          </FormControl>


          {/* ===================================================
            SUBMIT
        ==================================================== */}

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