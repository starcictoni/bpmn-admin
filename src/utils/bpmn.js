let BpmnUI = {
    setLabelOntoPanel(panel, bpmnType) {
        let slicedLabels = bpmnType.split(':')[1].match(/[A-Z][a-z]+/g); //ili bpmnType.slice(5)
        // let label = slicedLabels.join(' ');
        let label = slicedLabels.join(' ').toUpperCase();
        if(bpmnType == "bpmn:UserTask") {
            panel.form.label = label;
        }
        else if(bpmnType == "bpmn:ServiceTask" || bpmnType == "bpmn:SendTask") {
            panel.sendAndService.label = label;
        }
        else {
            panel.general.label = label;
        }

    },
    showPanel(panel, bpmnType) {
        if(bpmnType == "bpmn:Collaboration" || bpmnType == "bpmn:Lane" || bpmnType == "bpmn:ManualTask" || bpmnType == "bpmn:StartEvent" 
        || bpmnType == "bpmn:EndEvent" || bpmnType == "bpmn:ExclusiveGateway" || bpmnType == "bpmn:ParallelGateway" 
        || bpmnType == "bpmn:SequenceFlow" || bpmnType == 'bpmn:Participant') {
            panel.general.visible = true;
        }
        else if(bpmnType == "bpmn:ServiceTask" || bpmnType == "bpmn:SendTask") {
            panel.sendAndService.visible = true;
        }
        else if(bpmnType == "bpmn:UserTask") {
            panel.form.visible = true;
        }
        else {
            console.log("New element in the diagram or i've misspelled")
        }
    },
};

