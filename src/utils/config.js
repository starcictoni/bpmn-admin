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
        // { text: "Process Key", value: "process_definition_key", explanation: "Internal process definition UUID", divider: true, align: "left" },
        { text: "Filename", value: "file_name", explanation: "Filename", divider: true, align: "left" },
        { text: "Active", value: "is_active", explanation: "Is the process deployed?", sortable: false, divider: true, align: "left" },
        // { text: "Active Ver. No.", value: "active_version_number", explanation: "Deployed version nr.", divider: true, align: "left" },
        {
            text: "Active Version",
            value: "active_version_name",
            explanation: "Deployed version name",
            sortable: false,
            divider: true,
            align: "left",
        },
        
        { text: "Versions", value: "number_of_versions", explanation: "Number of versions", divider: true, align: "centerleft" },
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

let newFile = {
    xml_definition: `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0ij2edp" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.0.0">
      <bpmn:collaboration id="Collaboration_18kgnih">
        <bpmn:participant id="pool_id" processRef="new-process" />
      </bpmn:collaboration>
      <bpmn:process id="new-process" isExecutable="true">
        <bpmn:startEvent id="StartEvent_1" />
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_18kgnih">
          <bpmndi:BPMNShape id="Participant_0jzo6yw_di" bpmnElement="pool_id" isHorizontal="true">
            <dc:Bounds x="120" y="82" width="600" height="250" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
            <dc:Bounds x="222" y="189" width="36" height="36" />
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>
    `
}

export { HeaderConfig, FooterConfig, newFile }