import React, { useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { AddIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import KnowledgeBaseSearch from "../../components/knowledge/KnowledgeBaseSearch";
import KnowledgeBaseFilters from "../../components/knowledge/KnowledgeBaseFilters";
import KnowledgeBaseSort from "../../components/knowledge/KnowledgeBaseSort";
import KnowledgeBaseList from "../../components/knowledge/KnowledgeBaseList";
import CreateArticleModal from "../../components/knowledge/CreateArticleModal";
import EditArticleModal from "../../components/knowledge/EditArticleModal";
import {
  knowledgeArticles,
  knowledgeCategories,
  knowledgeTags,
} from "../../data/knowledgeBase";
import {
  filterArticles,
  sortArticles,
} from "../../utils/knowledgeBaseUtils";

const KnowledgeBasePage = () => {
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sortKey, setSortKey] = useState("recent");
  const [view, setView] = useState("card");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const systems = useMemo(() => {
    return Array.from(new Set(knowledgeArticles.map((item) => item.system)));
  }, []);

  const filtered = useMemo(() => {
    return filterArticles(knowledgeArticles, query, system, category, tag);
  }, [query, system, category, tag]);

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
      />
      <EditArticleModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        article={selectedArticle}
        systems={systems}
      />
    </Stack>
  );
};

export default KnowledgeBasePage;
