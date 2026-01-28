import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

const SystemFormModal = ({
  isOpen,
  onClose,
  title,
  description,
  categories,
  initialValues,
}) => {
  const toast = useToast();

  const handleSave = () => {
    toast({
      title,
      description: "Changes saved (mocked).",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack spacing={1}>
            <Text fontWeight="700">{title}</Text>
            <Text fontSize="sm" color="text.muted">
              {description}
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>System name</FormLabel>
              <Input defaultValue={initialValues.name} />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select defaultValue={initialValues.category}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Owner team</FormLabel>
              <Input defaultValue={initialValues.owner} />
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select defaultValue={initialValues.status}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormControl>
            <Stack direction="row" justify="flex-end">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSave}>
                Save
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SystemFormModal;
