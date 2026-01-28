import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const SystemDeleteModal = ({ isOpen, onClose, systemName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove system</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Remove{" "}
            <Text as="span" fontWeight="600">
              {systemName}
            </Text>{" "}
            from supported systems? This is a UI-only action.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onClose} ml={3}>
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SystemDeleteModal;
