import React, { useCallback, useEffect, useState } from "react";
import {
  Badge,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  acknowledgeNotification,
  checkThresholds,
  createDataSource,
  deleteDataSource,
  getContactPoints,
  getDataSources,
  getNotifications,
  getThresholds,
  importGrafanaDataSources,
  queryDataSource,
  updateDataSource,
} from "../observability.api";
import {
  getLokiDataSources,
  queryLoki,
} from "../loki.api";
import {
  FieldGroup,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  PageOutlineButton,
  PagePrimaryButton,
  SurfaceCard,
} from "../../../components/ui";
import { formatCaseOpenedAt } from "../../cases/case.utils";
import {
  SettingsSectionHeader,
  UnderlineNav,
} from "../../settings/components/settingsUi";

const TABS = ["Explorer", "Logs", "Data sources", "Alerts"];

const EMPTY_SOURCE = {
  name: "",
  url: "",
  type: "prometheus",
  apiKey: "",
  active: true,
};

const dataSourceErrorMessage = (err, fallback) => {
  const status = err.response?.status;
  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    "";

  if (
    status === 409 ||
    /unique|duplicate|already exists/i.test(String(message))
  ) {
    return "A data source with this name already exists.";
  }

  return message || fallback;
};

const formatQueryResult = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
};

