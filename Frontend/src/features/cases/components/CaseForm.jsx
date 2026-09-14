import React from "react";

import { SimpleGrid, Stack } from "@chakra-ui/react";

import {
  FieldGroup,
  FieldInput,
  FieldSelect,
  FieldTextarea,
} from "../../../components/ui";

const CaseForm = ({
  initialValues,
  onSubmit,
  formId = "create-case-form",
}) => {
  const [values, setValues] = React.useState(initialValues || {});

  React.useEffect(() => {
    setValues(initialValues || {});
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      title: values.title || values.summary || "",
      summary: values.title || values.summary || "",
      description: values.description || "",
      priority: values.priority || "Medium",
      assignedTo: (values.assignedTo || "").trim(),
    });
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Stack spacing={5}>
        <FieldGroup label="Title">
          <FieldInput
            name="title"
            required
            value={values.title || values.summary || ""}
            onChange={handleChange}
            placeholder="Short job title"
          />
        </FieldGroup>

        <FieldGroup label="Description" tall>
          <FieldTextarea
            name="description"
            required
            value={values.description || ""}
            onChange={handleChange}
            placeholder="Describe the issue"
          />
        </FieldGroup>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FieldGroup label="Priority">
            <FieldSelect
              name="priority"
              value={values.priority || "Medium"}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </FieldSelect>
          </FieldGroup>

          <FieldGroup label="Assignee">
            <FieldInput
              name="assignedTo"
              value={values.assignedTo || ""}
              onChange={handleChange}
              placeholder="Keycloak username"
            />
          </FieldGroup>
        </SimpleGrid>
      </Stack>
    </form>
  );
};

export default CaseForm;
