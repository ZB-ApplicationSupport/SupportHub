import React, { useCallback, useEffect, useState } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

import {
  CompactDesktopScale,
  DropdownSelect,
  PageHeader,
  PagePrimaryButton,
} from "../../../components/ui";
import { getCases } from "../../cases/cases.api";
import CreateCaseModal from "../../cases/components/CreateCaseModal";
import DashboardOverview from "../components/DashboardOverview";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

const DashboardPage = () => {
    const createModal = useDisclosure();
    const [cases, setCases] = useState([]);
    const [rangeDays, setRangeDays] = useState(30);

    const loadCases = useCallback(() => {
        return getCases()
            .then(setCases)
            .catch((err) => {
                console.error("Failed to load case statistics:", err);
                setCases([]);
            });
    }, []);

    useEffect(() => {
        loadCases();
    }, [loadCases]);

    return (
        <CompactDesktopScale>
            <Box width="100%">
                <PageHeader
                    title="Cases Analytics"
                    subtitle="Overview of case performance and system health"
                    mb={4}
                    filters={
                        <DropdownSelect
                            label="Date range"
                            value={String(rangeDays)}
                            onChange={(event) => {
                                const next = Number(event.target.value);
                                setRangeDays(Number.isFinite(next) ? next : 30);
                            }}
                            options={RANGE_OPTIONS}
                            size="sm"
                            minW="168px"
                        />
                    }
                    actions={
                        <PagePrimaryButton
                            leftIcon={<FiPlus />}
                            onClick={createModal.onOpen}
                        >
                            New Case
                        </PagePrimaryButton>
                    }
                />

                <DashboardOverview cases={cases} rangeDays={rangeDays} />

                <CreateCaseModal
                    isOpen={createModal.isOpen}
                    onClose={createModal.onClose}
                    onSuccess={loadCases}
                />
            </Box>
        </CompactDesktopScale>
    );
};

export default DashboardPage;
