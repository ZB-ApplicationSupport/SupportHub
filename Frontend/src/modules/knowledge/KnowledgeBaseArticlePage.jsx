import React, { useEffect, useState } from "react";
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import KnowledgeBaseArticle from "../../components/knowledge/KnowledgeBaseArticle";
import { getArticleById } from "../../API/knowledge.api";

const KnowledgeBaseArticlePage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!articleId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    getArticleById(articleId)
      .then(setArticle)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [articleId]);

  if (loading) {
    return (
      <Box py={8} textAlign="center">
        <Spinner size="lg" />
        <Text mt={2}>Loading article...</Text>
      </Box>
    );
  }

  if (error || !article) {
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
      <KnowledgeBaseArticle article={article} relatedItems={[]} />
    </Stack>
  );
};

export default KnowledgeBaseArticlePage;
