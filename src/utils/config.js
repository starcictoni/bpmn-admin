let HeaderConfig = {
    headerProps: {
        sortIcon: "mdi-sort",
    },
    activateTableHeaders: [
        { text: "Version Nr.", value: "process_version_number", explanation: "Deployed version number", divider: true, align: "left" },
        { text: "Process Version Name", value: "process_version_name", explanation: "Version name", divider: true, align: "left" },
        { text: "Created", value: "created", explanation: "Created timestamp", divider: true, align: "left" },
        {
            text: "Last Modified",
            value: "last_modified_date",
            explanation: "Last modified date",
            divider: true,
            align: "left",
        },
        { text: "Active", value: "is_active", explanation: "Is the version deployed?", divider: true, align: "left" },
    ],
    mainTableHeaders: [
        { text: "Process Name", value: "process_definition_name", explanation: "Process definition name", divider: true, align: "left" },
        { text: "Process Key", value: "process_definition_key", explanation: "Internal process definition UUID", divider: true, align: "left" },
        { text: "Filename", value: "file_name", explanation: "Filename", divider: true, align: "left" },
        { text: "Active", value: "is_active", explanation: "Is the process deployed?", sortable: false, divider: true, align: "left" },
        {
            text: "Active Version",
            value: "active_version_name",
            explanation: "Deployed version name",
            sortable: false,
            divider: true,
            align: "left",
        },
        { text: "Active Version Nr.", value: "active_version_number", explanation: "Deployed version nr.", divider: true, align: "left" },
        { text: "Versions", value: "number_of_versions", explanation: "Number of versions", divider: true, align: "left" },
        { text: "Created", value: "created", explanation: "Created timestamp", divider: true, align: "left" },
        {
            text: "Last Modified",
            value: "last_modified_date",
            explanation: "Last modified date",
            divider: true,
            align: "left",
        },
        { text: "Actions", value: "actions", explanation: "Edit process definition actions", sortable: false, align: "left" },
    ],
    expandTableHeaders: [
        { text: "Version Nr.", value: "process_version_number", explanation: "Deployed version number", divider: true, align: "left" },
        { text: "Process Version Name", value: "process_version_name", explanation: "Version name", divider: true, align: "left" },
        { text: "Filename", value: "file_name", explanation: "Filename", divider: true, align: "left" },
        { text: "Process Version Key", value: "process_version_key", explanation: "Internal process UUID", divider: true, align: "left" },
        { text: "Created", value: "created", explanation: "Created timestamp", divider: true, align: "left" },
        {
            text: "Last Modified",
            value: "last_modified_date",
            explanation: "Last modified date",
            divider: true,
            align: "left",
        },
        { text: "Active", value: "is_active", explanation: "Is the version deployed?", divider: true, align: "left" },
        { text: "Actions", value: "actions", explanation: "Edit process version actions", sortable: false, divider: true, align: "left" },
    ],
}
let FooterConfig = {
    footerProps: {
        showFirstLastPage: true,
        firstIcon: "mdi-chevron-left",
        lastIcon: "mdi-chevron-right",
        prevIcon: "mdi-minus",
        nextIcon: "mdi-plus",
        "items-per-page-text": "Items per page",
    },
}

export { HeaderConfig, FooterConfig }