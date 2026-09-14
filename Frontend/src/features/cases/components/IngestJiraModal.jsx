import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";

import {
  AppModal,
  FieldGroup,
  FieldInput,
  ModalCancelButton,
  ModalPrimaryButton,
} from "../../../components/ui";
import { ingestJiraJobs } from "../cases.api";

const IngestJiraModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [jql, setJql] = useState("project=CB");
  const [submitting, setSubmitting] = useState(false);

  const handleIngest = async () => {
    const query = jql.trim();
    if (!query) {
      toast({
        title: "JQL required",
        description: "Enter a Jira query, for example project=CB.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const jobs = await ingestJiraJobs(query);
      toast({
        title: "Jira ingest finished",
        description: `${Array.isArray(jobs) ? jobs.length : 0} job(s) returned.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Jira ingest failed",
        description:
          err.response?.data?.message ||
          "Admin ingest was not allowed or Jira is not configured.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ingest from Jira"
      subtitle="Pulls matching Jira issues into Case Tracker jobs."
      maxW="520px"
      footer={
        <>
          <ModalCancelButton onClick={onClose} isDisabled={submitting}>
            Cancel
          </ModalCancelButton>
          <ModalPrimaryButton
            onClick={handleIngest}
            isLoading={submitting}
            loadingText="Ingesting..."
          >
            Ingest
          </ModalPrimaryButton>
        </>
      }
    >
      <FieldGroup label="JQL">
        <FieldInput
          value={jql}
          onChange={(event) => setJql(event.target.value)}
          placeholder="project=CB"
        />
      </FieldGroup>
    </AppModal>
  );
};

export default IngestJiraModal;
