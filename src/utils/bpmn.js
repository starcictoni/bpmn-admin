let BpmnUI = {
    setLabelOntoPanel(panel, bpmnType) {
        let slicedLabels = bpmnType.split(':')[1].match(/[A-Z][a-z]+/g); //ili bpmnType.slice(5)
        // let label = slicedLabels.join(' ');
        let label = slicedLabels.join(' ');//.toUpperCase();
        if(bpmnType == "bpmn:UserTask") {
            panel.form.label = label;
        }
        else if(bpmnType == "bpmn:ServiceTask" || bpmnType == "bpmn:SendTask") {
            panel.service.label = label;
        }
        else {
            label = 'General';
            panel.general.label = label;
        }

    },
    showPanel(panel, bpmnType) {
        switch (bpmnType) {
            case "bpmn:Collaboration": 
            case "bpmn:Lane":
            case "bpmn:ManualTask":
            case "bpmn:StartEvent":
            case "bpmn:EndEvent":
            case "bpmn:ExclusiveGateway":
            case "bpmn:ParallelGateway":
            case "bpmn:SequenceFlow":
            case "bpmn:Participant":
                panel.general.visible = true;
                break;
            case "bpmn:ServiceTask":
            case "bpmn:SendTask":
                panel.general.visible = true;
                panel.service.visible = true;
                break;
            case "bpmn:UserTask":
                panel.general.visible = true;
                panel.form.visible = true;
                break;
            default:
                break;
        }
    },
};

let BpmnXml = {
    getExtension(element, type) {
        if (!element.extensionElements) {
            return;
        }

        return element.extensionElements.values.filter((extensionElement) => {
            return extensionElement.$instanceOf(type);
        })[0];
    },
    setExtension(element, type, value, moddle) {
        if (!element.extensionElements) {
            element.extensionElements = moddle.create('bpmn:ExtensionElements');
            element.extensionElements.get('values').push(value);
        }

        for (let i = 0; i < element.extensionElements.values.length; i++) {
            let o = element.extensionElements.values[i];
            if (o.$type == type) {
                element.extensionElements.values[i] == value;
            }
        }
    },
};
let ServiceItemMetaModel = {
    'camunda:property': {
        name: 'Property',
        type: 'Short text',
        icon: 'mdi-text-long'
    },
    'camunda:inputParameter': {
        name: 'Input Parameter',
        type: 'Short text',
        icon: 'mdi-arrow-collapse-right'
    },
    'camunda:outputParameter': {
        name: 'Output Parameter',
        type: 'Short text',
        icon: 'mdi-arrow-collapse-left'
    },
    'camunda:connectorId': {
        name: 'Connector Id',
        type: 'Short text',
        icon: 'mdi-application-brackets-outline'
    }
};


let FormItemMetaModel = {
    string: {
        type: 'string',
        name: 'Short text',
        icon: 'mdi-text-short',
    },
    'rich-text': {
        type: 'rich-text',
        name: 'Rich Text',
        icon: 'mdi-text-long',
    },
    integer: {
        type: 'integer',
        name: 'Numeric',
        icon: 'mdi-numeric',
    },
    'autocomplete-string': {
        type: 'autocomplete-string',
        name: 'Autocomplete',
        icon: 'mdi-text-search',
    },
    date: {
        type: 'date',
        name: 'Date',
        icon: 'mdi-calendar',
    },
    dropdown: {
        type: 'dropdown',
        name: 'Dropdown',
        icon: 'mdi-form-dropdown',
    },
    file: {
        type: 'file',
        name: 'File',
        icon: 'mdi-file-outline',
    },
    boolean: {
        type: 'boolean',
        name: 'Boolean',
        icon: 'mdi-check',
    },
    'yes-no-boolean': {
        name: 'Yes/No',
        type: 'yes-no-boolean',
        icon: 'mdi-check',
    },
};

export { BpmnUI, BpmnXml, FormItemMetaModel, ServiceItemMetaModel };
