import React from "react";
import {
  Box,
  Code,
  Heading,
  Image,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ArticleContent = ({ content, getHeadingId }) => {
  return (
    <Box>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <Heading
              size="md"
              mt={6}
              mb={2}
              id={getHeadingId ? getHeadingId(children) : undefined}
            >
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading
              size="sm"
              mt={5}
              mb={2}
              id={getHeadingId ? getHeadingId(children) : undefined}
            >
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading
              size="sm"
              mt={4}
              mb={2}
              id={getHeadingId ? getHeadingId(children) : undefined}
            >
              {children}
            </Heading>
          ),
          p: ({ children }) => (
            <Text color="text.secondary" lineHeight="1.7" mb={3}>
              {children}
            </Text>
          ),
          ul: ({ children }) => (
            <List pl={4} mb={3} styleType="disc" spacing={1}>
              {children}
            </List>
          ),
          ol: ({ children }) => (
            <List pl={4} mb={3} styleType="decimal" spacing={1}>
              {children}
            </List>
          ),
          li: ({ children }) => <ListItem>{children}</ListItem>,
          code: ({ inline, children }) =>
            inline ? (
              <Code fontSize="0.85em">{children}</Code>
            ) : (
              <Box
                bg="surface.subtle"
                borderRadius="md"
                p={3}
                mb={3}
                fontSize="sm"
                overflowX="auto"
              >
                <Code whiteSpace="pre">{children}</Code>
              </Box>
            ),
          img: ({ src, alt }) => (
            <Image src={src} alt={alt || "Article"} borderRadius="md" my={4} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default ArticleContent;
