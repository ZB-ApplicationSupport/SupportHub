import React, { useEffect, useMemo, useState } from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useAppContext } from "../../../context/AppContext";
import {
  DarkPillButton,
  SettingsSectionHeader,
  UnderlineNav,
} from "../../settings/components/settingsUi";
import SystemModal from "./SystemModal";
import SystemsTable from "./SystemsTable";
import {
  STORAGE_KEY,
  SYSTEM_STATUSES,
  loadStoredSystems,
  nextSystemId,
  normalizeSystem,
} from "../systems.data";
import {
  createSystem,
  deleteSystem,
  getSystems,
  updateSystem,
} from "../systems.api";

const STATUS_FILTERS = [
  { id: "all", label: "View all" },
  ...SYSTEM_STATUSES.map((status) => ({ id: status, label: status })),
];

const SupportedSystemsPanel = ({ searchQuery = "" }) => {
  const toast = useToast();
  const { user } = useAppContext();
  const [systems, setSystems] = useState(loadStoredSystems);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(systems.map(normalizeSystem)));
  }, [systems]);

  useEffect(() => {
    let isMounted = true;

    const loadSystems = async () => {
      try {
        const next = await getSystems();
        if (isMounted && next.length) {
          setSystems(next);
        }
      } catch (error) {
        setSystems(loadStoredSystems());
      }
    };

    loadSystems();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleSystems = useMemo(() => {
    if (statusFilter === "all") return systems;
    return systems.filter((item) => item.status === statusFilter);
  }, [systems, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (system) => {
    setEditing(system);
    setModalOpen(true);
  };

  const handleSave = async (formState) => {
    if (editing?.id) {
      try {
        const saved = await updateSystem(editing.id, formState);
        setSystems((prev) =>
          prev.map((item) => (item.id === editing.id ? saved : item))
        );
      } catch (error) {
        setSystems((prev) =>
          prev.map((item) =>
            item.id === editing.id
              ? normalizeSystem({
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
        title: "System updated",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } else {
      try {
        const saved = await createSystem(formState);
        setSystems((prev) => [...prev, saved]);
      } catch (error) {
        setSystems((prev) => [
          ...prev,
          normalizeSystem({
            ...formState,
            id: nextSystemId(prev),
            addedAt: new Date().toISOString(),
            addedBy: user?.username || user?.name || "Unknown",
          }),
        ]);
      }
      toast({
        title: "System added",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (system) => {
    try {
      await deleteSystem(system.id);
    } catch (error) {
      // Keep local removal usable when the backend rejects a system delete.
    }
    setSystems((prev) => prev.filter((item) => item.id !== system.id));
    toast({
      title: "System removed",
      description: `${system.name} was removed from the catalogue.`,
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
        title="Supported systems"
        description="Name, description, and status for platforms this team supports."
        action={
          <DarkPillButton leftIcon={<FiPlus />} onClick={openCreate}>
            Add system
          </DarkPillButton>
        }
      />

      <UnderlineNav
        items={STATUS_FILTERS}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <SystemsTable
        items={visibleSystems}
        onRowClick={openEdit}
        searchQuery={searchQuery}
        hideSearch
      />

      <SystemModal
        isOpen={modalOpen}
        system={editing}
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

export default SupportedSystemsPanel;
