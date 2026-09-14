import React, { useEffect, useState } from "react";
import { SimpleGrid, Stack } from "@chakra-ui/react";
import {
  AppModal,
  FieldGroup,
  FieldInput,
  FieldSelect,
  ModalCancelButton,
  ModalPrimaryButton,
} from "../../components/ui";
import { LINK_LOGOS } from "./links.data";

const EMPTY_FORM = {
  title: "",
  href: "",
  short: "",
  logo: "none",
};

const LinkModal = ({ isOpen, onClose, onSave, onDelete, link }) => {
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLogoFile(null);
    setFormState(
      link
        ? {
            title: link.title || "",
            href: link.href || "",
            short: link.short || "",
            logo: link.logo || "none",
          }
        : EMPTY_FORM
    );
  }, [isOpen, link]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setLogoFile(event.target.files?.[0] || null);
  };

  const canSave = Boolean(formState.title.trim() && formState.href.trim());

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={link ? "Edit link" : "Add link"}
      subtitle="Name, URL, and logo for a dashboard Systems & Services shortcut."
      compact
      footer={
        <>
          {link && onDelete ? (
            <ModalCancelButton onClick={onDelete} color="danger.onWash">
              Remove
            </ModalCancelButton>
          ) : null}
          <ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
          <ModalPrimaryButton
            onClick={() => onSave?.(formState, logoFile)}
            isDisabled={!canSave}
          >
            {link ? "Save changes" : "Add link"}
          </ModalPrimaryButton>
        </>
      }
    >
      <Stack spacing={5}>
        <FieldGroup label="Name">
          <FieldInput
            name="title"
            placeholder="FE Node 1"
            value={formState.title}
            onChange={handleChange}
          />
        </FieldGroup>
        <FieldGroup label="URL">
          <FieldInput
            name="href"
            placeholder="Enter URL"
            value={formState.href}
            onChange={handleChange}
          />
        </FieldGroup>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FieldGroup label="Short label">
            <FieldInput
              name="short"
              placeholder="N1"
              value={formState.short}
              onChange={handleChange}
            />
          </FieldGroup>
          <FieldGroup label="Logo">
            <FieldSelect
              name="logo"
              value={formState.logo}
              onChange={handleChange}
            >
              {LINK_LOGOS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </FieldSelect>
          </FieldGroup>
        </SimpleGrid>
        <FieldGroup label="Logo file">
          <FieldInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </FieldGroup>
      </Stack>
    </AppModal>
  );
};

export default LinkModal;
