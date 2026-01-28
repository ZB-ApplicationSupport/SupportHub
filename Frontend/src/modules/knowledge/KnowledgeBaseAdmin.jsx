import React, { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ArticleForm from "../../components/knowledge/ArticleForm";
import ArticleEditor from "../../components/knowledge/ArticleEditor";
import ArticleStatusToggle from "../../components/knowledge/ArticleStatusToggle";
import ArticleDeleteModal from "../../components/knowledge/ArticleDeleteModal";
import {
  knowledgeArticles,
  knowledgeCategories,
} from "../../data/knowledgeBase";

const KnowledgeBaseAdmin = () => {
  const [articles, setArticles] = useState(knowledgeArticles);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const deleteModal = useDisclosure();

  const systems = useMemo(() => {
    return Array.from(new Set(knowledgeArticles.map((item) => item.system)));
  }, []);

  const handleToggle = (articleId, nextValue) => {
    setArticles((prev) =>
      prev.map((item) =>
        item.id === articleId ? { ...item, isPublished: nextValue } : item
      )
    );
  };

  const openDeleteModal = (article) => {
    setSelectedArticle(article);
    deleteModal.onOpen();
  };

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg">Knowledge Base Admin</Heading>
        <Text color="text.muted">
          Create, update, and publish support documentation.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        <Stack spacing={4}>
          <Heading size="sm">Create article</Heading>
          <ArticleForm categories={knowledgeCategories} systems={systems} />
        </Stack>
        <Stack spacing={4}>
          <Heading size="sm">Article editor</Heading>
          <ArticleEditor />
          <HStack justify="flex-end">
            <Button variant="outline">Save draft</Button>
            <Button colorScheme="brand">Publish</Button>
          </HStack>
        </Stack>
      </SimpleGrid>

      <Divider />

      <Stack spacing={4}>
        <Heading size="sm">Manage articles</Heading>
        {articles.map((article) => (
          <Box
            key={article.id}
            bg="surface.card"
            borderWidth="1px"
            borderRadius="xl"
            p={5}
          >
            <Stack spacing={3}>
              <HStack justify="space-between" flexWrap="wrap">
                <Box>
                  <Text fontWeight="700">{article.title}</Text>
                  <Text fontSize="sm" color="text.muted">
                    Updated {article.updatedAt} · {article.readTime}
                  </Text>
                </Box>
                <ArticleStatusToggle
                  isPublished={article.isPublished}
                  onToggle={(nextValue) =>
                    handleToggle(article.id, nextValue)
                  }
                />
              </HStack>
              <HStack spacing={2} flexWrap="wrap">
                <Badge colorScheme="brand">{article.category}</Badge>
                <Badge colorScheme="secondary">{article.system}</Badge>
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="subtle" colorScheme="gray">
                    {tag}
                  </Badge>
                ))}
              </HStack>
              <HStack spacing={4} fontSize="sm" color="text.muted">
                <Text>{article.views} views</Text>
                <Text>
                  Rating {article.rating} ({article.ratingCount})
                </Text>
              </HStack>
              <HStack justify="flex-end">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => openDeleteModal(article)}
                >
                  Delete
                </Button>
              </HStack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <ArticleDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        articleTitle={selectedArticle?.title || "this article"}
      />
    </Stack>
  );
};

export default KnowledgeBaseAdmin;
