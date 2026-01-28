import React, { useMemo } from "react";
import {
  Box,
  Divider,
  Heading,
  Link,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import ArticleHeader from "./ArticleHeader";
import ArticleContent from "./ArticleContent";
import ArticleFeedback from "./ArticleFeedback";
import RelatedArticles from "./RelatedArticles";

const createSlugger = () => {
  const counts = {};
  return (value) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const count = counts[slug] || 0;
    counts[slug] = count + 1;
    return count ? `${slug}-${count}` : slug;
  };
};

const extractText = (node) => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && node.props && node.props.children) {
    return extractText(node.props.children);
  }
  return "";
};

const KnowledgeBaseArticle = ({ article, relatedItems }) => {
  const tocItems = useMemo(() => {
    const slugger = createSlugger();
    return article.content
      .split("\n")
      .filter((line) => line.startsWith("##"))
      .map((line) => {
        const level = line.startsWith("###") ? 3 : 2;
        const text = line.replace(/^###?\s*/, "").trim();
        return { id: slugger(text), text, level };
      });
  }, [article.content]);

  const headingSlugger = useMemo(() => createSlugger(), []);

  return (
    <Stack spacing={6}>
      <ArticleHeader article={article} />
      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8}>
        <Box gridColumn={{ lg: "span 8" }}>
          <ArticleContent
            content={article.content}
            getHeadingId={(children) =>
              headingSlugger(extractText(children))
            }
          />
          <Divider my={6} />
          <ArticleFeedback />
        </Box>
        <Box
          gridColumn={{ lg: "span 4" }}
          display={{ base: "none", lg: "block" }}
        >
          <Box position="sticky" top="96px">
            <Heading size="sm" mb={3}>
              On this page
            </Heading>
            {tocItems.length === 0 ? (
              <Text fontSize="sm" color="text.muted">
                No sections available.
              </Text>
            ) : (
              <List spacing={2} fontSize="sm">
                {tocItems.map((item) => (
                  <ListItem key={item.id} pl={item.level === 3 ? 4 : 0}>
                    <Link href={`#${item.id}`} color="brand.600">
                      {item.text}
                    </Link>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </SimpleGrid>
      <RelatedArticles items={relatedItems} />
    </Stack>
  );
};

export default KnowledgeBaseArticle;
