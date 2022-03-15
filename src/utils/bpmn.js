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
        debugger;
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
        debugger;
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

    // eslint-disable-next-line no-unused-vars
    getData(bpmnObject) {
        // eslint-disable-next-line no-unused-vars
        let config = this.interface(bpmnObject);

    },
    //Interface
    interface(bpmnObject) {
        switch(bpmnObject.$type) {
            case 'bpmn:UserTask':
                return this.parseUserTask(bpmnObject);
            case 'bpmn:ServiceTask':
                return this.parseServiceTask(bpmnObject);
            case 'bpmn:SendTask':
                return this.parseSendTask(bpmnObject);
            case 'bpmn:ManualTask':
                return this.parseManualTask(bpmnObject);
            case 'bpmn:SequenceFlow':
                return this.parseSequenceFlow(bpmnObject);
            default:
                return this.parseGeneralData(bpmnObject);
        }
    },

    parseServiceTask(bpmnObject) {
        // eslint-disable-next-line no-unused-vars
        let general = this.parseGeneralData(bpmnObject.$type, bpmnObject)
        // eslint-disable-next-line no-unused-vars
        let documentation = this.parseDocumentation(bpmnObject.documentation[0].$type, bpmnObject.documentation[0])
        return bpmnObject
    },
    parseSendTask(bpmnObject) {
        // eslint-disable-next-line no-unused-vars
        let general = this.parseGeneralData(bpmnObject.$type, bpmnObject)
        // eslint-disable-next-line no-unused-vars
        let documentation = this.parseDocumentation(bpmnObject.documentation[0].$type, bpmnObject.documentation[0])
        return bpmnObject
    },
    parseSequenceFlow(bpmnObject) {
        return bpmnObject
    },

    parseUserTask(bpmnObject) {
        let data = []
        // eslint-disable-next-line no-unused-vars
        let general = this.parseGeneralData(bpmnObject.$type, bpmnObject)
        data.push(this.parseGeneralData(bpmnObject.$type, bpmnObject))
        // eslint-disable-next-line no-unused-vars
        let documentation = this.parseDocumentation(bpmnObject.documentation[0].$type, bpmnObject.documentation[0])
        data.push(this.parseDocumentation(bpmnObject.documentation[0].$type, bpmnObject.documentation[0]))
        // eslint-disable-next-line no-unused-vars
        let extensions = this.parseExtensions(bpmnObject.extensionElements.$type, bpmnObject.extensionElements)
        data.push(this.parseExtensions(bpmnObject.extensionElements.$type, bpmnObject.extensionElements))

        debugger;
        return data
    },

    parseGeneralData(type, bpmnObject) {
        //debugger;
        let id = bpmnObject.id || undefined;
        let name = bpmnObject.name || undefined;
        let $bpmn = bpmnObject || undefined;
        let generalData = this.getConfig(type);

        if($bpmn !== undefined) generalData.$bpmn = $bpmn;
        if(id !== undefined) generalData.id = id;
        if(name !== undefined) generalData.name = name;
        //nedostaje li type?

        return generalData
    },
    parseDocumentation(type, bpmnObject) {
        //debugger;
        let $bpmn = bpmnObject || undefined;
        let text = bpmnObject.text || undefined;
        let docData = this.getConfig(type);

        if($bpmn !== undefined) docData.$bpmn = $bpmn;
        if(type !== undefined) docData.type = type
        if(text !== undefined) docData.text = text;

        return docData;
    },
    parseExtensions(type, bpmnObject) {
        let $bpmn = bpmnObject || undefined;
        let values = bpmnObject.values || undefined;
        let extensionData = this.getConfig(type);

        if($bpmn !== undefined) extensionData.$bpmn = $bpmn;
        if(values.length > 0) extensionData.values = values;
        
        let data = []
        for(let element of values) {
            // debugger;
            let elementType = element.$type;
            switch(elementType) {
                case 'camunda:formData':
                    data.push(this.parseFormData(elementType, element));
                    break;// formData;
                case 'camunda:executionListener':
                    data.push(this.parseExecutionListenerData());
                    break;
                case 'camunda:taskListener':
                    data.push(this.parseTaskListenerData());
                    break;
                case 'camunda:inputOutput':
                    data.push(this.parseInputOutputData());
                    break;
                case 'camunda:properties':
                    data.push(this.parsePropertiesData());
                    break;
                case 'camunda:extensions':
                    data.push(this.parseExtensionsData());
            }
        }
        console.log(data)
        debugger;
        return data;
    },

    parseFormData(type, bpmnObject) {
        // debugger;
        let $bpmn = bpmnObject || undefined;
        let children = bpmnObject.$children || undefined;
        let formData = this.getConfig(type);
        let formFields = []
        if($bpmn !== undefined) formData = $bpmn;
        if(children !== undefined) formData.$children = children;

        for(let element of children) {
            debugger;
            let elementType = element?.$type;
            let defaultValue = element?.defaultValue;
            let id = element?.id;
            let label = element?.label;
            let eType = element?.type;
            let eChildren = element?.$children;

            let propsAndValidations = []
            if(eChildren != undefined) {
                for(let child of eChildren) {

                    let childType = child.$type;
                    switch(childType) {
                        case 'camunda:properties':
                            var properties = this.parsePropertiesData(childType, child);
                            propsAndValidations.push(properties);
                            break;// properties;
                        case 'camunda:validation':
                            var validation = this.parseValidationData(childType, child);
                            propsAndValidations.push(validation);
                            break; //validation;
                    }
                    if(propsAndValidations.length == 0) propsAndValidations.push(this.getConfig(childType))
                }
            }
            //console.log(properties, validation)

            let formFieldData = this.getConfig(elementType)
            if(element !== undefined) formFieldData.$bpmn = element;
            if(elementType !== undefined) formFieldData.$type;  
            if(defaultValue !== undefined) formFieldData.defaultValue = defaultValue;
            if(id !== undefined) formFieldData.id = id;
            if(label !== undefined) formFieldData.label = label;
            if(eType !== undefined) formFieldData.type = eType;
            if(propsAndValidations !== undefined) formFieldData.$children = propsAndValidations;
            // debugger
            formFields.push(formFieldData);
        }


        return formFields;
    },
    // eslint-disable-next-line no-unused-vars
    parsePropertiesData(type, bpmnObject) {
        // debugger;
        let $bpmn = bpmnObject || undefined;
        let children = bpmnObject?.$children;
        let propertyData = this.getConfig(type);
        let properties = [];

        if($bpmn !== undefined) propertyData.$bpmn = $bpmn;
        if(type !== undefined) propertyData.$type = type;
        var property = null;
        if(children !== undefined) { 
            for(let child of children) {
                // debugger;
                var childType = child.$type;
                property = this.getConfig(childType);
                if(child !== undefined) property.$bpmn = child;
                if(child.$type !== undefined) property.$type = childType;
                if(child.id !== undefined) property.id = child.id;
                if(child.value !== undefined) property.value = child.value;
                properties.push(property)
            }
        }
        else {
            property = this.getConfig(childType);
            properties.push(property)
        }

        if(children !== undefined) propertyData.$children = properties;

        return propertyData;
    },

    // eslint-disable-next-line no-unused-vars
    parseValidationData(type, bpmnObject) {
        let $bpmn = bpmnObject || undefined;
        let children = bpmnObject?.$children;
        let validationData = this.getConfig(type);
        let validations = [];

        if($bpmn !== undefined) validationData.$bpmn = $bpmn;
        if(type !== undefined) validationData.$type = type;

        var constraint = null;
        if(children !== undefined) { 
            for(let child of children) {
                // debugger;
                var childType = child.$type;
                constraint = this.getConfig(childType);
                if(child !== undefined) constraint.$bpmn = child;
                if(child.$type !== undefined) constraint.$type = childType;
                if(child.config !== undefined) constraint.config = child.config;
                if(child.name !== undefined) constraint.name = child.name;
                validations.push(constraint)
            }
        }
        else {
            constraint = this.getConfig(childType);
            validations.push(constraint)
        }

        if(children !== undefined) validationData.$children = validations;

        return validationData;
    },

    parseExecutionListenerData() {
        return;
    },
    parseTaskListenerData() {
        return;
    },
    parseInputOutputData() {
        return;
    },
    parseExtensionsData() {
        return;
    },


    getConfig(type) {
        switch(type) {
            case 'bpmn:UserTask':
                return {
                    $bpmn: null, //ne znam jos
                    id: null, //getTheId()
                    //nedostaje li type?
                    name: 'No available data.'
                }
            case 'bpmn:Documentation':
                return {
                    $bpmn: null,
                    type: 'bpmn:Documentation',
                    text: 'No available data.'
                }
            case 'bpmn:ExtensionElements': {
                return {
                    $bpmn: null,
                    values: []
                }
            }
            case 'camunda:formData':
                return {
                    $bpmn: null,
                    $type: 'camunda:formData',
                    $children: []
                }
            case 'camunda:formField':
                return {
                    $bpmn: null,
                    $children: [],
                    $type: 'camunda:formField',
                    defaultValue: 'No available data.',
                    id: null,
                    label: 'No available data.',
                    type: null, //get types 
                }
            case 'camunda:properties':
                return {
                    $bpmn: null,
                    $children: [],
                    $type: 'camunda:properties',
                }
            case 'camunda:property':
                return {
                    $bpmn: null,
                    $type: 'camunda:property',
                    id: null,
                    value: 'No available data'
                }
            case 'camunda:validation':
                return {
                    $bpmn: null,
                    $children: [],
                    $type: 'camunda:validation',
                }
            case 'camunda:constraint':
                return {
                    $bpmn: null,
                    $type: 'camunda:constraint',
                    name: 'No available data',
                    config: 'No available data'
                }

        }
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

export { BpmnUI, BpmnXml, FormItemMetaModel, SendAndServiceItemMetaModel };
