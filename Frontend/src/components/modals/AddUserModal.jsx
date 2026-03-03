import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
import { ROLES } from "../../utils/constants";
import { addUser } from "../../API/users.api";

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    temporaryPassword: "",
    role: "USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormState({ email: "", temporaryPassword: "", role: "USER" });
    setTouched(false);
    onClose();
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.email || !formState.temporaryPassword) return;

    setSubmitting(true);
    try {
      await addUser({
        email: formState.email.trim(),
        temporaryPassword: formState.temporaryPassword,
        role: formState.role,
      });
      toast({
        title: "User added",
        description: "The user has been created and an email sent.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast({
        title: "Failed to add user",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const emailError = touched && !formState.email;
  const passwordError = touched && !formState.temporaryPassword;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
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
            <FormControl isInvalid={emailError} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="user@zb.example"
                value={formState.email}
                onChange={handleChange}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              />
              <FormErrorMessage>Email is required.</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={passwordError} isRequired>
              <FormLabel>Temporary password</FormLabel>
              <Input
                name="temporaryPassword"
                type="password"
                placeholder="Set a temporary password"
                value={formState.temporaryPassword}
                onChange={handleChange}
                onBlur={() => setTouched((p) => ({ ...p, temporaryPassword: true }))}
              />
              <FormErrorMessage>Temporary password is required.</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formState.role}
                onChange={handleChange}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" justify="flex-end">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleSave}
                isLoading={submitting}
                loadingText="Adding..."
                isDisabled={!formState.email || !formState.temporaryPassword}
              >
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
