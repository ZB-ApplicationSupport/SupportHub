import React from "react";
import {
    SimpleGrid,
    Select,
} from "@chakra-ui/react";

const CaseFilters = ({
                         status,
                         priority,
                         system,
                         assignee,
                         assignees,
                         sortKey,
                         direction,

                         onStatusChange,
                         onPriorityChange,
                         onSystemChange,
                         onAssigneeChange,
                         onSortChange,
                         onDirectionChange,
                     }) => {
    return (
        <SimpleGrid
            columns={{
                base: 1,
                md: 2,
                xl: 6,
            }}
            spacing={3}
        >

            {/* STATUS */}
            <Select
                value={status}
                onChange={(event) =>
                    onStatusChange(event.target.value)
                }
                aria-label="Filter by status"
            >
                <option value="">All Statuses</option>
                <option value="In progress">In Progress</option>
                <option value="In UAT">In UAT</option>
                <option value="Resolved">Resolved</option>
                <option value="Awaiting vendor">
                    Awaiting Vendor
                </option>
            </Select>

            {/* PRIORITY */}
            <Select
                value={priority}
                onChange={(event) =>
                    onPriorityChange(event.target.value)
                }
                aria-label="Filter by priority"
            >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
            </Select>

            {/* SYSTEM */}
            <Select
                value={system}
                onChange={(event) =>
                    onSystemChange(event.target.value)
                }
                aria-label="Filter by system"
            >
                <option value="">All Systems</option>
                <option value="Fusion Essence">
                    Fusion Essence
                </option>
                <option value="Treasury Dealing System">
                    Treasury Dealing System
                </option>
                <option value="Swift">
                    Swift
                </option>
            </Select>

            {/* ASSIGNEE */}
            <Select
                value={assignee}
                onChange={(event) =>
                    onAssigneeChange(event.target.value)
                }
                aria-label="Filter by assignee"
            >
                <option value="">
                    All Assignees
                </option>

                {Array.isArray(assignees) &&
                    assignees.map((user) => (
                        <option
                            key={user.id}
                            value={user.username}
                        >
                            {user.username}
                            {user.email
                                ? ` — ${user.email}`
                                : ""}
                        </option>
                    ))}
            </Select>

            {/* SORT BY */}
            <Select
                value={sortKey}
                onChange={(event) =>
                    onSortChange(event.target.value)
                }
                aria-label="Sort by"
            >
                <option value="openedAt">
                    Date Opened
                </option>
                <option value="priority">
                    Priority
                </option>
                <option value="status">
                    Status
                </option>
                <option value="system">
                    System
                </option>
                <option value="assignedTo">
                    Assignee
                </option>
            </Select>

            {/* SORT DIRECTION */}
            <Select
                value={direction}
                onChange={(event) =>
                    onDirectionChange(event.target.value)
                }
                aria-label="Sort direction"
            >
                <option value="desc">
                    Descending
                </option>
                <option value="asc">
                    Ascending
                </option>
            </Select>

        </SimpleGrid>
    );
};

export default CaseFilters;