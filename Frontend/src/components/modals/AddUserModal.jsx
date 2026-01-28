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
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ROLES } from "../../utils/constants";

const AddUserModal = ({ isOpen, onClose }) => {
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: "User added",
      description: "The user has been created (mocked).",
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
            <Text fontWeight="700">Add User</Text>
            <Text fontSize="sm" color="text.muted">
              Create a new user profile for support operations.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Full name</FormLabel>
              <Input placeholder="e.g. Tariro Moyo" />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input placeholder="user@zb.example" />
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select defaultValue={ROLES[0]}>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Switch colorScheme="brand" defaultChecked>
                Active
              </Switch>
            </FormControl>
            <Stack direction="row" justify="flex-end">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSave}>
                Add User
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