const ObservabilityPage = ({ initialTab } = {}) => {
  const toast = useToast();
  const [tab, setTab] = useState(
    TABS.includes(initialTab) ? initialTab : "Explorer"
  );
  const [sources, setSources] = useState([]);
  const [sourceId, setSourceId] = useState("");
  const [promql, setPromql] = useState("up");
  const [timeRange, setTimeRange] = useState("1h");
  const [result, setResult] = useState("");
  const [querying, setQuerying] = useState(false);
  const [thresholds, setThresholds] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [lokiSources, setLokiSources] = useState([]);
  const [lokiSourceId, setLokiSourceId] = useState("");
  const [logql, setLogql] = useState("");
  const [lokiResult, setLokiResult] = useState("");
  const [lokiQuerying, setLokiQuerying] = useState(false);
  const [newSource, setNewSource] = useState(EMPTY_SOURCE);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (TABS.includes(initialTab)) {
      setTab(initialTab);
    }
  }, [initialTab]);

  const loadSources = useCallback(async () => {
    try {
      const data = await getDataSources();
      const list = Array.isArray(data) ? data : [];
      setSources(list);
      setSourceId((current) => {
        const stillValid = list.some(
          (source) => String(source.id) === String(current) && source.active
        );
        if (stillValid) {
          return current;
        }
        const firstActive = list.find((source) => source.active);
        return firstActive?.id != null ? String(firstActive.id) : "";
      });
    } catch (err) {
      toast({
        title: "Failed to load data sources",
        description: err.response?.data?.message || "Check BSS observability.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [toast]);

  const loadAlerts = useCallback(async () => {
    try {
      const [rules, notes, points] = await Promise.all([
        getThresholds().catch(() => []),
        getNotifications().catch(() => []),
        getContactPoints().catch(() => []),
      ]);
      setThresholds(Array.isArray(rules) ? rules : []);
      setNotifications(Array.isArray(notes) ? notes : []);
      setContacts(Array.isArray(points) ? points : []);
    } catch (err) {
      setThresholds([]);
      setNotifications([]);
      setContacts([]);
    }
  }, []);

  const loadLokiSources = useCallback(async () => {
    try {
      const data = await getLokiDataSources();
      const list = Array.isArray(data) ? data : [];
      setLokiSources(list);
      setLokiSourceId((current) => {
        const stillValid = list.some((source) => String(source.id) === String(current));
        if (stillValid) return current;
        return list[0]?.id != null ? String(list[0].id) : "";
      });
    } catch (err) {
      setLokiSources([]);
    }
  }, []);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  useEffect(() => {
    if (tab === "Alerts") {
      loadAlerts();
    }
    if (tab === "Logs") {
      loadLokiSources();
    }
  }, [tab, loadAlerts, loadLokiSources]);

  const handleQuery = async () => {
    if (!promql.trim()) {
      toast({
        title: "Query needs PromQL",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setQuerying(true);
    try {
      if (!sourceId) {
        toast({
          title: "Select a data source",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const data = await queryDataSource(sourceId, promql.trim(), timeRange);
      setResult(formatQueryResult(data));
    } catch (err) {
      setResult("");
      toast({
        title: "Query failed",
        description: err.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setQuerying(false);
    }
  };

  const handleLokiQuery = async () => {
    if (!lokiSourceId || !logql.trim()) {
      toast({
        title: "Select a Loki source and enter LogQL",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLokiQuerying(true);
    try {
      const data = await queryLoki(lokiSourceId, logql.trim());
      setLokiResult(formatQueryResult(data));
    } catch (err) {
      setLokiResult("");
      toast({
        title: "Loki query failed",
        description: err.response?.data?.message || err.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLokiQuerying(false);
    }
  };

  const handleImportGrafana = async () => {
    try {
      await importGrafanaDataSources();
      toast({ title: "Grafana import finished", status: "success", duration: 3000, isClosable: true });
      loadSources();
    } catch (err) {
      toast({
        title: "Grafana import failed",
        description: dataSourceErrorMessage(err, "Please try again."),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleCreateSource = async () => {
    if (!newSource.name.trim() || !newSource.url.trim()) {
      toast({
        title: "Name and URL are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      if (editingId) {
        await updateDataSource(editingId, newSource);
        toast({
          title: "Data source updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createDataSource(newSource);
        toast({
          title: "Data source saved",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setNewSource(EMPTY_SOURCE);
      setEditingId(null);
      loadSources();
    } catch (err) {
      toast({
        title: "Save failed",
        description: dataSourceErrorMessage(err, "Please try again."),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleEditSource = (source) => {
    setEditingId(source.id);
    setNewSource({
      name: source.name || "",
      url: source.url || "",
      type: source.type || "prometheus",
      apiKey: "",
      active: source.active !== false,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewSource(EMPTY_SOURCE);
  };

  const handleDeleteSource = async (source) => {
    try {
      await deleteDataSource(source.id);
      if (String(sourceId) === String(source.id)) {
        setSourceId("");
      }
      if (editingId === source.id) {
        handleCancelEdit();
      }
      toast({
        title: "Data source deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadSources();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: dataSourceErrorMessage(err, "Please try again."),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleCheckThresholds = async () => {
    try {
      await checkThresholds();
      toast({ title: "Threshold check ran", status: "success", duration: 3000, isClosable: true });
      loadAlerts();
    } catch (err) {
      toast({
        title: "Threshold check failed",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack spacing={6} w="100%">
      <SettingsSectionHeader
        title="Observability"
        description="Grafana-style explorer on BSS data sources, thresholds, and notifications. Server Monitoring stays on Prometheus."
      />

      <UnderlineNav
        items={TABS.map((name) => ({ id: name, label: name }))}
        value={tab}
        onChange={setTab}
      />

      {tab === "Explorer" && (
        <SurfaceCard p={5}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
            <FieldGroup label="Data source">
              <FieldSelect
                value={sourceId}
                onChange={(event) => setSourceId(event.target.value)}
              >
                <option value="">Select source</option>
                {sources
                  .filter((source) => source.active)
                  .map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name || source.url || source.id}
                    </option>
                  ))}
              </FieldSelect>
            </FieldGroup>
            <FieldGroup label="Range">
              <FieldSelect
                value={timeRange}
                onChange={(event) => setTimeRange(event.target.value)}
              >
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1h">1h</option>
                <option value="6h">6h</option>
                <option value="24h">24h</option>
              </FieldSelect>
            </FieldGroup>
            <Stack justify="flex-end">
              <PagePrimaryButton onClick={handleQuery} isLoading={querying}>
                Run query
              </PagePrimaryButton>
            </Stack>
          </SimpleGrid>
          <FieldGroup label="PromQL" tall>
            <FieldTextarea
              value={promql}
              onChange={(event) => setPromql(event.target.value)}
              placeholder="up"
            />
          </FieldGroup>
          <Text mt={4} fontSize="xs" fontWeight="600" color="text.muted">
            Result
          </Text>
          <Text
            as="pre"
            mt={2}
            p={4}
            borderRadius="12px"
            bg="surface.subtle"
            fontSize="12px"
            whiteSpace="pre-wrap"
            minH="180px"
          >
            {result || "Run a query to see BSS observability results."}
          </Text>
        </SurfaceCard>
      )}

      {tab === "Logs" && (
        <SurfaceCard p={5}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
            <FieldGroup label="Loki data source">
              <FieldSelect
                value={lokiSourceId}
                onChange={(event) => setLokiSourceId(event.target.value)}
              >
                <option value="">Select source</option>
                {lokiSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name || source.url || source.id}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>
            <Stack justify="flex-end">
              <PagePrimaryButton onClick={handleLokiQuery} isLoading={lokiQuerying}>
                Run LogQL
              </PagePrimaryButton>
            </Stack>
          </SimpleGrid>
          <FieldGroup label="LogQL" tall>
            <FieldTextarea
              value={logql}
              onChange={(event) => setLogql(event.target.value)}
              placeholder="Enter LogQL query"
            />
          </FieldGroup>
          <Text mt={4} fontSize="xs" fontWeight="600" color="text.muted">
            Result
          </Text>
          <Text
            as="pre"
            mt={2}
            p={4}
            borderRadius="12px"
            bg="surface.subtle"
            fontSize="12px"
            whiteSpace="pre-wrap"
            minH="180px"
          >
            {lokiResult || "Run a LogQL query to see BSS log results."}
          </Text>
        </SurfaceCard>
      )}

      {tab === "Data sources" && (
        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
          <SurfaceCard p={5}>
            <Text fontWeight="700" mb={4}>
              {editingId ? "Edit data source" : "Add data source"}
            </Text>
            <Stack spacing={4}>
              <FieldGroup label="Name">
                <FieldInput
                  value={newSource.name}
                  maxLength={100}
                  onChange={(event) =>
                    setNewSource((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="prometheus-prod"
                />
              </FieldGroup>
              <FieldGroup label="URL">
                <FieldInput
                  value={newSource.url}
                  maxLength={500}
                  onChange={(event) =>
                    setNewSource((prev) => ({ ...prev, url: event.target.value }))
                  }
                  placeholder="Enter data source URL"
                />
              </FieldGroup>
              <FieldGroup label="Type">
                <FieldSelect
                  value={newSource.type}
                  onChange={(event) =>
                    setNewSource((prev) => ({ ...prev, type: event.target.value }))
                  }
                >
                  <option value="prometheus">prometheus</option>
                  <option value="loki">loki</option>
                </FieldSelect>
              </FieldGroup>
              <FieldGroup label="API key">
                <FieldInput
                  type="password"
                  value={newSource.apiKey}
                  maxLength={500}
                  autoComplete="new-password"
                  onChange={(event) =>
                    setNewSource((prev) => ({ ...prev, apiKey: event.target.value }))
                  }
                  placeholder={
                    editingId
                      ? "Leave blank to keep the current key"
                      : "Optional"
                  }
                />
              </FieldGroup>
              <FieldGroup label="Active">
                <FieldSelect
                  value={newSource.active ? "true" : "false"}
                  onChange={(event) =>
                    setNewSource((prev) => ({
                      ...prev,
                      active: event.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </FieldSelect>
              </FieldGroup>
              <HStack>
                <PagePrimaryButton onClick={handleCreateSource}>
                  {editingId ? "Update source" : "Save source"}
                </PagePrimaryButton>
                {editingId ? (
                  <PageOutlineButton onClick={handleCancelEdit}>
                    Cancel
                  </PageOutlineButton>
                ) : (
                  <PageOutlineButton onClick={handleImportGrafana}>
                    Import Grafana
                  </PageOutlineButton>
                )}
              </HStack>
            </Stack>
          </SurfaceCard>
          <SurfaceCard p={5}>
            <Text fontWeight="700" mb={4}>
              Configured sources
            </Text>
            <Stack spacing={3}>
              {sources.length === 0 ? (
                <Text color="text.muted" fontSize="sm">
                  No data sources yet.
                </Text>
              ) : (
                sources.map((source) => (
                  <HStack
                    key={source.id}
                    justify="space-between"
                    align="flex-start"
                    gap={3}
                    py={2}
                    borderBottom="1px solid"
                    borderColor="border.default"
                  >
                    <Stack spacing={0} minW={0} flex="1">
                      <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                        {source.name}
                      </Text>
                      <Text fontSize="xs" color="text.muted" noOfLines={1}>
                        {source.type || "Unspecified"} · {source.url}
                      </Text>
                      {(source.createdAt || source.updatedAt) && (
                        <Text fontSize="xs" color="text.muted" mt={1}>
                          {source.updatedAt
                            ? `Updated ${formatCaseOpenedAt(source.updatedAt)}`
                            : `Created ${formatCaseOpenedAt(source.createdAt)}`}
                        </Text>
                      )}
                    </Stack>
                    <Stack spacing={2} align="flex-end" flexShrink={0}>
                      <Badge colorScheme={source.active ? "green" : "gray"}>
                        {source.active ? "Active" : "Inactive"}
                      </Badge>
                      <HStack spacing={2}>
                        <PageOutlineButton onClick={() => handleEditSource(source)}>
                          Edit
                        </PageOutlineButton>
                        <PageOutlineButton onClick={() => handleDeleteSource(source)}>
                          Delete
                        </PageOutlineButton>
                      </HStack>
                    </Stack>
                  </HStack>
                ))
              )}
            </Stack>
          </SurfaceCard>
        </SimpleGrid>
      )}

      {tab === "Alerts" && (
        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
          <SurfaceCard p={5}>
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="700">Thresholds</Text>
              <PageOutlineButton onClick={handleCheckThresholds}>
                Run check
              </PageOutlineButton>
            </HStack>
            <Stack spacing={3}>
              {thresholds.length === 0 ? (
                <Text color="text.muted" fontSize="sm">
                  No threshold rules.
                </Text>
              ) : (
                thresholds.map((rule) => (
                  <Stack key={rule.id} spacing={0}>
                    <Text fontSize="sm" fontWeight="600">
                      {rule.name}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      {rule.metric} {rule.operator} {rule.thresholdValue} ·{" "}
                      {rule.severity}
                    </Text>
                  </Stack>
                ))
              )}
            </Stack>
            {contacts.length > 0 && (
              <Text mt={4} fontSize="xs" color="text.muted">
                Contact points: {contacts.map((item) => item.name).join(", ")}
              </Text>
            )}
          </SurfaceCard>
          <SurfaceCard p={5}>
            <Text fontWeight="700" mb={4}>
              Notifications
            </Text>
            <Stack spacing={3}>
              {notifications.length === 0 ? (
                <Text color="text.muted" fontSize="sm">
                  No notifications.
                </Text>
              ) : (
                notifications.map((note) => (
                  <HStack key={note.id} justify="space-between" align="flex-start">
                    <Stack spacing={0}>
                      <Text fontSize="sm" fontWeight="600">
                        {note.title || note.message || `Notification ${note.id}`}
                      </Text>
                      <Text fontSize="xs" color="text.muted">
                        {note.acknowledged ? "Acknowledged" : "Unacknowledged"}
                      </Text>
                    </Stack>
                    {!note.acknowledged && (
                      <PageOutlineButton
                        onClick={async () => {
                          await acknowledgeNotification(note.id);
                          loadAlerts();
                        }}
                      >
                        Ack
                      </PageOutlineButton>
                    )}
                  </HStack>
                ))
              )}
            </Stack>
          </SurfaceCard>
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default ObservabilityPage;
