import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";

const CaseForm = ({ initialValues, onSubmit, submitLabel }) => {
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Case Summary</FormLabel>
          <Input
            name="summary"
            value={values.summary}
            onChange={handleChange}
            placeholder="Provide a concise summary"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Detailed case description"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>System</FormLabel>
          <Select name="system" value={values.system} onChange={handleChange}>
            <option value="Core Banking">Core Banking</option>
            <option value="Payments Hub">Payments Hub</option>
            <option value="Digital Channels">Digital Channels</option>
            <option value="Treasury">Treasury</option>
            <option value="ATM Switch">ATM Switch</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Priority</FormLabel>
          <Select name="priority" value={values.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select name="status" value={values.status} onChange={handleChange}>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Escalated">Escalated</option>
            <option value="Closed">Closed</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Jira References</FormLabel>
          <Input
            name="jiraRefs"
            value={values.jiraRefs}
            onChange={handleChange}
            placeholder="e.g. JIRA-OPS-221, JIRA-CORE-118"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Vendor References</FormLabel>
          <Input
            name="vendorRefs"
            value={values.vendorRefs}
            onChange={handleChange}
            placeholder="e.g. VEND-FIS-3321"
          />
        </FormControl>
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
};

export default CaseForm;
