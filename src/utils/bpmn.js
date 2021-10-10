let BpmnXml = {
    getExtension(element, type) {
        if (!element.extensionElements) {
            return;
        }

        return element.extensionElements.values.filter((extensionElement) => {
            return extensionElement.$instanceOf(type);
        })[0];
    },
};

let FormMetaModel = {
    'yes-no-boolean': {
        name: 'Yes/No',
        type: 'yes-no-boolean',
    },
};

export { BpmnXml, FormMetaModel };
