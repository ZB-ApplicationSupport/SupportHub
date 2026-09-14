import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiFile, FiPlus, FiUpload, FiX } from "react-icons/fi";
import {
  aiSearchDocuments,
  createDocument,
  deleteDocument,
  downloadDocumentFile,
  getDocuments,
  searchDocuments,
  updateDocument,
} from "../knowledge.api";
import { extractDocxText } from "../knowledge.utils";
import { loadStoredSystems } from "../../systems/systems.data";
import { getSystems } from "../../systems/systems.api";
import { useAppContext } from "../../../context/AppContext";
import {
  AppModal,
  CompactDesktopScale,
  FieldGroup,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  ModalCancelButton,
  ModalPrimaryButton,
  PageHeader,
  PageOutlineButton,
  PagePrimaryButton,
  SurfaceCard,
  TableSearch,
} from "../../../components/ui";

const FORM_ID = "kb-document-form";
const FILE_INPUT_ID = "kb-document-file";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_FILES =
  ".pdf,.doc,.docx,.txt,.md,.rtf,.csv,.xls,.xlsx,.png,.jpg,.jpeg";
const TEXT_FILE_RE = /\.(txt|md|markdown|csv|log|json|xml|yml|yaml|html)$/i;
const DOCX_FILE_RE = /\.docx$/i;

const emptyForm = {
  title: "",
  content: "",
  system: "",
  author: "",
  documentType: "ARTICLE",
  published: true,
  tagsRaw: "",
};

