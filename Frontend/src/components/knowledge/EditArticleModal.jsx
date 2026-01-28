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
import ArticleStatusToggle from "./ArticleStatusToggle";

const EditArticleModal = ({ isOpen, onClose, article, categories, systems }) => {
  const toast = useToast();

  if (!article) return null;

  const handleSave = () => {
    toast({
      title: "Article updated",
      description: "The article has been updated (mocked).",
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
            <Text fontWeight="700">Edit Article</Text>
            <Text fontSize="sm" color="text.muted">
              Update article metadata and content.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <HStack justify="space-between">
              <Text fontWeight="600">{article.title}</Text>
              <ArticleStatusToggle
                isPublished={article.isPublished}
                onToggle={() => {}}
              />
            </HStack>
            <ArticleForm categories={categories} systems={systems} />
            <ArticleEditor />
            <HStack justify="flex-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSave}>
                Save Changes
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditArticleModal;
