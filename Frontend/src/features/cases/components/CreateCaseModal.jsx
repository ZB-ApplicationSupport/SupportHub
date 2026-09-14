import React, { useState } from "react";

import { useToast } from "@chakra-ui/react";

import CaseForm from "./CaseForm";
import {
  AppModal,
  ModalCancelButton,
  ModalPrimaryButton,
} from "../../../components/ui";
import { useAppContext } from "../../../context/AppContext";
import { createCase } from "../cases.api";

const CREATE_FORM_ID = "create-case-form";

const CreateCaseModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const { user } = useAppContext();
  const [submitting, setSubmitting] = useState(false);

  const defaultAssignee = user?.username || user?.email || "";

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await createCase(values);
      toast({
        title: "Job created",
        description: "The job has been saved in Case Tracker.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to create job",
        description:
          err.response?.data?.message || "Please try again.",
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
      title="Create Job"
      subtitle="Creates a Case Tracker job: title, description, priority, and assignee."
      compact
      footer={
        <>
          <ModalCancelButton onClick={onClose} isDisabled={submitting}>
            Cancel
          </ModalCancelButton>
          <ModalPrimaryButton
            type="submit"
            form={CREATE_FORM_ID}
            isLoading={submitting}
            loadingText="Saving..."
          >
            Create Job
          </ModalPrimaryButton>
        </>
      }
    >
      <CaseForm
        formId={CREATE_FORM_ID}
        initialValues={{
          title: "",
          description: "",
          priority: "Medium",
          assignedTo: defaultAssignee,
        }}
        onSubmit={handleSubmit}
      />
    </AppModal>
  );
};

export default CreateCaseModal;