let BpmnXml = {
    getAllExtensionsForSendOrServiceTask(bpmnObject) {
        let properties = [];
        let inputOutputs = [];
        let connectors = [];
        let state = [];

        state.push({"General": {
            $bpmn: bpmnObject,
            id: bpmnObject.id,
            name: bpmnObject.name
        }})

        if(bpmnObject.$type == "bpmn:ServiceTask" || bpmnObject.$type == "bpmn:SendTask") {
            let extensionElements = bpmnObject.extensionElements.values;
            let camProperties = extensionElements.find(x => x.$type == "camunda:properties")?.$children //$type, value, name
            if(camProperties != undefined) {
                for(let camProperty of camProperties) {
                    let field = {
                        $bpmn: bpmnObject,
                        name: camProperty.name,
                        type: camProperty.$type,
                        value: camProperty.value
                    }
                    properties.push(field)
                }
                state.push({"Props": properties})
            }
            
            let camInputOutput = extensionElements.find(x => x.$type == "camunda:inputOutput")?.$children //$body, $type, name - $type - name
            if(camInputOutput != undefined) {
                for(let camIO of camInputOutput) {
                    let field = {
                        $bpmn: bpmnObject,
                        name: camIO.name,
                        type: camIO.$type, 
                        body: camIO.$body
                    }
                    inputOutputs.push(field)
                }
                state.push({"IO":inputOutputs})
            }
            
            let camConnector = extensionElements.find(x => x.$type == "camunda:connector")?.$children
            if(camConnector != undefined) {
                //connectors.push({type: camConnector[0].$type})
                for(let cam of camConnector[0].$children) {
                    let field = {
                        $bpmn: bpmnObject,
                        name: cam.name,
                        type: cam.$type,
                        body: cam.$body
                    }
                    connectors.push(field)                
                }
                state.push({"ConnID": [{$bpmn: bpmnObject, type: camConnector[1].$type, body: camConnector[1].$body}]})
                state.push({"ConnParams": connectors})
            } 
        }
        else {
            console.log("New type of task")
            return null;
        }
        return state;
    },
    getAllExtensionsForUserTask(bpmnObject) {
        let state = []
        if(bpmnObject.$type == "bpmn:UserTask") {
            //Generalni dio
            state.push({"General": {
                $bpmn: bpmnObject,
                id: bpmnObject.id,
                name: bpmnObject.name
            }})
            //Docs
            if(bpmnObject.documentation != undefined) {
                let docs = bpmnObject.documentation[0];
                state.push({"Docs": {
                    $bpmn: docs,
                    text: docs.text,
                    type: docs.$type
                }})        
            }
            if(bpmnObject.extensionElements.values[0] != undefined) {
                let formFields = bpmnObject.extensionElements.values[0].$children;
                let formType = bpmnObject.extensionElements.values[0].$type
                let formData = []

                for(let formField of formFields) {
                    let fieldGeneral = {                   
                        $bpmn: formField,
                        id: formField.id,
                        label: formField.label,
                        $type: formField.$type,
                        type: formField.type
                    };

                    if(formField.$children != undefined) {
                        //field validation
                        let validation = formField.$children.find(x => x.$type === "camunda:validation")
                        if(validation != undefined) {
                            var fieldValidation = {
                                $bpmn: validation,
                                validationType: validation.$type,
                                fieldConstraints: []
                            };

                            if(validation?.$children != undefined) {
                                let constraints = validation.$children;
                                for(let constraint of constraints) {
                                    fieldValidation.fieldConstraints.push({
                                        $bpmn: constraint,
                                        constraintType: constraint.$type,
                                        config: constraint.config,
                                        name: constraint.name
                                    });
                                }
                            }
                            else {
                                fieldValidation.fieldConstraints = null;
                            }
                        }
                        else {
                            fieldValidation = null;
                        }
                        
                        //field property
                        let property = formField.$children.find(x => x.$type === "camunda:properties")
                        if(property != undefined) {
                            let properties = property.$children;
                            for(let prop of properties) {
                                // debugger
                                var fieldProperties = {
                                    $bpmn: prop,
                                    id: prop.id,
                                    type: prop.$type,
                                    value: prop.value
                                }
                            }
                        }
                        else {
                            fieldProperties = null;
                        }
                    }
                    let validationObject = {
                        fieldGeneral: fieldGeneral,
                        fieldValidation: fieldValidation,
                        fieldProperties: fieldProperties
                    }
                    formData.push(validationObject)
                }
                //Questionable $bpmn
                state.push({"FormData": {
                    $bpmn: formData,
                    data: formData,
                    type: formType
                }})
            }
        }
        else {
            console.log("Hmmm ", bpmnObject.$type, "?")
            return null;
        }
        return state;
    },


    getExtension(element, type) {
        if (!element.extensionElements) {
            return;
        }
        let extensionType = null;
        if (type == "bpmn:UserTask") {
            debugger;
            extensionType = 'camunda:formData';
            return element.extensionElements.values.filter((extensionElement) => {
                return extensionElement.$instanceOf(extensionType);
            })[0];
        }
        else {
            extensionType = 'camunda:formData';
            return element.extensionElements.values.filter((extensionElement) => {
                return extensionElement.$instanceOf(extensionType);
            })[0];
        }   
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

let FormItemMetaModel = {
    string: {
        type: 'string',
        name: 'Short text',
        icon: 'mdi-text-short',
    },
    'rich-text': {
        type: 'rich-text',
        name: 'Text',
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
    'camunda:property': {
        name: 'Property',
        type: 'Property',
        icon: 'mdi-text-long'
    },
    'camunda:constraint': {
        name: 'Property',
        type: 'Property',
        icon: 'mdi-text-long'
    },
};

let SendAndServiceItemMetaModel = {
    'camunda:property': {
        name: 'Property',
        type: 'Property',
        icon: 'mdi-text-long'
    },
    'camunda:inputParameter': {
        name: 'Input Parameter',
        type: 'Property',
        icon: 'mdi-text-long'
    },
    'camunda:outputParameter': {
        name: 'Output Parameter',
        type: 'Property',
        icon: 'mdi-text-long'
    },
    'camunda:connectorId': {
        name: 'Connector Id',
        type: 'Property',
        icon: 'mdi-text-long'
    }
};

let NewItemConfig = {
    'camunda:validation': {
        
    },
    'camunda:property': {

    },
    'camunda:formField': {

    }
}

export { BpmnUI, BpmnXml, FormItemMetaModel, SendAndServiceItemMetaModel, NewItemConfig };