const titleFromFileName = (name) =>
  String(name || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const readTextFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

const KnowledgePage = () => {
  const toast = useToast();
  const { user } = useAppContext();
  const isAdmin = user?.role === "ADMIN";
  const editor = useDisclosure();
  const [query, setQuery] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [systems, setSystems] = useState([]);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({
        title: "Failed to load knowledge base",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : "") ||
          "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    let isMounted = true;

    const loadSystems = async () => {
      try {
        const next = await getSystems();
        if (isMounted) {
          setSystems(next.length ? next : loadStoredSystems());
        }
      } catch (error) {
        if (isMounted) {
          setSystems(loadStoredSystems());
        }
      }
    };

    loadSystems();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      loadDocuments();
      return;
    }
    setLoading(true);
    try {
      const data = await searchDocuments(q);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({
        title: "Search failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : "") ||
          "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAiSearch = async () => {
    const question = aiQuestion.trim();
    if (!question) return;
    try {
      const result = await aiSearchDocuments(question);
      setAiAnswer(result.answer || "No answer returned.");
      if (result.documents?.length) {
        setDocuments(result.documents);
      }
    } catch (err) {
      toast({
        title: "AI search failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : "") ||
          "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFile(null);
    setExistingFileName("");
    setForm({
      ...emptyForm,
      author: user?.username || user?.email || "",
    });
    editor.onOpen();
  };

  const openEdit = (doc) => {
    setEditingId(doc.id);
    setFile(null);
    setExistingFileName(doc.fileName || "");
    setForm({
      title: doc.title,
      content: doc.content,
      category: doc.system || doc.category,
      system: doc.system || doc.category || "",
      author: doc.author,
      documentType: doc.documentType || "ARTICLE",
      published: doc.published !== false,
      tagsRaw: doc.tagsRaw || doc.tags.join(", "),
    });
    editor.onOpen();
  };

  const applySelectedFile = async (nextFile) => {
    if (!nextFile) {
      return;
    }
    if (nextFile.size > MAX_FILE_BYTES) {
      toast({
        title: "File is too large",
        description: "Maximum size is 10 MB.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setFile(nextFile);
    setForm((prev) => ({
      ...prev,
      title: prev.title || titleFromFileName(nextFile.name),
    }));

    try {
      let text = "";
      if (DOCX_FILE_RE.test(nextFile.name)) {
        text = await extractDocxText(nextFile);
        if (!text) {
          throw new Error("No text found in the Word file");
        }
      } else if (TEXT_FILE_RE.test(nextFile.name)) {
        text = await readTextFile(nextFile);
      } else if (/\.doc$/i.test(nextFile.name)) {
        toast({
          title: "Save this file as .docx",
          description: "Older .doc files cannot be read here. Use Word to save as .docx, or paste the text.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      } else {
        return;
      }

      setForm((prev) => ({
        ...prev,
        title: prev.title || titleFromFileName(nextFile.name),
        content: prev.content || text,
      }));
    } catch (err) {
      toast({
        title: "Could not read that Word file",
        description: "Paste the text into the content field, then save.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast({
        title: "Title is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!form.system.trim()) {
      toast({
        title: "System is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!file && !form.content.trim()) {
      toast({
        title: "Add content or upload a file",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        content:
          form.content.trim() ||
          (file ? `Uploaded file: ${file.name}` : ""),
      };
      if (editingId) {
        await updateDocument(editingId, payload, file);
      } else {
        await createDocument(payload, file);
      }

      const binaryFile =
        file &&
        !TEXT_FILE_RE.test(file.name) &&
        !DOCX_FILE_RE.test(file.name);
      if (binaryFile) {
        toast({
          title: editingId ? "Document updated" : "Document created",
          description:
            "The knowledge API stores title and text. Binary files are not attached on this endpoint.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: editingId ? "Document updated" : "Document created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      editor.onClose();
      loadDocuments();
    } catch (err) {
      toast({
        title: "Save failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : "") ||
          "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await downloadDocumentFile(doc);
    } catch (err) {
      toast({
        title: "Download failed",
        description: err.response?.data?.message || "No file is stored for this document.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"?`)) return;
    try {
      await deleteDocument(doc.id);
      toast({ title: "Document deleted", status: "success", duration: 3000, isClosable: true });
      loadDocuments();
    } catch (err) {
      toast({
        title: "Delete failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : "") ||
          "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const systemsUsed = useMemo(() => {
    const names = new Set();
    documents.forEach((doc) => {
      const system = doc.system || doc.category;
      if (system) names.add(system);
    });
    return [...names].sort();
  }, [documents]);

  const systemOptions = useMemo(() => {
    const names = systems
      .map((item) => item.name)
      .filter(Boolean);
    if (form.system && !names.includes(form.system)) {
      names.unshift(form.system);
    }
    return names;
  }, [systems, form.system]);

  return (
    <CompactDesktopScale>
    <Stack spacing={6} w="100%">
      <PageHeader
        title="Knowledge Base"
        subtitle="BSS documents, search, and AI search."
        actions={
          <PagePrimaryButton leftIcon={<FiPlus />} onClick={openCreate}>
            Add document
          </PagePrimaryButton>
        }
        mb={0}
      />

      <SurfaceCard p={5}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Stack spacing={3}>
            <Text fontSize="xs" fontWeight="600" color="text.muted">
              Search
            </Text>
            <HStack>
              <TableSearch
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search documents..."
              />
              <PageOutlineButton onClick={handleSearch}>Search</PageOutlineButton>
            </HStack>
          </Stack>
          <Stack spacing={3}>
            <Text fontSize="xs" fontWeight="600" color="text.muted">
              AI search
            </Text>
            <HStack>
              <TableSearch
                value={aiQuestion}
                onChange={(event) => setAiQuestion(event.target.value)}
                placeholder="Ask a question..."
              />
              <PageOutlineButton onClick={handleAiSearch}>Ask</PageOutlineButton>
            </HStack>
          </Stack>
        </SimpleGrid>
        {aiAnswer && (
          <Text mt={4} fontSize="sm" color="text.primary">
            {aiAnswer}
          </Text>
        )}
        {systemsUsed.length > 0 && (
          <HStack mt={4} spacing={2} flexWrap="wrap">
            {systemsUsed.map((system) => (
              <Badge key={system} variant="subtle" colorScheme="green">
                {system}
              </Badge>
            ))}
          </HStack>
        )}
      </SurfaceCard>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {loading ? (
          <SurfaceCard p={8}>
            <Text color="text.muted">Loading documents...</Text>
          </SurfaceCard>
        ) : documents.length === 0 ? (
          <SurfaceCard p={8}>
            <Text color="text.muted">No documents yet.</Text>
          </SurfaceCard>
        ) : (
          documents.map((doc) => (
            <SurfaceCard key={doc.id} p={5}>
              <Text fontSize="md" fontWeight="700" mb={1}>
                {doc.title}
              </Text>
              <Text fontSize="xs" color="text.muted" mb={3}>
                {doc.system || doc.category || "No system"}
                {doc.author ? ` · ${doc.author}` : ""}
                {doc.fileName ? ` · ${doc.fileName}` : ""}
              </Text>
              <Text fontSize="sm" noOfLines={4} mb={4}>
                {doc.content}
              </Text>
              <HStack spacing={2}>
                <PageOutlineButton onClick={() => openEdit(doc)}>
                  Open
                </PageOutlineButton>
                {(doc.fileName || doc.fileUrl) && (
                  <PageOutlineButton onClick={() => handleDownload(doc)}>
                    Download
                  </PageOutlineButton>
                )}
                {isAdmin && (
                  <PageOutlineButton onClick={() => handleDelete(doc)}>
                    Delete
                  </PageOutlineButton>
                )}
              </HStack>
            </SurfaceCard>
          ))
        )}
      </SimpleGrid>

      <AppModal
        isOpen={editor.isOpen}
        onClose={editor.onClose}
        title={editingId ? "Edit document" : "Add document"}
        compact
        footer={
          <>
            <ModalCancelButton onClick={editor.onClose} isDisabled={saving}>
              Cancel
            </ModalCancelButton>
            <ModalPrimaryButton
              type="submit"
              form={FORM_ID}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save
            </ModalPrimaryButton>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={handleSave}>
          <Stack spacing={4}>
            <FieldGroup label="Title">
              <FieldInput
                required
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </FieldGroup>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FieldGroup label="System">
                <FieldSelect
                  required
                  value={form.system}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, system: event.target.value }))
                  }
                >
                  <option value="">Select system</option>
                  {systemOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </FieldSelect>
              </FieldGroup>
              <FieldGroup label="Type">
                <FieldSelect
                  value={form.documentType}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      documentType: event.target.value,
                    }))
                  }
                >
                  <option value="ARTICLE">Article</option>
                  <option value="RUNBOOK">Runbook</option>
                  <option value="SOP">SOP</option>
                </FieldSelect>
              </FieldGroup>
            </SimpleGrid>
            <FieldGroup label="Tags">
              <FieldInput
                value={form.tagsRaw}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tagsRaw: event.target.value }))
                }
                placeholder="banking, transactions"
              />
            </FieldGroup>
            <Box>
              <Text
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.06em"
                textTransform="uppercase"
                color="text.muted"
                mb={2}
              >
                File
              </Text>
              <Box
                as="label"
                htmlFor={FILE_INPUT_ID}
                display="block"
                cursor="pointer"
                border="1px dashed"
                borderColor={dragging ? "brand.500" : "border.default"}
                borderRadius="12px"
                bg={dragging ? "brand.wash" : "white"}
                _dark={{ bg: dragging ? "brand.wash" : "surface.subtle" }}
                px={4}
                py={4}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  applySelectedFile(event.dataTransfer.files?.[0]);
                }}
              >
                <input
                  id={FILE_INPUT_ID}
                  type="file"
                  accept={ACCEPTED_FILES}
                  hidden
                  onChange={(event) => {
                    applySelectedFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                {file || existingFileName ? (
                  <HStack justify="space-between" align="center">
                    <HStack spacing={3} minW={0}>
                      <Box color="text.brand">
                        <FiFile />
                      </Box>
                      <Box minW={0}>
                        <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                          {file?.name || existingFileName}
                        </Text>
                        <Text fontSize="xs" color="text.muted">
                          {file
                            ? formatFileSize(file.size)
                            : "Stored file. Choose another to replace it."}
                        </Text>
                      </Box>
                    </HStack>
                    {file && (
                      <Box
                        as="button"
                        type="button"
                        aria-label="Remove file"
                        color="text.muted"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setFile(null);
                        }}
                      >
                        <FiX />
                      </Box>
                    )}
                  </HStack>
                ) : (
                  <HStack spacing={3}>
                    <Box color="text.brand">
                      <FiUpload />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600">
                        Upload a document
                      </Text>
                      <Text fontSize="xs" color="text.muted">
                        PDF, Word, Excel, or text. Drop a file or click to browse.
                      </Text>
                    </Box>
                  </HStack>
                )}
              </Box>
            </Box>
            <FieldGroup label="Content" tall>
              <FieldTextarea
                required={!file && !existingFileName}
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
                placeholder={
                  file
                    ? "Optional summary. Text files are filled in automatically."
                    : "Write the article, or upload a file above."
                }
              />
            </FieldGroup>
          </Stack>
        </form>
      </AppModal>
    </Stack>
    </CompactDesktopScale>
  );
};

export default KnowledgePage;
