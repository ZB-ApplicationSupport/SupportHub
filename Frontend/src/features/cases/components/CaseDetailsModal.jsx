import React, { useEffect, useState } from "react";

import {
  Button,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { deleteCase, updateCase } from "../cases.api";
import { formatCaseOpenedAt } from "../case.utils";
import {
  deleteFile,
  downloadFile,
  getJobFiles,
  uploadFile,
} from "../../files.api";
import {
  AppModal,
  FieldGroup,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  ModalCancelButton,
  ModalPrimaryButton,
} from "../../../components/ui";

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

const CaseDetailsModal = ({
  isOpen,
  onClose,
  item,
  isAdmin = false,
  onSuccess,
}) => {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!item) {
      return;
    }

    setTitle(item.title || item.summary || "");
    setDescription(item.description || "");
    setStatus(item.status === "Closed" ? "Closed" : "Open");
    setPriority(
      PRIORITY_OPTIONS.includes(item.priority) ? item.priority : "Medium"
    );
    setAssignedTo(
      item.assignedTo && item.assignedTo !== "Unassigned"
        ? item.assignedTo
        : ""
    );
    setSelectedFile(null);

    let isMounted = true;
    getJobFiles(item.id)
      .then((next) => {
        if (isMounted) {
          setFiles(next);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFiles([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [item]);

  const handleDownloadFile = async (file) => {
    const fileId = file.id || file.fileId;
    if (!fileId) return;

    try {
      const res = await downloadFile(fileId);
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName || file.name || `file-${fileId}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: "Failed to download file",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const refreshFiles = async () => {
    if (!item?.id) return;
    const next = await getJobFiles(item.id);
    setFiles(next);
  };

  const handleUploadFile = async () => {
    if (!selectedFile || !item?.id) return;

    setIsUploading(true);
    try {
      await uploadFile(selectedFile, { jobId: item.id });
      setSelectedFile(null);
      await refreshFiles();
      toast({
        title: "File uploaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to upload file",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (file) => {
    const fileId = file.id || file.fileId;
    if (!fileId) return;

    try {
      await deleteFile(fileId);
      await refreshFiles();
      toast({
        title: "File deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to delete file",
        description: err.response?.data?.message || "Admin delete was not allowed.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    if (!item) {
      return;
    }

    setIsSaving(true);

    try {
      await updateCase(item.id, {
        title,
        description,
        status,
        priority,
        assignedTo,
      });

      toast({
        title: "Job updated",
        description: `${item.reference || item.caseId || item.id} was updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (err) {
      toast({
        title: "Failed to update job",
        description:
          err.response?.data?.message ||
          "Unable to update the job. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${item.reference || item.caseId || item.id}? This cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCase(item.id);
      toast({
        title: "Job deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (err) {
      toast({
        title: "Failed to delete job",
        description:
          err.response?.data?.message || "Admin delete was not allowed.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const busy = isSaving || isDeleting;
  const isClosed = item?.status === "Closed" || Boolean(item?.closedAt);

  return (
    <AppModal
      isOpen={isOpen && Boolean(item)}
      onClose={onClose}
      title={item?.title || item?.summary || "Job details"}
      compact
      subtitle={
        item
          ? `${item.reference || item.caseId || item.id}${
              item.sourceSystem ? ` · ${item.sourceSystem}` : ""
            }`
          : ""
      }
      footer={
        <>
          {isAdmin && (
            <ModalCancelButton
              onClick={handleDelete}
              isDisabled={busy}
              mr="auto"
              bg="danger.wash"
              color="danger.onWash"
              _hover={{ bg: "rgba(214, 69, 69, 0.22)" }}
            >
              Delete
            </ModalCancelButton>
          )}
          <ModalCancelButton onClick={onClose} isDisabled={busy}>
            Cancel
          </ModalCancelButton>
          <ModalPrimaryButton
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving..."
            isDisabled={busy}
          >
            Save Changes
          </ModalPrimaryButton>
        </>
      }
    >
      {item && (
        <Stack spacing={5}>
          <FieldGroup label="Title">
            <FieldInput
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Description" tall>
            <FieldTextarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </FieldGroup>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FieldGroup label="Opened">
              <Text fontSize="sm" fontWeight="500">
                {formatCaseOpenedAt(item.openedAt || item.createdAt)}
              </Text>
            </FieldGroup>

            <FieldGroup label="Created by">
              <Text fontSize="sm" fontWeight="500">
                {item.createdBy || "—"}
              </Text>
            </FieldGroup>

            <FieldGroup label="Status">
              {isClosed ? (
                <Text fontSize="sm" fontWeight="500">
                  Closed
                  {item.closedAt
                    ? ` · ${formatCaseOpenedAt(item.closedAt)}`
                    : ""}
                </Text>
              ) : (
                <FieldSelect
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </FieldSelect>
              )}
            </FieldGroup>

            <FieldGroup label="Priority">
              <FieldSelect
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>

            <FieldGroup label="Assignee">
              <FieldInput
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                placeholder="Keycloak username"
              />
            </FieldGroup>

            <FieldGroup label="Source">
              <Text fontSize="sm" fontWeight="500">
                {item.sourceSystem || item.system || "—"}
              </Text>
            </FieldGroup>
          </SimpleGrid>

          <FieldGroup label="Files">
            <HStack mb={3} align="center">
              <FieldInput
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              />
              <Button
                size="sm"
                colorScheme="green"
                onClick={handleUploadFile}
                isLoading={isUploading}
                isDisabled={!selectedFile}
              >
                Upload
              </Button>
            </HStack>
            {files.length === 0 ? (
              <Text fontSize="sm" color="text.muted">
                No files attached.
              </Text>
            ) : (
              <Stack spacing={2}>
                {files.map((file, index) => (
                  <HStack key={file.id || file.fileId || index} spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      flex="1"
                      justifyContent="flex-start"
                      onClick={() => handleDownloadFile(file)}
                    >
                      {file.fileName || file.name || `File ${index + 1}`}
                    </Button>
                  {isAdmin ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteFile(file)}
                    >
                      Delete
                    </Button>
                  ) : null}
                  </HStack>
                ))}
              </Stack>
            )}
          </FieldGroup>
        </Stack>
      )}
    </AppModal>
  );
};

export default CaseDetailsModal;
