import React, { useEffect, useState } from "react";
import { SimpleGrid, Stack, useToast } from "@chakra-ui/react";

import {
  AppModal,
  FieldGroup,
  FieldInput,
  FieldTextarea,
  ModalCancelButton,
  ModalPrimaryButton,
} from "../../../components/ui";

const PASSWORD_FORM_ID = "add-password-form";

const PasswordModal = ({ isOpen, onClose, onSave, initialValues }) => {
  const toast = useToast();
  const isEdit = Boolean(initialValues?.id);
  const [formState, setFormState] = useState({
    systemName: "",
    username: "",
    password: "",
    description: "",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setFormState({
      systemName: initialValues?.systemName || "",
      username: initialValues?.username || "",
      password: "",
      description: initialValues?.description || "",
    });
  }, [isOpen, initialValues]);

  const handleChange = (event) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.systemName || !formState.username || !formState.password) {
      toast({
        title: "Missing fields",
        description: "System, username, and password are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSave(formState);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Update credential" : "Add credential"}
      subtitle="Stored in BSS with systemName, username, password, and description."
      compact
      footer={
        <>
          <ModalCancelButton onClick={handleClose}>Cancel</ModalCancelButton>
          <ModalPrimaryButton type="submit" form={PASSWORD_FORM_ID}>
            {isEdit ? "Update" : "Save"}
          </ModalPrimaryButton>
        </>
      }
    >
      <form id={PASSWORD_FORM_ID} onSubmit={handleSubmit}>
        <Stack spacing={5}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FieldGroup label="System name">
              <FieldInput
                name="systemName"
                required
                placeholder="e.g. core-banking-db"
                value={formState.systemName}
                onChange={handleChange}
              />
            </FieldGroup>
            <FieldGroup label="Username">
              <FieldInput
                name="username"
                required
                placeholder="e.g. admin_user"
                value={formState.username}
                onChange={handleChange}
              />
            </FieldGroup>
          </SimpleGrid>
          <FieldGroup label="Password">
            <FieldInput
              name="password"
              required
              type="password"
              placeholder={isEdit ? "Enter the new password" : "Enter password"}
              value={formState.password}
              onChange={handleChange}
            />
          </FieldGroup>
          <FieldGroup label="Description" tall>
            <FieldTextarea
              name="description"
              placeholder="Where this credential is used"
              value={formState.description}
              onChange={handleChange}
            />
          </FieldGroup>
        </Stack>
      </form>
    </AppModal>
  );
};

export default PasswordModal;
