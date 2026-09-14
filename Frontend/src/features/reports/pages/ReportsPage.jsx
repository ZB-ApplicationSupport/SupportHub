import React, { useEffect, useMemo, useState } from "react";
import {
  Heading,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { getCases } from "../../cases/cases.api";
import { formatCaseOpenedAt } from "../../cases/case.utils";
import CasesBySystemChart from "../../../components/charts/CasesBySystemChart";
import CaseStatusChart from "../../../components/charts/CaseStatusChart";
import CasePriorityChart from "../../../components/charts/CasePriorityChart";
import OpenCaseAgeCard from "../../dashboard/components/OpenCaseAgeCard";
import {
  CompactDesktopScale,
  DataTableShell,
  DropdownSelect,
  PageHeader,
  PageOutlineButton,
  StatCard,
  SurfaceCard,
} from "../../../components/ui";
import ReportsThroughputCard from "../components/ReportsThroughputCard";
import {
  RANGE_OPTIONS,
  buildAgeing,
  buildKpis,
  buildPriorityDistribution,
  buildSourceMix,
  buildStatusDistribution,
  buildThroughput,
  buildWorkload,
  closedInRange,
  downloadCsv,
  isOpenJob,
  jobsToCsv,
  openedInRange,
  rangeStartMs,
} from "../reports.utils";

const snapshotJobs = (jobs, rangeDays) => {
  const startMs = rangeStartMs(rangeDays);
  if (startMs == null) return jobs;
  return jobs.filter(
    (item) =>
      isOpenJob(item) ||
      openedInRange(item, startMs) ||
      closedInRange(item, startMs)
  );
};

const ReportsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [rangeDays, setRangeDays] = useState("30");

  useEffect(() => {
    getCases()
      .then(setJobs)
      .catch(() => setJobs([]));
  }, []);

  const kpis = useMemo(() => buildKpis(jobs, rangeDays), [jobs, rangeDays]);
  const visibleJobs = useMemo(
    () => snapshotJobs(jobs, rangeDays),
    [jobs, rangeDays]
  );
  const workload = useMemo(
    () => buildWorkload(jobs, rangeDays),
    [jobs, rangeDays]
  );
  const ageing = useMemo(() => buildAgeing(jobs), [jobs]);
  const throughput = useMemo(
    () => buildThroughput(jobs, rangeDays),
    [jobs, rangeDays]
  );
  const sourceData = useMemo(() => buildSourceMix(visibleJobs), [visibleJobs]);
  const statusData = useMemo(
    () => buildStatusDistribution(visibleJobs),
    [visibleJobs]
  );
  const priorityData = useMemo(
    () => buildPriorityDistribution(visibleJobs),
    [visibleJobs]
  );

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`supporthub-jobs-${stamp}.csv`, jobsToCsv(visibleJobs));
  };

  const rangeLabel =
    RANGE_OPTIONS.find((option) => option.value === rangeDays)?.label ||
    "Selected range";

  return (
    <CompactDesktopScale allScreens>
      <Stack spacing={4} w="100%">
        <PageHeader
          title="Reports"
          subtitle="Job reports from Case Tracker. Counts are from live jobs, not invented trends."
          mb={2}
          filters={
            <DropdownSelect
              label="Date range"
              value={rangeDays}
              onChange={(event) => setRangeDays(event.target.value)}
              options={RANGE_OPTIONS}
              size="sm"
              minW="168px"
            />
          }
          actions={
            <PageOutlineButton leftIcon={<FiDownload />} onClick={handleExport}>
              Export CSV
            </PageOutlineButton>
          }
        />

        <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={4}>
          <StatCard
            label="Opened"
            value={kpis.openedInRange}
            hint={rangeLabel}
          />
          <StatCard
            label="Closed"
            value={kpis.closedInRange}
            hint="Uses closedAt when present"
          />
          <StatCard
            label="Currently open"
            value={kpis.currentlyOpen}
            hint="Live queue"
          />
          <StatCard
            label="Unassigned open"
            value={kpis.unassignedOpen}
            hint="No Keycloak assignee"
          />
          <StatCard
            label="High + Critical open"
            value={kpis.escalatedOpen}
            hint="Still in the queue"
          />
          <StatCard
            label="Oldest open"
            value={kpis.oldestOpenAge}
            hint="From createdAt"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
          <ReportsThroughputCard data={throughput} />
          <OpenCaseAgeCard data={ageing} />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={4}>
          <SurfaceCard p={0} overflow="hidden">
            <Heading
              fontSize="14px"
              fontWeight="500"
              color="text.primary"
              px={5}
              pt={5}
              pb={2}
            >
              Source mix
            </Heading>
            <CasesBySystemChart data={sourceData} />
          </SurfaceCard>
          <SurfaceCard p={5}>
            <Heading fontSize="14px" fontWeight="500" color="text.primary" mb={4}>
              Status
            </Heading>
            <CaseStatusChart data={statusData} />
          </SurfaceCard>
          <SurfaceCard p={5}>
            <Heading fontSize="14px" fontWeight="500" color="text.primary" mb={4}>
              Priority
            </Heading>
            <CasePriorityChart data={priorityData} />
          </SurfaceCard>
        </SimpleGrid>

        <DataTableShell
          title="Workload by assignee"
          subtitle="Open is the live queue. Closed is in the selected range."
        >
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Assignee</Th>
                  <Th isNumeric>Open</Th>
                  <Th isNumeric>High + Critical open</Th>
                  <Th isNumeric>Closed in range</Th>
                </Tr>
              </Thead>
              <Tbody>
                {workload.length === 0 ? (
                  <Tr>
                    <Td colSpan={4}>
                      <Text color="text.muted" fontSize="sm">
                        No jobs loaded.
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  workload.map((row) => (
                    <Tr key={row.assignee}>
                      <Td fontWeight="600">{row.assignee}</Td>
                      <Td isNumeric>{row.open}</Td>
                      <Td isNumeric>{row.escalatedOpen}</Td>
                      <Td isNumeric>{row.closedInRange}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </DataTableShell>

        <DataTableShell
          title="Ageing open jobs"
          subtitle="Oldest first. 1 / 3 / 7 day bands from createdAt."
        >
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Reference</Th>
                  <Th>Title</Th>
                  <Th>Assignee</Th>
                  <Th>Priority</Th>
                  <Th>Source</Th>
                  <Th>Opened</Th>
                  <Th>Age</Th>
                  <Th>Band</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ageing.rows.length === 0 ? (
                  <Tr>
                    <Td colSpan={8}>
                      <Text color="text.muted" fontSize="sm">
                        No open jobs with an opened date.
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  ageing.rows.map((row) => (
                    <Tr key={row.id}>
                      <Td fontWeight="600">{row.reference}</Td>
                      <Td maxW="240px">
                        <Text noOfLines={1}>{row.title || "—"}</Text>
                      </Td>
                      <Td>{row.assignee}</Td>
                      <Td>{row.priority}</Td>
                      <Td>{row.system}</Td>
                      <Td>{formatCaseOpenedAt(row.openedAt)}</Td>
                      <Td>{row.ageLabel}</Td>
                      <Td>{row.bucket}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </DataTableShell>
      </Stack>
    </CompactDesktopScale>
  );
};

export default ReportsPage;
