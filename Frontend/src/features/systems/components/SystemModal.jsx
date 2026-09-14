import React, { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import {
  AppModal,
  FieldGroup,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  ModalCancelButton,
  ModalPrimaryButton,
} from "../../../components/ui";
import { SYSTEM_STATUSES } from "../systems.data";

const EMPTY_FORM = {
  name: "",
  description: "",
  status: "Active",
};

const SystemModal = ({ isOpen, onClose, onSave, onDelete, system }) => {
  const [formState, setFormState] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;
    setFormState(
      system
        ? {
            name: system.name || "",
            description: system.description || "",
            status: system.status || "Active",
          }
        : EMPTY_FORM
    );
  }, [isOpen, system]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const canSave = Boolean(formState.name.trim());

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={system ? "Edit system" : "Add system"}
      subtitle="Name, description, and status for this supported system."
      compact
      footer={
        <>
          {system && onDelete ? (
            <ModalCancelButton onClick={onDelete} color="danger.onWash">
              Remove
            </ModalCancelButton>
          ) : null}
          <ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
          <ModalPrimaryButton
            onClick={() => onSave?.(formState)}
            isDisabled={!canSave}
          >
            {system ? "Save changes" : "Add system"}
          </ModalPrimaryButton>
        </>
      }
    >
      <Stack spacing={5}>
        <FieldGroup label="Name">
          <FieldInput
            name="name"
            placeholder="Fusion Essence Live"
            value={formState.name}
            onChange={handleChange}
          />
        </FieldGroup>
        <FieldGroup label="Description" tall>
          <FieldTextarea
            name="description"
            placeholder="What this system is used for"
            value={formState.description}
            onChange={handleChange}
          />
        </FieldGroup>
        <FieldGroup label="Status">
          <FieldSelect
            name="status"
            value={formState.status}
            onChange={handleChange}
          >
            {SYSTEM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </FieldSelect>
        </FieldGroup>
      </Stack>
    </AppModal>
  );
};

export default SystemModal;
