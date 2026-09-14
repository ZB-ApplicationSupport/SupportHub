import React, { useEffect, useState } from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import {
  DarkPillButton,
  SettingsSectionHeader,
} from "../settings/components/settingsUi";
import LinkModal from "./LinkModal";
import LinksTable from "./LinksTable";
import {
  loadLinks,
  nextLinkId,
  normalizeLink,
  saveLinks,
} from "./links.data";
import {
  createQuickLink,
  deleteQuickLink,
  getQuickLinks,
  updateQuickLink,
} from "./links.api";

const LinksPanel = ({ searchQuery = "" }) => {
  const toast = useToast();
  const { user } = useAppContext();
  const [links, setLinks] = useState(loadLinks);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    saveLinks(links);
  }, [links]);

  useEffect(() => {
    let isMounted = true;

    const loadRemoteLinks = async () => {
      try {
        const next = await getQuickLinks();
        if (isMounted && next.length) {
          setLinks(next);
        }
      } catch (error) {
        setLinks(loadLinks());
      }
    };

    loadRemoteLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (link) => {
    setEditing(link);
    setModalOpen(true);
  };

  const handleSave = async (formState, logoFile) => {
    if (editing?.id) {
      try {
        const saved = await updateQuickLink(editing.id, formState, logoFile);
        setLinks((prev) =>
          prev.map((item) => (item.id === editing.id ? saved : item))
        );
      } catch (error) {
      setLinks((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? normalizeLink({
                ...item,
                ...formState,
                id: editing.id,
                addedAt: item.addedAt,
                addedBy: item.addedBy,
              })
            : item
        )
      );
      }
      toast({
        title: "Link updated",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } else {
      try {
        const saved = await createQuickLink(formState, logoFile);
        setLinks((prev) => [...prev, saved]);
      } catch (error) {
      setLinks((prev) => [
        ...prev,
        normalizeLink({
          ...formState,
          id: nextLinkId(prev),
          addedAt: new Date().toISOString(),
          addedBy: user?.username || user?.name || "Unknown",
        }),
      ]);
      }
      toast({
        title: "Link added",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (link) => {
    try {
      await deleteQuickLink(link.id);
    } catch (error) {
      // Keep local removal usable when a backend delete is rejected.
    }
    setLinks((prev) => prev.filter((item) => item.id !== link.id));
    toast({
      title: "Link removed",
      description: `${link.title} was removed from the dashboard.`,
      status: "info",
      duration: 2500,
      isClosable: true,
    });
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <Stack spacing={6} w="100%">
      <SettingsSectionHeader
        title="Add Links"
        description="Shortcuts shown on the dashboard Systems & Services panel."
        action={
          <DarkPillButton leftIcon={<FiPlus />} onClick={openCreate}>
            Add link
          </DarkPillButton>
        }
      />

      <LinksTable
        items={links}
        onRowClick={openEdit}
        searchQuery={searchQuery}
        hideSearch
      />

      <LinkModal
        isOpen={modalOpen}
        link={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        onDelete={editing ? () => handleDelete(editing) : undefined}
      />
    </Stack>
  );
};

export default LinksPanel;
