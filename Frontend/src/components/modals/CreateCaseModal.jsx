import React from "react";
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

const CreateCaseModal = ({ isOpen, onClose }) => {
  const toast = useToast();

  const handleSubmit = () => {
    toast({
      title: "Case created",
      description: "The case has been saved (mocked).",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
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
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateCaseModal;
