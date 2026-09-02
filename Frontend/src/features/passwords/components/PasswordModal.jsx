import React, { useState } from "react";
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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

const PasswordModal = ({ isOpen, onClose, onSave }) => {
  const toast = useToast();
  const [formState, setFormState] = useState({
    server: "",
    username: "",
    password: "",
    hostname: "",
  });

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.server || !formState.username || !formState.password || !formState.hostname) {
      toast({
        title: "Missing fields",
        description: "Fill in all fields before saving.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSave(formState);
    setFormState({ server: "", username: "", password: "", hostname: "" });
  };

  const handleClose = () => {
    setFormState({ server: "", username: "", password: "", hostname: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack spacing={1}>
            <Text fontWeight="700">Add Password</Text>
            <Text fontSize="sm" color="text.muted">
              Save access details for shared systems.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Server</FormLabel>
                <Input
                  name="server"
                  placeholder="e.g. Core Banking"
                  value={formState.server}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  placeholder="e.g. cb.admin"
                  value={formState.username}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="text"
                  placeholder="Enter password"
                  value={formState.password}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Hostname</FormLabel>
                <Input
                  name="hostname"
                  placeholder="e.g. corebanking.zb.co.zw"
                  value={formState.hostname}
                  onChange={handleChange}
                />
              </FormControl>
              <Stack direction="row" justify="flex-end">
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button colorScheme="brand" type="submit">
                  Save Password
                </Button>
              </Stack>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PasswordModal;
