export const filterCases = (
    cases,
    query,
    status,
    priority,
    system,
    assignee
) => {

  if (!Array.isArray(cases)) {
    return [];
  }

  return cases.filter((item) => {

    /*
     * =======================================================
     * ASSIGNEE VALUE
     * =======================================================
     */

    const assignedTo =
        typeof item.assignedTo === "object" &&
        item.assignedTo !== null
            ? (
                item.assignedTo.fullName ||
                item.assignedTo.name ||
                item.assignedTo.username ||
                item.assignedTo.email ||
                ""
            )
            : item.assignedTo || "";


    /*
     * =======================================================
     * SEARCH
     * =======================================================
     */

    const searchTerm =
        query?.toLowerCase().trim() || "";

    const matchesQuery =
        !searchTerm ||

        item.id
            ?.toString()
            .toLowerCase()
            .includes(searchTerm) ||

        item.summary
            ?.toLowerCase()
            .includes(searchTerm) ||

        item.description
            ?.toLowerCase()
            .includes(searchTerm) ||

        item.system
            ?.toLowerCase()
            .includes(searchTerm) ||

        String(assignedTo)
            .toLowerCase()
            .includes(searchTerm);


    /*
     * =======================================================
     * STATUS
     * =======================================================
     */

    const matchesStatus =
        !status ||
        item.status === status;


    /*
     * =======================================================
     * PRIORITY
     * =======================================================
     */

    const matchesPriority =
        !priority ||
        item.priority === priority;


    /*
     * =======================================================
     * SYSTEM
     * =======================================================
     */

    const matchesSystem =
        !system ||
        item.system === system;


    /*
     * =======================================================
     * ASSIGNEE
     * =======================================================
     */

    const matchesAssignee =
        !assignee ||
        String(assignedTo)
            .toLowerCase()
        ===
        String(assignee)
            .toLowerCase();


    /*
     * =======================================================
     * FINAL RESULT
     * =======================================================
     */

    return (
        matchesQuery &&
        matchesStatus &&
        matchesPriority &&
        matchesSystem &&
        matchesAssignee
    );
  });
};


/*
 * ===========================================================
 * SORT CASES
 * ===========================================================
 */

export const sortCases = (
    cases,
    sortKey,
    direction
) => {

  if (!Array.isArray(cases)) {
    return [];
  }

  const sorted = [...cases];

  sorted.sort((a, b) => {

    let valueA;
    let valueB;


    /*
     * =======================================================
     * SELECT SORT VALUES
     * =======================================================
     */

    switch (sortKey) {

      case "id":

        valueA =
            a.id ||
            a.caseId ||
            a.caseNumber ||
            "";

        valueB =
            b.id ||
            b.caseId ||
            b.caseNumber ||
            "";

        break;


      case "priority":

        valueA =
            a.priority || "";

        valueB =
            b.priority || "";

        break;


      case "status":

        valueA =
            a.status || "";

        valueB =
            b.status || "";

        break;


      case "system":

        valueA =
            a.system || "";

        valueB =
            b.system || "";

        break;


      case "assignedTo":

        valueA =
            typeof a.assignedTo === "object" &&
            a.assignedTo !== null
                ? (
                    a.assignedTo.fullName ||
                    a.assignedTo.name ||
                    a.assignedTo.username ||
                    a.assignedTo.email ||
                    ""
                )
                : a.assignedTo || "";

        valueB =
            typeof b.assignedTo === "object" &&
            b.assignedTo !== null
                ? (
                    b.assignedTo.fullName ||
                    b.assignedTo.name ||
                    b.assignedTo.username ||
                    b.assignedTo.email ||
                    ""
                )
                : b.assignedTo || "";

        break;


      case "openedAt":

      default:

        valueA =
            a.openedAt ||
            a.createdAt ||
            "";

        valueB =
            b.openedAt ||
            b.createdAt ||
            "";

        break;
    }


    /*
     * =======================================================
     * DATE SORTING
     * =======================================================
     */

    if (sortKey === "openedAt") {

      const dateA =
          valueA
              ? new Date(
                  valueA
              ).getTime()
              : 0;

      const dateB =
          valueB
              ? new Date(
                  valueB
              ).getTime()
              : 0;

      return direction === "asc"
          ? dateA - dateB
          : dateB - dateA;
    }


    /*
     * =======================================================
     * STRING SORTING
     * =======================================================
     */

    const comparison =
        String(valueA)
            .localeCompare(
                String(valueB),
                undefined,
                {
                  sensitivity: "base",
                }
            );


    return direction === "asc"
        ? comparison
        : -comparison;
  });

  return sorted;
};