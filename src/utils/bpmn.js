let BpmnXml = {
    setLabelOntoPanel(panel, bpmnType) {
        let slicedLabels = bpmnType.split(':')[1].match(/[A-Z][a-z]+/g); //ili bpmnType.slice(5)
        let label = slicedLabels.join(' ');
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
        // if(bpmnType == "bpmn:Collaboration") {
        //     console.log("Collaboration")
        //     //id
        //     //participants[0].$type
        //     //participants[0].id
        //     //participants[0].name
        // }
        // else if(bpmnType == "bpmn:Lane") {
        //     //id
        //     //name
        //     console.log("Lane")
        // }
        // else if(bpmnType == "bpmn:UserTask") {
        //     //id
        //     //name
        //     //extensionElements
        //     //documentation
        //     console.log("UserTask")
        // }
        // else if(bpmnType == "bpmn:ServiceTask") {
        //     //id
        //     //name
        //     //extensionElements
        //     console.log("ServiceTask")
        // }
        // else if(bpmnType == "bpmn:SendTask") {
        //     //id
        //     //name
        //     //extensionElements
        //     console.log("SendTask")
        // }
        // else if(bpmnType == "bpmn:ManualTask") {
        //     //id
        //     //name
        //     console.log("ManualTask")
        // }
        // else if(bpmnType == "bpmn:StartEvent") {
        //     //id
        //     //name
        //     console.log("StartEvent")
        // }
        // else if(bpmnType == "bpmn:EndEvent") {
        //     //id
        //     //name
        //     console.log("EndEvent")
        // }
        // else if(bpmnType == "bpmn:SequenceFlow") {
        //     console.log("SequenceFlow")
        //     //id 
        //     //name
        //     if(bpmnObject?.conditionExpression.$type == "bpmn:FormalExpression") {
        //         console.log("FormalExpression")
        //         //bpmnObject.conditionExpression.body = body -> string kao i ime
        //     }
        //     else {
        //         console.log("BezFormalExpressiona")
        //     }
        // }
        // else if(bpmnType == "bpmn:ExclusiveGateway") {
        //     //id
        //     //name
        //     console.log("ExclusiveGateway")
        // }
        // else if(bpmnType == "bpmn:ParallelGateway") {
        //     //id
        //     console.log("ParallelGateway")
        // }
        // else {
        //     console.log("Something else")
        // }
    },
    // getPropertyData(bpmnObject, bpmnElement) {
    //     console.log(bpmnElement, bpmnObject)
    // },
    getAllExtensionsForSendOrServiceTask(bpmnObject) {
        let properties = [];
        let inputOutputs = [];
        let connectors = [];
        let state = [];
        // state.push({"General Info": [{
        //     id: bpmnObject.id,
        //     name: bpmnObject.name
        // }]})
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
    getExtension(element, type) {
        // debugger;
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
            //Dokumentacija?
        }
        // else if(type == "bpmn:ServiceTask") {
        //     extensionType = 'camunda:properties';
        //     return element.extensionElements.values.filter((extensionElement) => {
        //         return extensionElement.$instanceOf(extensionType)[0];
        //     });
        // }
        // else if(type == "bpmn:SendTask") {
        //     var fields = element.extensionElements.values;
        //     var data = []
        //     fields.forEach(element => {
        //        data.push([element.$type, element.$children]) 
        //     });
        //     extensionType = fields
        //     return element.extensionElements.values.filter((extensionElement) => {
        //         return extensionElement.$instanceOf(extensionType);
        //     });
        // }
        else {
            extensionType = 'camunda:formData';
            return element.extensionElements.values.filter((extensionElement) => {
                return extensionElement.$instanceOf(extensionType);
            })[0];
        }   


        //console.log(data)
        // return element.extensionElements.values.filter((extensionElement) => {
        //     return extensionElement.$instanceOf(type);
        // })[0];
    },
    getDocumentation(element, type) {
        console.log(element, type)
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
    }
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

export { BpmnXml, FormItemMetaModel, SendAndServiceItemMetaModel };
