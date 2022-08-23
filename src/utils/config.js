let HeaderConfig = {
    headerProps: {
        sortIcon: "mdi-sort",
    },
    serviceTableHeaders: [
      { text: "", value: "status", explanation: "Service status", divider: true, align: "right" },
      { text: "Service Name", value: "name", explanation: "Service name", divider: true, align: "left" },
      { text: "Address", value: "address", explanation: "Service URL", divider: true, align: "left" },
      { text: "Created", value: "created", explanation: "Created timestamp", divider: true, align: "left" },
      {
          text: "Last Modified",
          value: "last_modified_date",
          explanation: "Last modified date",
          divider: true,
          align: "left",
      },
      { text: "Active", value: "is_active", explanation: "Is the service out of function?", divider: true, align: "left" },
      { text: "Actions", value: "actions", explanation: "Edit process version actions", sortable: false, align: "left" },
    ],
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
      { text: "Process Version Name", value: "process_version_name", explanation: "Version name", divider: true, align: "left" },
      { text: "Filename", value: "file_name", explanation: "Filename", divider: true, align: "left" },  
      { text: "Version Nr.", value: "process_version_number", explanation: "Deployed version number", divider: true, align: "left"},
      { text: "Active", value: "is_active", explanation: "Is the version deployed?", divider: true, align: "left" },
      { text: "Created", value: "created", explanation: "Created timestamp", divider: true, align: "left" },
      {
          text: "Last Modified",
          value: "last_modified_date",
          explanation: "Last modified date",
          divider: true,
          align: "left",
      },
      { text: "Actions", value: "actions", explanation: "Edit process version actions", sortable: false, divider: true, align: "left" },
    ],
    serviceConfigurationTableHeaders: [
      { text: "Type", value: "$type", explanation: "Input or Output type parameter", divider: true, align: "left" },
      { text: "Name", value: "name", explanation: "Variable name", divider: true, align: "left" },
      { text: "Value", value: "value", explanation: "Body needs to be enclosed in ${<var>}", divider: true, align: "left"},
      { text: "Actions", value: "actions", explanation: "Edit or delete the parameter", sortable: false, align: "left" }
    ],
    userTaskConfigurationTableHeaders: [
      { text: "Type", value: "type", explanation: "Form field type", divider: true, align: "left" },
      { text: "Identifer", value: "id", explanation: "Form field ID", divider: true, align: "left" },
      { text: "Label", value: "label", explanation: "Form field label", divider: true, align: "left" },
      { text: "Actions", value: "actions", explanation: "Edit or delete the parameter", sortable: false, align: "left" }
    ],
    connectorTableHeaders: [
      { text: "Name", value: "name", explanation: "Form field ID", divider: true, align: "left" },
      { text: "Value", value: "value", explanation: "Form field label", divider: true, align: "left" },
      { text: "Actions", value: "actions", explanation: "Edit or delete the parameter", sortable: false, align: "left" }
    ]
}

let DialogConfig = {
  service: {
    active: {
      title: "ACTIVATE SERVICE",
			text: "Are you sure that you want to activate this service?",
			buttonColor: "blue darken-3",
    },
    inactive: {
			title: "DEACTIVATE SERVICE",
			text: "Are you sure that you want to deactivate this service?",
			buttonColor: "red darken-3",
    },
    delete: {
			title: "DELETE SERVICE",
			text: "Are you sure that you want to delete this service?",
			buttonColor: "red darken-3",
    },
    add: {
			title: "ADD SERVICE",
			text: "Fill the data in and press 'Ok' button to save.",
			buttonColor: "blue lighten-1",
    },
    edit: {
			title: "EDIT SERVICE",
			text: "Are you sure that you want to edit this service?",
			buttonColor: "cyan darken-1",
    },
  },
  serviceConfiguration: {
    connectorParams: {
      title: "URL PARAMETERS"
    },
    map: {
      title: "MAP"
    },
    add: {
      title: "ADD PARAMETER",
      buttonColor: "orange lighten-1",
    },
    edit: {
      title: "EDIT PARAMETER",
      buttonColor: "orange lighten-2",
    }
  },
  userTaskConfiguration: {
    add: {
      title: "ADD FORM FIELD",
      buttonColor: "amber",
    },
    edit: {
      title: "EDIT FORM FIELD",
      buttonColor: "yellow",
    }
  },
  connectorConfiguration: {
    add: {
      title: "ADD URL PARAMETER",
      buttonColor: "amber",
    },
    edit: {
      title: "EDIT URL PARAMETER",
      buttonColor: "yellow",
    }
  },
  model: {
    active: {
      title: "ACTIVATE ITEM",
			text: "Are you sure that you want to activate this item?",
			buttonColor: "blue darken-3",
    },
    inactive: {
			title: "DEACTIVATE ITEM",
			text: "Are you sure that you want to deactivate this item?",
			buttonColor: "red darken-3",
    },
    delete: {
			title: "DELETE ITEM",
			text: "Are you sure that you want to delete this item?",
			buttonColor: "red darken-3",
    },
    add: {
			title: "ADD ITEM",
			text: "Fill the data in and press 'Ok' button to save.",
			buttonColor: "blue lighten-1",
    },
    edit: {
			title: "EDIT ITEM",
			text: "Are you sure that you want to edit this item?",
			buttonColor: "cyan darken-1",
    },
    addUserField: {
      formFieldText: "FORM FIELD",
			validationText: "VALIDATION",
			propertiesText: "PROPERTIES",
    },
    propsUserTask: {
      documentationText: "DOCUMENTATION",
      formFieldText: "FORM FIELDS"
    }
  }  
}

let TextConfig = {
  explanations: {
    viewer: "The existing process definition is read-only. You can create or import a new one, but you can never edit the existing one",
    goBack: "Return",
  },
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
  footerReduced: {
    firstIcon: "mdi-chevron-left",
    lastIcon: "mdi-chevron-right",
    prevIcon: "mdi-minus",
    nextIcon: "mdi-plus",
    "items-per-page-text": "Per page",
  }
}

let PanelsConfig = {
    processInformation: {
      label: "Process info",
      visible: false,
      module: "ProcessInfoPanel",
    },
    general: {
      label: "General",
      visible: false,
      module: "GeneralPanel",
    },
    send: {
      label: "Send Task",
      visible: false,
      module: "SendTaskPanel"
    },
    service:  {
      label: "Service Task",
      visible: false,
      module: "ServiceTaskPanel"
    },
    form: {
      label: "User Task",
      visible: false,
      module: "UserTaskPanel"
    }
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

export { HeaderConfig, FooterConfig, newFile, DialogConfig, TextConfig, PanelsConfig }