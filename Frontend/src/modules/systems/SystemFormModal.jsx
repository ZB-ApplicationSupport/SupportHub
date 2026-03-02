import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

const SystemFormModal = ({
  isOpen,
  onClose,
  title,
  description,
  categories,
  initialValues,
  onSave,
}) => {
  const [values, setValues] = useState(initialValues || {});

  useEffect(() => {
    if (isOpen && initialValues) setValues(initialValues);
  }, [isOpen, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave?.(values);
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
              <Input
                name="name"
                value={values.name || ""}
                onChange={handleChange}
                placeholder="e.g. Core Banking"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={values.category || categories[0]}
                onChange={handleChange}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Owner team</FormLabel>
              <Input
                name="owner"
                value={values.owner || ""}
                onChange={handleChange}
                placeholder="e.g. Case Operations"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={values.status || "Active"}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormControl>
            <Stack direction="row" justify="flex-end">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSubmit}>
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
