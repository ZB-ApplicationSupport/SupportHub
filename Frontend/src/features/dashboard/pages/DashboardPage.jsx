import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

import { useAppContext } from "../../context/AppContext";
import { getCases } from "../../features/cases/cases.api";

import DashboardOverview from "./DashboardOverview";
import CasesBySystemChart from "../../components/charts/CasesBySystemChart";

const buildCasesBySystem = (items) => {
    const map = (items || []).reduce((acc, item) => {
        const system = item.system || "Other";

        acc[system] = (acc[system] || 0) + 1;

        return acc;
    }, {});

    return Object.keys(map).map((system) => ({
        system,
        cases: map[system],
    }));
};

const buildRecentActivity = (items) => {
    return [...(items || [])]
        .sort(
            (a, b) =>
                new Date(
                    b.lastUpdatedAt || b.createdAt || 0
                ) -
                new Date(
                    a.lastUpdatedAt || a.createdAt || 0
                )
        )
        .slice(0, 5)
        .map((item) => ({
            id: item.id,
            caseId: item.caseId ?? item.id,
            summary:
                item.summary ||
                item.title ||
                "Case updated",
            updatedBy:
                item.createdByEmail ||
                item.updatedByEmail ||
                "Unknown",
        }));
};

const DashboardPage = () => {
    const { user } = useAppContext();
    const [cases, setCases] = useState([]);

    const cardBg = useColorModeValue(
        "surface.card",
        "gray.800"
    );

    useEffect(() => {
        getCases()
            .then(setCases)
            .catch(() => setCases([]));
    }, []);

    const systemData = buildCasesBySystem(cases);
    const recentActivity = buildRecentActivity(cases);

    return (
        <Stack spacing={6} width="100%">
            {/* Welcome */}
            <Box>
                <Heading size="lg">
                    Welcome back,{" "}
                    {user?.name
                        ? user.name.split(" ")[0]
                        : "there"}
                </Heading>
            </Box>

            {/* Statistics + Status Chart */}
            <DashboardOverview cases={cases} />

        </Stack>
    );
};

export default DashboardPage;