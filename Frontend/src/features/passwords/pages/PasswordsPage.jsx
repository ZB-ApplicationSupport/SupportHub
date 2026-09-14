import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import {
  createPassword,
  decryptHistoricalPassword,
  decryptPassword,
  deletePassword,
  getPasswordHistory,
  getPasswords,
  updatePassword,
} from "../passwords.api";
import PasswordsTable from "../components/PasswordsTable";
import PasswordModal from "../components/PasswordModal";
import { useAppContext } from "../../../context/AppContext";
import {
  AppModal,
  CompactDesktopScale,
  ModalCancelButton,
  PageHeader,
  PagePrimaryButton,
} from "../../../components/ui";
import { formatCaseOpenedAt } from "../../cases/case.utils";

const PasswordsPage = () => {
  const addModal = useDisclosure();
  const historyModal = useDisclosure();
  const toast = useToast();
  const { user } = useAppContext();
  const isAdmin = user?.role === "ADMIN";
  const [query, setQuery] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState({});
  const [editing, setEditing] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  const [historyRows, setHistoryRows] = useState([]);
  const [historySecrets, setHistorySecrets] = useState({});

  const loadPasswords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPasswords();
      setPasswords(data || []);
    } catch (err) {
      toast({
        title: "Failed to load credentials",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setPasswords([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  const filteredPasswords = useMemo(() => {
    const lowerQuery = (query || "").toLowerCase();
    return passwords.filter((item) => {
      if (!lowerQuery) return true;
      return (
        (item.systemName || "").toLowerCase().includes(lowerQuery) ||
        (item.username || "").toLowerCase().includes(lowerQuery) ||
        (item.description || "").toLowerCase().includes(lowerQuery)
      );
    });
  }, [passwords, query]);

  const handleSave = async (formValues) => {
    try {
      if (editing?.id) {
        await updatePassword(editing.id, formValues);
        toast({
          title: "Credential updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createPassword(formValues);
        toast({
          title: "Credential saved",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      loadPasswords();
      setEditing(null);
      addModal.onClose();
    } catch (err) {
      toast({
        title: "Failed to save credential",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleReveal = async (item) => {
    try {
      const secret = await decryptPassword(item.id);
      setRevealed((prev) => ({ ...prev, [item.id]: secret }));
    } catch (err) {
      toast({
        title: "Unable to decrypt",
        description:
          err.response?.data?.message || "Admin decrypt was not allowed.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleHistory = async (item) => {
    setHistoryItem(item);
    setHistorySecrets({});
    try {
      const rows = await getPasswordHistory(item.id);
      setHistoryRows(Array.isArray(rows) ? rows : []);
      historyModal.onOpen();
    } catch (err) {
      toast({
        title: "Unable to load history",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleRevealHistory = async (row) => {
    if (!historyItem) return;
    try {
      const secret = await decryptHistoricalPassword(historyItem.id, row.id);
      setHistorySecrets((prev) => ({ ...prev, [row.id]: secret }));
    } catch (err) {
      toast({
        title: "Unable to decrypt history",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Soft-delete credential for ${item.systemName}?`
    );
    if (!confirmed) return;
    try {
      await deletePassword(item.id);
      toast({ title: "Credential deleted", status: "success", duration: 3000, isClosable: true });
      loadPasswords();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <CompactDesktopScale>
    <Stack spacing={6} w="100%">
      <PageHeader
        title="Passwords"
        subtitle="BSS credentials: list, decrypt, rotate, and view history."
        actions={
          <PagePrimaryButton
            leftIcon={<FiPlus />}
            onClick={() => {
              setEditing(null);
              addModal.onOpen();
            }}
          >
            Add credential
          </PagePrimaryButton>
        }
        mb={0}
      />

      <PasswordsTable
        items={loading ? [] : filteredPasswords}
        query={query}
        onQueryChange={setQuery}
        revealed={revealed}
        onReveal={handleReveal}
        onHide={(item) =>
          setRevealed((prev) => {
            const next = { ...prev };
            delete next[item.id];
            return next;
          })
        }
        onHistory={handleHistory}
        onEdit={(item) => {
          setEditing(item);
          addModal.onOpen();
        }}
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />

      <PasswordModal
        isOpen={addModal.isOpen}
        onClose={() => {
          setEditing(null);
          addModal.onClose();
        }}
        onSave={handleSave}
        initialValues={editing}
      />

      <AppModal
        isOpen={historyModal.isOpen}
        onClose={historyModal.onClose}
        title="Password history"
        subtitle={historyItem ? historyItem.systemName : ""}
        footer={
          <ModalCancelButton onClick={historyModal.onClose}>Close</ModalCancelButton>
        }
      >
        <Stack spacing={3}>
          {historyRows.length === 0 ? (
            <Text fontSize="sm" color="text.muted">
              No history for this credential.
            </Text>
          ) : (
            historyRows.map((row) => (
              <Stack
                key={row.id}
                spacing={1}
                p={3}
                borderRadius="12px"
                bg="surface.subtle"
              >
                <Text fontSize="sm" fontWeight="600">
                  {formatCaseOpenedAt(row.createdAt || row.changedAt || row.updatedAt)}
                </Text>
                {row.createdBy ? (
                  <Text fontSize="sm">{row.createdBy}</Text>
                ) : null}
                <Text fontSize="sm" color="text.muted">
                  {historySecrets[row.id] || "••••••••"}
                </Text>
                {!historySecrets[row.id] && (
                  <Text
                    fontSize="xs"
                    color="text.brand"
                    cursor="pointer"
                    onClick={() => handleRevealHistory(row)}
                  >
                    Decrypt
                  </Text>
                )}
              </Stack>
            ))
          )}
        </Stack>
      </AppModal>
    </Stack>
    </CompactDesktopScale>
  );
};

export default PasswordsPage;
