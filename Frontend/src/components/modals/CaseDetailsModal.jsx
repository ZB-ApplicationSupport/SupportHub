import React from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PRIORITY_COLORS, STATUS_COLORS } from "../../utils/constants";
import { statusHistory } from "../../data/statusHistory";
import { caseComments } from "../../data/comments";
import { knowledgeArticles } from "../../data/knowledgeBase";
import CaseTimeline from "./CaseTimeline";
import CaseComments from "./CaseComments";
import CaseActions from "./CaseActions";

const CaseDetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  const timeline = statusHistory[item.id] || [];
  const comments = caseComments[item.id] || [];
  const relatedArticles = knowledgeArticles.filter(
    (article) => article.caseRef === item.id
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack spacing={1}>
            <Heading size="md">{item.summary}</Heading>
            <Text fontSize="sm" color="text.muted">
              {item.id} · {item.system}
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <Box>
              <Text fontWeight="600" mb={2}>
                Case Summary
              </Text>
              <Text fontSize="sm" color="text.muted">
                {item.description}
              </Text>
              <Stack direction="row" spacing={3} mt={3}>
                <Badge colorScheme={STATUS_COLORS[item.status] || "gray"}>
                  {item.status}
                </Badge>
                <Badge colorScheme={PRIORITY_COLORS[item.priority] || "gray"}>
                  {item.priority}
                </Badge>
                <Badge variant="subtle">{item.assignedTo}</Badge>
              </Stack>
              <Stack direction="row" spacing={2} mt={3} flexWrap="wrap">
                {item.jiraRefs?.length > 0 && (
                  <Badge variant="outline" colorScheme="purple">
                    Jira {item.jiraRefs.join(", ")}
                  </Badge>
                )}
                {item.vendorRefs?.length > 0 && (
                  <Badge variant="outline" colorScheme="orange">
                    Vendor {item.vendorRefs.join(", ")}
                  </Badge>
                )}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="600" mb={2}>
                Status Timeline
              </Text>
              <CaseTimeline items={timeline} />
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="600" mb={2}>
                Comments
              </Text>
              <CaseComments items={comments} />
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="600" mb={2}>
                Related knowledge articles
              </Text>
              {relatedArticles.length === 0 ? (
                <Text fontSize="sm" color="text.muted">
                  No linked knowledge articles yet.
                </Text>
              ) : (
                <Stack spacing={2}>
                  {relatedArticles.map((article) => (
                    <HStack key={article.id} justify="space-between">
                      <Text fontSize="sm">{article.title}</Text>
                      <Button
                        as={Link}
                        to={`/knowledge/${article.id}`}
                        size="xs"
                        variant="outline"
                      >
                        View article
                      </Button>
                    </HStack>
                  ))}
                </Stack>
              )}
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="600" mb={3}>
                Actions
              </Text>
              <CaseActions />
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CaseDetailsModal;
