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
import { createCase } from "../../API/cases.api";

const CreateCaseModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await createCase(values);
      toast({
        title: "Case created",
        description: "The case has been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to create case",
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
            <Text fontWeight="700">Create Case</Text>
            <Text fontSize="sm" color="text.muted">
              Capture new incidents with structured details.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <CaseForm
            initialValues={{
              summary: "",
              description: "",
              system: "Core Banking",
              priority: "Medium",
              status: "Open",
              jiraRefs: "",
              vendorRefs: "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Create Case"
            isSubmitting={submitting}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateCaseModal;
