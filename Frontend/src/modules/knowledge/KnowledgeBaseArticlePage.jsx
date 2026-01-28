import React, { useMemo } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import KnowledgeBaseArticle from "../../components/knowledge/KnowledgeBaseArticle";
import {
  knowledgeArticles,
  knowledgeRelatedMap,
} from "../../data/knowledgeBase";
import { getRelatedArticles } from "../../utils/knowledgeBaseUtils";

const KnowledgeBaseArticlePage = () => {
  const { articleId } = useParams();
  const article = knowledgeArticles.find((item) => item.id === articleId);

  const relatedItems = useMemo(() => {
    if (!article) return [];
    return getRelatedArticles(knowledgeArticles, knowledgeRelatedMap, article.id);
  }, [article]);

  if (!article) {
    return (
      <Box>
        <Text fontWeight="600" mb={3}>
          Article not found.
        </Text>
        <Button as={Link} to="/knowledge" variant="outline">
          Back to Knowledge Base
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={6}>
      <KnowledgeBaseArticle article={article} relatedItems={relatedItems} />
    </Stack>
  );
};

export default KnowledgeBaseArticlePage;
