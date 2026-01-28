import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import ArticleForm from "./ArticleForm";
import ArticleEditor from "./ArticleEditor";

const CreateArticleModal = ({ isOpen, onClose, categories, systems }) => {
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: "Article created",
      description: "The article has been saved (mocked).",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack spacing={1}>
            <Text fontWeight="700">Create Article</Text>
            <Text fontSize="sm" color="text.muted">
              Draft a new knowledge base article for support teams.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <ArticleForm categories={categories} systems={systems} />
            <ArticleEditor />
            <HStack justify="flex-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSave}>
                Save Article
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateArticleModal;
