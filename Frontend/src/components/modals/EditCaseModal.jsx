import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import CaseForm from "../../modules/cases/CaseForm";
import { updateCase } from "../../API/cases.api";

const EditCaseModal = ({ isOpen, onClose, item, onSuccess }) => {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await updateCase(item.id, values);
      toast({
        title: "Case updated",
        description: "The case has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to update case",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack spacing={1}>
            <Text fontWeight="700">Edit Case</Text>
            <Text fontSize="sm" color="text.muted">
              Update case details and workflow state.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <CaseForm
            key={item.id}
            initialValues={{
              summary: item.summary,
              description: item.description,
              system: item.system,
              priority: item.priority,
              status: item.status,
              jiraRefs: item.jiraRefs ? (Array.isArray(item.jiraRefs) ? item.jiraRefs.join(", ") : item.jiraRefs) : "",
              vendorRefs: item.vendorRefs ? (Array.isArray(item.vendorRefs) ? item.vendorRefs.join(", ") : item.vendorRefs) : "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            isSubmitting={submitting}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditCaseModal;
