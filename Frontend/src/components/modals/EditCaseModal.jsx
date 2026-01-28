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

const EditCaseModal = ({ isOpen, onClose, item }) => {
  const toast = useToast();

  if (!item) return null;

  const handleSubmit = () => {
    toast({
      title: "Case updated",
      description: "The case has been updated (mocked).",
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
            <Text fontWeight="700">Edit Case</Text>
            <Text fontSize="sm" color="text.muted">
              Update case details and workflow state.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <CaseForm
            initialValues={{
              summary: item.summary,
              description: item.description,
              system: item.system,
              priority: item.priority,
              status: item.status,
              jiraRefs: item.jiraRefs ? item.jiraRefs.join(", ") : "",
              vendorRefs: item.vendorRefs ? item.vendorRefs.join(", ") : "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditCaseModal;
