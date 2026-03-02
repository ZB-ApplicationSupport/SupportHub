import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import KnowledgeBaseSearch from "../../components/knowledge/KnowledgeBaseSearch";
import KnowledgeBaseFilters from "../../components/knowledge/KnowledgeBaseFilters";
import KnowledgeBaseSort from "../../components/knowledge/KnowledgeBaseSort";
import KnowledgeBaseList from "../../components/knowledge/KnowledgeBaseList";
import CreateArticleModal from "../../components/knowledge/CreateArticleModal";
import EditArticleModal from "../../components/knowledge/EditArticleModal";
import { getArticles } from "../../API/knowledge.api";
import { knowledgeCategories, knowledgeTags } from "../../data/knowledgeBase";
import {
  filterArticles,
  sortArticles,
} from "../../utils/knowledgeBaseUtils";

const KnowledgeBasePage = () => {
  const toast = useToast();
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sortKey, setSortKey] = useState("recent");
  const [view, setView] = useState("card");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data || []);
    } catch (err) {
      toast({
        title: "Failed to load articles",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const systems = useMemo(() => {
    return Array.from(new Set(articles.map((item) => item.system).filter(Boolean)));
  }, [articles]);

  const filtered = useMemo(() => {
    return filterArticles(articles, query, system, category, tag);
  }, [articles, query, system, category, tag]);

  const sorted = useMemo(() => {
    return sortArticles(filtered, sortKey);
  }, [filtered, sortKey]);

  const openEdit = (article) => {
    setSelectedArticle(article);
    editModal.onOpen();
  };

  return (
    <Stack spacing={6}>
      <Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} alignItems="center" spacing={4}>
          <Box>
            <Heading size="lg">Knowledge Base</Heading>
          </Box>
          <Box textAlign={{ base: "left", md: "right" }}>
            <Button
              leftIcon={<AddIcon />}
              onClick={createModal.onOpen}
              alignSelf="flex-end"
            >
              Add Article
            </Button>
          </Box>
        </SimpleGrid>
      </Box>

      <Stack spacing={4}>
        <KnowledgeBaseSearch value={query} onChange={setQuery} />
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} alignItems="center">
          <KnowledgeBaseFilters
            system={system}
            category={category}
            tag={tag}
            systems={systems}
            categories={knowledgeCategories}
            tags={knowledgeTags}
            onSystemChange={setSystem}
            onCategoryChange={setCategory}
            onTagChange={setTag}
          />
          <Box textAlign={{ base: "left", lg: "right" }}>
            <KnowledgeBaseSort value={sortKey} onChange={setSortKey} />
          </Box>
        </SimpleGrid>
      </Stack>

      <KnowledgeBaseList items={sorted} view={view} onEdit={openEdit} />
      <CreateArticleModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        categories={knowledgeCategories}
        systems={systems}
        onSuccess={loadArticles}
      />
      <EditArticleModal
        isOpen={editModal.isOpen}
        onClose={() => { editModal.onClose(); setSelectedArticle(null); }}
        article={selectedArticle}
        systems={systems}
        onSuccess={loadArticles}
      />
    </Stack>
  );
};

export default KnowledgeBasePage;
