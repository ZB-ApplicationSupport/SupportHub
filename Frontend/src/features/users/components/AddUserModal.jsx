import React, { useState } from "react";
import { SimpleGrid, Stack, Text, useToast } from "@chakra-ui/react";

import { ROLES } from "../../../utils/constants";
import { addUser } from "../users.api";
import {
  AppModal,
  FieldGroup,
  FieldInput,
  FieldSelect,
  ModalCancelButton,
  ModalPrimaryButton,
} from "../../../components/ui";

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    temporaryPassword: "",
    role: "USER",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormState({ email: "", temporaryPassword: "", role: "USER" });
    setTouched(false);
    onClose();
  };

  const handleSave = async () => {
    setTouched(true);
    if (!formState.email || !formState.temporaryPassword) {
      return;
    }

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

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add User"
      subtitle="Create a new user profile for support operations."
      footer={
        <>
          <ModalCancelButton onClick={handleClose} isDisabled={submitting}>
            Cancel
          </ModalCancelButton>
          <ModalPrimaryButton
            onClick={handleSave}
            isLoading={submitting}
            loadingText="Adding..."
            isDisabled={!formState.email || !formState.temporaryPassword}
          >
            Add User
          </ModalPrimaryButton>
        </>
      }
    >
      <Stack spacing={5}>
        <FieldGroup label="Email">
          <FieldInput
            name="email"
            type="email"
            required
            placeholder="user@zb.example"
            value={formState.email}
            onChange={handleChange}
          />
        </FieldGroup>
        {touched && !formState.email && (
          <Text fontSize="12px" color="#D64545" mt={-3}>
            Email is required.
          </Text>
        )}

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FieldGroup label="Temporary password">
            <FieldInput
              name="temporaryPassword"
              type="password"
              required
              placeholder="Set a temporary password"
              value={formState.temporaryPassword}
              onChange={handleChange}
            />
          </FieldGroup>
          <FieldGroup label="Role">
            <FieldSelect
              name="role"
              value={formState.role}
              onChange={handleChange}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </FieldSelect>
          </FieldGroup>
        </SimpleGrid>
        {touched && !formState.temporaryPassword && (
          <Text fontSize="12px" color="#D64545" mt={-3}>
            Temporary password is required.
          </Text>
        )}
      </Stack>
    </AppModal>
  );
};

export default AddUserModal;
