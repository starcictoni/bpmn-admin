let BpmnUI = {
    setLabelOntoPanel(panel, bpmnType) {
        let slicedLabels = bpmnType.split(':')[1].match(/[A-Z][a-z]+/g); //ili bpmnType.slice(5)
        // let label = slicedLabels.join(' ');
        let label = slicedLabels.join(' ');//.toUpperCase();
        if(bpmnType == "bpmn:UserTask") {
            panel.form.label = label;
        }
        else if(bpmnType == "bpmn:SendTask") {
            panel.send.label = label
        }
        else if(bpmnType == "bpmn:ServiceTask") {
            panel.service.label = label;
        }
        else {
            label = 'General';
            panel.general.label = label;
        }

    },
    showPanel(panel, bpmnType) {
        panel.processInformation.visible = true;
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
                panel.general.visible = true;
                panel.service.visible = true;
                break;
            case "bpmn:SendTask":
                panel.general.visible = true;
                panel.send.visible = true;
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
    updateDocumentation(moddle, modeling, element, documentation) {
        if(!element || !documentation) {
            return null;
        }
        let moddleDocumentation = this.createDocumentation(moddle, element.businessObject);
        if (documentation.text != null) {
            moddleDocumentation.text = documentation.text;
            modeling.updateModdleProperties(element, element.businessObject, { documentation: [moddleDocumentation] });
        } 
        else {
            delete element.businessObject.documentation;
        }
    },
    updateFormData(modeling, element, formData) {
        if(!element || !formData) {
            return null;
        }
        if(formData.fields.length > 0) {
            element.businessObject.extensionElements.values.forEach(context => {
                if(context.$type == "camunda:FormData") {
                    modeling.updateModdleProperties(element, context, {fields: formData.fields})
                }
            })
        }
        else {
            let idx = element.businessObject.extensionElements.values.find(x => x.$type == "camunda:FormData");
            element.businessObject.extensionElements.values.splice(idx, 1);
        }
    },
    updateConnector(modeling, element, connector) {
        if(!element || !connector) {
            return null;
        }
        element.businessObject.extensionElements.values.forEach((index) => {
            if (index.$type == "camunda:Connector") {
                modeling.updateModdleProperties(element, index, connector);
                let idx = element.businessObject.extensionElements.values.find(x => x.$type == "camunda:InputOutput");
                element.businessObject.extensionElements.values.splice(idx, 1);
            }
        });
    },
    updateInputOutput(modeling, element, inputOutput) {
        if(!element || !inputOutput) {
            return null;
        }
        element.businessObject.extensionElements.values.forEach((index) => {
            if (index.$type == "camunda:InputOutput") {
                if(inputOutput.inputParameters.length == 0 && inputOutput.outputParameters.length == 0) {
                    let idx = element.businessObject.extensionElements.values.find(x => x.$type == "camunda:InputOutput");
                    element.businessObject.extensionElements.values.splice(idx, 1);
                }
                else {
                    modeling.updateModdleProperties(element, index, inputOutput);
                }
            }
        });
    },
    handleElement(moddle, element) {
        if(!element || !moddle) return;
        if(element.businessObject.$type == "bpmn:UserTask") {
            let previousElement = element.businessObject;
            let currentElement = element.businessObject; 
            //Documentation
            if(element.businessObject.documentation && element.businessObject.documentation.length < 1) {
                currentElement = this.createDocumentation(moddle, previousElement);
                element.businessObject.documentation.push(currentElement); //Why?
            }
            //Extension Elements
            currentElement = element.businessObject.extensionElements;
            if(!currentElement) {
                currentElement = this.createFormExtensionElements(moddle, previousElement);
                element.businessObject.extensionElements = currentElement;
            }
            //Mozda dodati specialConnector, treba provjeriti
            
            //Form Data
            // let referenceIndex = null;
            let formDataIndex = element.businessObject.extensionElements.values.findIndex(x => x.$type == "camunda:FormData")
            let valuesLength = element.businessObject.extensionElements.values.length
            previousElement = element.businessObject.extensionElements;
            if(formDataIndex != -1) {
                // referenceIndex = formDataIndex;
            } else {
                currentElement = this.createFormData(moddle, previousElement);
                element.businessObject.extensionElements.values[valuesLength] = currentElement
                // referenceIndex = valuesLength;
            }
            //Commented out everything that is hierarchically lower then form data.7
            //reference index maybe needed

            //Form Field
            // previousElement = currentElement;
            // currentElement = element.businessObject.extensionElements.values[referenceIndex].fields;
            // if(!currentElement) {
            //     currentElement = this.createFormField(moddle, previousElement)
            //     element.businessObject.extensionElements.values[referenceIndex].fields = currentElement;
            // }
            // //Validation 1-M Constraint
            // let fields = element.businessObject.extensionElements.values[referenceIndex].fields;
            // fields.forEach((item, index) => {
            //     if(!item.validation) {
            //         currentElement = this.createValidation(moddle, item);
            //         element.businessObject.extensionElements.values[referenceIndex].fields[index].validation = currentElement;
            //     }
            // });
            // //Properties 1-M Property
            // fields = element.businessObject.extensionElements.values[referenceIndex].fields;
            // fields.forEach((item, index) => {
            //     if(!item.properties) {
            //         currentElement = this.createProperties(moddle, item);
            //         element.businessObject.extensionElements.values[referenceIndex].fields[index].properties = currentElement;
            //     }
            // });
            // //Constraint
            // fields = element.businessObject.extensionElements.values[referenceIndex].fields
            // fields.forEach((outterItem, outterIndex) => {
            //     outterItem.validation.constraints.forEach((innerItem, innerIndex) => {
            //         if(!innerItem) {
            //             currentElement = this.createConstraint(moddle, outterItem.validation);
            //             element.businessObject.extensionElements.values[referenceIndex].fields[outterIndex].validation.constraints[innerIndex] = currentElement;
            //         }
            //     })
            // })
            // //Property
            // fields = element.businessObject.extensionElements.values[referenceIndex].fields
            // fields.forEach((outterItem, outterIndex) => {
            //     outterItem.properties.values.forEach((innerItem, innerIndex) => {
            //         if(!innerItem) {
            //             currentElement = this.createConstraint(moddle, outterItem.properties);
            //             element.businessObject.extensionElements.values[referenceIndex].fields[outterIndex].properties.values[innerIndex] = currentElement;
            //         }
            //     })
            // })
        }
        else if(element.businessObject.$type == "bpmn:ServiceTask" || element.businessObject.$type == "bpmn:SendTask") {
            let previousElement = element.businessObject;
            let currentElement = element.businessObject.extensionElements; 
            if(!currentElement) {
                currentElement = this.createServiceExtensionElements(moddle, previousElement);
                element.businessObject.extensionElements = currentElement;
            }

            //Connector
            let referenceConnectorIndex = null;
            let connectorIndex = element.businessObject.extensionElements.values.findIndex(x => x.$type == "camunda:Connector")
            let valuesLength = element.businessObject.extensionElements.values.length
            previousElement = element.businessObject.extensionElements;
            if(connectorIndex != -1) {
                referenceConnectorIndex = connectorIndex;
            } else {
                currentElement = this.createSpecialConnector(moddle, previousElement);
                element.businessObject.extensionElements.values[valuesLength] = currentElement
                referenceConnectorIndex = valuesLength;
            }
            
            //Connector InputOutput
            let connectorInputOutput = element.businessObject.extensionElements.values[referenceConnectorIndex].inputOutput;
            if(connectorInputOutput.inputParameters.length == 0) {
                this.createSpecialConnectorParameters(moddle, connectorInputOutput.inputParameters)
            }
            let inputParams = connectorInputOutput.inputParameters.map(item => {return item.name});
            let missing = ["url", "method", "url_parameter"].filter(item => !inputParams.includes(item));
            missing.forEach(x => {
                if(x == "url") {
                    currentElement = this.createSpecialConnectorInputRegular("url", moddle, connectorInputOutput)
                    connectorInputOutput.inputParameters.push(currentElement);
                }
                else if(x == "method") {
                    currentElement = this.createSpecialConnectorInputRegular("method", moddle, connectorInputOutput)
                    connectorInputOutput.inputParameters.push(currentElement);
                }
                else if(x == "url_parameter"){
                    currentElement = this.createSpecialConnectorInputIrregular(moddle, connectorInputOutput)
                    connectorInputOutput.inputParameters.push(currentElement);
                }
            })
            //Commented out everything that is hierarchically lower then inputOutput

            //InputOutput
            // let referenceIoIndex = null;
            let inputOutputIndex = element.businessObject.extensionElements.values.findIndex(x => x.$type == "camunda:InputOutput")
            valuesLength = element.businessObject.extensionElements.values.length;
            previousElement = element.businessObject.extensionElements;
            if(inputOutputIndex != -1) {
                // referenceIoIndex = inputOutputIndex;
            } else {
                currentElement = this.createInputOutput(moddle, previousElement);
                element.businessObject.extensionElements.values[valuesLength] = currentElement;
                // referenceIoIndex = valuesLength;
            }

            // //Output Parameters
            // let outParams = element.businessObject.extensionElements.values[referenceIoIndex];
            // if(outParams.outputParameters) {
            //     outParams.outputParameters.forEach((item, index) => {
            //         if(!item) {
            //             currentElement = this.createOutputParameter(moddle, item);
            //             element.businessObject.extensionElements.values[referenceIoIndex].outputParameters[index] = currentElement;
            //         }
            //     });
            // }

            // //Input Parameters
            // let ioParams = element.businessObject.extensionElements.values[referenceIoIndex];
            // if(ioParams.inputParameters) {
            //     ioParams.inputParameters.forEach((item, index) => {
            //         if(!item) {
            //             currentElement = this.createInputParameter(moddle, item);
            //             element.businessObject.extensionElements.values[referenceIoIndex].inputParameters[index] = currentElement;
            //         }
            //     });
            // }
        }
        return element;
    },
    getMap(parameter) {
        // debugger;
        if(!parameter[0])
            return [];
        else if(!parameter[0].definition.entries)
            return [];
        else 
            return parameter[0].definition.entries;
    },
    createSpecialConnector(moddle, parent) {
        let connector = moddle.create("camunda:Connector", { 
            connectorId: null,
            inputOutput: null
        });
        connector.$parent = parent;
        let inputOutput = this.createSpecialConnectorInputOutput(moddle, connector);
        // let method = this.createSpecialConnectorInputRegular("method", moddle, inputOutput);
        // let url = this.createSpecialConnectorInputRegular("url", moddle, inputOutput);
        // let url_parametar = this.createSpecialConnectorInputIrregular(moddle, inputOutput);
        this.createSpecialConnectorParameters(moddle, inputOutput);
        // debugger;
        // inputOutput.inputParameters.push(method, url, url_parametar);
        connector.inputOutput = inputOutput;
        return connector;
    },
    createSpecialConnectorParameters(moddle, parent) {
        let method = this.createSpecialConnectorInputRegular("method", moddle, parent);
        let url = this.createSpecialConnectorInputRegular("url", moddle, parent);
        let url_parametar = this.createSpecialConnectorInputIrregular(moddle, parent);
        parent.inputParameters.push(method, url, url_parametar);
    },
    createSpecialConnectorInputOutput(moddle, parent) {
        let inputOutput = moddle.create("camunda:InputOutput", {
            inputParameters: [],
        })
        inputOutput.$parent = parent;
        return inputOutput;
    },
    createSpecialConnectorInputRegular(name, moddle, parent) {
        let inputParameter = moddle.create("camunda:InputParameter", {
            name: name,
            value: null,
        })
        inputParameter.$parent = parent;
        return inputParameter;
    },
    createSpecialConnectorInputIrregular(moddle, parent) {
        let inputParameter = moddle.create("camunda:InputParameter", {
            name: "url_parameter",
            definition: null
        })
        inputParameter.$parent = parent;
        inputParameter.definition = this.createMap(moddle, inputParameter)
        return inputParameter;
    },
    createServiceExtensionElements(moddle, parent) {
        let extensionElements = moddle.create("bpmn:ExtensionElements", { values: [] })
        extensionElements.$parent = parent;
        let connector = this.createSpecialConnector(moddle, extensionElements)
        // let connector = this.createConnector(moddle, extensionElements);
        let inputOutput = this.createInputOutput(moddle, extensionElements);
        extensionElements.values.push(connector);
        extensionElements.values.push(inputOutput);
        return extensionElements
    },
    createConnector(moddle, parent) {
        let connector = moddle.create("camunda:Connector", { 
            connectorId: null,
            inputOutput: null
        });
        connector.$parent = parent;
        connector.inputOutput = this.createInputOutput(moddle, connector);
        return connector;
    },
    createInputOutput(moddle, parent) {
        let inputOutput = moddle.create("camunda:InputOutput", {
            inputParameters: [],
            outputParameters: []
        })
        inputOutput.$parent = parent;
        // let inputParameter = this.createInputParameter(moddle, inputOutput);
        // let outputParameter = this.createOutputParameter(moddle, inputOutput);
        // inputOutput.inputParameters.push(inputParameter);
        // inputOutput.outputParameters.push(outputParameter);
        return inputOutput;
    },
    createConnectorInputParameter(moddle, parent) {
        let inputParameter = moddle.create("camunda:InputParameter", {
            name: null,
            value: null,
            definition: null
        })
        inputParameter.$parent = parent;
        inputParameter.definition = this.createMap(moddle, inputParameter)
        return inputParameter;
    },
    createInputParameter(moddle, parent) {
        let inputParameter = moddle.create("camunda:InputParameter", {
            name: null,
            value: null,
        })
        inputParameter.$parent = parent;
        return inputParameter;
    },
    createOutputParameter(moddle, parent) {
        let outputParameter = moddle.create("camunda:OutputParameter", {
            name: null,
            // type: null,
            value: null,
        })
        outputParameter.$parent = parent;
        return outputParameter;
    },
    createMap(moddle, parent) {
        let map = moddle.create("camunda:Map", {
            entries: []
        })
        map.$parent = parent;
        let entry = this.createEntry(moddle, map);
        map.entries.push(entry);
        return map;
    },
    createEntry(moddle, parent) {
        let entry = moddle.create("camunda:Entry", { 
            key: null, 
            value: null 
        })
        entry.$parent = parent;
        return entry;
    },
    createDocumentation(moddle, parent) {
        let documentation = moddle.create("bpmn:Documentation", {text: null});
        documentation.$parent = parent;
        return documentation;
    },
    createFormExtensionElements(moddle, parent) {
        let extensionElements = moddle.create("bpmn:ExtensionElements", { values: [] });
        extensionElements.$parent = parent;
        let formData = this.createFormData(moddle, extensionElements);
        extensionElements.values.push(formData);
        return extensionElements;
    },
    createFormData(moddle, parent) {
        let formData = moddle.create("camunda:FormData", {fields: []})
        formData.$parent = parent;
        //let formField = this.createFormField(moddle, formData);
        //formData.fields.push(formField);
        return formData;
    },
    createFormField(moddle, parent) {
        let formField = moddle.create("camunda:FormField", {
            id: null,
            label: null,
            type: null,
            validation: [],
            properties: []
        })
        formField.$parent = parent;
        formField.validation = this.createValidation(moddle, formField);
        formField.properties = this.createProperties(moddle, formField);
        return formField;
    },
    createValidation(moddle, parent) {
        let validation = moddle.create("camunda:Validation", { constraints: [] })
        validation.$parent = parent;
        let constraint = this.createConstraint(moddle, validation.$parent);
        validation.constraints.push(constraint)
        return validation;
    },
    createConstraint(moddle, parent) {
        let constraint = moddle.create("camunda:Constraint", {name: null, config: null})
        constraint.$parent = parent;
        return constraint;
    },
    createProperties(moddle, parent) {
        let properties = moddle.create("camunda:Properties", { values: [] })
        properties.$parent = parent;
        let property = this.createProperty(moddle, properties.$parent);
        properties.values.push(property);
        return properties;
    },
    createProperty(moddle, parent) {
        let property = moddle.create("camunda:Property", {id: null, value: null})
        property.$parent = parent;
        return property;
    },
    getDocumentation(element) {
        if(!element.documentation) {
            return;
        }
        return element.documentation[0];
    },
    getExtension(element, type) {
        if (!element.extensionElements) {
            return;
        }
        return element.extensionElements.values.find( x => x.$type == type)
        
    },
    getExtensionOld(element, type) {
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
