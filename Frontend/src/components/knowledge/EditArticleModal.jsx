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
import ArticleStatusToggle from "./ArticleStatusToggle";
import { updateArticle } from "../../API/knowledge.api";

const EditArticleModal = ({ isOpen, onClose, article, categories, systems, onSuccess }) => {
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
    if (isOpen && article) {
      setValues({
        title: article.title || "",
        system: article.system || "",
        category: article.category || "",
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : (article.tags || ""),
        readTime: article.readTime || "",
        summary: article.summary || "",
        content: article.content || "",
        isPublished: article.isPublished !== false,
      });
    }
  }, [isOpen, article]);

  const handleFormChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePublish = () => {
    setValues((prev) => ({ ...prev, isPublished: !prev.isPublished }));
  };

  const handleSave = async () => {
    if (!article) return;
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      await updateArticle(article.id, payload);
      toast({
        title: "Article updated",
        description: "The article has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to update article",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!article) return null;

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
                isPublished={values.isPublished}
                onToggle={handleTogglePublish}
              />
            </HStack>
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
