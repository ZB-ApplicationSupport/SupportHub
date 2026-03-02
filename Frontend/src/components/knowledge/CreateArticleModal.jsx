import React, { useState, useEffect } from "react";
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
import { createArticle } from "../../API/knowledge.api";

const CreateArticleModal = ({ isOpen, onClose, categories, systems, onSuccess }) => {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    title: "",
    system: "",
    category: "",
    tags: "",
    readTime: "",
    summary: "",
    content: "",
    isPublished: true,
  });

  useEffect(() => {
    if (isOpen) {
      setValues({
        title: "",
        system: systems?.[0] || "",
        category: categories?.[0] || "",
        tags: "",
        readTime: "",
        summary: "",
        content: "",
        isPublished: true,
      });
    }
  }, [isOpen, systems, categories]);

  const handleFormChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      await createArticle(payload);
      toast({
        title: "Article created",
        description: "The article has been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to create article",
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
            <ArticleForm
              categories={categories}
              systems={systems}
              values={values}
              onChange={handleFormChange}
            />
            <ArticleEditor value={values.content} onChange={(v) => handleFormChange("content", v)} />
            <HStack justify="flex-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSave} isLoading={submitting} loadingText="Saving...">
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
